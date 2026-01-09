<template>
  <div class="view floor-view">
    <h1>{{ title }}</h1>
    <div class="group">
      <h2>Beleuchtung</h2>
      <div class="lamp-control"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useDataPoint } from "../composables/useDataPoint";
import { useSubscriptionStore } from "../stores/subscriptions";
import LampIcon from "../components/Light.vue";
import ToggleSwitch from "../components/ToggleSwitch.vue";
import type { DataPoint } from "../types/datapoint";

const route = useRoute();
const title = route.name as string;

const WICKELLICHT: DataPoint = {
  name: "Wickellicht",
  id: "hm-rpc.0.000B9F29BA08DA.2.STATE",
  type: "switch",
  writable: true,
};
</script>
