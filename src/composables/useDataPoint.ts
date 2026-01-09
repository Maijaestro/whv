import { computed, onMounted, onUnmounted } from "vue";
import { useIoBrokerStore } from "../stores/useIoBrokerStore";

export interface DataPoint {
  id: string;
  name?: string;
}

export function useDataPoint(dp: DataPoint) {
  const store = useIoBrokerStore();

  onMounted(() => {
    store.subscribeState(dp.id);
  });

  onUnmounted(() => {
    store.unsubscribeState(dp.id);
  });

  const value = computed(() => store.states[dp.id]?.val);

  function set(val: any) {
    store.setState(dp.id, val);
  }

  return {
    id: dp.id,
    name: dp.name ?? dp.id,
    value,
    set,
  };
}
