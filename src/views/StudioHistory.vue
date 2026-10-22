<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import StudioShell from '../components/StudioShell.vue'
import { listEvents, listInvites } from '../api/client'
import { deviceMeta, deviceTitle } from '../lib/device'
import type { Invite, VisitEvent } from '../lib/invite'

type SessionGroup = {
  sessionId: string
  device: string
  startedAt: string
  ended: boolean
  left: boolean
  choices: { step: string; button: string; at: string }[]
}

const invites = ref<Invite[]>([])
const inviteId = ref('')
const events = ref<VisitEvent[]>([])
const error = ref('')
const openSessions = ref<string[]>([])

const sessions = computed(() => {
  const groups = new Map<string, SessionGroup>()

  for (const event of events.value) {
    const current = groups.get(event.sessionId) ?? {
      sessionId: event.sessionId,
      device: event.device,
      startedAt: event.createdAt,
      ended: false,
      left: false,
      choices: [],
    }

    if (event.device) current.device = event.device
    if (event.type === 'end') current.ended = true
    if (event.type === 'leave') current.left = true
    if (event.type === 'step' && event.step && event.button) {
      current.choices.push({ step: event.step, button: event.button, at: event.createdAt })
    }

    groups.set(event.sessionId, current)
  }

  return [...groups.values()].sort((a, b) => b.startedAt.localeCompare(a.startedAt))
})

function sessionStatus(session: SessionGroup) {
  if (session.ended) return 'Дошла до конца'
  if (session.left) return 'Закрыла страницу'
  return 'На странице'
}

function stepsCount(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return `${count} шаг`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} шага`
  return `${count} шагов`
}

function formatTime(value: string) {
  return new Date(value).toLocaleString('ru')
}

function isSessionOpen(id: string) {
  return openSessions.value.includes(id)
}

function toggleSession(id: string) {
  openSessions.value = isSessionOpen(id)
    ? openSessions.value.filter((item) => item !== id)
    : [...openSessions.value, id]
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
  openSessions.value = []
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
        <div class="studio-history__head">
          <div class="studio-history__summary">
            <p class="studio-history__time">{{ formatTime(session.startedAt) }}</p>
            <p class="studio-history__device">{{ deviceTitle(session.device) }}</p>
            <p v-if="deviceMeta(session.device)" class="studio-history__device-meta">{{ deviceMeta(session.device) }}</p>
            <p class="studio-history__status">
              {{ sessionStatus(session) }} · {{ stepsCount(session.choices.length) }}
            </p>
          </div>
          <button
            type="button"
            class="studio-history__arrow"
            :class="{ 'studio-history__arrow--open': isSessionOpen(session.sessionId) }"
            :aria-expanded="isSessionOpen(session.sessionId)"
            aria-label="Шаги"
            @click="toggleSession(session.sessionId)"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.2 6.1 8 10.6l4.8-4.5" />
            </svg>
          </button>
        </div>
        <ol v-if="isSessionOpen(session.sessionId)" class="studio-history__choices">
          <li v-if="!session.choices.length">Кнопок не нажимала</li>
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
  appearance: none;
  min-height: 42px;
  padding: 8px 40px 8px 12px;
  border: 1px solid #ffd0e1;
  border-radius: 12px;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M3.2 6.1 8 10.6l4.8-4.5' stroke='%23ff4d94' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px 16px;
  color: #6a4a55;
  cursor: pointer;
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

.studio-history__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.studio-history__summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.studio-history__arrow {
  display: grid;
  place-items: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: #ffe3ed;
  cursor: pointer;
}

.studio-history__arrow svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: #ff4d94;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.studio-history__arrow--open svg {
  transform: rotate(180deg);
}

.studio-history__time {
  font-weight: 700;
}

.studio-history__device {
  font-weight: 700;
}

.studio-history__device-meta,
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
