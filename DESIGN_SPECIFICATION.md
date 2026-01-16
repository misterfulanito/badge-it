# Badge It - Design Specification Document

## Overview

This document provides comprehensive UI/UX design specifications for the Badge It application, built with Nuxt 3 and PrimeVue 4. It addresses all requested improvements while maintaining consistency with the existing design system.

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
2. [Theme Toggle](#2-theme-toggle)
3. [Horizontal Stepper Component](#3-horizontal-stepper-component)
4. [Footer Component](#4-footer-component)
5. [Step 1: Upload Image](#5-step-1-upload-image)
6. [Step 2: Crop & Zoom](#6-step-2-crop--zoom)
7. [Step 3: Badge Selection](#7-step-3-badge-selection)
8. [Step 4: Preview](#8-step-4-preview)
9. [General UI Improvements](#9-general-ui-improvements)
10. [Accessibility Considerations](#10-accessibility-considerations)
11. [Recommended PrimeVue Components](#11-recommended-primevue-components)

---

## 1. Design Tokens

### Color Palette

The application uses a Navy Blue primary color scheme with full light/dark theme support.

```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;
--primary-600: #1e40af;    /* Main Primary */
--primary-700: #1e3a8a;
--primary-800: #1e3a8a;
--primary-900: #172554;

/* Semantic Colors */
--success-color: #22c55e;
--error-color: #ef4444;
--warning-color: #f59e0b;
--info-color: #3b82f6;
```

### Typography

```css
/* Font Family */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Font Sizes */
--font-size-xs: 0.6875rem;   /* 11px - Badge labels, hints */
--font-size-sm: 0.75rem;     /* 12px - Secondary text, labels */
--font-size-base: 0.875rem;  /* 14px - Body text */
--font-size-md: 0.9375rem;   /* 15px - Primary text */
--font-size-lg: 1rem;        /* 16px - Section titles */
--font-size-xl: 1.125rem;    /* 18px - Step titles (mobile) */
--font-size-2xl: 1.25rem;    /* 20px - Step titles (desktop) */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line Height */
--line-height-tight: 1.3;
--line-height-normal: 1.6;
```

### Spacing

```css
/* Spacing Scale (based on 4px grid) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### Border Radius

```css
--border-radius-sm: 4px;
--border-radius: 8px;
--border-radius-lg: 12px;
--border-radius-xl: 16px;
--border-radius-full: 9999px;
```

### Shadows

```css
/* Light Theme */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

/* Dark Theme */
--shadow-sm-dark: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md-dark: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
--shadow-lg-dark: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
```

### Transitions

```css
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;
```

---

## 2. Theme Toggle

### Current Implementation
The theme toggle exists in `ThemeToggle.vue` and is already correctly implemented.

### Design Specifications

| Property | Value |
|----------|-------|
| Component Type | Icon Button |
| Size | 44px x 44px (touch-friendly) |
| Shape | Circular |
| Position | Header, right-aligned |

### Icon Mapping

| Theme State | Icon Displayed | Icon Class |
|-------------|----------------|------------|
| Dark Mode | Sun icon | `pi pi-sun` |
| Light Mode | Moon icon | `pi pi-moon` |

### Visual States

```css
/* Default State */
.theme-toggle {
  background-color: var(--surface-100);
  color: var(--text-color);
}

/* Hover State */
.theme-toggle:hover {
  background-color: var(--surface-200);
  transform: scale(1.05);
}

/* Active/Pressed State */
.theme-toggle:active {
  transform: scale(0.95);
}

/* Focus State */
.theme-toggle:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

### Interaction Pattern
- Single click toggles between light and dark mode
- Respects system preference when set to "system"
- Persists user preference in localStorage

---

## 3. Horizontal Stepper Component

### New Component: `AppStepper.vue`

A horizontal progress indicator showing the user's position in the 4-step workflow.

### Step Definitions

| Step | Number | Label | Route/Action |
|------|--------|-------|--------------|
| 1 | Upload | Upload | `currentStep === 'upload'` |
| 2 | Crop | Crop | `currentStep === 'crop'` |
| 3 | Badge | Badge | `currentStep === 'badge'` |
| 4 | Preview | Preview | `currentStep === 'preview'` |

### Visual States per Step

#### Current Step (Active)
```css
.step-current {
  /* Circle Indicator */
  background-color: var(--primary-color);
  color: white;

  /* Label */
  color: var(--primary-color);
  font-weight: 600;
}
```

#### Completed Steps (Previous)
```css
.step-completed {
  /* Circle shows checkmark icon */
  background-color: var(--primary-color);
  color: white;
  opacity: 0.7;

  /* Connector line */
  background-color: var(--primary-color);

  /* Label */
  color: var(--text-color-secondary);
}
```

#### Upcoming Steps (Future)
```css
.step-upcoming {
  /* Circle shows step number */
  background-color: transparent;
  border: 2px solid var(--border-color);
  color: var(--text-color-muted);

  /* Label */
  color: var(--text-color-muted);
}
```

### Layout Structure

```
[1]----[2]----[3]----[4]
Upload  Crop  Badge  Preview
```

### Dimensions

| Element | Desktop | Mobile |
|---------|---------|--------|
| Step Circle | 32px | 28px |
| Connector Line | 40px width, 2px height | 24px width, 2px height |
| Label Font Size | 0.75rem | 0.6875rem |
| Total Height | 64px | 56px |

### Props Interface

```typescript
interface StepperProps {
  currentStep: 'upload' | 'crop' | 'badge' | 'preview';
  onStepClick?: (step: string) => void;  // Only allows navigation to previous steps
}
```

### Interaction Pattern

- **Completed steps**: Clickable, navigates to that step
- **Current step**: Not clickable, highlighted
- **Future steps**: Not clickable, visually muted
- Cursor changes to `pointer` on clickable steps
- Hover effect on clickable steps (subtle background change)

### Recommended PrimeVue Component
- Custom implementation using `<Steps>` component from PrimeVue 4
- Or build custom with flexbox for more control

---

## 4. Footer Component

### New Component: `AppFooter.vue`

A minimal footer displayed at the bottom of the page.

### Content

```
Created with love by Huri ❤️ @2026
```

### Design Specifications

| Property | Value |
|----------|-------|
| Height | 48px |
| Background | `var(--bg-color-secondary)` |
| Border Top | `1px solid var(--border-color)` |
| Text Alignment | Center |
| Font Size | 0.8125rem (13px) |
| Font Color | `var(--text-color-secondary)` |
| Padding | 1rem |

### Visual Style

```css
.app-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: var(--bg-color-secondary);
  border-top: 1px solid var(--border-color);
  font-size: 0.8125rem;
  color: var(--text-color-secondary);
}

.app-footer .heart {
  color: #ef4444;  /* Red heart regardless of theme */
}
```

### Placement
- Fixed at the bottom of the page container
- Always visible (not sticky - scrolls with content)

---

## 5. Step 1: Upload Image

### Component: `ImageUploader.vue`

### Design Improvement: Add Image Icon

Add a visual image/photo icon inside the upload area to make the purpose clearer.

### Updated Layout Structure

```
┌─────────────────────────────────────┐
│                                     │
│            [Image Icon]             │
│           (pi-image, 64px)          │
│                                     │
│      [Cloud Upload Icon, 24px]      │
│                                     │
│   "Drag and drop or click to upload"│
│        PNG, JPG up to 5MB           │
│                                     │
└─────────────────────────────────────┘
```

### Icon Specifications

| State | Primary Icon | Secondary Icon |
|-------|--------------|----------------|
| Idle | `pi pi-image` (64px, muted) | `pi pi-cloud-upload` (24px) |
| Hover | `pi pi-image` (64px, primary) | `pi pi-cloud-upload` (24px, primary) |
| Dragging | `pi pi-download` (animated) | - |
| Success | `pi pi-check` (green) | - |
| Error | `pi pi-times` (red) | - |

### Visual Hierarchy

```css
.upload-area {
  min-height: 280px;  /* Increased for larger icon */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.image-icon {
  font-size: 4rem;  /* 64px */
  color: var(--text-color-muted);
  opacity: 0.6;
}

.upload-icon {
  font-size: 1.5rem;  /* 24px */
  color: var(--text-color-secondary);
}
```

### Text Content

| Text Element | Content | Style |
|--------------|---------|-------|
| Primary (Desktop) | "Drag and drop or click to upload" | 1rem, semibold |
| Primary (Mobile) | "Tap to upload" | 1rem, semibold |
| Secondary | "PNG, JPG up to 5MB" | 0.875rem, muted |

---

## 6. Step 2: Crop & Zoom

### Component: `ImageCropper.vue`

### Zoom Slider Specifications

#### Range and Increments

| Property | Value |
|----------|-------|
| Minimum | 50% |
| Maximum | 200% |
| Default | 100% |
| Step/Increment | 25% |
| Displayed Values | 50%, 75%, 100%, 125%, 150%, 175%, 200% |

#### Slider Layout

```
[-] ━━━━━━━━━●━━━━━━━━━ [+]
    50%    100%    200%
         Current: 100%
```

### Zoom Controls Structure

```css
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Minus Button */
.zoom-button-minus {
  icon: 'pi pi-minus';
  size: 40px;
  shape: circular;
}

/* Plus Button */
.zoom-button-plus {
  icon: 'pi pi-plus';
  size: 40px;
  shape: circular;
}

/* Slider */
.zoom-slider {
  flex: 1;
  min: 50;
  max: 200;
  step: 25;
}
```

### Button States

| Button | Disabled Condition | Visual |
|--------|-------------------|--------|
| Minus (-) | `zoom <= 50%` | Opacity 0.5, cursor not-allowed |
| Plus (+) | `zoom >= 200%` | Opacity 0.5, cursor not-allowed |

### Slider Tick Marks

Show tick marks at each 25% increment:
- 50%, 75%, 100%, 125%, 150%, 175%, 200%

### Cropper Library

**Recommended:** Continue using `vue-advanced-cropper` (already in package.json)

#### Configuration Updates

```typescript
// Cropper settings
const cropperConfig = {
  aspectRatio: 1,           // 1:1 ratio (keep existing)
  stencilComponent: 'rectangle',
  resizable: false,         // Disable resize handles
  movable: true,            // Allow dragging
}

// Zoom mapping
function mapSliderToZoom(sliderValue: number): number {
  // sliderValue: 50-200 (percentage)
  // Return zoom factor: 0.5-2.0
  return sliderValue / 100;
}
```

### Updated State Management

```typescript
const zoomLevel = ref(100);  // Default 100%

const MIN_ZOOM = 50;
const MAX_ZOOM = 200;
const ZOOM_STEP = 25;

function zoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value + ZOOM_STEP, MAX_ZOOM);
}

function zoomOut() {
  zoomLevel.value = Math.max(zoomLevel.value - ZOOM_STEP, MIN_ZOOM);
}
```

---

## 7. Step 3: Badge Selection

### Components to Update

- `BadgeLibrary.vue`
- `pages/index.vue` (Badge step section)

### Two-Column Layout (Keep Existing)

```
┌─────────────────┬─────────────────────────────┐
│                 │                             │
│   [Preview]     │   Badge Options             │
│   Cropped       │   ┌─────────────────────┐   │
│   Image with    │   │ Select Badge    ▼   │   │
│   Badge         │   │ [No Badge] [B1] [B2]│   │
│                 │   │ [B3]                │   │
│                 │   └─────────────────────┘   │
│                 │   ┌─────────────────────┐   │
│                 │   │ Badge Position  ▼   │   │
│                 │   │ [L] [C] [R]         │   │
│                 │   └─────────────────────┘   │
│                 │   ┌─────────────────────┐   │
│                 │   │ Badge Size      ▼   │   │
│                 │   │ [-] ━━━●━━━ [+]     │   │
│                 │   │   20%      50%      │   │
│                 │   └─────────────────────┘   │
│                 │                             │
└─────────────────┴─────────────────────────────┘
```

### Badge Selection Changes

#### Remove Custom Badge Upload
- Remove the "Upload Custom Badge" section from `BadgeLibrary.vue`
- Remove file input and related handlers

#### Add "No Badge" Option

```typescript
// Add as first option in badge list
const noBadgeOption = {
  id: 'no-badge',
  name: 'No Badge',
  category: 'Default',
  src: null,  // or empty placeholder
  isNoBadge: true
};
```

**Visual Design for "No Badge" Option:**

```css
.badge-item--no-badge {
  /* Circle with slash or empty state */
  background-color: var(--surface-100);
  border: 2px dashed var(--border-color);
}

.badge-item--no-badge .badge-thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-item--no-badge .badge-thumbnail::before {
  content: '';
  width: 40px;
  height: 40px;
  border: 2px solid var(--text-color-muted);
  border-radius: 50%;
  position: relative;
}

/* Diagonal line through circle */
.badge-item--no-badge .badge-thumbnail::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 32px;
  background-color: var(--text-color-muted);
  transform: rotate(45deg);
}
```

#### Reduced Badge Set (3 Dummy Badges)

Keep only 3 badges for simplicity:

```typescript
const defaultBadges: Badge[] = [
  {
    id: 'open-to-work',
    name: 'Open to Work',
    src: '/badges/open-to-work.svg'
  },
  {
    id: 'hiring',
    name: 'Hiring',
    src: '/badges/hiring.svg'
  },
  {
    id: 'verified',
    name: 'Verified',
    src: '/badges/verified.svg'
  }
];
```

### Accordion Section Improvements

#### Fix Collapse/Expand Icons

Replace current chevron icons with proper arrow rotation:

```css
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-chevron {
  transition: transform 0.2s ease;
}

/* Expanded state */
.section-header[aria-expanded="true"] .section-chevron {
  transform: rotate(180deg);
}

/* Collapsed state */
.section-header[aria-expanded="false"] .section-chevron {
  transform: rotate(0deg);
}
```

**Icon to use:** `pi pi-chevron-down`

### Badge Resize Feature (NEW)

#### New Component Section: Badge Size

```typescript
interface BadgeSizeConfig {
  min: 20;      // 20% of image size
  max: 50;      // 50% of image size
  default: 30;  // 30% default
  step: 5;      // 5% increments
}
```

#### UI Layout

```
┌─────────────────────────────────┐
│ Badge Size                  ▼   │
├─────────────────────────────────┤
│  [-]  ━━━━━━━●━━━━━━━  [+]      │
│       20%    30%    50%         │
│                                 │
│  ⓘ Badge is at minimum size    │  ← Tooltip when min reached
│  ⓘ Badge is at maximum size    │  ← Tooltip when max reached
└─────────────────────────────────┘
```

#### Size Slider Specifications

| Property | Value |
|----------|-------|
| Minimum | 20% |
| Maximum | 50% |
| Default | 30% |
| Step | 5% |

#### Tooltip Messages

| Condition | Message |
|-----------|---------|
| `size <= 20%` | "Badge is at minimum size (20%)" |
| `size >= 50%` | "Badge is at maximum size (50%)" |

#### Implementation Notes

```typescript
// In useImageProcessor.ts
const badgeSizeRatio = ref(0.3);  // Default 30%

function setBadgeSize(percentage: number) {
  badgeSizeRatio.value = Math.max(0.2, Math.min(0.5, percentage / 100));
}

// Update renderPreview to use dynamic size
function renderPreview(canvas, croppedImage, badgeImage, position, sizeRatio) {
  // ...
  const badgeSize = Math.round(canvasSize * sizeRatio);
  // ...
}
```

### PrimeVue Components for Accordion

Use **Accordion** component from PrimeVue:

```vue
<Accordion :activeIndex="activeIndex" @tab-change="onTabChange">
  <AccordionTab header="Select Badge">
    <!-- Badge grid -->
  </AccordionTab>
  <AccordionTab header="Badge Position">
    <!-- Position controls -->
  </AccordionTab>
  <AccordionTab header="Badge Size">
    <!-- Size slider -->
  </AccordionTab>
</Accordion>
```

Or use **Panel** component with collapse functionality.

---

## 8. Step 4: Preview

### Component: `pages/index.vue` (Preview section)

### Button Label Change

| Current | New |
|---------|-----|
| "Continue to Download" | "Preview" |

Update in Step 3's action buttons:

```vue
<Button
  label="Preview"
  severity="primary"
  icon="pi pi-eye"
  icon-pos="left"
  :disabled="!selectedBadge && !hasNoBadgeSelected"
  @click="proceedToPreview"
/>
```

### Icon Update

Change icon from `pi-arrow-right` to `pi-eye` to better represent the preview action.

---

## 9. General UI Improvements

### Remove Sticky Bottom Action Bar

#### Current Implementation
```css
.sticky-action-bar {
  position: sticky;
  bottom: 0;
  /* ... */
}
```

#### New Implementation
```css
.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 0;  /* Remove extra padding */
}
```

### Consistent Button Placement

All steps should have action buttons placed directly below the content:

```
┌─────────────────────────────────────┐
│                                     │
│           Step Content              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   [Secondary]          [Primary]    │
│                                     │
└─────────────────────────────────────┘
```

### Button Layout per Step

| Step | Left Button | Right Button |
|------|-------------|--------------|
| 1. Upload | - | - (auto-proceed on upload) |
| 2. Crop | "Upload Another Photo" | "Continue" |
| 3. Badge | "Start Over" | "Preview" |
| 4. Preview | "Back" | "Download Image" |

### Mobile Responsive Buttons

```css
@media (max-width: 640px) {
  .action-buttons {
    flex-direction: column-reverse;  /* Primary on top */
    gap: 0.75rem;
  }

  .action-buttons .p-button {
    width: 100%;
    min-height: 48px;  /* Touch-friendly */
  }
}
```

---

## 10. Accessibility Considerations

### Keyboard Navigation

| Component | Tab Order | Keyboard Actions |
|-----------|-----------|------------------|
| Theme Toggle | 1 | Enter/Space: Toggle theme |
| Stepper Steps | 2-5 | Enter: Navigate to step (if completed) |
| Upload Area | 6 | Enter/Space: Open file picker |
| Zoom Slider | 7 | Arrow keys: Adjust zoom |
| Badge Grid | 8-11 | Arrow keys: Navigate, Enter: Select |
| Position Buttons | 12-14 | Arrow keys: Navigate, Enter: Select |
| Action Buttons | 15-16 | Enter: Activate |

### ARIA Attributes

#### Stepper
```html
<nav role="navigation" aria-label="Progress">
  <ol role="list">
    <li role="listitem" aria-current="step">
      <span aria-label="Step 1: Upload, current step">1</span>
    </li>
    <li role="listitem" aria-label="Step 2: Crop, not started">
      <span>2</span>
    </li>
  </ol>
</nav>
```

#### Badge Selection
```html
<div role="listbox" aria-label="Available badges">
  <button
    role="option"
    aria-selected="true"
    aria-label="Open to Work badge, selected"
  >
  </button>
</div>
```

#### Slider Controls
```html
<div role="group" aria-label="Zoom controls">
  <button aria-label="Zoom out">-</button>
  <input
    type="range"
    aria-valuemin="50"
    aria-valuemax="200"
    aria-valuenow="100"
    aria-label="Zoom level, 100 percent"
  />
  <button aria-label="Zoom in">+</button>
</div>
```

### Focus Management

- Auto-focus on primary action when step changes
- Return focus to trigger element after modal closes
- Visible focus indicators on all interactive elements

### Color Contrast

Ensure all text meets WCAG 2.1 AA standards:

| Element | Light Mode | Dark Mode | Ratio |
|---------|------------|-----------|-------|
| Primary Text | `#1e293b` on `#f8fafc` | `#f1f5f9` on `#0f172a` | 12.6:1 |
| Secondary Text | `#64748b` on `#ffffff` | `#94a3b8` on `#1e293b` | 5.4:1 |
| Primary Button | `#ffffff` on `#1e40af` | `#ffffff` on `#3b82f6` | 7.8:1 |

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Announcements

- Announce step changes: "Now on step 2: Crop your image"
- Announce badge selection: "Open to Work badge selected"
- Announce zoom changes: "Zoom level: 125 percent"
- Announce errors: "Error: File too large. Maximum size is 5 megabytes"

---

## 11. Recommended PrimeVue Components

### For Each Improvement

| Feature | PrimeVue Component | Alternative |
|---------|-------------------|-------------|
| Theme Toggle | `Button` (existing) | Custom button |
| Stepper | `Steps` | Custom implementation |
| Upload Area | Custom | `FileUpload` (for advanced features) |
| Zoom Slider | `Slider` (existing) | Custom range input |
| Badge Grid | Custom | `DataView` for list mode |
| Accordion Sections | `Accordion` / `Panel` | Custom collapsible |
| Position Selector | `SelectButton` (existing) | `ToggleButton` group |
| Size Slider | `Slider` | Custom range input |
| Action Buttons | `Button` (existing) | - |
| Tooltips | `Tooltip` directive | Custom tooltip |
| Footer | Custom | - |

### PrimeVue 4 Component Props

#### Steps Component
```vue
<Steps
  :model="stepItems"
  :activeIndex="activeStep"
  :readonly="false"
  @step-select="onStepSelect"
/>
```

#### Accordion Component
```vue
<Accordion :multiple="true">
  <AccordionTab header="Select Badge">
    <!-- Content -->
  </AccordionTab>
</Accordion>
```

#### Slider Component
```vue
<Slider
  v-model="zoomLevel"
  :min="50"
  :max="200"
  :step="25"
  aria-label="Zoom level"
/>
```

#### Tooltip Directive
```vue
<Button
  v-tooltip.top="'Badge is at minimum size'"
  :disabled="isMinSize"
/>
```

---

## Component File Structure

### Recommended New/Updated Files

```
components/
├── AppStepper.vue          (NEW)
├── AppFooter.vue           (NEW)
├── ImageUploader.vue       (UPDATE: Add image icon)
├── ImageCropper.vue        (UPDATE: Fix zoom slider)
├── BadgeLibrary.vue        (UPDATE: Remove custom, add No Badge)
├── BadgeSizeSlider.vue     (NEW)
├── BadgePositioner.vue     (Keep existing)
├── PreviewCanvas.vue       (UPDATE: Support dynamic badge size)
└── ThemeToggle.vue         (Keep existing)

composables/
├── useBadges.ts            (UPDATE: Simplified badge list)
├── useImageProcessor.ts    (UPDATE: Dynamic badge sizing)
├── useTheme.ts             (Keep existing)
└── useToastMessages.ts     (Keep existing)

pages/
└── index.vue               (UPDATE: Remove sticky bar, add stepper/footer)
```

---

## Implementation Priority

### Phase 1: Core UI Fixes
1. Remove sticky action bar
2. Fix accordion icons
3. Update button labels ("Preview")
4. Add footer component

### Phase 2: Stepper & Layout
5. Create horizontal stepper component
6. Integrate stepper into main layout
7. Add step navigation

### Phase 3: Upload Improvements
8. Add image icon to upload area
9. Improve upload feedback states

### Phase 4: Crop & Zoom
10. Fix zoom slider range (50-200%)
11. Update zoom increment to 25%
12. Ensure proper cropper integration

### Phase 5: Badge Selection
13. Remove custom badge upload
14. Add "No Badge" option
15. Reduce to 3 dummy badges
16. Add badge resize slider with tooltips

---

## Summary of Changes

| Area | Change Type | Priority |
|------|-------------|----------|
| Theme Toggle | Keep existing | - |
| Stepper | New component | High |
| Footer | New component | Medium |
| Upload Icon | Enhancement | Medium |
| Zoom Slider | Fix/Update | High |
| Badge Library | Simplify | High |
| Badge Resize | New feature | Medium |
| Sticky Bar | Remove | High |
| Button Placement | Standardize | High |

---

*Document Version: 1.0*
*Created: January 2026*
*For: Badge It (Nuxt 3 + PrimeVue 4)*
