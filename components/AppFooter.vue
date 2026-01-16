<script setup lang="ts">
// Simple footer component - no logic needed
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <span class="credit">Created with love by Huri <span class="heart">❤️</span> @2026</span>
      <span class="privacy-note">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Your images are processed locally and never leave your device
      </span>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-size: 0.8125rem;
  color: var(--text-color-secondary);
  background: var(--surface-ground);
  border-top: 1px solid var(--surface-border);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.credit {
  display: flex;
  align-items: center;
}

.heart {
  color: #ef4444;
  margin: 0 0.25rem;
}

.privacy-note {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--text-color-muted);
}

.privacy-note svg {
  color: var(--green-500, #22c55e);
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .footer-content {
    flex-direction: row;
    gap: 1.5rem;
  }

  .privacy-note::before {
    content: '•';
    margin-right: 0.5rem;
    color: var(--surface-300);
  }

  .privacy-note svg {
    margin-left: -0.25rem;
  }
}
</style>
