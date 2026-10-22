<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InviteStage from '../components/InviteStage.vue'
import StudioShell from '../components/StudioShell.vue'
import { createInvite, getInvite, updateInvite } from '../api/client'
import { cloneSteps, publicSteps } from '../lib/normalizeSteps'
import type { StepButton, StepConfig } from '../lib/steps'
import type { ThemeId } from '../templates/themes'
import { themes } from '../templates/themes'
import { scripts } from '../templates/scripts'

const route = useRoute()
const router = useRouter()
const title = ref('')
const theme = ref<ThemeId>('cats')
const scriptId = ref(scripts[0].id)
const steps = ref<StepConfig[]>([])
const error = ref('')
const savedSlug = ref('')
const pending = ref(false)
const previewKey = ref(0)
const openSteps = ref<string[]>([])

const isNew = computed(() => route.params.id === 'new')
const previewSteps = computed(() => publicSteps(steps.value))
const savedLink = computed(() => (savedSlug.value ? `${location.origin}/i/${savedSlug.value}` : ''))

function applyScript(id: string) {
  const script = scripts.find((item) => item.id === id) ?? scripts[0]
  scriptId.value = script.id
  steps.value = cloneSteps(script.steps)
  openSteps.value = []
  previewKey.value += 1
}

function isStepOpen(id: string) {
  return openSteps.value.includes(id)
}

function toggleStep(id: string) {
  openSteps.value = isStepOpen(id)
    ? openSteps.value.filter((item) => item !== id)
    : [...openSteps.value, id]
}

function onScriptChange(id: string) {
  if (id === scriptId.value) return
  if (!window.confirm('Подставить шаблон? Текущие правки шагов заменятся.')) return
  applyScript(id)
}

function move(index: number, direction: -1 | 1) {
  const next = index + direction
  if (next < 0 || next >= steps.value.length) return
  const copy = steps.value.slice()
  const [item] = copy.splice(index, 1)
  if (!item) return
  copy.splice(next, 0, item)
  steps.value = copy
  previewKey.value += 1
}

function buttonText(button: StepButton) {
  return Array.isArray(button.text) ? button.text.join('\n') : button.text
}

function setButtonText(step: StepConfig, index: number, value: string) {
  const button = step.buttons?.[index]
  if (!button) return
  if (button.decorate) {
    button.text = value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  } else {
    button.text = value
  }
}

function setDecorate(step: StepConfig, index: number, decorate: boolean) {
  const button = step.buttons?.[index]
  if (!button || !step.buttons) return
  if (decorate) {
    const text = Array.isArray(button.text) ? button.text : [button.text || 'Нет']
    step.buttons[index] = { text, route: button.route, decorate: true }
    return
  }
  const text = Array.isArray(button.text) ? (button.text[0] ?? '') : button.text
  step.buttons[index] = { text, route: button.route }
}

function addButton(step: StepConfig) {
  const next = steps.value.find((item) => item.step !== step.step)
  step.buttons = [...(step.buttons ?? []), { text: 'Дальше', route: next?.step }]
}

function removeButton(step: StepConfig, index: number) {
  step.buttons = step.buttons?.filter((_, buttonIndex) => buttonIndex !== index)
}

async function load() {
  error.value = ''
  if (isNew.value) {
    title.value = ''
    theme.value = 'cats'
    savedSlug.value = ''
    applyScript(scripts[0].id)
    return
  }

  try {
    const invite = await getInvite(String(route.params.id))
    title.value = invite.title
    theme.value = invite.theme
    steps.value = cloneSteps(invite.steps)
    openSteps.value = []
    savedSlug.value = invite.slug
    previewKey.value += 1
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Не удалось открыть приглашение'
  }
}

async function save() {
  error.value = ''
  if (!title.value.trim()) {
    error.value = 'Нужно название'
    return
  }
  if (!previewSteps.value.length) {
    error.value = 'Оставь хотя бы один шаг'
    return
  }

  pending.value = true
  try {
    const draft = { title: title.value.trim(), theme: theme.value, steps: steps.value }
    const saved = isNew.value
      ? await createInvite(draft)
      : await updateInvite(String(route.params.id), draft)
    savedSlug.value = saved.slug
    if (isNew.value) await router.replace(`/studio/${saved.id}`)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Не удалось сохранить'
  } finally {
    pending.value = false
  }
}

