/*
import { onMounted, onBeforeUnmount, computed, Ref } from 'vue'
import type { DataPoint } from '../types/datapoint'
import { useSubscriptionStore } from '../store/subscriptions'


export function useDataPoint(dp: DataPoint): Ref<any> {
  const subscriptionStore = useSubscriptionStore()

  let valueRef: Ref<any> | null = null

  onMounted(async () => {
    valueRef = await subscriptionStore.subscribe(dp)
  })

  onBeforeUnmount(async () => {
    await subscriptionStore.unsubscribe(dp)
  })

  // Return a computed that accesses the store value directly
  // (This works even before valueRef is set, because the store manages the actual value)
  return computed(() => subscriptionStore.getValue(dp.id))
}
*/
import { computed, onMounted, onUnmounted } from "vue";
import { useIoBrokerStore } from "../store/iobroker";

export interface DataPoint {
  id: string;
  name: string;
}

export function useDataPoint(dp: DataPoint) {
  const store = useIoBrokerStore();

  onMounted(() => {
    store.subscribe(dp.id);
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
    name: dp.name,
    value,
    set,
  };
}

