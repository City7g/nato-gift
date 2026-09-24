<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import StudioShell from '../components/StudioShell.vue'
import { listEvents, listInvites } from '../api/client'
import type { Invite, VisitEvent } from '../lib/invite'

type SessionGroup = {
  sessionId: string
  device: string
  startedAt: string
  ended: boolean
  choices: { step: string; button: string; at: string }[]
}

const invites = ref<Invite[]>([])
const inviteId = ref('')
const events = ref<VisitEvent[]>([])
const error = ref('')

const sessions = computed(() => {
  const groups = new Map<string, SessionGroup>()

  for (const event of events.value) {
    const current = groups.get(event.sessionId) ?? {
      sessionId: event.sessionId,
      device: event.device,
      startedAt: event.createdAt,
      ended: false,
      choices: [],
    }

    if (event.device) current.device = event.device
    if (event.type === 'end') current.ended = true
    if (event.type === 'step' && event.step && event.button) {
      current.choices.push({ step: event.step, button: event.button, at: event.createdAt })
    }

    groups.set(event.sessionId, current)
  }

  return [...groups.values()].sort((a, b) => b.startedAt.localeCompare(a.startedAt))
})

function formatTime(value: string) {
  return new Date(value).toLocaleString('ru')
}

function stepLabel(stepId: string) {
  const invite = invites.value.find((item) => item.id === inviteId.value)
  return invite?.steps.find((step) => step.step === stepId)?.text ?? stepId
}

async function loadInvites() {
  invites.value = await listInvites()
  if (!inviteId.value) inviteId.value = invites.value[0]?.id ?? ''
}

async function loadEvents() {
  error.value = ''
  events.value = []
  if (!inviteId.value) return
  try {
    events.value = await listEvents(inviteId.value)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Не удалось загрузить историю'
  }
}

onMounted(async () => {
  try {
    await loadInvites()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Не удалось загрузить приглашения'
  }
})

watch(inviteId, () => {
  void loadEvents()
})
</script>

<template>
  <StudioShell title="История">
    <label class="studio-history__filter">
      <span>Приглашение</span>
      <select v-model="inviteId" class="studio-history__select">
        <option v-for="invite in invites" :key="invite.id" :value="invite.id">{{ invite.title }}</option>
      </select>
    </label>
    <p v-if="error" class="studio-history__error">{{ error }}</p>
    <p v-else-if="inviteId && !sessions.length" class="studio-history__empty">Пока никто не заходил</p>
    <ul v-else class="studio-history">
      <li v-for="session in sessions" :key="session.sessionId" class="studio-history__session">
        <p class="studio-history__time">{{ formatTime(session.startedAt) }}</p>
        <p class="studio-history__device">{{ session.device }}</p>
        <p class="studio-history__status">{{ session.ended ? 'Дошла до конца' : 'Не дошла до конца' }}</p>
        <ol class="studio-history__choices">
          <li v-for="(choice, index) in session.choices" :key="index">
            {{ stepLabel(choice.step) }} — «{{ choice.button }}»
          </li>
        </ol>
      </li>
    </ul>
  </StudioShell>
</template>

<style scoped lang="scss">
.studio-history__filter {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
}

.studio-history__select {
  min-height: 42px;
  padding: 8px 12px;
  border: 1px solid #ffd0e1;
  border-radius: 12px;
  background: #fff;
  color: #6a4a55;
}

.studio-history {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
}

.studio-history__session {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
}

.studio-history__time {
  font-weight: 700;
}

.studio-history__device,
.studio-history__status {
  font-size: 15px;
  opacity: 0.8;
}

.studio-history__choices {
  padding-left: 18px;
}

.studio-history__error {
  color: #d61f3c;
}
</style>
