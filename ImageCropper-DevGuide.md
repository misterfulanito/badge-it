# ImageCropper Component - Developer Quick Start

**This is a condensed guide for developers ready to implement. For detailed specs, see other docs.**

---

## SETUP (5 minutes)

### 1. Dependencies (Already Installed)
```json
{
  "vue": "^3.5.26",
  "vue-advanced-cropper": "^2.8.9",
  "primevue": "^4.5.4"
}
```

### 2. Create Component File
```bash
touch /Users/hurisb/Projects/badge-it/components/ImageCropper.vue
```

### 3. Basic Shell
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

interface Props {
  imageFile: File
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'crop-complete': [blob: Blob, dataUrl: string]
  'cancel': []
}>()

// State
const cropperRef = ref<InstanceType<typeof Cropper>>()
const zoomLevel = ref(100)
</script>

<template>
  <div class="image-cropper">
    <!-- Your template here -->
  </div>
</template>

<style scoped>
/* Your styles here */
</style>
```

---

## ESSENTIAL CODE (Copy-Paste Ready)

### Load Image File
```ts
const imageUrl = ref('')

onMounted(async () => {
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(props.imageFile)
})
```

### Zoom Control
```ts
function onZoomChange(value: number) {
  const actualZoom = 1 + (value / 100) * 2  // 0–100 → 1–3x
  if (cropperRef.value) {
    cropperRef.value.setZoom(actualZoom)
  }
  zoomLevel.value = value
}

function zoomIn() {
  zoomLevel.value = Math.min(100, zoomLevel.value + 10)
  onZoomChange(zoomLevel.value)
}

function zoomOut() {
  zoomLevel.value = Math.max(0, zoomLevel.value - 10)
  onZoomChange(zoomLevel.value)
}
```

### Mouse Wheel Zoom
```ts
function handleWheel(event: WheelEvent) {
  event.preventDefault()
  event.deltaY < 0 ? zoomIn() : zoomOut()
}

onMounted(() => {
  const canvas = cropperRef.value?.$el
  if (canvas) {
    canvas.addEventListener('wheel', handleWheel, { passive: false })
  }
})
```

### Export Cropped Image
```ts
function confirmCrop() {
  const canvas = cropperRef.value?.getCanvas()
  if (!canvas) return

  canvas.toBlob((blob) => {
    if (!blob) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      emit('crop-complete', blob, dataUrl)
    }
    reader.readAsDataURL(blob)
  }, 'image/png', 1)
}

function cancelCrop() {
  emit('cancel')
}
```

### Responsive Canvas Size
```ts
const canvasSize = computed(() => {
  if (window.innerWidth > 640) {
    return 512
  }
  return Math.min(window.innerWidth - 48, 512)
})
```

---

## TEMPLATE (Minimal Working Example)

```vue
<template>
  <div class="image-cropper">
    <!-- Header -->
    <div class="header">
      <h2>Adjust Your Profile Picture</h2>
      <p>Pan and zoom to crop 1:1 square</p>
    </div>

    <!-- Cropper Canvas -->
    <div class="canvas-wrapper">
      <Cropper
        ref="cropperRef"
        :image="imageUrl"
        :stencil-props="{ aspectRatio: 1 }"
        :canvas-height="canvasSize"
        :canvas-width="canvasSize"
      />
    </div>

    <!-- Zoom Controls -->
    <div class="zoom-controls">
      <button @click="zoomOut" aria-label="Zoom out">−</button>
      <input
        v-model.number="zoomLevel"
        type="range"
        min="0"
        max="100"
        step="5"
        aria-label="Zoom level"
        @input="onZoomChange"
      />
      <button @click="zoomIn" aria-label="Zoom in">+</button>
      <span class="zoom-label">{{ (zoomLevel / 100 * 2 + 1).toFixed(1) }}x</span>
    </div>

    <!-- Action Buttons -->
    <div class="button-row">
      <button
        @click="cancelCrop"
        class="btn-secondary"
      >
        Cancel
      </button>
      <button
        @click="confirmCrop"
        class="btn-primary"
      >
        Confirm & Continue
      </button>
    </div>
  </div>
</template>
```

---

## STYLING (Essential Only)

```css
<style scoped>
.image-cropper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  text-align: center;
}

.header h2 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: var(--p-surface-700);
}

.header p {
  margin: 0;
  color: var(--p-surface-500);
  font-size: 0.95rem;
}

.canvas-wrapper {
  width: 512px;
  height: 512px;
  margin: 0 auto;
  border: 2px solid var(--p-surface-200);
  border-radius: 12px;
  overflow: hidden;
  background: var(--p-surface-50);
}

.canvas-wrapper :deep(.vue-advanced-cropper__canvas) {
  width: 100%;
  height: 100%;
}

.zoom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.zoom-controls button {
  width: 40px;
  height: 40px;
  border: 1px solid var(--p-surface-200);
  background: var(--p-surface-50);
  border-radius: 50%;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s ease;
}

.zoom-controls button:hover {
  background: var(--p-primary-50);
  border-color: var(--p-primary-color);
  color: var(--p-primary-color);
}

.zoom-controls input {
  width: 200px;
  cursor: pointer;
}

.zoom-label {
  font-size: 0.875rem;
  color: var(--p-surface-600);
  min-width: 50px;
  text-align: right;
}

.button-row {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 44px;
}

