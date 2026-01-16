# ImageCropper Component - UX Specification

**Component Name:** ImageCropper.vue
**Library:** vue-advanced-cropper v2.8.9
**Use Case:** Profile picture cropping (1:1 square, 512x512px output)
**Design Pattern:** Follows ImageUploader.vue conventions (PrimeVue integration, state management)

---

## 1. USER FLOW

```
┌──────────────────┐
│  Image Selected  │ ← From ImageUploader
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  ImageCropper Modal/Page             │
│  • Load image into canvas            │
│  • Show aspect ratio lock (1:1)      │
│  • Initial crop box: centered, max   │
│  └──────────────────────────────────┘
         │
         ├─ Pan: Drag image to reposition
         ├─ Zoom: Scroll wheel / pinch (mobile) / slider
         │
         ▼
┌──────────────────────────────────────┐
│  Confirm / Cancel Selection          │
│  • Cancel: Return to uploader        │
│  • Confirm: Emit cropped image blob  │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│  Next Step       │ → Badge overlay / preview
└──────────────────┘
```

---

## 2. VISUAL LAYOUT

### Container Structure
- **Desktop:** Fixed 512x512px canvas (square crop area, centered on screen)
- **Mobile:** 100% viewport width, maintain 1:1 aspect ratio (responsive square)
- **Padding:** Match form spacing from ImageUploader (2rem desktop, 1.5rem mobile)

### Component Layout (Top to Bottom)

```
┌─────────────────────────────────────────────────────────┐
│  Header                                                 │
│  "Adjust Your Profile Picture"                          │
│  Subtitle: "Pan and zoom to crop 1:1 square"            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                                                         │
│            512x512px Crop Canvas                        │
│            (Desktop: fixed, Mobile: 100% width)         │
│                                                         │
│            ┌────────────────────────┐                   │
│            │                        │                   │
│            │   Image Preview        │                   │
│            │   (cropped area)       │                   │
│            │                        │                   │
│            └────────────────────────┘                   │
│                                                         │
│            Darkened area outside crop region            │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Controls Row                                           │
│                                                         │
│  [−] Zoom Slider [+]     |    Reset Button    |         │
│                          |  (optional)        |         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Action Buttons (Bottom)                                │
│                                                         │
│       [Cancel]                    [Confirm & Continue]  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Spacing & Measurements
- **Header to Canvas:** 1.5rem gap
- **Canvas to Controls:** 1.5rem gap
- **Controls to Buttons:** 2rem gap
- **Button padding:** 0.75rem 1.5rem (min height 44px mobile)
- **Canvas border:** 2px solid, subtle shadow for depth

---

## 3. TOUCH/MOUSE INTERACTION PATTERNS

### Pan (Reposition Image)
- **Desktop:** Click + drag on image
- **Mobile:** Single finger drag on image
- **Behavior:** Image moves inversely (intuitive pan)
- **Constraints:** Image stays within crop bounds (can overshoot slightly for natural feel)
- **Cursor:** `grab` on hover, `grabbing` while dragging

### Zoom
Three parallel mechanisms for consistency:

#### A. Scroll Wheel (Desktop)
- **Trigger:** Mouse wheel over canvas
- **Direction:** Up = zoom in, Down = zoom out
- **Speed:** Incremental (10-15% per scroll step)
- **Min Zoom:** 1x (image fits crop area)
- **Max Zoom:** 3x (3x magnification for detail)

#### B. Pinch Gesture (Mobile/Tablet)
- **Trigger:** Two-finger pinch on canvas
- **Direction:** Spread = zoom in, Pinch = zoom out
- **Speed:** Continuous (follow finger distance)
- **Same limits:** 1x–3x zoom range

#### C. Zoom Slider (All Devices)
- **Location:** Below canvas, centered
- **Range:** 0–100 (maps to 1x–3x zoom)
- **Visual:** Standard range input styled with PrimeVue theme
- **Labels:** "−" (left) and "+" (right) buttons flanking slider
- **Accessibility:** Keyboard step (arrow keys: ±5% increment)

### Canvas Edge Behavior
- **Crop region:** Always visible overlay with circular corner indicator
- **Outside region:** Darkened/dimmed (overlay opacity 60%)
- **Resize handles:** Optional corner/edge handles for direct crop adjustment (simplify if needed)

---

## 4. ZOOM CONTROL STRATEGY (Recommended)

**Primary: Scroll wheel (desktop) + Pinch (mobile)**
- Most natural and discoverable
- Works on both platforms

**Secondary: Slider with ± buttons**
- Visible, accessible for users unfamiliar with gestures
- Mobile-friendly alternative
- Button style: Light icons with hover state

**Implementation:**
```vue
<div class="zoom-controls">
  <button @click="zoomOut" aria-label="Zoom out">
    <i class="pi pi-minus"></i>
  </button>
  <input
    v-model="zoomLevel"
    type="range"
    min="0"
    max="100"
    @input="handleZoomSlider"
  >
  <button @click="zoomIn" aria-label="Zoom in">
    <i class="pi pi-plus"></i>
  </button>
