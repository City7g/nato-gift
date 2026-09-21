<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import gsap from 'gsap'
import PrimaryButton from './PrimaryButton.vue'
import SecondaryButton from './SecondaryButton.vue'
import type { StepButton, StepConfig } from '../lib/steps'

const { steps } = defineProps<{
  steps: StepConfig[]
}>()

const emit = defineEmits<{
  celebrate: []
}>()

const currentId = ref(steps[0]?.step ?? '')
let isTransitioning = false
const decorateClicks = ref<number[]>([])
const decorateOffsets = ref<{ x: number; y: number }[]>([])
const rootEl = useTemplateRef<HTMLDivElement>('root')

const stepsById = computed(() => new Map(steps.map((step) => [step.step, step])))

const current = computed(() => stepsById.value.get(currentId.value) ?? steps[0])

watch(
  () => current.value?.step,
  () => {
    const count = current.value?.buttons?.length ?? 0
    decorateClicks.value = Array.from({ length: count }, () => 0)
    decorateOffsets.value = Array.from({ length: count }, () => ({ x: 0, y: 0 }))
  },
  { immediate: true },
)

function isPrimary(button: StepButton, index: number) {
  return !button.decorate && index === 0
}

function buttonLabel(button: StepButton, index: number) {
  if (!Array.isArray(button.text)) return button.text
  const clicks = decorateClicks.value[index] ?? 0
  return button.text[Math.min(clicks, button.text.length - 1)] ?? ''
}

function isButtonVisible(button: StepButton, index: number) {
  if (!button.decorate || !Array.isArray(button.text)) return true
  return (decorateClicks.value[index] ?? 0) < button.text.length
}

function decorateStyle(button: StepButton, index: number) {
  if (!button.decorate) return undefined
  const offset = decorateOffsets.value[index]
  if (!offset) return undefined
  return { transform: `translate(${offset.x}px, ${offset.y}px)` }
}

function dodge(index: number) {
  const angle = Math.random() * Math.PI * 2
  const distance = 48 + Math.random() * 56

  decorateOffsets.value[index] = {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  }
}

async function goToStep(nextId: string) {
  const next = stepsById.value.get(nextId)
  if (!next || next.step === currentId.value || isTransitioning) return

  isTransitioning = true

  try {
    await animHide()
    currentId.value = next.step
    await nextTick()
    await animShow()

    if (next.celebrate) emit('celebrate')
  } finally {
    isTransitioning = false
  }
}

function onButtonClick(button: StepButton, index: number) {
  if (button.decorate) {
    decorateClicks.value[index] = (decorateClicks.value[index] ?? 0) + 1
    dodge(index)
    return
  }

  if (button.route) void goToStep(button.route)
}

const animShow = async () => {
  const items = rootEl.value?.querySelectorAll('.steps__title, .steps__subtitle, .steps__button')
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
  const items = rootEl.value?.querySelectorAll('.steps__title, .steps__subtitle, .steps__button')
  if (!items?.length) return

  return gsap.to(items, {
    opacity: 0,
    y: 16,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power2.out',
  })
}

onMounted(() => {
  void animShow()
})
</script>

<template>
  <div v-if="current" ref="root" class="steps">
    <div :key="current.step" class="steps__stage">
      <h1 class="steps__title">{{ current.text }}</h1>
      <p v-if="current.subtitle" class="steps__subtitle">{{ current.subtitle }}</p>
      <div v-if="current.buttons?.length" class="steps__actions">
        <template v-for="(button, index) in current.buttons" :key="index">
          <div
            v-if="isButtonVisible(button, index)"
            class="steps__button"
            :class="{ 'steps__button--flee': button.decorate }"
            :style="decorateStyle(button, index)"
          >
            <PrimaryButton v-if="isPrimary(button, index)" @click="onButtonClick(button, index)">
              {{ buttonLabel(button, index) }}
            </PrimaryButton>
            <SecondaryButton v-else @click="onButtonClick(button, index)">
              {{ buttonLabel(button, index) }}
            </SecondaryButton>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.steps {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  text-align: center;
  padding: 20px;
  overflow: visible;
}

@media (min-aspect-ratio: 1/1) {
  .steps {
    justify-content: center;
  }
}

.steps__title {
  color: #6a4a55;
  font-family: 'Nunito', sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.02em;
}

.steps__stage {
  display: contents;
}

.steps__subtitle {
  color: #6a4a55;
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  opacity: 0.72;
}

.steps__actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(280px, 100%);
  overflow: visible;
}

.steps__button--flee {
  position: relative;
  z-index: 2;
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
