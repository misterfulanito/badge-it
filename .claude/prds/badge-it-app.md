---
name: badge-it-app
description: Web app for adding decorative badges to profile pictures using PrimeVue
status: backlog
created: 2026-01-14T19:16:59Z
updated: 2026-01-14T19:23:56Z
---

# PRD: Badge It App

## Executive Summary

Badge It is a simple, privacy-focused web application that allows users to personalize their profile pictures by adding decorative badges. Users can upload an image, crop it to a 1:1 ratio, select a predefined badge from a library, position it at the bottom of the image, and download the final composition. The tool requires no account creation and performs all processing client-side, ensuring user privacy.

## Problem Statement

### What problem are we solving?
Users want to add badges, flags, or icons to their profile pictures (for LinkedIn, Twitter/X, Discord, etc.) to express affiliations, causes, or status. Current solutions either:
- Require account creation and store user images on servers
- Are overly complex with too many features
- Have poor mobile experiences
- Are buried within larger photo editing apps

### Why is this important now?
- Profile picture badges are increasingly popular for showing support for causes, indicating availability status, or displaying affiliations
- Privacy concerns make client-side-only processing attractive
- Mobile-first users need a responsive, touch-friendly solution

## User Stories

### Primary Persona: Social Media User
**As a** social media user
**I want to** add a badge to my profile picture
**So that** I can express my affiliation, status, or support for a cause

**Acceptance Criteria:**
- Can upload an image from device (max 5MB, PNG or JPG)
- Can crop/adjust the image to 1:1 ratio
- Can choose one badge from preset options
- Can position badge at bottom (left, center, or right)
- Can preview the result before downloading
- Can remove badge and select a different one
- Can download the final image as 1024x1024 PNG
- Can start over and clear all changes
- Works on both mobile and desktop

### Secondary Persona: Professional Networker
**As a** professional on LinkedIn
**I want to** add a "Hiring" or "Open to Work" style badge
**So that** I can signal my professional status

**Acceptance Criteria:**
- Professional-looking badge presets available
- High-quality output (1024x1024px) suitable for professional platforms
- Quick workflow (under 30 seconds to complete)

## Requirements

### Functional Requirements

#### FR1: Image Upload
| ID | Requirement | Priority |
|----|-------------|----------|
| FR1.1 | Drag and drop support (desktop) | Must |
| FR1.2 | File picker for all devices | Must |
| FR1.3 | Support PNG and JPG formats only | Must |
| FR1.4 | Maximum file size: 5MB | Must |
| FR1.5 | Client-side file validation before processing | Must |
| FR1.6 | Show error toast if file exceeds 5MB | Must |
| FR1.7 | Show error toast if file format is not supported | Must |

#### FR2: Image Cropping
| ID | Requirement | Priority |
|----|-------------|----------|
| FR2.1 | Crop tool with 1:1 aspect ratio (locked) | Must |
| FR2.2 | User can adjust crop area position | Must |
| FR2.3 | User can zoom in/out within crop area | Should |
| FR2.4 | Preview area: 512x512px on desktop | Must |
| FR2.5 | Preview area: responsive percentage on mobile | Must |

#### FR3: Badge Selection
| ID | Requirement | Priority |
|----|-------------|----------|
| FR3.1 | Display badge library with preset options | Must |
| FR3.2 | Badges are transparent PNG files | Must |
| FR3.3 | Only one badge can be selected at a time | Must |
| FR3.4 | Visual indicator for selected badge | Must |
| FR3.5 | User can remove current badge | Must |
| FR3.6 | User can replace badge with another option | Must |

#### FR4: Badge Positioning
| ID | Requirement | Priority |
|----|-------------|----------|
| FR4.1 | Three position options: left-bottom, center-bottom, right-bottom | Must |
| FR4.2 | Visual position selector (buttons or icons) | Must |
| FR4.3 | Real-time preview of badge position | Must |
| FR4.4 | Default position: center-bottom | Should |

#### FR5: Preview & Export
| ID | Requirement | Priority |
|----|-------------|----------|
| FR5.1 | Live preview of final composition | Must |
| FR5.2 | Download button for final image | Must |
| FR5.3 | Output format: PNG only | Must |
| FR5.4 | Output resolution: 1024x1024px | Must |
| FR5.5 | Composition layers: background (cropped image) + badge overlay | Must |
| FR5.6 | Show success toast on download | Must |

