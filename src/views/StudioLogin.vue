<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../api/client'
import { hidePreloader } from '../lib/preloader'

const route = useRoute()
const router = useRouter()
const code = ref('')
const error = ref('')
const pending = ref(false)

onMounted(() => {
  void hidePreloader()
})

async function submit() {
  error.value = ''
  pending.value = true
  try {
    await login(code.value)
    const next = typeof route.query.next === 'string' ? route.query.next : '/studio'
    await router.push(next.startsWith('/studio') ? next : '/studio')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Не удалось войти'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form class="studio-login" @submit.prevent="submit">
    <h1 class="studio-login__title">Кабинет</h1>
    <p class="studio-login__hint">Код доступа к генератору приглашений</p>
    <input v-model="code" class="studio-login__input" type="password" autocomplete="current-password" />
    <p v-if="error" class="studio-login__error">{{ error }}</p>
    <button class="studio-login__submit" type="submit" :disabled="pending">Войти</button>
  </form>
</template>

<style scoped lang="scss">
.studio-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 360px;
  margin: 12vh auto 0;
}

.studio-login__title {
  font-size: 32px;
}

.studio-login__hint {
  opacity: 0.72;
}

.studio-login__input {
  min-height: 48px;
  padding: 10px 14px;
  border: 1px solid #ffd0e1;
  border-radius: 12px;
  background: #fff;
  color: #6a4a55;
}

.studio-login__error {
  color: #d61f3c;
}

.studio-login__submit {
  min-height: 48px;
  border: 0;
  border-radius: 999px;
  background: #ff4d94;
  color: #fff;
  cursor: pointer;
}

.studio-login__submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
