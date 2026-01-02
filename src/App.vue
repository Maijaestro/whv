<template>
  <div id="app" class="app-root">
    <header class="app-header">
      <nav class="tabs">
        <router-link to="/">Start</router-link>
        <router-link to="/erdgeschoss">Erdgeschoss</router-link>
        <router-link to="/obergeschoss">Obergeschoss</router-link>
        <router-link to="/kameras">Kameras</router-link>
        <router-link to="/links">Links</router-link>
      </nav>
      <div class="right-controls">
        <router-link to="/notifications" aria-label="notifications">🔔</router-link>
        <router-link to="/settings" aria-label="settings">⚙️</router-link>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({ name: 'App' })
</script>

<style src="./styles/variables.css"></style>
