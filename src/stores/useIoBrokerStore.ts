import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import {
  createIoBrokerClient,
  WsConnectionStatus,
} from "@/services/iobrokerClient";

export const useIoBrokerStore = defineStore("iobroker", () => {
  const states = reactive<Record<string, ioBroker.State | null>>({});
  const subscriptions = new Map<
    string,
    (id: string, state: ioBroker.State | null | undefined) => void
  >();
  const stateListeners = ref<
    ((id: string, state: ioBroker.State | null) => void)[]
  >([]);

  const isReady = ref(false);
  const lastPing = ref(0);

  const client = createIoBrokerClient({
    host: "iobroker",
    port: 8084,
    name: "whv-frontend",

    onReady: () => {
      isReady.value = true;

      // alle wartenden Subscriptions jetzt ausführen
      for (const [id, handler] of subscriptions) {
        client.connection.subscribeState(id, handler as any);

        client.connection.getState(id).then((state) => {
          states[id] = state ?? null;
        });
      }

      subscribeState("evcc.0.status.grid");
    },

    onConnectionStatusChange: (status) => {
      connectionStatus.value = status;
    },
  });

  const connectionStatus = ref<WsConnectionStatus>(
    WsConnectionStatus.Disconnected
  );

  function subscribeState(id: string) {
    if (subscriptions.has(id)) return;

    const handler = (
      stateId: string,
      state: ioBroker.State | null | undefined
    ) => {
      states[stateId] = state ?? null;

      if (stateId === "evcc.0.status.grid") {
        lastPing.value = Date.now();
      }

      for (const cb of stateListeners.value) {
        cb(stateId, state ?? null);
      }
    };

    subscriptions.set(id, handler);

    if (isReady.value) {
      client.connection.subscribeState(id, handler as any);

      client.connection.getState(id).then((state) => {
        states[id] = state ?? null;
      });
    }
  }

  function unsubscribeState(id: string) {
    const handler = subscriptions.get(id);
    if (!handler) return;

    if (isReady.value) {
      client.connection.unsubscribeState(id, handler as any);
    }

    subscriptions.delete(id);
  }

  function setState(id: string, val: any) {
    client.connection.setState(id, val);
  }

  function onStateChange(
    callback: (id: string, state: ioBroker.State | null) => void
  ) {
    stateListeners.value.push(callback);
  }

  return {
    states,
    subscribeState,
    unsubscribeState,
    setState,
    onStateChange,

    connectionStatus,
    lastPing,
  };
});
