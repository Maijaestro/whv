/**
 * iobrokerService: WebSocket-based connection to ioBroker using iobroker.ws adapter.
 * Implements socket.io v3 protocol simulation for WebSocket communication.
 * Messages are sent as JSON arrays: [type, sid, command, data]
 * where type: 2=message, 3=ack, 4=error, 5=binary, etc.
 */

const defaultWsUrl = import.meta.env.VITE_IOBROKER_WS_URL || 'ws://iobroker:8084'

type StateChangeCallback = (id: string, state: any) => void

class IoBrokerService {
  ws: WebSocket | null = null
  wsUrl: string = defaultWsUrl
  sid: string | null = null
  messageId: number = 0
  pendingRequests: Map<number, { resolve: (v: any) => void; reject: (e: any) => void }> = new Map()
  stateChangeCallbacks: Set<StateChangeCallback> = new Set()
  reconnectDelay: number = 3000
  reconnectTimer: number | null = null
  connected: boolean = false

  setWsUrl(url: string) {
    this.wsUrl = url
  }

  /**
   * Connect to ioBroker WebSocket (iobroker.ws adapter).
   * The adapter expects socket.io v3 protocol format.
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsUrl)

        this.ws.onopen = () => {
          console.log('WebSocket connected, waiting for handshake...')
          // Do NOT resolve yet; wait for server handshake
        }

        this.ws.onmessage = (event) => {
          try {
            const data = event.data
            // Parse message (socket.io format: JSON array [type, sid, ...] or plain JSON)
            let msg: any
            if (data.startsWith('[')) {
              msg = JSON.parse(data) // Array format
            } else {
              msg = JSON.parse(data) // Object format
            }
            
            // Handle handshake (type 0)
            if (Array.isArray(msg) && msg[0] === 0) {
              // Handshake response: [0, {sid: '...', upgrades: [...], pingInterval: ..., pingTimeout: ...}]
              const handshakeData = msg[1]
              if (handshakeData && handshakeData.sid) {
                this.sid = handshakeData.sid
                console.log(`Handshake successful, sid: ${this.sid}`)
                this.connected = true
                // Send handshake confirmation (type 0 probe)
                this._send([2, this.messageId++, 'connect'])
                if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
                this.reconnectTimer = null
                resolve()
              }
            } else {
              // Regular message
              this._handleMessage(msg)
            }
          } catch (e) {
            console.error('Failed to parse WebSocket message:', e, 'Raw:', event.data)
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          if (!this.connected) {
            reject(error)
          }
        }

        this.ws.onclose = () => {
          console.log('WebSocket closed')
          this.connected = false
          this.ws = null
          this.sid = null
          // Auto-reconnect
          this._scheduleReconnect()
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.connected = false
  }

  private _scheduleReconnect() {
    if (this.reconnectTimer) return
    this.reconnectTimer = window.setTimeout(() => {
      console.log('Attempting to reconnect...')
      this.connect().catch((e) => console.error('Reconnect failed:', e))
    }, this.reconnectDelay)
  }

  private _handleMessage(msg: any) {
    // Socket.io array format: [type, sid, command, data] or [type, command, data]
    if (!Array.isArray(msg)) {
      console.warn('Unexpected non-array message:', msg)
      return
    }

    const type = msg[0]
    
    // Type 2 = message (regular RPC)
    // Type 4 = error
    if (type === 2) {
      // Regular message: [2, sid?, messageId, command, ...data]
      // or [2, command, data...]
      let cmdIndex = 1
      let msgId: number | null = null
      let command: string
      let data: any

      // Determine structure
      if (msg.length >= 3 && typeof msg[1] === 'number' && typeof msg[2] === 'string') {
        // [2, messageId, command, data...]
        msgId = msg[1]
        command = msg[2]
        data = msg[3]
      } else if (msg.length >= 2 && typeof msg[1] === 'string') {
        // [2, command, data...]
        command = msg[1]
        data = msg[2]
      } else {
        console.warn('Unknown message format:', msg)
        return
      }

      // Handle state changes
      if (command === 'stateChange' && data && data.id) {
        this.stateChangeCallbacks.forEach((cb) => {
          try {
            cb(data.id, data.state)
          } catch (e) {
            console.error('State change callback error:', e)
          }
        })
      }

      // Handle responses to requests (ACK)
      if (msgId !== null && this.pendingRequests.has(msgId)) {
        const { resolve, reject } = this.pendingRequests.get(msgId)!
        this.pendingRequests.delete(msgId)
        resolve(data)
      }
    } else if (type === 4) {
      // Error message: [4, messageId, error, errorData]
      const msgId = msg[1]
      if (msgId !== null && this.pendingRequests.has(msgId)) {
        const { reject } = this.pendingRequests.get(msgId)!
        this.pendingRequests.delete(msgId)
        reject(new Error(msg[3]?.[0] || msg[2]))
      }
    }
  }

  /**
   * Send message in socket.io format: [2, messageId, command, data]
   */
  private _send(msg: any): number {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected')
    }
    // Convert to socket.io format if needed
    const payload = Array.isArray(msg) ? msg : JSON.stringify(msg)
    this.ws.send(JSON.stringify(payload))
    return msg[1] ?? msg[0]
  }

  private _sendAndWait(command: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
          throw new Error('WebSocket not connected')
        }
        const msgId = this.messageId++
        // Format: [2, messageId, command, data]
        const msg = [2, msgId, command, data]
        this.pendingRequests.set(msgId, { resolve, reject })
        this.ws.send(JSON.stringify(msg))

        // Timeout after 5s
        setTimeout(() => {
          if (this.pendingRequests.has(msgId)) {
            this.pendingRequests.delete(msgId)
            reject(new Error('Request timeout'))
          }
        }, 5000)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * Subscribe to state changes for a given state ID.
   */
  async subscribeState(id: string): Promise<void> {
    await this._sendAndWait('subscribe', { id })
  }

  /**
   * Unsubscribe from state changes for a given state ID.
   */
  async unsubscribeState(id: string): Promise<void> {
    await this._sendAndWait('unsubscribe', { id })
  }

  /**
   * Set a state value.
   */
  async setState(id: string, value: any): Promise<void> {
    await this._sendAndWait('setState', { id, state: { val: value } })
  }

  /**
   * Get a state value.
   */
  async getState(id: string): Promise<any> {
    const resp = await this._sendAndWait('getState', { id })
    return resp?.state
  }

  /**
   * Register a callback for state changes.
   */
  onStateChange(cb: StateChangeCallback) {
    this.stateChangeCallbacks.add(cb)
    return () => this.stateChangeCallbacks.delete(cb)
  }
}

export default new IoBrokerService()

