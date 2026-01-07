<template>
	<IconBase
		:width="width"
		:height="height"
		viewBox="0 0 13.563 13.563"
	>
		<g>
			<path
				d="M13.781-5.25A6.781,6.781,0,0,0,7-12.031,6.781,6.781,0,0,0,.219-5.25,6.781,6.781,0,0,0,7,1.531,6.781,6.781,0,0,0,13.781-5.25ZM6.216-1.659a.438.438,0,0,1-.619,0L2.753-4.5a.438.438,0,0,1,0-.619l.619-.619a.438.438,0,0,1,.619,0L5.906-3.825l4.1-4.1a.437.437,0,0,1,.619,0l.619.619a.438.438,0,0,1,0,.619Z"
				transform="translate(-0.219 12.031)"
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
			default: 13.563,
		},
		height: {
			type: Number,
			default: 13.563,
		},
	},
});
</script>

