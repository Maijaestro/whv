<template>
  <div class="temp-display">
    <div class="setpoint">Soll: {{ target }}°C</div>
    <div class="current">Ist: {{ current }}°C</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'TempDisplay', props: { target: { type: Number, required: false }, current: { type: Number, required: false } } })
</script>
