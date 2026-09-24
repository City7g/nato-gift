<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { hidePreloader } from './lib/preloader'

const route = useRoute()

onMounted(() => {
  if (route.path === '/' || route.path.startsWith('/i/')) return
  void hidePreloader()
})
</script>

<template>
  <router-view />
</template>
