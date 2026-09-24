<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import InviteStage from '../components/InviteStage.vue'
import { getInviteBySlug } from '../api/client'
import { hidePreloader, wait } from '../lib/preloader'
import { preloadCatFrames } from '../lib/catsFrames'
import { publicSteps } from '../lib/normalizeSteps'
import type { Invite } from '../lib/invite'

const route = useRoute()
const invite = ref<Invite | null>(null)
const missing = ref(false)
const ready = ref(false)

async function load(slug: string) {
  ready.value = false
  missing.value = false
  invite.value = null

  try {
    invite.value = await getInviteBySlug(slug)
  } catch {
    missing.value = true
  }

  if (document.getElementById('preloader')) {
    if (invite.value?.theme === 'cats') {
      await Promise.all([document.fonts.ready, preloadCatFrames()])
      await wait(1000)
    }
    await hidePreloader()
  }

  ready.value = true
}

watch(
  () => String(route.params.slug ?? ''),
  (slug) => {
    void load(slug)
  },
  { immediate: true },
)
</script>

<template>
  <p v-if="missing" class="invite-view__missing">Такой страницы нет</p>
  <InviteStage
    v-else-if="ready && invite"
    :theme="invite.theme"
    :steps="publicSteps(invite.steps)"
    :slug="invite.slug"
    track
  />
</template>

<style scoped lang="scss">
.invite-view__missing {
  text-align: center;
  padding: 48px 16px;
}
</style>
