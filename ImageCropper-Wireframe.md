# ImageCropper Component - Visual Wireframe & Interaction Guide

## DESKTOP LAYOUT (512x512px Fixed Canvas)

```
┌────────────────────────────────────────────────────────────────┐
│                        Badge It                                │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │              Adjust Your Profile Picture                │ │
│  │              Pan and zoom to crop 1:1 square            │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │                                                          │ │
│  │              512x512px CROP CANVAS                      │ │
│  │                                                          │ │
│  │           ┌────────────────────────┐                    │ │
│  │           │                        │                    │ │
│  │           │   Image Content        │                    │ │
│  │  (Dark)   │   (Visible Crop)       │    (Dark)         │ │
│  │           │                        │                    │ │
│  │           │                        │                    │ │
│  │           └────────────────────────┘                    │ │
│  │                    ↑                                    │ │
│  │            1:1 Aspect Ratio Locked                     │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  [−]  ▓▓▓▓▓▓░░░░  [+]              [Reset]              │ │
│  │        Zoom Slider (0–100%)                            │ │
│  │        Displayed: 1.5x                                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│                                                                │
│                   [Cancel]  [Confirm & Continue]             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## MOBILE LAYOUT (100% Width, Responsive Square)

```
┌──────────────────────────────┐
│     Status Bar               │
├──────────────────────────────┤
│   < Back                  ☰  │  (Header with safe area)
├──────────────────────────────┤
│                              │
│  Adjust Your Profile Picture │
│  Pan and zoom to crop 1:1    │
│                              │
├──────────────────────────────┤
│                              │
│                              │
│     100% WIDTH CANVAS        │
│     (Responsive Square)       │
│                              │
│   ┌──────────────────┐       │
│   │                  │       │
│   │  Cropped Area    │       │
│   │                  │       │
│   └──────────────────┘       │
│                              │
│   (Darkened Surround)        │
│                              │
│                              │
├──────────────────────────────┤
│                              │
│  [−] ▓▓░░ [+]    Zoom: 1.2x  │  (Zoom Controls)
│                              │
├──────────────────────────────┤
│                              │
│         [Cancel]             │
│    [Confirm & Continue]      │  (Full-width buttons)
│                              │
│  (1.5rem safe area padding)  │
└──────────────────────────────┘
```

---

## INTERACTION ZONES & HOTSPOTS

### Desktop Cropper

```
ZONE A: Canvas Area (512x512px)
├─ CENTER: Pan zone (drag to move image)
├─ CORNERS: Resize handles (optional, for aspect-locked adjustment)
├─ BORDER: Crop boundary visual (2px solid border)
└─ OVERLAY: Dimmed area outside crop region (60% opacity)

ZONE B: Zoom Controls (Below Canvas)
├─ LEFT BUTTON:  [−] Zoom Out
├─ CENTER:       Slider (0–100) with ticks
├─ RIGHT BUTTON: [+] Zoom In
├─ LABEL:        "Zoom: 1.5x"
└─ WHEEL:        Mouse wheel over canvas area

ZONE C: Action Buttons (Bottom)
├─ LEFT:  [Cancel] → Emit 'cancel' event
└─ RIGHT: [Confirm & Continue] → Emit 'crop-complete' event
```

### Mobile Cropper

```
ZONE A: Canvas Area (90vw × 90vw)
├─ FULL AREA: Pan (single finger drag) + Pinch zoom (two fingers)
├─ BORDER: Crop boundary with circular indicators at corners
└─ OVERLAY: Darkened surround (60% opacity)

ZONE B: Zoom Controls (Below Canvas)
├─ LEFT BUTTON:  [−] Zoom Out
├─ CENTER:       Slider with mobile-optimized touch targets (min 44px)
├─ RIGHT BUTTON: [+] Zoom In
└─ LABEL:        "Zoom: 1.2x" (visible, not hidden)

ZONE C: Action Buttons (Sticky Footer)
├─ FULL WIDTH: [Cancel] (secondary style)
├─ FULL WIDTH: [Confirm & Continue] (primary style)
└─ SAFE AREA: 1.5rem padding above (respects home indicator / notch)
```

---

## INTERACTION FLOWS

### Pan (Image Repositioning)

**Desktop:**
```
Mouse Down (over image)
  ↓