async function copyLink() {
  if (!savedLink.value) return
  await navigator.clipboard.writeText(savedLink.value)
}

watch(
  () => route.params.id,
  () => {
    void load()
  },
  { immediate: true },
)
</script>

<template>
  <StudioShell :title="isNew ? 'Новое приглашение' : 'Редактор'">
    <div class="studio-editor">
      <form class="studio-editor__form" @submit.prevent="save">
        <label class="studio-editor__field">
          <span>Название для себя</span>
          <input v-model="title" class="studio-editor__input" type="text" />
        </label>

        <fieldset class="studio-editor__choices">
          <legend>Тема</legend>
          <label v-for="item in themes" :key="item.id" class="studio-editor__choice">
            <input v-model="theme" class="studio-editor__radio" type="radio" name="theme" :value="item.id" />
            <span>
              <strong>{{ item.title }}</strong>
              <small>{{ item.description }}</small>
            </span>
          </label>
        </fieldset>

        <fieldset class="studio-editor__choices">
          <legend>Сценарий</legend>
          <label v-for="item in scripts" :key="item.id" class="studio-editor__choice">
            <input
              class="studio-editor__radio"
              type="radio"
              name="script"
              :value="item.id"
              :checked="scriptId === item.id"
              @change="onScriptChange(item.id)"
            />
            <span>
              <strong>{{ item.title }}</strong>
              <small>{{ item.description }}</small>
            </span>
          </label>
        </fieldset>

        <ol class="studio-editor__steps">
          <li v-for="(step, index) in steps" :key="step.step" class="studio-editor__step">
            <div class="studio-editor__step-bar">
              <button
                type="button"
                class="studio-editor__toggle"
                :aria-expanded="isStepOpen(step.step)"
                @click="toggleStep(step.step)"
              >
                <span class="studio-editor__toggle-title">Шаг {{ index + 1 }}</span>
                <span class="studio-editor__summary">{{ step.text }}</span>
              </button>
              <label class="studio-editor__enable">
                <input
                  class="studio-editor__check"
                  type="checkbox"
                  aria-label="Шаг включён"
                  :checked="step.enabled !== false"
                  @change="step.enabled = ($event.target as HTMLInputElement).checked; previewKey += 1"
                />
              </label>
              <div class="studio-editor__move">
                <button type="button" @click="move(index, -1)">Вверх</button>
                <button type="button" @click="move(index, 1)">Вниз</button>
              </div>
            </div>
            <div v-if="isStepOpen(step.step)" class="studio-editor__body">
            <label class="studio-editor__field">
              <span>Текст</span>
              <textarea v-model="step.text" class="studio-editor__input" rows="2" />
            </label>
            <label class="studio-editor__field">
              <span>Подзаголовок</span>
              <input v-model="step.subtitle" class="studio-editor__input" type="text" />
            </label>
            <div v-for="(button, buttonIndex) in step.buttons" :key="buttonIndex" class="studio-editor__button">
              <label class="studio-editor__field">
                <span>{{ button.decorate ? 'Фразы кнопки, каждая с новой строки' : 'Кнопка' }}</span>
                <textarea
                  class="studio-editor__input"
                  rows="2"
                  :value="buttonText(button)"
                  @change="setButtonText(step, buttonIndex, ($event.target as HTMLTextAreaElement).value)"
                />
              </label>
              <label class="studio-editor__field">
                <span>Куда ведёт</span>
                <select v-model="button.route" class="studio-editor__input">
                  <option v-for="target in steps" :key="target.step" :value="target.step">
                    {{ target.text }}
                  </option>
                </select>
              </label>
              <label class="studio-editor__enable">
                <input
                  class="studio-editor__check"
                  type="checkbox"
                  :checked="Boolean(button.decorate)"
                  @change="setDecorate(step, buttonIndex, ($event.target as HTMLInputElement).checked)"
                />
                Убегающая кнопка
              </label>
              <button type="button" class="studio-editor__text-button" @click="removeButton(step, buttonIndex)">
                Убрать кнопку
              </button>
            </div>
            <button type="button" class="studio-editor__text-button" @click="addButton(step)">Добавить кнопку</button>
            </div>
          </li>
        </ol>

        <p v-if="error" class="studio-editor__error">{{ error }}</p>
        <button class="studio-editor__save" type="submit" :disabled="pending">Сохранить</button>
        <p v-if="savedLink" class="studio-editor__link">
          <a :href="savedLink" target="_blank" rel="noreferrer">{{ savedLink }}</a>
          <button type="button" @click="copyLink">Копировать</button>
        </p>
      </form>

      <section class="studio-editor__preview">
        <h2>Предпросмотр</h2>
        <p v-if="!previewSteps.length">Включи хотя бы один шаг</p>
        <InviteStage v-else :key="previewKey" :theme="theme" :steps="previewSteps" />
      </section>
    </div>
  </StudioShell>
