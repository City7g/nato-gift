<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '../api/client'
import { hidePreloader } from '../lib/preloader'

defineProps<{
  title: string
}>()

const router = useRouter()

onMounted(() => {
  void hidePreloader()
})

function exit() {
  logout()
  void router.push('/studio/login')
}
</script>

<template>
  <div class="studio-shell">
    <header class="studio-shell__bar">
      <p class="studio-shell__title">{{ title }}</p>
      <nav class="studio-shell__nav">
        <RouterLink class="studio-shell__link" to="/studio">Приглашения</RouterLink>
        <RouterLink class="studio-shell__link" to="/studio/history">История</RouterLink>
        <button class="studio-shell__exit" type="button" @click="exit">Выйти</button>
      </nav>
    </header>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.studio-shell {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 920px;
  margin: 0 auto;
}

.studio-shell__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.studio-shell__title {
  font-size: 28px;
  font-weight: 700;
}

.studio-shell__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.studio-shell__link {
  color: #6a4a55;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 999px;
}

.studio-shell__link.router-link-active {
  background: #ffe3ed;
}

.studio-shell__exit {
  border: 0;
  background: transparent;
  color: #6a4a55;
  cursor: pointer;
  padding: 8px 12px;
}
</style>
