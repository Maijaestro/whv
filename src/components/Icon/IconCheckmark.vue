<template>
	<IconBase
		:width="width"
		:height="height"
		:viewBox="viewBox"
	>
		<g>
			<path
				d="M16.324,5.951,8.063,15.376,3,10.922l.976-1.1L7.93,13.288,15.232,5l1.092.951Z"
			/>
		</g>
	</IconBase>
</template>

<script lang="ts" setup>
interface Props {
	width?: number,
	height?: number,
	viewBox?: string,
}
withDefaults(defineProps<Props>(), {width: 19, height: 19, viewBox: '0 0 19 20'});
</script>

