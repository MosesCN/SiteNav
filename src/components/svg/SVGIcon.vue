<template>
  <svg class="svg-icon icon" :style="iconStyle">
    <use :href="iconName" />
  </svg>
</template>

<script setup lang="ts">
  import { computed, CSSProperties } from 'vue'

  interface Props {
    name: string
    size: string
    color: string
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    size: '18px',
    color: '#000000',
  })

  const size = `${props.size.replace('px', '')}px`
  const iconName = computed(() => `#${props.name}`)
  const iconStyle = computed((): CSSProperties => {
    return {
      color: props.color,
      fontSize: size,
    }
  })
  const urlIconStyle = computed(() => {
    return {
      width: s,
      height: s,
      mask: `url(${props.name}) no-repeat 50% 50%`,
      '-webkit-mask': `url(${props.name}) no-repeat 50% 50%`,
    }
  })
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
