# ImageCropper Component - Design Documentation

Welcome! This directory contains comprehensive UX/design specifications for the ImageCropper component in the Badge It app.

## Document Overview

### 1. **ImageCropper-UX-Spec.md** (14 KB) - START HERE
The comprehensive specification document covering:
- User flow (load → adjust → confirm)
- Visual layout and control placement
- Interaction patterns (pan, zoom)
- Mobile considerations
- Accessibility requirements
- Component API and state management

**Best for:** Understanding the complete requirements and passing to developers.

### 2. **ImageCropper-Wireframe.md** (14 KB) - VISUAL REFERENCE
ASCII wireframes and interaction flows showing:
- Desktop layout (512×512px fixed canvas)
- Mobile layout (100% responsive square)
- Interaction zones and hotspots
- Touch target sizing
- Animation timings and color palette
- Accessibility details

**Best for:** Visual designers, mobile developers, QA testing specifications.

### 3. **ImageCropper-Implementation-Guide.md** (12 KB) - DEVELOPER GUIDE
Code patterns and implementation details:
- Component structure and setup
- Zoom handling (slider, wheel, pinch)
- Pan gesture implementation
- Crop and export logic
- Responsive sizing patterns
- Event listener management
- Accessibility (ARIA, keyboard)
- Styling patterns
- Testing patterns
- Common pitfalls and fixes

**Best for:** Frontend developers implementing the component.

### 4. **ImageCropper-QuickRef.md** (10 KB) - QUICK LOOKUP
Quick reference card with:
- At-a-glance specs table
- Control reference (desktop/mobile)
- Layout grid
- CSS classes and variables
- Event flow
- State management
- Keyboard support
- Responsive breakpoints
- Emit signatures
- Debugging tips
- FAQ

**Best for:** Quick lookups during development, onboarding, troubleshooting.

---

## KEY SPECIFICATIONS

### Canvas Size
- **Desktop:** 512×512px (fixed)
- **Mobile:** 100% − padding (responsive square)
- **Min:** 300×300px (very small phones)

### Aspect Ratio
- **Locked:** 1:1 (square for profile pictures)
- **Non-resizable**

### Zoom Range
- **Min:** 1x (image fits entire canvas)
- **Max:** 3x (3x magnification)
- **Control:** Scroll wheel (desktop) + Pinch gesture (mobile) + Slider (all)

### Output
- **Format:** PNG Blob (512×512px)
- **Quality:** Optimized (1.0)
- **Includes:** Data URL for preview

### Interaction Patterns
| Desktop | Mobile |
|---------|--------|
| Drag to pan | Single-finger drag to pan |
| Scroll to zoom | Pinch to zoom |
| Slider for zoom | Slider for zoom |
| Click buttons | Tap buttons |

---

## COMPONENT INTEGRATION

### User Flow
```
ImageUploader (select file)
        ↓
ImageCropper (crop image)
        ↓
BadgePreview (apply badge)
        ↓
Export/Share
```

### Props
```ts
ImageCropper receives:
- imageFile: File (from ImageUploader)
- Optional: canvasSize, maxZoom, minZoom
```

### Emits
```ts
ImageCropper emits:
- 'crop-complete': (blob: Blob, dataUrl: string)
- 'cancel': ()
- 'error': (message: string)
```

---

## DESIGN TOKENS (PrimeVue Integration)

Uses existing Badge It theme variables:
- `--p-primary-color` - Buttons, highlights
- `--p-surface-50, -100, -200` - Backgrounds
- `--p-surface-500, -700` - Text, borders
- `--p-border-radius-lg` - Canvas corners
- `--p-shadow-md` - Canvas elevation
- `--p-focus-ring-color` - Keyboard focus

---

## ACCESSIBILITY HIGHLIGHTS

### WCAG 2.1 AA Compliance
- **Keyboard Navigation:** Tab, Shift+Tab, Arrow keys, Enter
- **ARIA Labels:** All buttons and slider
- **Focus Indicator:** 2px outline visible
- **Reduced Motion:** Respects `prefers-reduced-motion`
- **High Contrast:** Adapts to high-contrast mode
- **Touch Targets:** Min 44×44px on mobile (48×48px with padding)

### Screen Reader Support
- Semantic HTML
- Descriptive ARIA labels
- Value text updates
- State announcements

---

## MOBILE CONSIDERATIONS

### Viewport & Orientation
- Full-width canvas (100% − padding)
- Portrait-optimized, landscape-responsive
- Safe area padding for notch/home indicator
- No forced rotation lock

### Touch Interactions
- Single-finger pan (standard drag)
- Two-finger pinch for zoom (momentum included)
- Slider fallback for accessibility
- Debounced updates (60fps)

