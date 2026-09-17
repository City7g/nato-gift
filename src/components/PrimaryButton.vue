<script setup lang="ts">
const { type = 'button', disabled = false } = defineProps<{
  type?: 'button' | 'submit'
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="primary-button"
    :type="type"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 56px;
  padding: 12px 28px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(180deg, #ff7eb6 0%, #ff4d94 72%, #f43f86 100%);
  box-shadow:
    0 10px 24px rgba(255, 77, 148, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.45);
  color: #fff;
  font-family: 'Caveat', cursive;
  font-size: 32px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;
}

.primary-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.04);
  box-shadow:
    0 14px 28px rgba(255, 77, 148, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.primary-button:active {
  transform: translateY(1px);
  filter: brightness(0.97);
}

.primary-button:focus-visible {
  outline: 2px solid #ff4d94;
  outline-offset: 3px;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
  filter: none;
}
</style>
