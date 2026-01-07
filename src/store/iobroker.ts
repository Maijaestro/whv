import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { createIoBrokerClient } from "../services/iobrokerClient";

export const useIoBrokerStore = defineStore("iobroker", () => {
  const states = reactive<Record<string, ioBroker.State | null>>({});
  const subscriptions = new Map<
    string,
    (id: string, state: ioBroker.State | null | undefined) => void
  >();

  const isReady = ref(false);

  const connection = createIoBrokerClient({
    host: "iobroker",
    port: 8084,
    name: "whv-frontend",

    onReady: () => {
      console.log("[iobroker] ready");
      isReady.value = true;

      // Jetzt ALLE wartenden Subscriptions ausführen
      for (const [id, handler] of subscriptions) {
        connection.subscribeState(id, handler as any);

        connection.getState(id).then((state) => {
          states[id] = state ?? null;
        });
      }
    },
  });

  function ensureSubscribed(id: string) {
    if (subscriptions.has(id)) return;

    const handler = (
      stateId: string,
      state: ioBroker.State | null | undefined
    ) => {
      states[stateId] = state ?? null;
    };

    subscriptions.set(id, handler);

    if (isReady.value) {
      // Verbindung steht → sofort subscriben
      connection.subscribeState(id, handler as any);

      connection.getState(id).then((state) => {
        states[id] = state ?? null;
      });
    }

    // Wenn nicht ready → warten, bis onReady kommt
  }

  function unsubscribe(id: string) {
    const handler = subscriptions.get(id);
    if (!handler) return;

    if (isReady.value) {
      connection.unsubscribeState(id, handler as any);
    }

    subscriptions.delete(id);
  }

  function setState(id: string, val: any) {
    connection.setState(id, val);
  }

  return {
    states,
    ensureSubscribed,
    unsubscribe,
    setState,
  };
});
