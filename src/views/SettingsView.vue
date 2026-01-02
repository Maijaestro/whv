<template>
  <div class="view settings-view">
    <h1>Einstellungen</h1>
    <section class="group">
      <h2>Adressen</h2>
      <label for="iobroker">iobroker-Adresse</label>
      <input id="iobroker" v-model="iobroker" />
      <button @click="testApi">API Test</button>
    </section>

    <div class="actions">
      <button @click="save">Speichern</button>
      <button @click="cancel">Abbrechen</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import iobrokerService from '../services/iobrokerService'

// Local-only settings (no persistence)
const iobroker = ref(iobrokerService.base)

function testApi() {
  // simple reachability test (HEAD)
  fetch(iobroker.value, { method: 'GET' })
    .then(() => alert('API erreichbar: ' + iobroker.value))
    .catch(() => alert('API nicht erreichbar: ' + iobroker.value))
}

function save() {
  iobrokerService.setBase(iobroker.value)
  alert('Adresse übernommen (in-memory)')
}

function cancel() {
  iobroker.value = iobrokerService.base
}

</script>
