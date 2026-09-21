<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import HeartsCanvas from './components/HeartsCanvas.vue'
import PrimaryButton from './components/PrimaryButton.vue'
import SecondaryButton from './components/SecondaryButton.vue'
import CatsGift from './components/CatsGift.vue'
import { sendInvite, sendInviteAccept } from './api/invite'
import { preloadCatFrames } from './lib/catsFrames'
import { hidePreloader, wait } from './lib/preloader'
import gsap from 'gsap'

type Step = 'intro' | 'reassure' | 'hint' | 'invite' | 'promise' | 'finale'

const PRIMARY_NEXT: Record<Step, Step | null> = {
  intro: 'hint',
  reassure: 'hint',
  hint: 'invite',
  invite: 'promise',
  promise: 'finale',
  finale: null,
}

const SECONDARY_NEXT: Partial<Record<Step, Step>> = {
  intro: 'reassure',
  promise: 'finale',
}

const { t } = useI18n()

const currentStep = ref<Step>('intro')
let isTransitioning = false

const step = computed(() => currentStep.value)
const isReady = ref(false)
const accepted = ref(false)
const noClicks = ref(0)
const noOffset = ref({ x: 0, y: 0 })

const heartsCanvas = useTemplateRef<{ burst: (x: number, y: number) => void }>('heartsCanvas')
const contentEl = useTemplateRef<HTMLDivElement>('content')

const hasPrimary = computed(() => step.value !== 'finale')
const hasSecondary = computed(() => {
  if (step.value === 'invite') return noClicks.value < 3
  return step.value in SECONDARY_NEXT
})

const secondaryLabel = computed(() => {
  if (step.value !== 'invite') return t(`steps.${step.value}.secondary`)
  if (noClicks.value >= 2) return t('steps.invite.decorative')
  if (noClicks.value >= 1) return t('steps.invite.broken')
  return t('steps.invite.secondary')
})

const noButtonStyle = computed(() => {
  if (step.value !== 'invite') return undefined
  return { transform: `translate(${noOffset.value.x}px, ${noOffset.value.y}px)` }
})

async function goToStep(next: Step) {
  if (next === currentStep.value || isTransitioning) return

  isTransitioning = true

  try {
    await animHide()
    currentStep.value = next
    await nextTick()
    await animShow()

    if (next === 'finale') {
      void celebrate()
    }
  } finally {
    isTransitioning = false
  }
}

function onPrimary() {
  const next = PRIMARY_NEXT[currentStep.value]
  if (next) void goToStep(next)
}

function onSecondary() {
  if (currentStep.value === 'invite') {
    dodgeNo()
    return
  }

  const next = SECONDARY_NEXT[currentStep.value]
  if (next) void goToStep(next)
}

function dodgeNo() {
  noClicks.value += 1

  const angle = Math.random() * Math.PI * 2
  const distance = 48 + Math.random() * 56

  noOffset.value = {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  }
}

async function celebrate() {
  if (accepted.value) return

  accepted.value = true
  heartsCanvas.value?.burst(window.innerWidth / 2, window.innerHeight / 2)

  try {
    await sendInviteAccept()
  } catch (error) {
    console.error(error)
  }
}

const animShow = async () => {
  const items = contentEl.value?.querySelectorAll('.invite__title, .invite__subtitle, .invite__button')
  if (!items?.length) return

  return gsap.from(items, {
    opacity: 0,
    y: 16,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power2.out',
  })
}

const animHide = async () => {
  const items = contentEl.value?.querySelectorAll('.invite__title, .invite__subtitle, .invite__button')
  if (!items?.length) return

  return gsap.to(items, {
    opacity: 0,
    y: 16,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power2.out',
  })
}

onMounted(async () => {
  if (document.getElementById('preloader')) {
    await Promise.all([document.fonts.ready, preloadCatFrames()])
    await wait(1000)
    await hidePreloader()
  }

  isReady.value = true
  void sendInvite().catch((error) => {
    console.error(error)
  })
  await nextTick()
  await animShow()
})
</script>

<template>
  <HeartsCanvas ref="heartsCanvas" />

  <div v-if="isReady" class="invite">
    <CatsGift class="invite__imgs" />
    <!-- <div class="invite__imgs" style="outline: 1px solid red;"></div> -->

    <div ref="content" class="invite__content">
      <div :key="step" class="invite__stage">
        <h1 class="invite__title">
          {{ $t(`steps.${step}.title`) }}
        </h1>
        <p v-if="step === 'finale'" class="invite__subtitle">
          {{ $t('steps.finale.subtitle') }}
        </p>
        <div v-if="hasPrimary" class="invite__actions">
          <div class="invite__button">
            <PrimaryButton @click="onPrimary">{{ $t(`steps.${step}.primary`) }}</PrimaryButton>
          </div>
          <div
            v-if="hasSecondary"
            class="invite__button"
            :class="{ 'invite__button--flee': step === 'invite' }"
            :style="noButtonStyle"
          >
            <SecondaryButton @click="onSecondary">{{ secondaryLabel }}</SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// .invite {
//   outline: 1px solid green;
// }

// .invite__imgs {
//   outline: 1px solid blue;
// }

// .invite__content {
//   outline: 1px solid red;
// }

.invite {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, calc(50svh - 110px));
  justify-content: center;
  // justify-items: center;
  align-content: center;
  align-items: center;
  gap: 10px;
  height: calc(100svh - 80px);

  @media (min-aspect-ratio: 1/1) {
    grid-template-columns: repeat(2, calc(50svw - 110px));
    grid-template-rows: 1fr;
  }
}

.invite__imgs,
.invite__content {
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 1;
}

.invite__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  text-align: center;
  padding: 20px;
  overflow: visible;

  @media (min-aspect-ratio: 1/1) {
    justify-content: center;
  }
}

.invite__title {
  color: #6a4a55;
  font-family: 'Nunito', sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.02em;
}

.invite__stage {
  display: contents;
}

.invite__subtitle {
  color: #6a4a55;
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  opacity: 0.72;
}

.invite__actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(280px, 100%);
  overflow: visible;
}

.invite__button--flee {
  position: relative;
  z-index: 2;
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
