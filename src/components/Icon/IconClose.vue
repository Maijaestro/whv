<template>
	<IconBase
		:width="width"
		:height="height"
		viewBox="0 0 14 14"
	>
		<g>
			<path
				d="M13.954,12.248,8.6,6.943l5.3-5.351L12.248-.046l-5.3,5.354L1.593.007-.046,1.646,5.312,6.957.007,12.315l1.639,1.639L6.962,8.592,12.317,13.9Z"
				transform="translate(0.046 0.046)"
			/>
		</g>
	</IconBase>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
	props: {
		width: {
			type: Number,
			default: 14,
		},
		height: {
			type: Number,
			default: 14,
		},
	},
});
</script>

