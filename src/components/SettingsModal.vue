<template>
  <div class="settings-modal">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({ name: 'SettingsModal' })
</script>
