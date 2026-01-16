<script setup lang="ts">
// Initialize theme on app mount
const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <div class="app-wrapper">
    <!-- App Header with Theme Toggle -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🎖️</span>
          <span class="logo-text">Badge It</span>
        </div>
        <ThemeToggle />
      </div>
    </header>

    <!-- Toast Notifications -->
    <Toast position="top-right" />

    <!-- Main Content -->
    <NuxtPage />
  </div>
</template>

<style>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--bg-color-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

@media (max-width: 640px) {
  .app-header {
    padding: 0.5rem 1rem;
  }

  .logo-text {
    font-size: 1.125rem;
  }
}
</style>