</template>

<style scoped lang="scss">
.studio-editor {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;
}

.studio-editor__form,
.studio-editor__step,
.studio-editor__button,
.studio-editor__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.studio-editor__form {
  gap: 18px;
}

.studio-editor__choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 0;
  padding: 0;
}

.studio-editor__choice {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  border: 1px solid transparent;
  padding: 12px;
  border-radius: 12px;
  background: #fff;
}

.studio-editor__choice small {
  display: block;
  opacity: 0.72;
}

.studio-editor__choice:has(.studio-editor__radio:checked) {
  border-color: #ffb3cc;
  background: #fff7f9;
}

.studio-editor__radio,
.studio-editor__check {
  appearance: none;
  width: 22px;
  height: 22px;
  margin: 2px 0 0;
  flex: 0 0 22px;
  border: 2px solid #ffb3cc;
  background: #fff;
  display: grid;
  place-content: center;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}

.studio-editor__radio {
  border-radius: 50%;
}

.studio-editor__check {
  border-radius: 7px;
}

.studio-editor__radio::before,
.studio-editor__check::before {
  content: '';
}

.studio-editor__radio::before {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff4d94;
  transform: scale(0);
  transition: transform 0.15s ease;
}

.studio-editor__radio:checked {
  border-color: #ff4d94;
  box-shadow: 0 0 0 4px rgba(255, 77, 148, 0.12);
}

.studio-editor__radio:checked::before {
  transform: scale(1);
}

.studio-editor__check:checked {
  border-color: #ff4d94;
  background: linear-gradient(180deg, #ff7eb6 0%, #ff4d94 100%);
  box-shadow: 0 4px 10px rgba(255, 77, 148, 0.28);
}

.studio-editor__check:checked::before {
  width: 6px;
  height: 10px;
  margin-top: -2px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.studio-editor__radio:focus-visible,
.studio-editor__check:focus-visible {
  outline: 2px solid #ff4d94;
  outline-offset: 3px;
}

.studio-editor__radio:hover,
.studio-editor__check:hover {
  border-color: #ff4d94;
}

.studio-editor__steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
}

.studio-editor__step {
  padding: 14px;
  border-radius: 16px;
  background: #fff;
}

.studio-editor__step-bar,
.studio-editor__move,
.studio-editor__link {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.studio-editor__step-bar {
  justify-content: space-between;
}

.studio-editor__toggle {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #6a4a55;
  text-align: left;
  cursor: pointer;
}

.studio-editor__toggle-title {
  font-weight: 700;
}

.studio-editor__summary {
  max-width: 100%;
  overflow: hidden;
  font-size: 15px;
  opacity: 0.72;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.studio-editor__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.studio-editor__input {
  width: 100%;
  min-height: 42px;
  padding: 8px 12px;
  border: 1px solid #ffd0e1;
  border-radius: 12px;
  background: #fff7f9;
  color: #6a4a55;
}

select.studio-editor__input {
  appearance: none;
  padding-right: 40px;
  cursor: pointer;
  background-color: #fff7f9;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M3.2 6.1 8 10.6l4.8-4.5' stroke='%23ff4d94' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px 16px;
}

.studio-editor__move button,
.studio-editor__text-button,
.studio-editor__link button {
  border: 0;
  background: #ffe3ed;
  color: #6a4a55;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
}

.studio-editor__save {
  min-height: 48px;
  border: 0;
  border-radius: 999px;
  background: #ff4d94;
  color: #fff;
  cursor: pointer;
}

.studio-editor__save:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.studio-editor__error {
  color: #d61f3c;
}

.studio-editor__preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 420px;
  padding: 12px;
  border-radius: 16px;
  background: #fff;
  overflow: auto;
}

.studio-editor__enable {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (min-width: 960px) {
  .studio-editor {
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
    align-items: start;
  }
}
</style>
