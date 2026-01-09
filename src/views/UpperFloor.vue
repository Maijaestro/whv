<template>
  <div class="view upper-floor">
    <h1>Obergeschoss</h1>
    <div class="group">
      <h2>Beleuchtung</h2>
      <div class="lamp-control">
        <Light v-if="lamp" :cap="lamp.capabilities[0]" :label="lamp.name" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
//id: "hm-rpc.0.000B9F29BA08DA.2.STATE",

import { onMounted } from "vue";
import { useDevicesStore } from "@/stores/useDevicesStore";
import { OnOffCapability } from "@/types/deviceModel";

const devicesStore = useDevicesStore();

onMounted(() => {
  devicesStore.addDevice({
    id: "test-switch",
    name: "Testschalter",
    type: "switch",
    category: "light",
    favorite: false,
    location: { room: "OG", floor: "OG" },

    datapoints: {
      state: "hm-rpc.0.000B9F29BA08DA.2.STATE",
    },

    capabilities: [
      {
        type: "onOff",
        label: "Schalten",
        writable: true,
        stateId: "hm-rpc.0.000B9F29BA08DA.2.STATE",
      },
    ],
  });
});

const lamp = computed(() =>
  devicesStore.devices.find((d) => d.id === "test-switch")
);

watch(
  () => (lamp.value?.capabilities[0] as OnOffCapability)?.value,
  (val) => {
    console.log("State geändert:", val);
  }
);
</script>
