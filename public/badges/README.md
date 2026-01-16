# Adding Badges to Badge It

This folder contains all badge images available in the Badge It application.

## File Requirements

- **Format**: PNG with transparent background (recommended) or SVG
- **Size**: 512x512 pixels (recommended)
- **Naming**: lowercase, hyphens, no spaces
  - Example: `verified-badge.png`, `hiring-now.png`

## How to Add a Badge

1. Create your badge image (512x512 PNG with transparent background)
2. Name it descriptively: `badge-name.png`
3. Place it in this folder: `/public/badges/`
4. The badge will automatically appear in the app

## Naming Convention

- Use lowercase letters
- Use hyphens (-) instead of spaces
- Keep names short but descriptive
- Examples:
  - `open-to-work.png`
  - `hiring-badge.png`
  - `verified.png`
  - `ukraine-support.png`

**Avoid:**
- `Open To Work.png` (spaces and uppercase)
- `badge_1.png` (underscores and non-descriptive)
- `my-super-awesome-badge-for-linkedin.png` (too long)

## Badge Design Tips

1. **Use transparent backgrounds** - Your badge will overlay on profile pictures
2. **Keep designs simple** - The badge may appear as small as 200px on output
3. **Use bold colors** - Stand out against various photo backgrounds
4. **Test at small sizes** - Preview how it looks at S, M, and L sizes
5. **Avoid fine details** - They may not be visible at smaller sizes

## Supported Formats

| Format | Recommended | Notes |
|--------|-------------|-------|
| PNG | Yes | Best for badges with transparency |
| SVG | Yes | Scalable, good for simple graphics |
| JPG | No | No transparency support |
| WebP | No | Limited browser support |

## Current Badges

The following badges are currently available:
- `available.svg` - Available for opportunities
- `certified.svg` - Certified professional
- `gamer.svg` - Gaming enthusiast
- `hiring.png` / `hiring.svg` - We're hiring
- `open-to-work.svg` - Open to work opportunities
- `party.svg` - Celebration/party mode
- `pride.svg` - Pride support
- `ukraine-support.svg` - Ukraine support
- `verified.svg` - Verified account

## Questions?

For feature requests or issues, visit our GitHub repository.
