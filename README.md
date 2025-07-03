[![Join the chat at https://gitter.im/jAlert/Lobby](https://badges.gitter.im/jAlert/Lobby.svg)](https://gitter.im/jAlert/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Build](https://img.shields.io/badge/Build-Passing-green.svg)
[![npm](https://img.shields.io/badge/NPM-v6.0.0-blue.svg)](https://npmjs.com/package/jAlert)

# jAlert - The Ultimate jQuery Modal & Lightbox Plugin

## ✨ Why Choose jAlert?

**🎯 Perfect for jQuery Sites** - If you're already using jQuery, jAlert integrates seamlessly without adding bulky dependencies. No need to learn new frameworks or rewrite existing code.

**⚡ Zero Config** - Include JS/CSS and add a modal immediately, no complicated setup.

**🎨 Beautiful by Default** - 12 built-in themes with smooth animations. Your modals will look professional out of the box.

**📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile with touch-friendly controls and swipe gestures.

**♿ Basic Accessibility** - Keyboard navigation, screen reader support, and ARIA attributes for better usability.

## 🎯 When to Use jAlert

- **Simple Modal Needs** - Quick alerts, confirmations, or information dialogs
- **Image & Video Galleries** - Lightbox slideshows with navigation controls
- **Content Previews** - Show videos, iframes, or AJAX content in modals
- **Form Dialogs** - Login forms, contact forms, or any interactive content
- **jQuery Projects** - Perfect addition to existing jQuery-based websites
- **Quick Prototypes** - Get beautiful modals running in minutes, not hours

## Browser Compatibility

Minimum browser versions that should fully support this plugin:
- Chrome: 30+
- Firefox: 28+
- Safari: 7+
- Edge: 12+
- Opera: 17+
- Internet Explorer: 11 (with jQuery polyfills, but MutationObserver support is limited)

**Note:** IE10 and below are not fully supported due to missing ES5 features and MutationObserver.

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
});

// Video lightbox
$.jAlert({
    video: 'https://embed.youtube.com/my-video',
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
14 built-in themes: `default`, `green`, `red`, `blue`, `yellow`, `orange`, `brown`, `gray`, `black`, and dark variants (`dark_green`, `dark_red`, `dark_blue`, `dark_gray`, `dark_orange`).

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
- **Modern browsers** (see browser compatibility below)

## 🛠️ Development

### Setup
```bash
git clone https://github.com/HTMLGuyLLC/jAlert.git
cd jAlert
npm install
```

### Build & Test
```bash
# Build commands
npm run build      # Production build (minified)
npm run dev        # Development build with watch mode

# Test commands
npm test           # Run unit tests only (fastest)
npm run test:unit  # Run unit tests only (alias)
npm run test:e2e   # Run end-to-end tests with Puppeteer
npm run test:all   # Run unit + e2e tests (full test suite)npm
```

**📋 Test Coverage:**
- **Unit Tests:** Core functionality, slideshow features, and API methods
- **E2E Tests:** Real browser testing with Puppeteer for user interactions
- **Visual Regression:** Screenshot comparison testing for UI consistency

**🧪 Test Requirements:**
- E2E tests require Chrome/Chromium browser
- Visual tests may skip if browser dependencies are unavailable
- All tests work in CI/CD environments with `--no-sandbox` flag

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

- **Issues & Bug Reports:** [GitHub Issues](https://github.com/HTMLGuyLLC/jAlert/issues)
- **Questions & Discussions:** [GitHub Discussions](https://github.com/HTMLGuyLLC/jAlert/discussions)
- **Chat:** [Gitter](https://gitter.im/jAlert/Lobby)

## ☕ Support the Project

If jAlert has been helpful to you, consider buying me a coffee! Your support helps maintain and improve this project.

**[☕ Buy me a coffee](https://github.com/sponsors/HTMLGuyLLC)**

---

**Made with ❤️ by [HTMLGuy, LLC](https://htmlguy.com)**