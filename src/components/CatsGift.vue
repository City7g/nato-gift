<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import frame1 from '../assets/cats-frame-1.png'
import frame2 from '../assets/cats-frame-2.png'
import frame3 from '../assets/cats-frame-3.png'
import frame4 from '../assets/cats-frame-4.png'
import frame5 from '../assets/cats-frame-5.png'

const frames = [frame1, frame2, frame3, frame4, frame5]
const delays = [5000, 5000, 5000, 5000, 5000]
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
    <img v-for="(frame, index) in frames" :key="frame" class="cats-gift__frame"
      :class="{ 'cats-gift__frame--active': index === frameIndex }" :src="frame" width="280" height="280" alt="" />
  </div>
</template>

<style scoped lang="scss">
.cats-gift {
  position: relative;
  width: min(300px, 86%);
  aspect-ratio: 1;
  margin-bottom: 4px;
  pointer-events: none;
  user-select: none;
}

.cats-gift__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  visibility: hidden;
  mix-blend-mode: multiply;
}

.cats-gift__frame--active {
  opacity: 1;
  visibility: visible;
}
</style>
