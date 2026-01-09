<template>
  <button class="switch" :class="{ on: cap.value === true }" @click="toggle">
    <div class="icon-wrapper">
      <IconLightbulb :width="48" :height="48" viewBox="0 0 24 24" />
    </div>

    <div class="label">
      {{ label }}
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useIoBrokerStore } from "@/stores/useIoBrokerStore";
import type { OnOffCapability } from "@/types/deviceModel";

interface Props {
  cap: OnOffCapability;
  label: string;
}

const props = defineProps<Props>();
const io = useIoBrokerStore();

const isOn = computed(() => props.cap.value === true);

function toggle() {
  io.setState(props.cap.stateId, !isOn.value);
}
</script>

<style scoped lang="scss">
.switch {
  width: 140px;
  height: 140px;
  border-radius: 24px;
  border: none;
  cursor: pointer;
  background: $color-background-secondary;
  color: $color-front;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
  }

  &.on {
    background: $color-primary;
    color: $color-background;

    .icon-wrapper svg {
      fill: $color-background;
      stroke: $color-background;
    }
  }
}

.icon-wrapper {
  margin-bottom: 8px;
}

.label {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}
</style>
