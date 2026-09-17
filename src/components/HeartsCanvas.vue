<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { createHeartBurst } from '../lib/heartBurst'

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')

let burstFn: ((x: number, y: number) => void) | null = null
let resize: (() => void) | null = null
let destroy: (() => void) | null = null

function burst(x: number, y: number) {
  burstFn?.(x, y)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  const engine = createHeartBurst(canvas)
  burstFn = engine.burst
  resize = engine.resize
  destroy = engine.destroy

  window.addEventListener('resize', engine.resize)
})

onUnmounted(() => {
  if (resize) {
    window.removeEventListener('resize', resize)
  }
  destroy?.()
})

defineExpose({ burst })
</script>

<template>
  <canvas ref="canvas" class="hearts-canvas" aria-hidden="true" />
</template>

<style scoped lang="scss">
.hearts-canvas {
  position: fixed;
  inset: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
