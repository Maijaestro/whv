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
const iobroker = ref(iobrokerService.wsUrl)

function testApi() {
  // Test WebSocket connection to the configured URL
  const testUrl = iobroker.value.startsWith('ws') ? iobroker.value : 'ws://' + iobroker.value
  try {
    const testWs = new WebSocket(testUrl)
    testWs.onopen = () => {
      alert('WebSocket erreichbar: ' + testUrl)
      testWs.close()
    }
    testWs.onerror = () => {
      alert('WebSocket nicht erreichbar: ' + testUrl)
    }
  } catch (e) {
    alert('Fehler beim WebSocket-Test: ' + e)
  }
}

function save() {
  const newUrl = iobroker.value.startsWith('ws') ? iobroker.value : 'ws://' + iobroker.value
  iobrokerService.setWsUrl(newUrl)
  alert('WebSocket-Adresse übernommen (in-memory)')
}

function cancel() {
  iobroker.value = iobrokerService.wsUrl
}
</script>
