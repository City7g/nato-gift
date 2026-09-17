<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import CloudBackground from './components/CloudBackground.vue'
import HeartsCanvas from './components/HeartsCanvas.vue'
import PrimaryButton from './components/PrimaryButton.vue'
import SecondaryButton from './components/SecondaryButton.vue'
import catsImg from './assets/cats.png'

const accepted = ref(false)
const heartsCanvas = useTemplateRef<{ burst: (x: number, y: number) => void }>('heartsCanvas')

function accept(event: MouseEvent) {
  accepted.value = true
  heartsCanvas.value?.burst(event.clientX, event.clientY)
}
</script>

<template>
  <HeartsCanvas ref="heartsCanvas" />
  <CloudBackground>
    <div class="invite">
      <img class="invite__cats" :src="catsImg" width="280" height="280" alt="Рыжий и белый котики" />

      <h1 class="invite__title">
        <template v-if="accepted">я так и знала 💕</template>
        <template v-else>ты пойдешь со мной<br />на свидание?</template>
      </h1>

      <div v-if="!accepted" class="invite__actions">
        <PrimaryButton @click="accept">Да</PrimaryButton>
        <SecondaryButton>Нет</SecondaryButton>
      </div>
    </div>
  </CloudBackground>
</template>

<style scoped lang="scss">
.invite {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.invite__cats {
  width: min(300px, 86%);
  height: auto;
  margin-bottom: 4px;
  mix-blend-mode: multiply;
  pointer-events: none;
  user-select: none;
}

.invite__title {
  margin: 0 0 28px;
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
