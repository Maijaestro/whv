import { defineStore } from "pinia";
import { reactive } from "vue";
import { IoBrokerWsClient } from "../services/iobrokerClient";

export const useIoBrokerStore = defineStore("iobroker", () => {
  const states = reactive<Record<string, any>>({});
  const subscriptions = new Set<string>();

  const client = new IoBrokerWsClient(
    {
      url: "ws://iobroker:8084",
      name: "whv-client",
      debug: true,
    },
    handleMessage,
    handleConnected,
    handleDisconnected
  );

  client.connect();

  function handleConnected() {
    console.log("[store] connected (ready)");

    // Subscriptions nur EINMAL senden
    for (const id of subscriptions) {
      client.subscribe(id);
    }
  }

  function handleDisconnected() {
    console.log("[store] disconnected");
  }

  function handleMessage(msg: any[]) {
    const [_, __, command, args] = msg;

    if (command === "stateChange") {
      const [id, state] = args;
      states[id] = state;
    }
  }

  function subscribe(id: string) {
    if (!subscriptions.has(id)) {
      subscriptions.add(id);
      client.subscribe(id);
    }
  }

  function unsubscribe(id: string) {
    if (subscriptions.has(id)) {
      subscriptions.delete(id);
      client.unsubscribe(id);
    }
  }

  function setState(id: string, val: any) {
    client.setState(id, val);
  }

  return {
    states,
    subscribe,
    unsubscribe,
    setState,
  };
});
