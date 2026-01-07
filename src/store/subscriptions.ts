import { defineStore } from 'pinia'
import { ref, computed, Ref } from 'vue'
import type { DataPoint } from '../types/datapoint'
import iobrokerService from '../services/iobrokerService'

interface StateEntry {
  value: any
  refCount: number // track subscriptions
}

export const useSubscriptionStore = defineStore('subscriptions', () => {
  const states: Ref<Map<string, StateEntry>> = ref(new Map())
  const connected = ref(false)

  // Initialize WebSocket connection on first use
  let connectPromise: Promise<void> | null = null
  async function ensureConnected() {
    if (connected.value) return
    if (!connectPromise) {
      connectPromise = (async () => {
        try {
          await iobrokerService.connect()
          connected.value = true
          // Register global state change handler
          iobrokerService.onStateChange((id: string, state: any) => {
            const entry = states.value.get(id)
            if (entry) {
              entry.value = state?.val ?? state
            }
          })
        } catch (e) {
          console.error('Failed to connect to ioBroker:', e)
          connectPromise = null
          throw e
        }
      })()
    }
    await connectPromise
  }

  /**
   * Subscribe to a datapoint. Auto-fetches initial value and manages subscriptions.
   * Returns a computed ref to the current value.
   */
  async function subscribe(dp: DataPoint) {
    await ensureConnected()

    const id = dp.id
    let entry = states.value.get(id)

    if (!entry) {
      entry = { value: undefined, refCount: 0 }
      states.value.set(id, entry)

      // Fetch initial value
      try {
        const state = await iobrokerService.getState(id)
        entry.value = state?.val ?? state
      } catch (e) {
        console.error(`Failed to fetch initial value for ${id}:`, e)
      }

      // Subscribe to changes
      try {
        await iobrokerService.subscribeState(id)
      } catch (e) {
        console.error(`Failed to subscribe to ${id}:`, e)
      }
    }

    entry.refCount++

    // Return a computed ref that always reflects the current value
    return computed(() => entry!.value)
  }

  /**
   * Unsubscribe from a datapoint when no longer needed.
   */
  async function unsubscribe(dp: DataPoint) {
    const id = dp.id
    const entry = states.value.get(id)
    if (!entry) return

    entry.refCount--
    if (entry.refCount <= 0) {
      // Cleanup
      try {
        await iobrokerService.unsubscribeState(id)
      } catch (e) {
        console.error(`Failed to unsubscribe from ${id}:`, e)
      }
      states.value.delete(id)
    }
  }

  /**
   * Write a value to a datapoint.
   */
  async function writeState(dp: DataPoint, value: any) {
    await ensureConnected()
    try {
      await iobrokerService.setState(dp.id, value)
    } catch (e) {
      console.error(`Failed to write state for ${dp.id}:`, e)
      throw e
    }
  }

  /**
   * Get the current value of a subscribed state.
   */
  function getValue(dpId: string): any {
    return states.value.get(dpId)?.value
  }

  return {
    states,
    connected,
    subscribe,
    unsubscribe,
    writeState,
    getValue
  }
})
