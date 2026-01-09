<template>
  <div class="iob-wrapper" :class="store.connectionStatus" :title="tooltipText">
    <span class="label">IOB</span>
    <div
      v-if="animatePing"
      class="ping-border"
      @animationend="onAnimationEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useIoBrokerStore } from "../stores/useIoBrokerStore";
import { WsConnectionStatus } from "../services/iobrokerClient";

const store = useIoBrokerStore();
const animatePing = ref(false);
const tooltipText = computed(() => {
  switch (store.connectionStatus) {
    case WsConnectionStatus.Connected:
      return "Verbunden mit ioBroker";
    case WsConnectionStatus.Connecting:
      return "Verbindung wird aufgebaut…";
    default:
      return "Keine Verbindung zu ioBroker";
  }
});

// watch(
//   () => store.lastPing,
//   (v) => {
//     if (!v) return;
//     animatePing.value = false;
//     requestAnimationFrame(() => {
//       animatePing.value = true;
//     });
//   }
// );
function onAnimationEnd() {
  animatePing.value = false;
}
</script>

<style lang="scss" scoped>
.iob-wrapper {
  position: relative;
  padding: 4px 10px;
  border-radius: 6px;
  border: 2px solid transparent;
  font-weight: bold;
  font-family: monospace;
  transition: background 0.3s, border-color 0.3s, color 0.3s;
  user-select: none;
  display: inline-flex;
}

.iob-wrapper.disconnected {
  background: #666;
  color: $color-front;
}

.iob-wrapper.connecting {
  background: #e6c200;
  color: $color-background;
}

.iob-wrapper.connected {
  background: #2ecc71;
  color: $color-background;
}
/*
.ping-border {
  position: absolute;
  inset: 0px;
  border-radius: inherit;
  pointer-events: none;

  background: conic-gradient(
    from 0deg,
    white 0deg,
    transparent 60deg,
    transparent 360deg
  );

  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 2px),
    black calc(100% - 1px)
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 2px),
    black calc(100% - 1px)
  );

  animation: sweep 0.6s linear;
}
*/
</style>
