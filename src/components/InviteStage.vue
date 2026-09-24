<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'
import CatsGift from './CatsGift.vue'
import CloudBackground from './CloudBackground.vue'
import HeartBackground from './HeartBackground.vue'
import HeartsCanvas from './HeartsCanvas.vue'
import Steps from './Steps.vue'
import { preloadCatFrames } from '../lib/catsFrames'
import type { StepConfig } from '../lib/steps'
import type { ThemeId } from '../templates/themes'

const { theme, steps, slug = '', track = false } = defineProps<{
  theme: ThemeId
  steps: StepConfig[]
  slug?: string
  track?: boolean
}>()

const accepted = ref(false)
const heartsCanvas = useTemplateRef<{ burst: (x: number, y: number) => void }>('heartsCanvas')

function celebrate() {
  if (accepted.value) return
  accepted.value = true
  heartsCanvas.value?.burst(window.innerWidth / 2, window.innerHeight / 2)
}

watch(
  () => steps.map((step) => step.step).join('|'),
  () => {
    accepted.value = false
  },
)

onMounted(() => {
  if (theme === 'cats') void preloadCatFrames()
})
</script>

<template>
  <HeartsCanvas ref="heartsCanvas" />

  <div v-if="theme === 'cats'" class="invite-stage invite-stage--cats">
    <CatsGift class="invite-stage__media" />
    <Steps class="invite-stage__content" :steps="steps" :slug="slug" :track="track" @celebrate="celebrate" />
  </div>

  <div v-else-if="theme === 'hearts'" class="invite-stage invite-stage--hearts">
    <HeartBackground />
    <Steps class="invite-stage__content" :steps="steps" :slug="slug" :track="track" @celebrate="celebrate" />
  </div>

  <CloudBackground v-else>
    <Steps :steps="steps" :slug="slug" :track="track" @celebrate="celebrate" />
  </CloudBackground>
</template>

<style scoped lang="scss">
.invite-stage--cats {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, calc(50svh - 110px));
  justify-content: center;
  align-content: center;
  align-items: center;
  gap: 10px;
  height: calc(100svh - 80px);
}

.invite-stage--hearts {
  position: relative;
  display: grid;
  place-items: center;
  min-height: calc(100svh - 80px);
}

.invite-stage__media,
.invite-stage__content {
  max-width: 100%;
  max-height: 100%;
  height: 100%;
  width: 100%;
}

.invite-stage--hearts .invite-stage__content {
  position: relative;
  z-index: 1;
  height: auto;
}

@media (min-aspect-ratio: 1/1) {
  .invite-stage--cats {
    grid-template-columns: repeat(2, calc(50svw - 110px));
    grid-template-rows: 1fr;
  }
}
</style>
