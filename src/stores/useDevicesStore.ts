import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useIoBrokerStore } from "@/stores/useIoBrokerStore";
import type { Device, Capability } from "@/types/deviceModel";

export const useDevicesStore = defineStore("devices", () => {
  const io = useIoBrokerStore();

  const devices = ref<Device[]>([]);

  // Map: stateId -> Set(deviceId)
  const stateSubscriptions = ref<Map<string, Set<string>>>(new Map());

  function getAllStateIds(device: Device): string[] {
    const ids: string[] = [];

    for (const cap of device.capabilities) {
      if ("stateId" in cap && cap.stateId) ids.push(cap.stateId);
      if ("targetId" in cap && cap.targetId) ids.push(cap.targetId);
      if ("actualId" in cap && cap.actualId) ids.push(cap.actualId);
      if ("datapoints" in cap) {
        ids.push(...Object.values(cap.datapoints));
      }
    }

    return ids;
  }

  function subscribeToDevice(device: Device) {
    const ids = getAllStateIds(device);

    for (const id of ids) {
      // Map aktualisieren
      if (!stateSubscriptions.value.has(id)) {
        stateSubscriptions.value.set(id, new Set());
      }
      stateSubscriptions.value.get(id)!.add(device.id);

      // ioBroker Subscription
      io.subscribeState(id);
    }
  }

  function unsubscribeFromDevice(device: Device) {
    const ids = getAllStateIds(device);

    for (const id of ids) {
      const set = stateSubscriptions.value.get(id);
      if (!set) continue;

      set.delete(device.id);

      // Wenn kein Device mehr diesen State braucht → unsubscriben
      if (set.size === 0) {
        io.unsubscribeState(id);
        stateSubscriptions.value.delete(id);
      }
    }
  }

  function addDevice(device: Device) {
    devices.value.push(device);
    subscribeToDevice(device);
  }
  function removeDevice(deviceId: string) {
    const index = devices.value.findIndex((d) => d.id === deviceId);
    if (index === -1) return;

    const device = devices.value[index];
    unsubscribeFromDevice(device);
    devices.value.splice(index, 1);
  }

  function updateDeviceState(stateId: string, value: any) {
    const subscribers = stateSubscriptions.value.get(stateId);
    if (!subscribers) return;

    const val = value?.val ?? value;

    for (const deviceId of subscribers) {
      const device = devices.value.find((d) => d.id === deviceId);
      if (!device) continue;

      for (const cap of device.capabilities) {
        if ("stateId" in cap && cap.stateId === stateId) {
          (cap as any).value = val;
        }
        if ("targetId" in cap && cap.targetId === stateId) {
          (cap as any).targetValue = val;
        }
        if ("actualId" in cap && cap.actualId === stateId) {
          (cap as any).actualValue = val;
        }
        if ("datapoints" in cap) {
          for (const [key, dp] of Object.entries(cap.datapoints)) {
            if (dp === stateId) {
              (cap as any)[key] = val;
            }
          }
        }
      }
    }
  }

  io.onStateChange(updateDeviceState);

  const favoriteDevices = computed(() =>
    devices.value.filter((d) => d.favorite)
  );

  const devicesByRoom = computed(() => {
    const map = new Map<string, Device[]>();
    for (const d of devices.value) {
      const room = d.location.room ?? "Unbekannt";
      if (!map.has(room)) map.set(room, []);
      map.get(room)!.push(d);
    }
    return map;
  });

  return {
    devices,
    favoriteDevices,
    devicesByRoom,
    addDevice,
    removeDevice,
    subscribeToDevice,
    unsubscribeFromDevice,
    updateDeviceState,
  };
});
