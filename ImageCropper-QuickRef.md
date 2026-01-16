# ImageCropper Component - Quick Reference Card

## AT A GLANCE

| Aspect | Spec |
|--------|------|
| **Component** | `/components/ImageCropper.vue` |
| **Library** | vue-advanced-cropper v2.8.9 |
| **Aspect Ratio** | 1:1 (square, locked) |
| **Canvas Size** | 512×512px (desktop), 100% − padding (mobile) |
| **Zoom Range** | 1x–3x (0–100% slider) |
| **Output Format** | Blob (PNG) + data URL |
| **Interaction** | Pan (drag), Zoom (scroll/pinch/slider) |

---

## CONTROL REFERENCE

### Desktop Interaction
| Action | Input | Result |
|--------|-------|--------|
| **Pan** | Drag on image | Move image within crop bounds |
| **Zoom In** | Scroll up / [+] button / slider right | Magnify image (max 3x) |
| **Zoom Out** | Scroll down / [−] button / slider left | Shrink image (min 1x) |
| **Confirm** | Click [Confirm & Continue] | Export 512×512 blob |
| **Cancel** | Click [Cancel] | Return to upload |

### Mobile Interaction
| Action | Input | Result |
|--------|-------|--------|
| **Pan** | Single finger drag | Move image |
| **Zoom In** | Pinch spread / [+] button / slider right | Magnify (max 3x) |
| **Zoom Out** | Pinch squeeze / [−] button / slider left | Shrink (min 1x) |
| **Confirm** | Tap [Confirm & Continue] | Export 512×512 blob |
| **Cancel** | Tap [Cancel] | Return to upload |

---

## LAYOUT GRID

### Desktop (512×512px Fixed)
```
Header (140px)
  └─ Title + Subtitle (center-aligned)
Gap (24px)
Canvas (512×512px)
  └─ Cropper component (1:1 aspect locked)
Gap (24px)
Zoom Controls (60px)
  └─ [−] Slider [+] | Label
Gap (32px)
Button Row (48px)
  └─ [Cancel] | [Confirm & Continue] (right-aligned)
```

### Mobile (Responsive)
```
Header (variable)
  └─ Title + Subtitle (center-aligned)
Gap (16px)
Canvas (100% − 48px padding)
  └─ Maintains 1:1 aspect ratio
Gap (16px)
Zoom Controls (60px)
  └─ [−] Slider [+] | Label (wrap if tight)
Gap (32px)
Button Stack (100px)
  └─ [Cancel] (full width)
  └─ [Confirm & Continue] (full width)
Padding (24px from bottom for safe area)
```

---

## CSS CLASSES & VARIABLES

### Key Classes
```
.image-cropper              Main container
.cropper-header             Title section
.cropper-canvas             Canvas wrapper (512×512 or responsive)
.zoom-controls              Zoom slider + buttons
.zoom-button                Individual zoom button
.zoom-slider                Range input
.zoom-label                 Zoom percentage text
.action-buttons             Confirm/Cancel row
```

### PrimeVue Variables Used
```css
--p-primary-color           Buttons, highlights
--p-surface-50, -100, -200  Backgrounds
--p-surface-500, -700       Text, borders
--p-border-radius-lg        Canvas corners
--p-shadow-md               Canvas elevation
--p-focus-ring-color        Keyboard focus
```

---

## EVENT FLOW

```
┌─ User Action
│
├─ onPointerDown / onWheel / onPinch
│     ↓
│  Update zoom/pan state
│     ↓
│  Debounce/throttle (16ms)
│     ↓
│  Apply transform to image
│     ↓
│  Render updated crop preview
│
└─ On Confirm Click
    ↓
 Extract canvas content
    ↓
 Call canvas.toBlob()
    ↓
 Emit 'crop-complete' (blob, dataUrl)
    ↓
 Parent component handles next step
```

---

## STATE MANAGEMENT

```ts
// Core reactive state
const zoomLevel = ref(100)              // 0–100 (maps to 1–3x)
const panOffset = ref({ x: 0, y: 0 })  // Pan position
const state = ref('idle')               // idle | loading | error
const imageUrl = ref('')                // From File prop

// Computed
const actualZoom = computed(
  () => 1 + (zoomLevel.value / 100) * 2 // Actual zoom factor
)
```

---

## KEYBOARD SUPPORT

| Key | Action |
|-----|--------|
| **Tab** | Navigate to next control |
| **Shift+Tab** | Navigate to previous control |
| **←** / **→** | Adjust zoom slider (±5% step) |
| **Enter** / **Space** | Activate focused button |
| **Escape** | Cancel (optional) |

---

## TOUCH TARGET SIZES (Mobile WCAG)

```
Minimum: 48×48px
  └─ Zoom buttons: [−] and [+]
  └─ Canvas: Full draggable area (≥ 300×300px)

Slider: 44px min height, full width

Buttons: 44px min height, full width
  └─ [Cancel]
  └─ [Confirm & Continue]
```

---

## RESPONSIVE BREAKPOINTS

| Width | Canvas | Layout |
|-------|--------|--------|
| `<640px` | 100% − 48px | Stack buttons, responsive square |
| `640–1024px` | min(80vw, 512px) | Side-by-side buttons |
| `>1024px` | 512px fixed | Right-aligned buttons |

---

## EMIT SIGNATURES

### 'crop-complete'
```ts
emit('crop-complete', blob: Blob, dataUrl: string)
```
- **blob:** PNG Blob (512×512px, optimized)
- **dataUrl:** Data URL for preview (`data:image/png;base64,...`)