</div>
```

---

## 5. CONFIRM/CANCEL BUTTON PLACEMENT

### Button Bar (Bottom Fixed)
- **Position:** Bottom of modal/page, full-width sticky footer (mobile), or right-aligned (desktop)
- **Layout:**
  - **Desktop:** Right-aligned within padding container
  - **Mobile:** Full-width stack (Cancel above Confirm) OR side-by-side with flex

### Button Specs
| Button | Action | Style | Icon |
|--------|--------|-------|------|
| **Cancel** | Discard crop, return to uploader | Secondary / Outlined | Close (pi-times) |
| **Confirm** | Save crop, emit blob, proceed | Primary / Filled | Check (pi-check) |

**Mobile Button Sizing:** Full width (100% container width) with min-height 44px for touch targets.

**States:**
- Default: Ready to interact
- Hover: Subtle color shift + shadow lift
- Active (press): Scale 0.98 for tactile feedback
- Disabled: Grayed out (only if validation needed)

---

## 6. MOBILE-SPECIFIC CONSIDERATIONS

### Viewport & Canvas
- **Canvas width:** 100% (minus padding: `width: calc(100% - 3rem)`)
- **Canvas height:** Match width (1:1 square, maintains aspect)
- **Max canvas size:** 90vw × 90vw (respects header/footer)
- **Avoid:** Full-screen modal on small screens (top bar visible for context)

### Touch Interactions
- **Pan:** Single finger drag (standard)
- **Zoom:** Pinch gesture + slider fallback
- **Tap:** Don't use tap to start/stop (use drag threshold)
- **Double-tap:** Optional—zoom to fit / reset view (if space allows)

### Typography & Labels
- **Header:** 1.25rem (responsive down from 1.5rem desktop)
- **Helper text:** 0.875rem, color: secondary (gray)
- **Button text:** 1rem, uppercase for clarity

### Safe Areas
- **Padding:** 1.5rem (top/bottom) for notch/home indicator
- **Button area:** 1.5rem padding above bottom (sticky footer behavior)
- **Canvas margin:** 1rem top/bottom buffer

### Orientation
- **Portrait:** Optimized (canvas at 100% width)
- **Landscape:** Allow (canvas shrinks, controls scroll if needed)
- **No rotation lock:** Responsive to device rotation

### Performance
- **Debounce pan/zoom:** 16ms (60fps) throttle on image transform updates
- **Lazy render:** Don't redraw outside visible crop area
- **Prevent pinch-zoom:** Add `touch-action: manipulation` to prevent browser zoom

---

## 7. VISUAL FEEDBACK & ANIMATIONS

### Hover States
- **Canvas border:** Subtle color pulse when hovering (optional)
- **Buttons:** Slight scale/lift on hover
- **Cursor changes:** `grab` → `grabbing` during pan

### Zoom Feedback
- **Slider value display:** Show "2.1x" label next to slider
- **Smooth zoom:** CSS transitions (200ms) between discrete zoom levels
- **Momentum:** Mobile pinch naturally decelerates (browser default)

### Confirmation Feedback
- **Confirm click:** Brief loading spinner, then emit `cropped-image` event
- **Toast notification:** (Optional) "Image cropped successfully!"

### Accessibility (WCAG 2.1 AA)
- **Keyboard nav:** Tab through buttons, Shift+Tab reverse
- **Slider:** Arrow keys (left/right) adjust zoom in 5% steps
- **ARIA labels:** `aria-label` on buttons, `aria-valuenow` on slider
- **Reduced motion:** Disable zoom animation if `prefers-reduced-motion: reduce`
- **High contrast:** Border/text adapt to system settings

---

## 8. ERROR HANDLING & EDGE CASES

### Image Load Issues
- **Missing image:** Display placeholder with error message
- **Timeout:** Fallback to low-resolution version after 5s
- **Invalid format:** (Handled by ImageUploader, but validate here too)

### Canvas Edge Cases
- **Very small images:** Min zoom at 1x may not fill canvas; show blank area
- **Very large images:** Max zoom at 3x is sufficient for detail work
- **Extreme aspect ratios:** Stretch to fill (1:1 crop ensures quality subset)

### User Actions
- **Rapid zoom clicks:** Debounce/queue updates
- **Pan beyond bounds:** Clamp image position (smooth spring-back animation)
- **Cancel mid-gesture:** Discard ongoing pinch/drag without state corruption

---

## 9. COMPONENT API & EMITS

### Props (Input)
```ts
interface ImageCropperProps {
  imageFile: File                    // From ImageUploader
  canvasSize?: number                // Default 512 (px)
  aspectRatio?: number               // Default 1 (locked)
  maxZoom?: number                   // Default 3
  minZoom?: number                   // Default 1
}
```

### Emits (Output)
```ts
defineEmits<{
  'crop-complete': [blob: Blob, dataUrl: string]
  'cancel': []
  'error': [message: string]
}>()
```

### Exposed Methods (if needed)
```ts
defineExpose({
  reset: () => void                  // Reset to initial state
  getCroppedCanvas: () => HTMLCanvasElement
})
```

---

## 10. DESIGN TOKENS (PrimeVue Integration)

Use existing PrimeVue CSS variables (from ImageUploader):

```css
/* Colors */
--p-primary-color              /* Buttons, highlights */
--p-surface-50, -100, -200     /* Backgrounds */
--p-surface-500, -600, -700    /* Text, borders */

