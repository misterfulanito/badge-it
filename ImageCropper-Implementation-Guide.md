# ImageCropper Component - Implementation Guide

**File Location:** `/components/ImageCropper.vue`
**Framework:** Vue 3 + TypeScript + PrimeVue
**Library:** vue-advanced-cropper v2.8.9

---

## COMPONENT STRUCTURE

```vue
<script setup lang="ts">
// Types
type CropperState = 'idle' | 'loading' | 'error'

// Props / Emits
defineProps<{ imageFile: File }>()
defineEmits<{
  'crop-complete': [blob: Blob, dataUrl: string]
  'cancel': []
}>()

// Refs
const cropperRef = ref<InstanceType<typeof Cropper>>()
const zoomLevel = ref(1)
const panOffset = ref({ x: 0, y: 0 })
const state = ref<CropperState>('idle')

// Methods
function pan(deltaX: number, deltaY: number) { }
function zoom(direction: 'in' | 'out') { }
function handleWheel(event: WheelEvent) { }
function handlePinch(event: any) { }
function confirmCrop() { }
function cancelCrop() { }

// Lifecycle
onMounted(() => { setupEventListeners() })
onBeforeUnmount(() => { removeEventListeners() })
</script>

<template>
  <!-- Layout structure from wireframe -->
</template>

<style scoped>
/* Canvas, controls, responsive styles */
</style>
```

---

## KEY CODE PATTERNS

### 1. CROPPER INITIALIZATION

```ts
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

// In template:
<Cropper
  ref="cropperRef"
  :image="imageUrl"
  :stencil-props="stencilProps"
  :default-position="defaultPosition"
  @change="onCropperChange"
/>

// Stencil config (1:1 aspect ratio):
const stencilProps = computed(() => ({
  aspectRatio: 1,
  handlers: ['nwse', 'ne', 'se', 'sw', 'nw', 'se', 'e', 'w', 'n', 's'],
  movable: true,
  resizable: true,
}))

// Default centered position:
const defaultPosition = computed(() => ({
  left: 0,
  top: 0,
  width: 100,
  height: 100,
}))
```

### 2. ZOOM HANDLING

```ts
// Zoom state (1–3 range, store as 0–100 for slider)
const zoomLevel = ref(100) // 0–100 maps to 1–3x

// Slider change handler:
function onZoomChange(value: number) {
  const actualZoom = 1 + (value / 100) * 2 // 1–3 range
  cropperRef.value?.setZoom(actualZoom)
  zoomLevel.value = value
}

// Zoom in/out button handlers:
function zoomIn() {
  zoomLevel.value = Math.min(100, zoomLevel.value + 10)
  onZoomChange(zoomLevel.value)
}

function zoomOut() {
  zoomLevel.value = Math.max(0, zoomLevel.value - 10)
  onZoomChange(zoomLevel.value)
}

// Mouse wheel zoom (desktop):
function handleWheel(event: WheelEvent) {
  event.preventDefault()
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

// Pinch zoom (mobile) - via Cropper's gesture events:
// vue-advanced-cropper handles pinch automatically,
// just listen to zoom changes and update slider
```

### 3. PAN HANDLING

```ts
let isPanning = false
let panStart = { x: 0, y: 0 }

function onMouseDown(event: MouseEvent) {
  isPanning = true
  panStart = { x: event.clientX, y: event.clientY }
  (event.target as HTMLElement).style.cursor = 'grabbing'
}

function onMouseMove(event: MouseEvent) {
  if (!isPanning) return

  const deltaX = event.clientX - panStart.x
  const deltaY = event.clientY - panStart.y

  panOffset.value.x += deltaX
  panOffset.value.y += deltaY
  panStart = { x: event.clientX, y: event.clientY }

  // Apply transform to image inside cropper
  // Use cropper's internal image transform or pan method
}

function onMouseUp() {
  isPanning = false
  (event?.target as HTMLElement).style.cursor = 'grab'
}

// Similar for touch events (pointerdown, pointermove, pointerup)
// Cropper library handles pan internally, but you can enhance with feedback
```

### 4. CROP & EXPORT

