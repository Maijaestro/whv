<template>
  <div class="window-state">Fenster: <strong>{{ open ? 'Offen' : 'Geschlossen' }}</strong></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'WindowState', props: { open: { type: Boolean, required: true } } })
</script>
