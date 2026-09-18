<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

const WAVE_EASE = 0.36

const {
  waves = 4,
  inset = 30,
  radius = 18,
} = defineProps<{
  waves?: number
  inset?: number
  radius?: number
}>()

const rootEl = useTemplateRef<HTMLElement>('root')
const box = ref({ w: 0, h: 0 })

let resizeObserver: ResizeObserver | undefined

function fmt(value: number) {
  return value.toFixed(2)
}

function wavyEdge(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  insetX: number,
  insetY: number,
) {
  const dx = x1 - x0
  const dy = y1 - y0
  const hx = (dx / waves / 2) * WAVE_EASE
  const hy = (dy / waves / 2) * WAVE_EASE
  const parts: string[] = []

  for (let i = 0; i < waves; i += 1) {
    const t0 = i / waves
    const t1 = (i + 1) / waves
    const tm = (t0 + t1) / 2
    const sx = x0 + dx * t0
    const sy = y0 + dy * t0
    const mx = x0 + dx * tm + insetX
    const my = y0 + dy * tm + insetY
    const ex = x0 + dx * t1
    const ey = y0 + dy * t1

    parts.push(
      `C ${fmt(sx + hx)} ${fmt(sy + hy)}, ${fmt(mx - hx)} ${fmt(my - hy)}, ${fmt(mx)} ${fmt(my)}`,
      `C ${fmt(mx + hx)} ${fmt(my + hy)}, ${fmt(ex - hx)} ${fmt(ey - hy)}, ${fmt(ex)} ${fmt(ey)}`,
    )
  }

  return parts.join(' ')
}

const wavePath = computed(() => {
  const { w, h } = box.value
  if (w < 1 || h < 1) return ''

  const a = Math.min(inset, w / 4, h / 4)
  const r = Math.min(radius, w / 8, h / 8)

  return [
    `M ${fmt(r)} 0`,
    wavyEdge(r, 0, w - r, 0, 0, a),
    `A ${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(w)} ${fmt(r)}`,
    wavyEdge(w, r, w, h - r, -a, 0),
    `A ${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(w - r)} ${fmt(h)}`,
    wavyEdge(w - r, h, r, h, 0, -a),
    `A ${fmt(r)} ${fmt(r)} 0 0 1 0 ${fmt(h - r)}`,
    wavyEdge(0, h - r, 0, r, a, 0),
    `A ${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(r)} 0`,
    'Z',
  ].join(' ')
})

onMounted(() => {
  if (!rootEl.value) return

  resizeObserver = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect
    box.value = { w: width, h: height }
  })
  resizeObserver.observe(rootEl.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div ref="root" class="wavy-background" aria-hidden="true">
    <svg
      v-if="wavePath"
      class="wavy-background__svg"
      :viewBox="`0 0 ${box.w} ${box.h}`"
      preserveAspectRatio="none"
    >
      <path class="wavy-background__shape" :d="wavePath" />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.wavy-background {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
}

.wavy-background__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.wavy-background__shape {
  fill: #fff;
  stroke: #f3c1ce;
  stroke-width: 2;
  stroke-linejoin: round;
}
</style>