#### FR6: Reset Functionality
| ID | Requirement | Priority |
|----|-------------|----------|
| FR6.1 | "Start Over" button to clear all changes | Must |
| FR6.2 | Confirmation dialog before clearing | Should |
| FR6.3 | Reset returns to initial upload state | Must |

#### FR7: Notifications
| ID | Requirement | Priority |
|----|-------------|----------|
| FR7.1 | Toast notifications for errors | Must |
| FR7.2 | Toast notifications for success messages | Must |
| FR7.3 | Toast notifications for system information | Must |
| FR7.4 | Use PrimeVue Toast component | Must |

#### FR8: Social Sharing
| ID | Requirement | Priority |
|----|-------------|----------|
| FR8.1 | Share website button (not the image) | Must |
| FR8.2 | Share to: Twitter/X, LinkedIn, Facebook | Should |
| FR8.3 | Copy link to clipboard option | Should |

### Non-Functional Requirements

#### Performance
- Initial page load: < 2 seconds
- Image processing: < 1 second
- Smooth cropping interactions (60fps)

#### Security & Privacy
- Zero server-side image storage
- All processing done client-side (Canvas API)
- No tracking or analytics on uploaded images
- No account required

#### Compatibility
- Modern browsers: Chrome, Firefox, Safari, Edge (last 2 versions)
- Mobile: iOS Safari 14+, Android Chrome 90+
- Responsive design: 320px to 4K displays

#### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Sufficient color contrast

## Error Scenarios (For Agent Implementation)

The following error scenarios should be handled by specialized agents:

### ES1: File Upload Errors
| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| ES1.1 | File exceeds 5MB | Show error toast: "File too large. Maximum size is 5MB." |
| ES1.2 | Invalid file format | Show error toast: "Invalid format. Please upload PNG or JPG." |
| ES1.3 | Corrupted image file | Show error toast: "Unable to read image. Please try another file." |
| ES1.4 | Upload cancelled by user | No action, remain in current state |

### ES2: Image Processing Errors
| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| ES2.1 | Canvas API not supported | Show error toast: "Your browser doesn't support this feature." |
| ES2.2 | Memory limit exceeded | Show error toast: "Image processing failed. Try a smaller image." |
| ES2.3 | Image fails to load | Show error toast: "Failed to load image. Please try again." |

### ES3: Badge Errors
| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| ES3.1 | Badge asset fails to load | Show error toast: "Badge failed to load. Please try another." |
| ES3.2 | No badge selected on download | Show info toast: "No badge selected. Download image without badge?" |

### ES4: Download Errors
| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| ES4.1 | Download fails | Show error toast: "Download failed. Please try again." |
| ES4.2 | Browser blocks download | Show info toast: "Please allow downloads from this site." |

## UI Specifications

### Layout
```
+--------------------------------------------------+
|  Header: "Badge It" logo + Share button          |
+--------------------------------------------------+
|                                                  |
|  +------------------------------------------+    |
|  |                                          |    |
|  |         Preview Canvas                   |    |
|  |         (512x512px desktop)              |    |
|  |         (responsive on mobile)           |    |
|  |                                          |    |
|  +------------------------------------------+    |
|                                                  |
|  [ Upload Image ] or drag & drop                 |
|                                                  |
|  Position: [ Left ] [ Center ] [ Right ]         |
|                                                  |
|  Badge Library:                                  |
|  +------+ +------+ +------+ +------+             |
|  |badge1| |badge2| |badge3| |badge4|             |
|  +------+ +------+ +------+ +------+             |
|                                                  |
|  [ Download PNG ]  [ Start Over ]                |
|                                                  |
+--------------------------------------------------+
```

### Preview Canvas Dimensions
- **Desktop**: 512x512px fixed
- **Mobile**: 100% width, maintain 1:1 aspect ratio
- **Breakpoint**: 768px (below = mobile layout)

### PrimeVue Components to Use
- `FileUpload` - For image upload
- `Image` - For preview display
- `Button` - For actions
- `Toast` - For notifications
- `Dialog` - For confirmation dialogs
- `Galleria` or custom grid - For badge library
- `SelectButton` - For position selection

## Success Criteria

### Quantitative Metrics
- Page load time < 2 seconds (Lighthouse score > 90)
- Complete user flow in < 30 seconds
- Zero server errors (all client-side)
- Mobile usability score > 95

