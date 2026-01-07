<template>
  <div class="view upper-floor">
    <h1>Obergeschoss</h1>
    <div class="group">
      <h2>Beleuchtung</h2>
      <div class="lamp-control">
        <div class="label">Wickellicht</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ToggleSwitch from "../components/ToggleSwitch.vue";
import { useDataPoint } from "../composables/useDataPoint";
import type { DataPoint } from "../types/datapoint";

const Wickellicht: DataPoint = {
  name: "Wickellicht",
  id: "hm-rpc.0.000B9F29BA08DA.2.STATE",
  type: "switch",
  writable: true,
};

// Auto-subscribe/unsubscribe via composable
const wickellichtValue = useDataPoint(Wickellicht);
</script>
