# Badge It

A privacy-focused web app that lets you add badges to your profile pictures - all processing happens locally in your browser.

![Badge It](https://img.shields.io/badge/Made%20with-Nuxt%203-00DC82?style=flat-square&logo=nuxt.js)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## Features

- **Privacy First** - All image processing happens locally in your browser. Your photos never leave your device.
- **Multiple Badges** - Choose from various badges including "Open to Work", "Hiring", "Verified", "Pride", and more.
- **Smart Cropping** - Intuitive image cropper with zoom controls to frame your photo perfectly.
- **Badge Positioning** - Adjust badge position around your profile picture.
- **AI Image Enhancement** - Optional AI-powered upscaling to improve image quality on download.
- **Multiple Sizes** - Export in standard sizes (400x400, 800x800) or custom dimensions.
- **Dark Mode** - Full dark mode support for comfortable viewing.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) with Vue 3
- **UI Components**: [PrimeVue 4](https://primevue.org/)
- **Image Cropping**: [Cropper.js](https://fengyuanchen.github.io/cropperjs/)
- **AI Upscaling**: [Upscaler.js](https://upscalerjs.com/) (ESRGAN model)
- **Styling**: Scoped CSS with CSS Variables
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/misterfulanito/badge-it.git
cd badge-it

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## How It Works

1. **Upload** - Select or drag & drop your profile picture
2. **Crop** - Adjust the crop area and zoom to frame your photo
3. **Badge** - Choose a badge from the library
4. **Position** - Adjust where the badge appears on your photo
5. **Download** - Export your badged profile picture (with optional AI enhancement)

## Privacy

Badge It is designed with privacy as a core principle:

- No server-side processing - everything runs in your browser
- No image uploads to external servers
- No tracking or analytics
- No account required

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with magic by pixel wizards, Huri. Special recognition to the alchemist Sr.Javi