/* Typography */
--p-font-family, -font-size-base

/* Spacing */
--p-border-radius-lg           /* Canvas border-radius */
--p-shadow-sm, -md             /* Canvas shadow */

/* Interactive */
--p-focus-ring-color           /* Keyboard focus outline */
--p-transition-duration        /* Hover/transition timing */
```

---

## 11. STATE MANAGEMENT

```ts
const cropperState = reactive({
  zoom: 1,                           // Current zoom level (1–3)
  panX: 0, panY: 0,                  // Pan offset (px)
  isLoading: false,                  // Image loading
  error: null as string | null,      // Error message
  isDragging: false,                 // Pan gesture active
})
```

---

## IMPLEMENTATION CHECKLIST

- [ ] **Component file:** `/components/ImageCropper.vue`
- [ ] **vue-advanced-cropper integration:** Wrap `Cropper` component with custom canvas
- [ ] **Zoom controls:** Slider + wheel/pinch listeners
- [ ] **Pan handling:** Mouse/touch drag events with debounce
- [ ] **1:1 aspect ratio:** Lock via cropper `stencil-props`
- [ ] **512x512 responsive:** Media queries (desktop fixed, mobile 100%)
- [ ] **Confirm/Cancel buttons:** PrimeVue Button integration
- [ ] **Toast notifications:** useToast for feedback
- [ ] **Accessibility:** ARIA labels, keyboard navigation, focus management
- [ ] **Mobile testing:** Pinch zoom, portrait/landscape, safe areas
- [ ] **Performance:** Debounce updates, avoid unnecessary re-renders
- [ ] **Styling:** Match ImageUploader theme (PrimeVue CSS vars)

---

## NEXT STEPS FOR DESIGN HANDOFF

1. **Developer:** Review vue-advanced-cropper docs for API details
2. **Developer:** Implement zoom slider + pan listeners
3. **QA:** Test gesture interactions (pinch, drag) on mobile devices
4. **QA:** Verify 512x512 output quality and 1:1 aspect lock
5. **Product:** Confirm confirm/cancel flow integrates with upload pipeline
