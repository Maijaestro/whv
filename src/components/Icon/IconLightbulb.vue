<template>
  <IconBase :width="width" :height="height" :viewBox="viewBox" :title="title">
    <path
      d="M9 21h6v-1H9v1zm3-19a7 7 0 00-7 7c0 2.53 1.39 4.74 3.44 5.93L8 18h8l-.44-3.07A6.978 6.978 0 0019 9a7 7 0 00-7-7z"
    />
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from "./IconBase.vue";

interface Props {
  width?: number;
  height?: number;
  title?: string;
  viewBox: string;
}

defineProps<Props>();
</script>
