---
name: badge-it-app
status: backlog
created: 2026-01-14T19:25:39Z
progress: 0%
prd: .claude/prds/badge-it-app.md
github: https://github.com/misterfulanito/badge-it/issues/1
---

# Epic: Badge It App

## Overview

Build a privacy-focused web application using Nuxt 3 and PrimeVue that allows users to add decorative badges to their profile pictures. The app processes images entirely client-side using the Canvas API, with no server storage. Users upload an image (max 5MB, PNG/JPG), crop to 1:1 ratio, select a badge, position it at the bottom, and download a 1024x1024 PNG.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Nuxt 3 | SSR support, file-based routing, Vue ecosystem |
| UI Library | PrimeVue 4 | Comprehensive components, Toast, FileUpload built-in |
| Image Cropping | vue-advanced-cropper | Best Vue 3 support, 1:1 aspect ratio lock |
| Image Processing | Canvas API | Native browser support, no server needed |
| State Management | Vue Composables | Simple app, no need for Pinia |
| Styling | PrimeVue + CSS | Leverage PrimeVue theming system |

## Technical Approach

### Frontend Components
```
components/
├── ImageUploader.vue    # PrimeVue FileUpload + drag/drop
├── ImageCropper.vue     # vue-advanced-cropper wrapper
├── BadgeLibrary.vue     # Grid of badge options
├── BadgePositioner.vue  # SelectButton for L/C/R position
├── PreviewCanvas.vue    # Real-time canvas composition
├── ActionButtons.vue    # Download + Start Over buttons
└── ShareButton.vue      # Social share dropdown
```

### Composables
```
composables/
├── useImageProcessor.ts  # Canvas drawing, export to PNG
├── useToastMessages.ts   # Centralized toast notifications
└── useBadges.ts          # Badge data, loading, selection
```

### State Flow
```
uploadedImage (File)
    → croppedImageData (ImageData)
        → selectedBadge (Badge | null)
            → badgePosition ('left' | 'center' | 'right')
                → previewCanvas (real-time render)
                    → downloadImage (1024x1024 PNG)
```

### Backend Services
None required - fully client-side application.

### Infrastructure
- **Hosting**: Vercel (zero-config Nuxt deployment)
- **CDN**: Vercel Edge Network for static assets
- **Badge Assets**: `/public/badges/` directory

## Implementation Strategy

### Development Phases
1. **Foundation** (Tasks 1-2): Project setup, image upload with validation
2. **Core Features** (Tasks 3-6): Cropping, badge selection, positioning, preview
3. **Export & Polish** (Tasks 7-9): Download, notifications, responsive UI
4. **Quality** (Task 10): Testing and deployment

### Risk Mitigation
- **Canvas API support**: Check on mount, show browser compatibility warning
- **Large images**: Validate size on upload, resize if needed before cropping
- **Mobile performance**: Use requestAnimationFrame for smooth preview updates

### Testing Approach
- Manual testing on Chrome, Firefox, Safari, Edge
- Mobile testing on iOS Safari, Android Chrome
- Lighthouse performance audit (target >90)

## Task Breakdown Preview

High-level tasks (10 total, will be decomposed further):

- [ ] **Task 1**: Project Setup - Initialize Nuxt 3, install PrimeVue, configure project structure
- [ ] **Task 2**: Image Upload - FileUpload component with 5MB/format validation and error toasts
- [ ] **Task 3**: Image Cropper - 1:1 aspect ratio cropping with vue-advanced-cropper
- [ ] **Task 4**: Badge Library - Display badge grid, selection state, remove/replace functionality
- [ ] **Task 5**: Badge Positioning - SelectButton for left/center/right bottom placement
- [ ] **Task 6**: Preview Canvas - Real-time composition render at 512x512 (responsive on mobile)
- [ ] **Task 7**: Download Feature - Export 1024x1024 PNG with badge overlay
- [ ] **Task 8**: Toast Notifications - Centralized error/success/info messages via PrimeVue Toast
- [ ] **Task 9**: UI Polish - Responsive layout, Start Over with confirmation, Share button
- [ ] **Task 10**: Testing & Deployment - Cross-browser testing, Lighthouse audit, Vercel deploy

## Dependencies

### NPM Packages
| Package | Version | Purpose |
|---------|---------|---------|
| nuxt | ^3.x | Framework |
| primevue | ^4.x | UI components |
| @primevue/themes | ^4.x | PrimeVue theming |
| vue-advanced-cropper | ^2.x | Image cropping |

### Assets Required
- Badge PNG files (512x512, transparent)
- App logo/favicon
- Social share preview image (OG image)

### External Services
- None (fully client-side)

## Success Criteria (Technical)

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 90 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 2s |
| Bundle Size (JS) | < 300KB gzipped |
| Image Processing Time | < 500ms |
| Download Generation | < 1s |

## Estimated Effort

| Phase | Tasks | Complexity |
|-------|-------|------------|
| Foundation | 1-2 | Low |
| Core Features | 3-6 | Medium |
| Export & Polish | 7-9 | Medium |
| Quality | 10 | Low |

**Critical Path**: Tasks 1 → 2 → 3 → 6 → 7 (upload → crop → preview → download)

**Parallel Work Possible**:
- Task 4 (badges) can run parallel to Task 3 (cropper)
- Task 8 (toasts) can run parallel to Task 7 (download)
- Task 9 (UI polish) can run parallel to Task 10 (testing)

## Tasks Created

- [ ] #2 - Project Setup (parallel: false)
- [ ] #3 - Image Upload Component (parallel: false)
- [ ] #4 - Image Cropper Component (parallel: false)
- [ ] #5 - Badge Library Component (parallel: true)
- [ ] #6 - Badge Positioning Component (parallel: true)
- [ ] #7 - Preview Canvas Component (parallel: false)
- [ ] #8 - Download Feature (parallel: false)
- [ ] #9 - Toast Notifications (parallel: true)
- [ ] #10 - UI Polish and Additional Features (parallel: true)
- [ ] #11 - Testing and Deployment (parallel: true)

**Summary:**
- Total tasks: 10
- Parallel tasks: 5
- Sequential tasks: 5
- Estimated total effort: 22-30 hours
