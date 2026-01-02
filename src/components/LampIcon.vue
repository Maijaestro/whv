<template>
  <div class="lamp" :class="{on: on}" @click="$emit('update:on', !on)">
    💡
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'LampIcon', props: { on: { type: Boolean, required: true } } })
</script>