Set cursor to 'grabbing'
  ↓
Track Mouse Move (continuous)
  ↓
Calculate offset: (currentX - startX, currentY - startY)
  ↓
Update image transform: translate(panX, panY)
  ↓
Mouse Up
  ↓
Set cursor back to 'grab'
  ↓
(Image stays at new position)
```

**Mobile:**
```
Touch Start (1 finger)
  ↓
Store initial touch position
  ↓
Touch Move (continuous)
  ↓
Calculate drag offset
  ↓
Update image position (throttled @ 60fps)
  ↓
Touch End
  ↓
(Image snaps to final position or animates if past boundary)
```

### Zoom (Scale Adjustment)

**Mouse Wheel:**
```
Wheel Event (over canvas)
  ↓
Determine direction: up (+) or down (−)
  ↓
Increment zoom: ±0.1 (10% step)
  ↓
Clamp to range: 1.0 → 3.0
  ↓
Update image scale: scale(currentZoom)
  ↓
Update slider position (visual sync)
```

**Pinch Gesture (Mobile):**
```
Touch Start (2 fingers)
  ↓
Measure initial distance between fingers
  ↓
Touch Move (continuous)
  ↓
Calculate new distance
  ↓
Derive zoom delta: newDistance / oldDistance
  ↓
Update zoom level (smooth, continuous)
  ↓
Update slider position (visual sync)
  ↓
Touch End
  ↓
(Zoom stays at final position)
```

**Slider / Buttons:**
```
User adjusts slider OR clicks [+]/[−]
  ↓
Input event triggered
  ↓
Map value: 0–100 → 1.0–3.0 zoom
  ↓
Update image scale smoothly (200ms transition)
  ↓
Update label: "Zoom: X.Xz"
```

### Confirm & Proceed

```
User clicks [Confirm & Continue]
  ↓
Show brief loading state (optional spinner)
  ↓
Extract crop region from canvas
  ↓
Generate blob (canvas.toBlob() or dataUrl)
  ↓
Emit 'crop-complete' event with blob + dataUrl
  ↓
Parent component handles next step (badge preview)
  ↓
(Modal closes or page navigates)
```

### Cancel & Return

```
User clicks [Cancel]
  ↓
Show confirmation (optional: "Discard changes?")
  ↓
Emit 'cancel' event
  ↓
Parent component unmounts cropper
  ↓
Return to ImageUploader step
```

---

## VISUAL STATE EXAMPLES

### Default State
- Canvas: 100% opacity, border visible
- Crop region: Light glow or gradient (subtle indication)
- Overlay: 60% dark opacity outside crop area
- Buttons: Enabled, default styling
- Zoom slider: At 100% (1x zoom)

### Hover State (Desktop)
- Canvas border: Accent color
- Pan cursor: `grab` icon
- Buttons: Slight shadow lift, color shift
- Zoom buttons: Light background highlight

### Dragging (Pan) State
- Canvas: Slight scale (1.01x)
- Cursor: `grabbing` icon
- Image: Smooth translate animation
- Feedback: Real-time crop preview update

### Pinch Zoom (Mobile) State
- Canvas: Responsive scaling
- Image: Smooth scale animation
- Overlay: Continuous update
- Zoom label: Live numeric display

### Focus State (Keyboard)
- Button: 2px focus ring (PrimeVue color)
- Slider: Visible focus outline
- Canvas: Optional focus indicator

---

## RESPONSIVE BREAKPOINTS

| Breakpoint | Canvas Size | Layout |
|------------|-------------|--------|
| **Mobile** (`<640px`) | 100% − 3rem | Stack buttons, full-width |
| **Tablet** (`640px–1024px`) | 80vw (max 512px) | Side-by-side buttons |
| **Desktop** (`>1024px`) | 512px fixed | Right-aligned buttons |

---

## TOUCH TARGET SIZING (Mobile WCAG Compliance)

```
[−]  Button:  48×48px (icon 24px centered)
Slider:       44px height, 100% width
[+]  Button:  48×48px (icon 24px centered)

[Cancel]:     48px min-height, full width
[Confirm]:    48px min-height, full width