### 'cancel'
```ts
emit('cancel')
```
- No payload; parent unmounts component

---

## COMPONENT PROPS

```ts
interface Props {
  imageFile: File                  // From ImageUploader
  canvasSize?: number              // Optional: default 512
  maxZoom?: number                 // Optional: default 3
  minZoom?: number                 // Optional: default 1
  aspectRatio?: number             // Locked at 1 (square)
}
```

---

## ERROR HANDLING

| Scenario | Handling |
|----------|----------|
| Image fails to load | Show error message, provide retry |
| Blob export fails | Toast error, allow retry |
| Canvas unavailable | Early return, log error |
| Out of memory (large image) | Fallback to lower quality |

---

## PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Pan latency | <16ms (60fps) |
| Zoom response | <200ms (smooth) |
| Pan smoothness | 60fps (60 updates/sec) |
| Initial load | <500ms |
| Crop export | <1s (blob generation) |

---

## ACCESSIBILITY CHECKLIST

- [ ] All buttons have `aria-label`
- [ ] Slider has `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`
- [ ] Canvas labeled (contextual `aria-label` on container)
- [ ] Keyboard navigation works (Tab, Arrow keys, Enter)
- [ ] Focus indicator visible (2px outline)
- [ ] Reduced motion respected (@media prefers-reduced-motion)
- [ ] High contrast mode tested (3px borders)
- [ ] Screen reader tested (VoiceOver, NVDA, JAWS)
- [ ] Touch targets ≥44×44px

---

## TESTING COMMANDS

```bash
# Unit tests
npm run test -- ImageCropper.vue

# E2E tests (simulate user interactions)
npx playwright test ImageCropper.spec.ts

# Accessibility audit
npx axe-core ImageCropper.vue

# Performance profiling
npm run dev  # Open DevTools, Lighthouse tab
```

---

## MIGRATION PATH

1. **ImageUploader** → File selected → `emit('file-selected', file)`
2. **Parent component** → Mount ImageCropper with file
3. **ImageCropper** → User crops image
4. **ImageCropper** → `emit('crop-complete', blob, dataUrl)`
5. **Parent component** → Store blob, show badge overlay/preview

---

## FILE STRUCTURE

```
components/
├─ ImageUploader.vue        (existing: file selection)
├─ ImageCropper.vue         (new: crop tool)
└─ BadgePreview.vue         (next: badge overlay)

ImageCropper-UX-Spec.md                    (comprehensive spec)
ImageCropper-Wireframe.md                  (visual layouts)
ImageCropper-Implementation-Guide.md       (code patterns)
ImageCropper-QuickRef.md                   (this file)
```

---

## QUICK START CODE SNIPPET

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ImageCropper from '@/components/ImageCropper.vue'

const selectedFile = ref<File | null>(null)
const showCropper = ref(false)

function handleFileSel (file: File) {
  selectedFile.value = file
  showCropper.value = true
}

function handleCropComplete(blob: Blob, dataUrl: string) {
  console.log('Cropped image:', blob)
  console.log('Preview:', dataUrl)
  // Upload blob or store for next step
  showCropper.value = false
}

function handleCropCancel() {
  showCropper.value = false
}
</script>

<template>
  <div v-if="!showCropper">
    <ImageUploader @file-selected="handleFileSel" />
  </div>

  <div v-else-if="selectedFile">
    <ImageCropper
      :image-file="selectedFile"
      @crop-complete="handleCropComplete"
      @cancel="handleCropCancel"
    />
  </div>
</template>
```

---

## DEBUGGING TIPS

```ts
// Log zoom changes
console.log(`Zoom: ${actualZoom.value.toFixed(1)}x`)

// Log pan movement
console.log(`Pan: (${panOffset.value.x}, ${panOffset.value.y})`)

// Verify canvas export
const canvas = cropperRef.value?.getCanvas()
console.log('Canvas size:', canvas.width, '×', canvas.height)

// Check blob generation
canvas.toBlob((blob) => {
  console.log('Blob size:', (blob.size / 1024).toFixed(1), 'KB')
})

// Inspect DOM
document.querySelector('.cropper-canvas')
```

---

## COMMON QUESTIONS

**Q: Why 512×512 output?**
A: Standard profile picture size, efficient for thumbnails and avatars.

**Q: Can I change aspect ratio?**
A: Not recommended. Current spec locks at 1:1 for square profiles. Modify `aspectRatio` prop if needed.

**Q: What formats are supported?**
A: Input: PNG, JPG (from ImageUploader). Output: PNG (optimized, via canvas.toBlob).

**Q: How to handle very large images?**
A: Cropper library scales down internally. For 100MB+ files, consider resizing in ImageUploader first.

**Q: Is it accessible?**
A: Yes. Full WCAG 2.1 AA compliance with ARIA labels, keyboard navigation, and high contrast support.

**Q: Mobile zoom feels slow?**
A: Check debounce timing (target <16ms). Profile with DevTools Performance tab.

---

## VERSION COMPATIBILITY

- **Vue:** 3.5.26+
- **vue-advanced-cropper:** 2.8.9+
- **PrimeVue:** 4.5.4+
- **Node:** 16+

---

## FURTHER READING

- Full UX Spec: `ImageCropper-UX-Spec.md`
- Visual Wireframes: `ImageCropper-Wireframe.md`
- Implementation Details: `ImageCropper-Implementation-Guide.md`
- vue-advanced-cropper docs: https://norserium.github.io/vue-advanced-cropper/
- WCAG 2.1 Accessibility: https://www.w3.org/WAI/WCAG21/quickref/