```ts
async function confirmCrop() {
  state.value = 'loading'

  try {
    const canvas = cropperRef.value?.getCanvas()
    if (!canvas) throw new Error('No canvas found')

    // Generate blob
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Failed to create blob')

      // Generate data URL (for preview)
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        emit('crop-complete', blob, dataUrl)
        state.value = 'idle'
      }
      reader.readAsDataURL(blob)
    }, 'image/png', 1) // PNG format, quality 1
  } catch (error) {
    state.value = 'error'
    toast.add({
      severity: 'error',
      summary: 'Crop Failed',
      detail: (error as Error).message,
    })
  }
}

function cancelCrop() {
  emit('cancel')
}
```

### 5. RESPONSIVE CANVAS SIZE

```ts
// Computed property for responsive canvas
const canvasSize = computed(() => {
  // Desktop: 512px fixed
  // Mobile: 90vw (with max limit)
  if (window.innerWidth > 640) {
    return 512
  }
  return Math.min(window.innerWidth - 48, 512) // -48 for padding
})

// Watch for resize
onMounted(() => {
  window.addEventListener('resize', () => {
    // Recompute and re-render
  })
})

// In template:
<div class="cropper-container" :style="{ width: `${canvasSize}px`, height: `${canvasSize}px` }">
  <Cropper ... />
</div>
```

### 6. EVENT LISTENER MANAGEMENT

```ts
function setupEventListeners() {
  const canvasEl = cropperRef.value?.$el
  if (!canvasEl) return

  // Pan
  canvasEl.addEventListener('pointerdown', onPointerDown)
  canvasEl.addEventListener('pointermove', onPointerMove)
  canvasEl.addEventListener('pointerup', onPointerUp)

  // Wheel zoom
  canvasEl.addEventListener('wheel', handleWheel, { passive: false })

  // Global mouse leave (in case pointer leaves window during drag)
  window.addEventListener('pointerup', onPointerUp)
}

function removeEventListeners() {
  const canvasEl = cropperRef.value?.$el
  if (!canvasEl) return

  canvasEl.removeEventListener('pointerdown', onPointerDown)
  canvasEl.removeEventListener('pointermove', onPointerMove)
  canvasEl.removeEventListener('pointerup', onPointerUp)
  canvasEl.removeEventListener('wheel', handleWheel)
  window.removeEventListener('pointerup', onPointerUp)
}
```

### 7. ACCESSIBILITY (ARIA + KEYBOARD)

```ts
// Slider keyboard handling (native <input> handles this)
// But you can enhance with custom key handlers:

function onSliderKeyDown(event: KeyboardEvent) {
  const step = 5 // 5% increments
  if (event.key === 'ArrowLeft') {
    zoomOut()
  } else if (event.key === 'ArrowRight') {
    zoomIn()
  }
}

// In template:
<input
  v-model.number="zoomLevel"
  type="range"
  min="0"
  max="100"
  step="5"
  aria-label="Image zoom level"
  :aria-valuenow="zoomLevel"
  aria-valuemin="0"
  aria-valuemax="100"
  :aria-valuetext="`${((zoomLevel / 100) * 2 + 1).toFixed(1)}x magnification`"
  @input="onZoomChange"
  @keydown="onSliderKeyDown"
/>
```

---

## STYLING PATTERN

```css
/* Base Container */
.image-cropper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  max-width: 800px;
}

/* Header */
.cropper-header {
  text-align: center;
}

.cropper-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--p-surface-700);
  margin: 0 0 0.5rem;
}

.cropper-subtitle {
  font-size: 0.95rem;
  color: var(--p-surface-500);
  margin: 0;
}

/* Canvas Container */
.cropper-canvas {
  position: relative;
  width: 512px;
  height: 512px;
  border: 2px solid var(--p-surface-200);
  border-radius: var(--p-border-radius-lg, 12px);
  box-shadow: var(--p-shadow-md);
  overflow: hidden;
  background: var(--p-surface-50);
}

/* Zoom Controls */
.zoom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.zoom-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--p-surface-200);
  background: var(--p-surface-50);
  cursor: pointer;
  transition: all 0.15s ease;
}

.zoom-button:hover {
  background: var(--p-primary-50);
  border-color: var(--p-primary-color);
  color: var(--p-primary-color);
}

.zoom-slider {
  flex: 1;
  max-width: 300px;
}

.zoom-label {
  font-size: 0.875rem;
  color: var(--p-surface-600);
  min-width: 60px;
  text-align: right;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 640px) {
  .image-cropper {
    padding: 1.5rem;
    gap: 1rem;
  }

  .cropper-canvas {
    width: calc(100vw - 3rem);
    height: calc(100vw - 3rem);
    max-width: 90vw;
    max-height: 90vw;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
    width: 100%;
  }

  .zoom-controls {
    flex-wrap: wrap;
  }

  .zoom-slider {
    max-width: 100%;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .cropper-canvas {
    border-width: 3px;
  }

  .zoom-button {
    border-width: 2px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
```

