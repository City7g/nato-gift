<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import StudioShell from '../components/StudioShell.vue'
import { deleteInvite, listInvites } from '../api/client'
import type { Invite } from '../lib/invite'
import { themes } from '../templates/themes'

const router = useRouter()
const invites = ref<Invite[]>([])
const error = ref('')

function themeTitle(id: Invite['theme']) {
  return themes.find((theme) => theme.id === id)?.title ?? id
}

function link(invite: Invite) {
  return `${window.location.origin}/i/${invite.slug}`
}

async function load() {
  error.value = ''
  try {
    invites.value = await listInvites()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Не удалось загрузить список'
  }
}

async function remove(invite: Invite) {
  if (!window.confirm(`Удалить «${invite.title}»? Ссылка перестанет открываться.`)) return
  await deleteInvite(invite.id)
  await load()
}

async function copy(invite: Invite) {
  await navigator.clipboard.writeText(link(invite))
}

onMounted(() => {
  void load()
})
</script>

<template>
  <StudioShell title="Приглашения">
    <div class="studio-list__toolbar">
      <button class="studio-list__create" type="button" @click="router.push('/studio/new')">Новое</button>
    </div>
    <p v-if="error" class="studio-list__error">{{ error }}</p>
    <p v-else-if="!invites.length" class="studio-list__empty">Пока нет приглашений</p>
    <ul v-else class="studio-list">
      <li v-for="invite in invites" :key="invite.id" class="studio-list__item">
        <div>
          <p class="studio-list__name">{{ invite.title }}</p>
          <p class="studio-list__meta">{{ themeTitle(invite.theme) }} · /i/{{ invite.slug }}</p>
        </div>
        <div class="studio-list__actions">
          <button type="button" class="studio-list__button" @click="copy(invite)">Ссылка</button>
          <button type="button" class="studio-list__button" @click="router.push(`/studio/${invite.id}`)">Править</button>
          <button type="button" class="studio-list__button" @click="remove(invite)">Удалить</button>
        </div>
      </li>
    </ul>
  </StudioShell>
</template>

<style scoped lang="scss">
.studio-list__toolbar {
  display: flex;
  justify-content: flex-end;
}

.studio-list__create,
.studio-list__button {
  min-height: 40px;
  padding: 8px 16px;
  border: 0;
  border-radius: 999px;
  background: #ffe3ed;
  color: #6a4a55;
  cursor: pointer;
}

.studio-list__create {
  background: #ff4d94;
  color: #fff;
}

.studio-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
}

.studio-list__item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
}

.studio-list__name {
  font-weight: 700;
}

.studio-list__meta {
  opacity: 0.72;
  font-size: 15px;
}

.studio-list__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.studio-list__error {
  color: #d61f3c;
}
</style>
