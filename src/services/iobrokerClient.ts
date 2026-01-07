export type IoBrokerWsMessage = any[];

export interface IoBrokerWsClientOptions {
  url: string;
  name?: string;
  reconnectInterval?: number;
  debug?: boolean;
}

export class IoBrokerWsClient {
  private ws: WebSocket | null = null;
  private msgId = 1;
  private reconnectTimer: number | null = null;

  private isReady = false; // wird true, wenn ___ready___ kommt
  private hasConnectedOnce = false; // verhindert mehrfaches Subscriben

  constructor(
    private options: IoBrokerWsClientOptions,
    private onMessage: (msg: IoBrokerWsMessage) => void,
    private onConnected: () => void,
    private onDisconnected: () => void
  ) {}

  connect() {
    const sid = Math.random().toString(36).slice(2, 12);
    const name = this.options.name ?? "vue-client";

    const url = `${this.options.url}?sid=${sid}&name=${encodeURIComponent(
      name
    )}`;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      if (this.options.debug) console.log("[ws] open");
    };

    this.ws.onclose = () => {
      if (this.options.debug) console.log("[ws] closed");

      this.isReady = false;
      this.onDisconnected();
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      if (this.options.debug) console.warn("[ws] error", err);
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.options.reconnectInterval ?? 3000);
  }

  private handleMessage(raw: string) {
    let msg: IoBrokerWsMessage;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    if (this.options.debug && msg[0] != 1) console.log("[ws recv]", msg);

    // Server sendet ___ready___ → Verbindung ist aktiv
    if (msg[2] === "___ready___") {
      this.isReady = true;

      // Nur beim ALLERERSTEN Mal Subscriptions senden
      if (!this.hasConnectedOnce) {
        this.hasConnectedOnce = true;
        this.onConnected();
      }

      return;
    }

    // Ping vom Server
    if (msg[0] === 1) {
      //if (this.options.debug) console.log("[ws] ping → pong");
      this.ws?.send(JSON.stringify([2]));
      return;
    }

    // ACK ignorieren
    if (msg.length === 1 && msg[0] === 1) {
      return;
    }

    this.onMessage(msg);
  }

  private send(command: string, args: any[] = []) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const msg: IoBrokerWsMessage = [0, this.msgId++, command, args];

    if (this.options.debug) console.log("[ws send]", msg);

    this.ws.send(JSON.stringify(msg));
  }

  subscribe(id: string) {
    this.send("subscribe", [id]);
  }

  unsubscribe(id: string) {
    this.send("unsubscribe", [id]);
  }

  setState(id: string, val: any) {
    this.send("setState", [id, { val, ack: false }]);
  }
}
