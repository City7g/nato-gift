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
    class="secondary-button"
    :type="type"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 56px;
  padding: 12px 28px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(180deg, #f6e9fb 0%, #ead6f4 100%);
  box-shadow:
    0 8px 18px rgba(196, 150, 210, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  color: #d07aa8;
  font-family: 'Caveat', cursive;
  font-size: 32px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.secondary-button:hover {
  transform: translateY(-1px);
  background: linear-gradient(180deg, #f8eefc 0%, #f0def7 100%);
  box-shadow:
    0 12px 22px rgba(196, 150, 210, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.secondary-button:active {
  transform: translateY(1px);
}

.secondary-button:focus-visible {
  outline: 2px solid #d07aa8;
  outline-offset: 3px;
}

.secondary-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
}
</style>