Canvas:       Entire area is draggable (min 300×300px on mobile)
```

---

## ANIMATION TIMING

| Action | Duration | Easing |
|--------|----------|--------|
| **Pan** | Real-time | None (direct tracking) |
| **Zoom (slider)** | 200ms | ease-out |
| **Boundary snap** | 300ms | ease-in-out |
| **Button hover** | 150ms | ease-out |
| **Focus ring** | Instant | — |

---

## COLOR PALETTE (PrimeVue Variables)

```
Primary Color:     var(--p-primary-color)          [Buttons, accents]
Surface 50:        var(--p-surface-50)             [Light backgrounds]
Surface 100:       var(--p-surface-100)            [Borders, subtle]
Surface 500:       var(--p-surface-500)            [Secondary text]
Surface 700:       var(--p-surface-700)            [Primary text]

Overlay (dim):     rgba(0, 0, 0, 0.6)              [Outside crop area]
Focus Ring:        var(--p-focus-ring-color)       [2px outline]
Error (if needed): var(--p-red-500)                [Error messages]
```

---

## ACCESSIBILITY CONSIDERATIONS

### Keyboard Navigation
- **Tab:** Cycle through buttons, slider
- **Shift+Tab:** Reverse
- **Arrow Keys:** Adjust slider (←/→ = ±5% zoom)
- **Enter/Space:** Activate buttons
- **Escape:** Cancel (optional)

### Screen Reader (ARIA)
```html
<div aria-label="Image crop tool, square 1:1 aspect ratio">
  <!-- Canvas with role -->

  <input
    type="range"
    aria-label="Zoom level"
    aria-valuenow="150"
    aria-valuemin="100"
    aria-valuemax="300"
    aria-valuetext="1.5x magnification"
  >

  <button aria-label="Confirm and save crop">
    Confirm & Continue
  </button>
</div>
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0 !important;
    transition-duration: 0 !important;
  }
}
```

### High Contrast
- Border width: 3px (vs. 2px)
- Text color: Ensure 7:1 ratio
- Focus ring: Thicker and brighter

---

## ERROR STATES & EDGE CASES

### Image Load Error
```
┌──────────────────────────────┐
│  ⚠️  Unable to load image    │
│                              │
│  Please upload a different   │
│  file and try again.         │
│                              │
│          [← Go Back]         │
└──────────────────────────────┘
```

### Canvas Too Small
- Min canvas dimension: 300×300px (even on very small mobile)
- If exceeded, display alternative or scroll view

### Extreme Aspect Ratios
- Image 10:1? → Crops to 1:1 square subset (preserves details)
- Display helper: "Showing best 1:1 portion of image"

---

## TESTING CHECKLIST

- [ ] Pan works: Drag image smoothly without flickering
- [ ] Zoom works: All 3 methods (scroll, pinch, slider)
- [ ] Crop region: Always visible, 1:1 locked
- [ ] Mobile: Canvas is 100% width, responsive
- [ ] Touch targets: Min 44×44px on mobile
- [ ] Buttons: Confirm/cancel work and emit correct events
- [ ] Focus states: Keyboard navigation complete
- [ ] Performance: No jank on drag/zoom (60fps)
- [ ] Edge cases: Very large/small images handled
- [ ] Accessibility: Screen reader works, keyboard-only navigation
- [ ] Reduced motion: Animations disabled correctly
- [ ] Output: 512×512px blob with correct data

---

## NOTES FOR IMPLEMENTATION

1. **Vue-Advanced-Cropper:** Provides `Cropper` component and canvas manipulation
2. **Zoom Slider:** Use HTML5 `<input type="range">` styled with PrimeVue
3. **Pan Handling:** Intercept `pointerdown`, `pointermove`, `pointerup` events
4. **Pinch:** Use `wheel` event for scroll + `gesturechange` for pinch
5. **Output:** Call `canvas.toBlob()` on cropper's canvas element
6. **Performance:** Debounce pan/zoom updates at 16ms (60fps throttle)
7. **Accessibility:** Include `aria-labels`, keyboard event handlers, focus management
8. **Responsive:** Use CSS media queries + Vue computed properties for layout switching
