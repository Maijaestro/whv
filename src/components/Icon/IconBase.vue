<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    class="base-icon"
    preserveAspectRatio="xMidYMid meet"
  >
    <title v-if="title">{{ title }}</title>
    <slot />
  </svg>
</template>

<script lang="ts" setup>
interface Props {
  width?: number;
  height?: number;
  title?: string;
  viewBox: string;
}
defineProps<Props>();
</script>

<style lang="scss" scoped>
.base-icon {
  fill: $color-front;
  stroke: $color-front;
  stroke-width: 0;

  &.spinning {
    animation: spin-animation 1s infinite linear;
  }

  @keyframes spin-animation {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(359deg);
    }
  }
}
</style>
