<script setup lang="ts">
/**
 * BadgeLibrary Component
 *
 * Displays a grid of badge thumbnails.
 * Supports single selection with toggle behavior.
 */

import type { Badge } from '~/composables/useBadges'

// Emits
const emit = defineEmits<{
  'badge-selected': [badge: Badge | null]
}>()

// Use the badges composable
const { badges, selectedBadge, selectBadge, isSelected } = useBadges()

// Handle badge click - select/deselect and emit event
function handleBadgeClick(badge: Badge): void {
  selectBadge(badge)
  emit('badge-selected', selectedBadge.value)
}

// Handle keyboard navigation
function handleKeyDown(event: KeyboardEvent, badge: Badge): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleBadgeClick(badge)
  }
}
</script>

<template>
  <div class="badge-library" role="region" aria-label="Badge Library">
    <!-- Badge grid -->
    <div class="badge-grid" role="listbox" aria-label="Available badges">
      <button
        v-for="badge in badges"
        :key="badge.id"
        type="button"
        class="badge-item"
        :class="{
          'badge-item--selected': isSelected(badge),
          'badge-item--no-badge': badge.isNoBadge
        }"
        role="option"
        :aria-selected="isSelected(badge)"
        :aria-label="`${badge.name}${isSelected(badge) ? ', selected' : ''}`"
        @click="handleBadgeClick(badge)"
        @keydown="handleKeyDown($event, badge)"
      >
        <!-- Badge thumbnail -->
        <div class="badge-thumbnail">
          <!-- No Badge icon (prohibition symbol) -->
          <div v-if="badge.isNoBadge" class="no-badge-icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <line
                x1="12"
                y1="12"
                x2="52"
                y2="52"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <!-- Badge image -->
          <img
            v-else
            :src="badge.src!"
            :alt="`${badge.name} badge preview`"
            class="badge-image"
            loading="lazy"
            width="48"
            height="48"
          />
        </div>

        <!-- Badge name -->
        <span class="badge-name">{{ badge.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.badge-library {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

/* Flexible badge grid - auto-fits to container width */
.badge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
}

/* Badge item button */
.badge-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background-color: var(--surface-0);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Hover state */
.badge-item:hover {
  border-color: var(--surface-300);
  background-color: var(--surface-50);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Focus state for accessibility */
.badge-item:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow:
    0 0 0 3px rgba(30, 64, 175, 0.2),
    var(--shadow-md);
}

.badge-item:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Selected state */
.badge-item--selected {
  border-color: var(--primary-color);
  background-color: var(--primary-50, rgba(30, 64, 175, 0.05));
  box-shadow:
    0 0 0 3px rgba(30, 64, 175, 0.2),
    inset 0 0 0 1px var(--primary-color);
}

.badge-item--selected:hover {
  border-color: var(--primary-600, #1e40af);
  background-color: rgba(30, 64, 175, 0.1);
}

/* Badge thumbnail container */
.badge-thumbnail {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius, 8px);
  overflow: hidden;
  background-color: var(--surface-100);
}

/* Badge image */
.badge-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.badge-item:hover .badge-image {
  transform: scale(1.05);
}

/* No badge icon styling */
.no-badge-icon {
  width: 36px;
  height: 36px;
  color: var(--text-color-muted);
  transition: color 0.2s ease;
}

.badge-item:hover .no-badge-icon {
  color: var(--text-color-secondary);
}

.badge-item--selected .no-badge-icon {
  color: var(--primary-color);
}

/* Badge name label */
.badge-name {
  font-size: 0.625rem;
  font-weight: 500;
  color: var(--text-color);
  text-align: center;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge-item--selected .badge-name {
  color: var(--primary-color);
  font-weight: 600;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .badge-item,
  .badge-image,
  .no-badge-icon {
    transition: none;
  }

  .badge-item:hover {
    transform: none;
  }

  .badge-item:hover .badge-image {
    transform: none;
  }
}
</style>
