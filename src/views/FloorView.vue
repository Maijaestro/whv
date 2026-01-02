<template>
	<div class="view floor-view">
		<h1>{{ title }}</h1>
		<p>Stub: Komponenten für Lichter, Thermostate, Fenster etc. kommen hierhin.</p>
	</div>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
const route = useRoute()
const title = route.name as string
</script>
