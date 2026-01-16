<script setup lang="ts">
/**
 * BadgePositioner Component
 *
 * Allows users to select badge placement position (left, center, right)
 * using PrimeVue SelectButton.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BadgePosition = 'left' | 'center' | 'right'

interface PositionOption {
  label: string
  value: BadgePosition
  icon: string
}

// ---------------------------------------------------------------------------
// Props & Emits
// ---------------------------------------------------------------------------

interface Props {
  modelValue?: BadgePosition
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'center',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [position: BadgePosition]
}>()

// ---------------------------------------------------------------------------
// Position Options
// ---------------------------------------------------------------------------

const positions: PositionOption[] = [
  { label: 'Left', value: 'left', icon: 'pi pi-align-left' },
  { label: 'Center', value: 'center', icon: 'pi pi-align-center' },
  { label: 'Right', value: 'right', icon: 'pi pi-align-right' }
]

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const selectedPosition = ref<BadgePosition>(props.modelValue)

// Sync with parent v-model
watch(
  () => props.modelValue,
  (newVal) => {
    selectedPosition.value = newVal
  }
)

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------

function onPositionChange(event: { value: BadgePosition }) {
  selectedPosition.value = event.value
  emit('update:modelValue', event.value)
}
</script>

<template>
  <div class="badge-positioner" :class="{ disabled: disabled }">
    <SelectButton
      v-model="selectedPosition"
      :options="positions"
      option-label="label"
      option-value="value"
      :disabled="disabled"
      aria-label="Badge position"
      class="position-buttons"
      @change="onPositionChange"
    >
      <template #option="{ option }">
        <div class="position-option">
          <i :class="option.icon" aria-hidden="true" />
          <span class="position-label-text">{{ option.label }}</span>
        </div>
      </template>
    </SelectButton>
  </div>
</template>

<style scoped>
.badge-positioner {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  padding: 1rem;
}

.position-buttons {
  display: flex;
  gap: 0;
  width: 100%;
  max-width: 300px;
}

.position-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  min-width: 80px;
}

.position-option i {
  font-size: 1.25rem;
}

.position-label-text {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Disabled state */
.badge-positioner.disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* SelectButton customization */
.position-buttons :deep(.p-selectbutton) {
  width: 100%;
  display: flex;
}

.position-buttons :deep(.p-button) {
  flex: 1;
  min-height: 64px;
  background-color: var(--surface-0);
  border-color: var(--border-color);
  color: var(--text-color);
  transition: all 0.2s ease;
}

.position-buttons :deep(.p-button:hover) {
  background-color: var(--surface-50);
}

.position-buttons :deep(.p-button.p-highlight) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.position-buttons :deep(.p-button.p-highlight:hover) {
  background-color: var(--primary-color-hover);
  border-color: var(--primary-color-hover);
}

.position-buttons :deep(.p-button:focus-visible) {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 400px) {
  .position-option {
    min-width: 60px;
    padding: 0.625rem 0.5rem;
  }

  .position-label-text {
    display: none;
  }

  .position-option i {
    font-size: 1.5rem;
  }
}
</style>
