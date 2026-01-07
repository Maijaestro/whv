<template>
	<div
		class="base-icon-container"
		:class="{'with-badge': withBadge}"
	>
		<svg
			ref="icon"
			xmlns="http://www.w3.org/2000/svg"
			:width="width"
			:height="height"
			:viewBox="viewBox"
			class="base-icon"
			:style="{ fill:color }"
			preserveAspectRatio="xMidYMid meet"
		>
			<slot />
		</svg>
		<div
			v-if="withBadge"
			class="badge"
			:style="'--minSize: ' + baseSize +'px'"
		>
			{{ badgeNumber }}
		</div>
	</div>
</template>

<script lang="ts" setup>import {get, useElementSize} from '@vueuse/core';
import {computed, ref} from 'vue';

interface Props {
	width?: number,
	height?: number,
	viewBox: string,
	color?: string,
	badgeNumber?: number,
}
const props = defineProps<Props>();
const withBadge = computed(() => props.badgeNumber && props.badgeNumber > 0);

const icon = ref(null);
const {width: elWidth, height: elHeight} = useElementSize(icon);
const baseSize = computed(() => props.width && props.height ? Math.min(props.width, props.height) : Math.min(get(elWidth), get(elHeight)));
</script>

<style lang="scss" scoped>
.base-icon-container {
	position: relative;

	.base-icon {
		fill: $color-scheme-grey90;
		stroke: $color-scheme-grey90;
		stroke-width: 0;

		&.spinning {
			animation: spin-animation 1s infinite linear;
		}

		@keyframes spin-animation {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(359deg);
			}
		}
	}

	&.with-badge {
		margin-right: 1em;
	}

	.badge {
		position: absolute;
		background-color: $color-scheme-astral;
		color: $color-scheme-white;
		font-size: calc(var(--minSize)*0.65);
		left: 1em;
		bottom: 1em;
		border-radius: 4px;
		padding: 1px 3px;
	}
}
</style>
