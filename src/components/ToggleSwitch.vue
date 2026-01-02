<template>
  <button class="toggle" :class="{on: modelValue}" @click="$emit('update:modelValue', !modelValue)">
    <slot>{{ modelValue ? 'On' : 'Off' }}</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ToggleSwitch',
  props: { modelValue: { type: Boolean, required: true } }
})
</script>