---

## TESTING PATTERNS

```ts
// Unit test (Vitest example)
describe('ImageCropper', () => {
  it('should emit crop-complete with blob on confirm', async () => {
    const { emitted } = mount(ImageCropper, {
      props: { imageFile: mockFile },
    })

    await wrapper.find('button[aria-label="Confirm and save crop"]').trigger('click')

    expect(emitted('crop-complete')).toBeTruthy()
    expect(emitted('crop-complete')[0][0]).toBeInstanceOf(Blob)
  })

  it('should support zoom slider input', async () => {
    const { vm } = mount(ImageCropper, {
      props: { imageFile: mockFile },
    })

    const slider = wrapper.find('input[type="range"]')
    await slider.setValue(50)

    expect(vm.zoomLevel).toBe(50)
    // Verify zoom applied to cropper
  })

  it('should handle pan events without jank', async () => {
    const { vm } = mount(ImageCropper)

    // Simulate drag
    await wrapper.find('.cropper-canvas').trigger('pointerdown', {
      clientX: 100,
      clientY: 100,
    })

    // Should not update state on every pixel (use debounce/throttle)
    expect(performanceNow() - startTime).toBeLessThan(16) // 60fps threshold
  })
})
```

---

## MIGRATION CHECKLIST

### From ImageUploader to ImageCropper
1. User selects image in ImageUploader
2. ImageUploader emits `file-selected` with File object
3. Parent catches this and mounts ImageCropper component
4. ImageCropper receives File as prop
5. User adjusts crop
6. ImageCropper emits `crop-complete` with Blob
7. Parent processes Blob (upload, preview, badge overlay)

---

## PERFORMANCE OPTIMIZATION

```ts
// 1. Debounce pan updates
function debouncePan(fn: Function, delay = 16) {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const debouncedPan = debouncePan(pan)

// 2. Lazy render (only update canvas when gesture ends)
let gesturePending = false

function onPanMove(e: PointerEvent) {
  calculatePan(e) // Store delta
  if (!gesturePending) {
    gesturePending = true
    requestAnimationFrame(() => {
      applyPan() // Apply transform once per frame
      gesturePending = false
    })
  }
}

// 3. Minimize reflows
// Batch DOM updates together
// Use CSS transforms instead of layout properties
```

---

## COMMON PITFALLS & FIXES

| Issue | Cause | Fix |
|-------|-------|-----|
| Pinch not working on mobile | No gesture event listeners | Use Cropper's built-in pinch or add `touch-action` CSS |
| Lag during pan | Updating on every pixel | Debounce/throttle to 16ms (60fps) |
| Aspect ratio breaks | Stencil not locked | Verify `aspectRatio: 1` in stencilProps |
| Canvas blank on export | `toBlob()` timing | Use callback, not promises |
| Focus not visible | Missing ARIA | Add `aria-label`, focus outlines, keyboard handlers |
| Mobile buttons too small | Touch targets < 44px | Min height/width 48px (including padding) |
| High latency on scroll wheel | No passive listener | Add `{ passive: false }` to wheel listener |

---

## NEXT STEPS

1. **Copy structure** from this guide into new `/components/ImageCropper.vue`
2. **Install/verify** vue-advanced-cropper in package.json (already present)
3. **Implement** zoom, pan, and export logic step-by-step
4. **Test** on mobile (pinch, drag, rotate device)
5. **Integrate** parent component to call ImageCropper after upload
6. **Polish** accessibility and animations
7. **Verify** 512×512 output and 1:1 aspect ratio
