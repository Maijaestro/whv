<template>
	<div class="multi-state">
		<button v-for="opt in options" :key="opt" @click="$emit('update:modelValue', opt)"
			:class="{active: modelValue === opt}">{{ opt }}</button>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'

export default defineComponent({
	name: 'MultiStateSwitch',
	props: {options: {type: Array as PropType<string[]>, required: true}, modelValue: {type: String}}
})
</script>
