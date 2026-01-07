import { computed, onMounted, onUnmounted } from "vue";
import { useIoBrokerStore } from "../store/iobroker";

export interface DataPoint {
  id: string;
  name?: string;
}

export function useDataPoint(dp: DataPoint) {
  const store = useIoBrokerStore();

  onMounted(() => {
    store.ensureSubscribed(dp.id);
  });

  onUnmounted(() => {
    store.unsubscribe(dp.id);
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