.btn-primary {
  background: var(--p-primary-color);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background: var(--p-surface-100);
  color: var(--p-surface-700);
  border: 1px solid var(--p-surface-200);
}

.btn-secondary:hover {
  background: var(--p-surface-200);
}

/* Mobile */
@media (max-width: 640px) {
  .image-cropper {
    padding: 1.5rem;
  }

  .canvas-wrapper {
    width: calc(100vw - 3rem);
    height: calc(100vw - 3rem);
    max-width: 90vw;
    max-height: 90vw;
  }

  .button-row {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .zoom-controls {
    flex-wrap: wrap;
  }

  .zoom-controls input {
    width: 100%;
    order: 3;
    flex-basis: 100%;
  }
}
</style>
```

---

## INTEGRATION (Parent Component)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ImageUploader from '@/components/ImageUploader.vue'
import ImageCropper from '@/components/ImageCropper.vue'

const step = ref<'upload' | 'crop'>('upload')
const selectedFile = ref<File | null>(null)
const croppedBlob = ref<Blob | null>(null)

function handleFileSelect(file: File) {
  selectedFile.value = file
  step.value = 'crop'
}

function handleCropComplete(blob: Blob, dataUrl: string) {
  croppedBlob.value = blob
  // Next: send to server or show badge preview
  console.log('Cropped image ready:', blob)
  step.value = 'preview'  // Or next step
}

function handleCropCancel() {
  step.value = 'upload'
  selectedFile.value = null
}
</script>

<template>
  <div class="workflow">
    <ImageUploader
      v-if="step === 'upload'"
      @file-selected="handleFileSelect"
    />

    <ImageCropper
      v-else-if="step === 'crop' && selectedFile"
      :image-file="selectedFile"
      @crop-complete="handleCropComplete"
      @cancel="handleCropCancel"
    />

    <!-- Next: BadgePreview component -->
  </div>
</template>
```

---

## TESTING QUICK COMMANDS

```bash
# Unit test example
npm run test -- ImageCropper.vue --watch

# Type check
npx vue-tsc --noEmit

# Lint
npm run lint -- components/ImageCropper.vue

# Mobile test (use DevTools device emulation)
npm run dev
# Then inspect in mobile viewport (768px width test)
```

---

## COMMON ISSUES & FIXES

| Issue | Fix |
|-------|-----|
| Cropper canvas blank | Verify `imageUrl` is valid data URL. Check `readAsDataURL()` completes. |
| Zoom doesn't work | Ensure wheel listener has `{ passive: false }`. Check `setZoom()` range (1–3). |
| Pan locked | Vue-advanced-cropper should handle pan. If not, add custom pan handlers. |
| Aspect ratio breaks | Verify `stencil-props: { aspectRatio: 1 }` is set. Don't remove `resizable: false`. |
| Mobile buttons too small | Add `min-height: 44px` or `48px` to buttons. Test with device browser. |
| Blob export empty | Check `toBlob()` callback fires. Verify `canvas.width/height` = 512. |
| Focus ring missing | Add `outline: 2px solid var(--p-focus-ring-color)` on button focus. |

---

## ACCESSIBILITY QUICK CHECKLIST

```html
<!-- Buttons have labels -->
<button aria-label="Zoom out">−</button>
<button aria-label="Zoom in">+</button>

<!-- Slider has attributes -->
<input
  type="range"
  aria-label="Zoom level"
  aria-valuenow="150"
  aria-valuemin="100"
  aria-valuemax="300"
  aria-valuetext="1.5x magnification"
/>

<!-- Buttons are focusable -->
<button>Confirm</button>

<!-- Focus indicator visible -->
button:focus {
  outline: 2px solid var(--p-focus-ring-color);
  outline-offset: 2px;
}

<!-- Reduced motion respected -->
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
```

---

## NEXT STEPS AFTER BASIC IMPLEMENTATION

1. **Pan handling:** Add `pointerdown`, `pointermove`, `pointerup` events for custom panning
2. **Pinch zoom:** Use `gesture` events or Cropper's built-in pinch support
3. **Error handling:** Wrap blob export in try/catch, show toast on failure
4. **Loading state:** Add spinner while processing crop
5. **Accessibility:** Full ARIA labels, keyboard nav, focus management
6. **Performance:** Debounce pan/zoom (16ms throttle)
7. **Testing:** Unit tests for zoom/pan logic, E2E for full flow

---

## FILE CHECKLIST

```
✓ /components/ImageCropper.vue          (to create)
✓ Import in parent component             (update parent)
✓ Style with PrimeVue tokens             (use existing vars)
✓ Export blob via 'crop-complete' event  (emit payload)
✓ Test on mobile                         (DevTools device emulation)
```

---

## USEFUL REFERENCES

- **Vue-Advanced-Cropper Docs:** https://norserium.github.io/vue-advanced-cropper/
- **PrimeVue Theme:** https://primevue.org/theming/
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **Full Specs:** See other ImageCropper-*.md files in this directory

---

## TIME ESTIMATE

- **Basic component (core zoom/pan):** 2–3 hours
- **Responsive + mobile:** +1 hour
- **Accessibility:** +1 hour
- **Testing:** +1–2 hours
- **Polish & refinement:** +1 hour
- **Total:** ~6–8 hours for production-ready component

---

**Start here → Implement basic shell → Test on mobile → Add accessibility → Ship!**
