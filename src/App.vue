<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import HeartsCanvas from './components/HeartsCanvas.vue'
import CatsGift from './components/CatsGift.vue'
import Steps from './components/Steps.vue'
import { sendEnter, sendStep, sendEnd } from './api/invite'
import { preloadCatFrames } from './lib/catsFrames'
import { hidePreloader, wait } from './lib/preloader'
import { steps } from './lib/steps'

const isReady = ref(false)
const accepted = ref(false)

const heartsCanvas = useTemplateRef<{ burst: (x: number, y: number) => void }>('heartsCanvas')

async function celebrate() {
  if (accepted.value) return

  accepted.value = true
  heartsCanvas.value?.burst(window.innerWidth / 2, window.innerHeight / 2)

  try {
    await sendEnd()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await sendEnter()

  if (document.getElementById('preloader')) {
    await Promise.all([document.fonts.ready, preloadCatFrames()])
    await wait(1000)
    await hidePreloader()
  }

  isReady.value = true
})
</script>

<template>
  <HeartsCanvas ref="heartsCanvas" />

  <div v-if="isReady" class="invite">
    <CatsGift class="invite__imgs" />

    <Steps class="invite__content" :steps="steps" @celebrate="celebrate" />
  </div>
</template>

<style scoped lang="scss">
.invite {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, calc(50svh - 110px));
  justify-content: center;
  align-content: center;
  align-items: center;
  gap: 10px;
  height: calc(100svh - 80px);
}

@media (min-aspect-ratio: 1/1) {
  .invite {
    grid-template-columns: repeat(2, calc(50svw - 110px));
    grid-template-rows: 1fr;
  }
}

.invite__imgs,
.invite__content {
  max-width: 100%;
  max-height: 100%;
  height: 100%;
  width: 100%;
}
</style>