### Performance
- Touch action optimized (`touch-action: manipulation`)
- Debounce pan/zoom at 16ms
- No unneeded renders

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Core Component
- [ ] Create `/components/ImageCropper.vue`
- [ ] Integrate vue-advanced-cropper
- [ ] Implement zoom slider
- [ ] Implement zoom buttons (±)
- [ ] Lock 1:1 aspect ratio

### Phase 2: Interactions
- [ ] Pan handling (mouse drag)
- [ ] Zoom via scroll wheel
- [ ] Pinch gesture (mobile)
- [ ] Debouncing/throttling

### Phase 3: Export & Controls
- [ ] Confirm button (emit blob)
- [ ] Cancel button (emit cancel)
- [ ] Canvas export (512×512)
- [ ] Data URL generation

### Phase 4: Polish & Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Reduced motion support
- [ ] High contrast mode
- [ ] Focus indicator

### Phase 5: Testing
- [ ] Unit tests
- [ ] Mobile gesture tests
- [ ] Accessibility audit
- [ ] Performance profiling
- [ ] QA sign-off

---

## PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Pan latency | <16ms |
| Zoom response | <200ms |
| Pan smoothness | 60fps |
| Initial load | <500ms |
| Crop export | <1s |

---

## FILE LOCATIONS

```
/Users/hurisb/Projects/badge-it/
├─ components/
│  ├─ ImageUploader.vue      (existing)
│  ├─ ImageCropper.vue       (to create)
│  └─ BadgePreview.vue       (next component)
│
└─ (design docs - this directory)
   ├─ ImageCropper-UX-Spec.md
   ├─ ImageCropper-Wireframe.md
   ├─ ImageCropper-Implementation-Guide.md
   ├─ ImageCropper-QuickRef.md
   └─ IMAGECROPPER-README.md (this file)
```

---

## HOW TO USE THESE DOCUMENTS

### For Product Managers
1. Read **ImageCropper-UX-Spec.md** sections 1-6
2. Review **ImageCropper-Wireframe.md** for layouts
3. Share quick reference with team

### For Developers
1. Start with **ImageCropper-QuickRef.md** for overview
2. Read **ImageCropper-Implementation-Guide.md** for patterns
3. Reference **ImageCropper-UX-Spec.md** for full requirements
4. Use wireframes for visual confirmation

### For QA/Testing
1. Review **ImageCropper-Wireframe.md** interaction flows
2. Check **ImageCropper-UX-Spec.md** section 6 (mobile) and 7 (error handling)
3. Use **ImageCropper-QuickRef.md** testing commands
4. Reference accessibility checklist

### For Designers
1. Review **ImageCropper-Wireframe.md** layouts and spacing
2. Check **ImageCropper-UX-Spec.md** visual feedback section
3. Reference design tokens and color variables
4. Use as base for design tool mockups

---

## KEY DECISIONS & RATIONALE

### Why 512×512 Canvas?
- Standard profile picture size
- Efficient for thumbnails and web
- Clear for crop preview
- Fills most mobile screens nicely

### Why 1:1 Locked Aspect?
- Profile pictures are square
- Reduces complexity (no "stretch" decisions)
- Consistent output
- User's expected for avatar use case

### Why Scroll Wheel + Pinch + Slider?
- **Scroll wheel:** Most discoverable on desktop
- **Pinch:** Natural mobile gesture
- **Slider:** Accessible alternative (keyboard + visible feedback)
- Three parallel methods = universal usability

### Why PrimeVue Integration?
- Existing theme in Badge It
- Consistent styling
- Accessibility built-in
- Toast notifications for feedback

---

## NEXT STEPS

1. **Share** these docs with development team
2. **Review** with product/design stakeholders
3. **Create** `/components/ImageCropper.vue`
4. **Implement** using patterns from Implementation Guide
5. **Test** against mobile checklist and accessibility criteria
6. **QA** via device testing and accessibility audit
7. **Deploy** and gather user feedback

---

## QUESTIONS OR FEEDBACK?

Refer to the appropriate spec document:
- **What should it do?** → UX-Spec.md
- **How should it look?** → Wireframe.md
- **How do I build it?** → Implementation-Guide.md
- **Quick answers?** → QuickRef.md

---

**Last Updated:** January 14, 2026
**Status:** Ready for Implementation
**Version:** 1.0

---

## DOCUMENT SIZES

- **UX-Spec.md:** 14 KB (comprehensive requirements)
- **Wireframe.md:** 14 KB (visual layouts & flows)
- **Implementation-Guide.md:** 12 KB (code patterns & examples)
- **QuickRef.md:** 10 KB (quick lookup reference)
- **Total:** ~50 KB (optimized for readability)

All documents are standalone but cross-referenced. Start with the document that matches your role, then dive deeper as needed.
