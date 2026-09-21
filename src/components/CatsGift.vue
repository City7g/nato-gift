<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import WavyBackground from './WavyBackground.vue'
import HeartBackground from './HeartBackground.vue'
import { catFrames as frames } from '../lib/catsFrames'

const delays = frames.map((_, index) => (index === frames.length - 1 ? 1000 : 150))
const frameIndex = ref(0)

let timeoutId = 0

function playNext() {
  frameIndex.value = (frameIndex.value + 1) % frames.length
  timeoutId = window.setTimeout(playNext, delays[frameIndex.value])
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    frameIndex.value = frames.length - 1
    return
  }

  timeoutId = window.setTimeout(playNext, delays[0])
})

onUnmounted(() => {
  window.clearTimeout(timeoutId)
})
</script>

<template>
  <div class="cats-gift" role="img" aria-label="Рыжий кот достаёт конфету и протягивает её белому коту">
    <!-- <WavyBackground /> -->
    <HeartBackground />
    <img v-for="(frame, index) in frames" :key="frame" class="cats-gift__frame"
      :class="{ 'cats-gift__frame--active': index === frameIndex }" :src="frame" width="280" height="280" alt="" />
  </div>
</template>

<style scoped lang="scss">
.cats-gift {
  position: relative;
  overflow: visible;
}

.cats-gift__frame {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  visibility: hidden;
}

.cats-gift__frame--active {
  opacity: 1;
  visibility: visible;
}
</style>
