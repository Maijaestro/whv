<template>
  <div class="label-value">
    <div class="label">{{ label }}</div>
    <div class="value">{{ value }} <span class="unit">{{ unit }}</span></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'LabelValue',
  props: {
    label: { type: String as PropType<string>, required: true },
    value: { type: [String, Number] as PropType<string | number>, required: false },
    unit: { type: String as PropType<string>, required: false }
  }
})
</script>
