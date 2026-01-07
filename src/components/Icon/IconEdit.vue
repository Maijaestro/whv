<template>
	<IconBase
		:width="width"
		:height="height"
		viewBox="0 0 15.348 16.933"
	>
		<g>
			<path
				class="a"
				d="M.959,11.249,0,16l4.752-.958L16,3.794,12.207,0,.959,11.249Zm3.135,2.565L1.706,14.3l.481-2.389,1.907,1.907ZM14.114,3.793,5.036,12.871,3.13,10.964l7.216-7.217,1.9,1.9.943-.943-1.9-1.9.918-.918,1.907,1.907Z"
				transform="translate(0 -0.001)"
			/>
		</g>
	</IconBase>
</template>

<script lang="ts" setup>

interface Props {
	width?: number,
	height?: number,
}

withDefaults(defineProps<Props>(), {
	width: 15.348,
	height: 16.933,
});

</script>

