[![Join the chat at https://gitter.im/jAlert/Lobby](https://badges.gitter.im/jAlert/Lobby.svg)](https://gitter.im/jAlert/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Build](https://img.shields.io/badge/Build-Passing-green.svg)
[![npm](https://img.shields.io/badge/NPM-v5.0.1-blue.svg)](https://npmjs.com/package/jAlert)

# jAlert - The Ultimate jQuery Modal & Lightbox Plugin

**🚀 Version 5.0.1 - Completely Modernized!** A powerful, lightweight jQuery plugin for creating stunning modals, popups, lightboxes, and image slideshows. Perfect for modern web applications that need beautiful, accessible, and responsive dialogs.

## ✨ Why Choose jAlert?

**🎯 Perfect for jQuery Sites** - If you're already using jQuery, jAlert integrates seamlessly without adding bulky dependencies. No need to learn new frameworks or rewrite existing code.

**⚡ Lightning Fast** - Lightweight and optimized for performance. No bloat, just pure functionality.

**🎨 Beautiful by Default** - 12 built-in themes with smooth animations. Your modals will look professional out of the box.

**📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile with touch-friendly controls and swipe gestures.

**♿ Basic Accessibility** - Keyboard navigation, screen reader support, and ARIA attributes for better usability.

**🔄 Backward Compatible** - Upgrading from older versions? Your existing code will work without changes.

## 🎯 When to Use jAlert

- **Simple Modal Needs** - Quick alerts, confirmations, or information dialogs
- **Image Galleries** - Lightbox slideshows with navigation controls
- **Content Previews** - Show videos, iframes, or AJAX content in modals
- **Form Dialogs** - Login forms, contact forms, or any interactive content
- **jQuery Projects** - Perfect addition to existing jQuery-based websites
- **Quick Prototypes** - Get beautiful modals running in minutes, not hours

## 🚀 Quick Start

### Installation
```bash
npm install jalert
```

### Basic Usage
```html
<!-- Include jQuery first -->
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>

<!-- Include jAlert -->
<link rel="stylesheet" href="node_modules/jalert/dist/jAlert.min.css">
<script src="node_modules/jalert/dist/jAlert.min.js"></script>
```

```javascript
// Simple alert
$.jAlert({
    title: 'Success!',
    content: 'Your action was completed successfully.',
    theme: 'green'
});

// Image lightbox
$.jAlert({
    image: 'path/to/image.jpg',
    title: 'Beautiful Image'
});

// Slideshow gallery
$.jAlert({
    slideshow: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
    slideshowOptions: {
        autoAdvance: true,
        showArrows: true,
        showCounter: 'dots'
    }
});
```

## 🎨 Key Features

### 📱 **Responsive & Mobile-Friendly**
- Works perfectly on desktop, tablet, and mobile
- Touch-friendly controls and gestures
- Adaptive sizing for different screen sizes

### 🖼️ **Rich Media Support**
- **Images** - Lightbox with zoom and navigation
- **Videos** - YouTube, Vimeo, and direct video files
- **Slideshows** - Multi-image galleries with controls
- **Iframes** - Embed any web content
- **AJAX** - Load dynamic content

### 🎭 **Beautiful Themes**
12 built-in themes: `default`, `green`, `red`, `blue`, `yellow`, `brown`, `gray`, `black`, and dark variants.

### ⌨️ **Keyboard & Accessibility**
- Full keyboard navigation (ESC, arrow keys)
- Basic screen reader support with ARIA attributes
- Focus management and semantic HTML
- Touch-friendly controls with swipe gestures

### ⚙️ **Flexible Configuration**
- Custom sizes and positioning
- Animation controls
- Auto-advance slideshows
- Loop and navigation options

## 📖 Documentation & Examples

**🎮 Live Demo:** [View Interactive Examples](https://htmlguyllc.github.io/jAlert/)

**📚 Full Documentation:** [Complete API Reference](https://htmlguyllc.github.io/jAlert/)

**🔄 Changelog:** [Version History](https://github.com/HTMLGuyLLC/jAlert/blob/master/CHANGELOG.md)

**⬆️ Upgrade Guide:** [Migration Instructions](https://github.com/HTMLGuyLLC/jAlert/blob/master/UPGRADE_GUIDE.md)

## 🔧 Requirements

- **jQuery 3.7.0+** (peer dependency)
- **Modern browsers** (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+, IE11+)

## 🛠️ Development

### Setup
```bash
git clone https://github.com/HTMLGuyLLC/jAlert.git
cd jAlert
npm install
```

### Build & Test
```bash
npm run build      # Production build
npm run dev        # Development with watch
npm test           # Run all tests
```

**📋 Test Coverage:** Unit tests, E2E tests with Puppeteer, and visual regression testing.

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](https://github.com/HTMLGuyLLC/jAlert/blob/master/CONTRIBUTING.md) for details.

**Quick Start:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/HTMLGuyLLC/jAlert/issues)
- **Chat:** [Gitter](https://gitter.im/jAlert/Lobby)
- **Email:** support@htmlguy.com

---

**Made with ❤️ by [HTMLGuy, LLC](https://htmlguy.com)**