<template>
	<div class="view floor-view">
		<h1>{{ title }}</h1>
		<div class="group">
			<h2>Beleuchtung</h2>
			<div class="lamp-control">
				<LampIcon :on="wickellichtOn" @update:on="toggleWickellicht" />
				<div class="label">Wickellicht</div>
				<ToggleSwitch v-model="wickellichtOn" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useDataPoint } from '../composables/useDataPoint'
import { useSubscriptionStore } from '../store/subscriptions'
import LampIcon from '../components/LampIcon.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'
import type { DataPoint } from '../types/datapoint'

const route = useRoute()
const title = route.name as string

const WICKELLICHT: DataPoint = {
  name: 'Wickellicht',
  id: 'hm-rpc.0.000B9F29BA08DA.2.STATE',
  type: 'switch',
  writable: true
}

// Auto-subscribe/unsubscribe via composable
const wickellichtValue = useDataPoint(WICKELLICHT)
const wickellichtOn = computed({
  get: () => Boolean(wickellichtValue.value),
  set: (val: boolean) => {
    wickellichtValue.value = val
  }
})

const subscriptionStore = useSubscriptionStore()

async function toggleWickellicht() {
  const newValue = !wickellichtOn.value
  try {
    await subscriptionStore.writeState(WICKELLICHT, newValue)
  } catch (e) {
    console.error('Failed to toggle wickellicht:', e)
  }
}
</script>
