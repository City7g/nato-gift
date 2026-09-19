<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue'
import HeartsCanvas from './components/HeartsCanvas.vue'
import PrimaryButton from './components/PrimaryButton.vue'
import SecondaryButton from './components/SecondaryButton.vue'
import CatsGift from './components/CatsGift.vue'
import { sendInvite, sendInviteAccept } from './api/invite'
import gsap from 'gsap'

const step = ref<'invite' | 'accepted'>('invite')

const accepted = ref(false)
const heartsCanvas = useTemplateRef<{ burst: (x: number, y: number) => void }>('heartsCanvas')

const contentEl = useTemplateRef<HTMLDivElement>('content')

// onMounted(() => {
//   sendInvite()
// })

async function accept(event: MouseEvent) {
  if (accepted.value) return

  accepted.value = true
  heartsCanvas.value?.burst(event.clientX, event.clientY)

  try {
    await sendInviteAccept()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  const items = contentEl.value?.querySelectorAll('.invite__title, .invite__button')
  if (!items?.length) return
  gsap.from(items, {
    opacity: 0,
    y: 16,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power2.out',
  })
})
</script>

<template>
  <HeartsCanvas ref="heartsCanvas" />

  <div class="invite">
    <CatsGift class="invite__imgs" />
    <!-- <div class="invite__imgs" style="outline: 1px solid red;"></div> -->

    <div ref="content" class="invite__content">
      <template v-if="step === 'invite'">
        <h1 class="invite__title">
          {{ $t('first.title', { emoji: '💕' }) }}
        </h1>
        <div class="invite__actions">
          <div class="invite__button">
            <PrimaryButton @click="accept">{{ $t('buttons.yes') }}</PrimaryButton>
          </div>
          <div class="invite__button">
            <SecondaryButton @click="step = 'accepted'">{{ $t('buttons.no') }}</SecondaryButton>
          </div>
        </div>
      </template>
      <template v-else>
        <h1 class="invite__title">
          {{ $t('first.accepted', { emoji: '💕' }) }}
        </h1>
      </template>
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

.invite__actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(280px, 100%);
}
</style>