### Qualitative Metrics
- Intuitive enough to use without instructions
- Professional-quality output
- Smooth, responsive interactions

## Constraints & Assumptions

### Technical Constraints
- Client-side only (no backend for image processing)
- Bundle size < 300KB (excluding badge assets)
- PrimeVue as the UI component library

### Assumptions
- Users have modern browsers with Canvas API support
- Users can upload images from their devices
- Badge assets stored in public folder

## Out of Scope

The following are explicitly NOT part of this project:
- User accounts or authentication
- Server-side image storage
- Custom badge creation/design tools
- Custom text on badges (preset badges only)
- Sharing the generated image directly (only share website link)
- Badge animation or GIF support
- Batch processing multiple images
- API for third-party integrations
- Multiple badges on single image
- Badge resizing by user

## Dependencies

### External Dependencies
- Badge PNG assets (need to source or create)
- CDN for hosting (Vercel/Cloudflare)

### Technical Dependencies
- **Nuxt 3** - Vue.js meta-framework
- **Vue 3** - Frontend framework
- **PrimeVue 4** - UI component library
- **Canvas API** - Browser native for image compositing
- **Cropper.js or vue-advanced-cropper** - For image cropping

## Technical Approach

### Architecture
```
badge-it/
├── app.vue                 # Root component
├── nuxt.config.ts          # Nuxt configuration
├── pages/
│   └── index.vue           # Main app page
├── components/
│   ├── ImageUploader.vue   # File upload component
│   ├── ImageCropper.vue    # Crop tool component
│   ├── BadgeLibrary.vue    # Badge selection grid
│   ├── BadgePositioner.vue # Position selector
│   ├── PreviewCanvas.vue   # Live preview
│   ├── ActionButtons.vue   # Download, Start Over
│   └── ShareButton.vue     # Social share
├── composables/
│   ├── useImageProcessor.ts  # Canvas operations
│   ├── useToastMessages.ts   # Toast notifications
│   └── useBadges.ts          # Badge data/loading
├── public/
│   └── badges/             # Badge PNG assets
├── assets/
│   └── styles/             # Global CSS
└── package.json
```

### Key Technical Decisions
1. **Nuxt 3** - Vue meta-framework for SSR and file-based routing
2. **PrimeVue 4** - Comprehensive UI component library
3. **Canvas API** - For client-side image compositing
4. **vue-advanced-cropper** - For 1:1 aspect ratio cropping
5. **Composition API** - Modern Vue 3 patterns

### Image Processing Flow
```
1. User uploads image (PNG/JPG, max 5MB)
2. Image loaded into cropper with 1:1 ratio
3. User adjusts crop area
4. User selects badge from library
5. User selects position (left/center/right bottom)
6. Preview canvas shows composition in real-time
7. On download:
   a. Create 1024x1024 canvas
   b. Draw cropped image scaled to fill
   c. Draw badge at selected position
   d. Export as PNG
   e. Trigger download
```

## Badge Library (Initial Set)

| Category | Badges |
|----------|--------|
| Professional | Hiring, Open to Work, Available, Looking |
| Status | Verified, Certified, Expert, Pro |
| Causes | Pride Flag, Ukraine, Climate Action |
| Fun | Party, Gaming, Music, Coffee |
| Flags | US, UK, EU, Spain, France, Germany, etc. |

### Badge Asset Specifications
- Format: PNG with transparency
- Size: 512x512px (will scale to fit)
- Style: Consistent visual language
- Licensing: Free for commercial use or custom-created

## Appendix

### Competitor Analysis
- pfpmaker.com - Feature-heavy, requires signup for some features
- LinkedIn's built-in badges - Limited options, only for LinkedIn
- Canva - Too complex for simple badge addition

### User Flow Diagram
```
[Start]
   │
   ▼
[Upload Image] ──(error)──> [Show Error Toast] ──> [Return to Upload]
   │
   ▼
[Crop Image 1:1]
   │
   ▼
[Select Badge] ◄──────────────────┐
   │                              │
   ▼                              │
[Select Position]                 │
   │                              │
   ▼                              │
[Preview]                         │
   │                              │
   ├──[Change Badge]──────────────┘
   │
   ├──[Start Over]──> [Confirm] ──> [Return to Upload]
   │
   ▼
[Download 1024x1024 PNG]
   │
   ▼
[Success Toast]
   │
   ▼
[End]
```
