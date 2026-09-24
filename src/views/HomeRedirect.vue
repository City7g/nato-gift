<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SEED_SLUG } from '../api/local'
import { getInviteBySlug } from '../api/client'

const router = useRouter()

onMounted(async () => {
  try {
    await getInviteBySlug(SEED_SLUG)
    await router.replace(`/i/${SEED_SLUG}`)
  } catch {
    await router.replace('/studio')
  }
})
</script>

<template>
  <p class="home-redirect">Открываю приглашение…</p>
</template>

<style scoped lang="scss">
.home-redirect {
  text-align: center;
}
</style>
