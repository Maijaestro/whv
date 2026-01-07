<template>
  <div class="lamp" :class="{ on: on }" @click="$emit('update:on', !on)">
    <span :style="{ color: on ? '#FFD700' : '#ffffff' }">💡</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  on: { type: Boolean, required: true },
});
</script>

<style scoped>
.lamp {
  cursor: pointer;
  font-size: 2rem;
  transition: filter 0.2s;
}

.lamp:hover {
  filter: brightness(1.2);
}
</style>
