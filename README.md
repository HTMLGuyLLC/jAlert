[![Join the chat at https://gitter.im/jAlert/Lobby](https://badges.gitter.im/jAlert/Lobby.svg)](https://gitter.im/jAlert/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![Packagist](https://img.shields.io/badge/License-MIT-blue.svg)
![Codeship](https://img.shields.io/badge/Build-Passing-green.svg)
[![npm](https://img.shields.io/badge/NPM-v5.0.0-blue.svg)](https://npmjs.com/package/jAlert)

# jAlert v5.0.0
**Modern jQuery Modal/Popup/Lightbox Plugin**

by HTMLGuy, LLC (https://htmlguy.com)

![jAlert Logo](https://htmlguyllc.github.io/jAlert/index-assets/img/logo.png)

## 🚀 What's New in v5.0.0

**Complete Modernization!** jAlert has been completely rewritten with modern JavaScript practices while maintaining 100% backward compatibility:

- **ES6+ Modern JavaScript** with Babel transpilation
- **Webpack 5** for efficient bundling
- **PostCSS** for modern CSS processing
- **Comprehensive Test Suite** with Jest, Puppeteer, and visual regression testing
- **Lightbox Slideshow Feature** with advanced navigation options
- **Enhanced Performance** and smaller bundle size
- **Full Backward Compatibility** with existing code

## 📖 Demo & Documentation

**Live Demo:** https://htmlguyllc.github.io/jAlert/

## 🎯 What is jAlert?

jAlert is a powerful, lightweight jQuery plugin for creating beautiful modals, popups, lightboxes, and alerts. It's an excellent replacement for Simple Modal, FancyBox, or Reveal.

### Key Features

- **Responsive Design** - Works perfectly on all devices
- **Multiple Content Types** - Images, videos, iframes, AJAX content, and custom HTML
- **Lightbox Slideshow** - Advanced slideshow with navigation controls
- **Theme System** - 12 built-in themes with custom styling support
- **Animation Support** - Integrated with Animate.css
- **Keyboard Navigation** - Full keyboard support
- **Accessibility** - ARIA compliant and screen reader friendly
- **Modern Build System** - ES6+, Webpack, PostCSS

## 📦 Installation

### NPM (Recommended)
```bash
npm install jAlert
```

### CDN
```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/jAlert/dist/jAlert.min.css">

<!-- JavaScript (after jQuery) -->
<script src="https://unpkg.com/jAlert/dist/jAlert.min.js"></script>
```

### Manual Download
Download the latest release from the [releases page](https://github.com/HTMLGuyLLC/jAlert/releases).

## 🔧 Dependencies

- **jQuery 3.7.0+** (supports 1.7+ for backward compatibility)

## 🚀 Quick Start

### Basic Usage
```html
<!-- Include jQuery and jAlert -->
<script src="jquery.min.js"></script>
<script src="jAlert.min.js"></script>
<link rel="stylesheet" href="jAlert.min.css">

<!-- Basic alert -->
<script>
$.jAlert({
    'title': 'Hello World',
    'content': 'This is a simple alert!'
});
</script>
```

### Lightbox Slideshow
```javascript
$.jAlert({
    'slideshow': [
        'image1.jpg',
        'image2.jpg',
        'image3.jpg'
    ],
    'slideshowOptions': {
        'showArrows': true,
        'showCounter': 'numbers',
        'autoAdvance': true,
        'autoAdvanceInterval': 3000,
        'loop': true,
        'keyboardNav': true
    },
    'size': 'lg'
});
```

## 🛠️ Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/HTMLGuyLLC/jAlert.git
cd jAlert

# Install dependencies
npm install
```

### Build Commands
```bash
# Build for production (minified)
npm run build

# Build for development (with source maps)
npm run build:dev

# Watch for changes during development
npm run watch

# Clean build artifacts
npm run clean
```

### Testing
The project includes a comprehensive test suite:

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run end-to-end tests
npm run test:e2e

# Run visual regression tests
npm run test:visual

# Run all tests with coverage
npm run test:all
```

**Test Coverage:**
- **Unit Tests:** Core functionality, slideshow features
- **E2E Tests:** Browser automation with Puppeteer
- **Visual Tests:** Screenshot regression testing

## 🎨 Configuration Options

### Basic Options
```javascript
$.jAlert({
    'title': 'Alert Title',
    'content': 'Alert content or HTML',
    'theme': 'blue',           // Theme color
    'size': 'lg',              // Size: xsm, sm, md, lg, xlg, full, auto
    'closeOnClick': true,      // Close when clicking outside
    'closeOnEscape': true,     // Close with ESC key
    'autofocus': true,         // Auto-focus on first button
    'blurBackground': false    // Blur background elements
});
```

### Slideshow Options
```javascript
'slideshowOptions': {
    'showArrows': true,              // Show navigation arrows
    'showCounter': 'numbers',        // 'numbers', 'dots', or false
    'autoAdvance': false,            // Auto-advance slides
    'autoAdvanceInterval': 3000,     // Interval in milliseconds
    'pauseOnHover': true,            // Pause auto-advance on hover
    'loop': false,                   // Loop back to first slide
    'keyboardNav': true,             // Enable keyboard navigation
    'resizeMode': 'fitLargest'       // 'fitLargest' or 'original'
}
```

## 🎭 Themes

jAlert includes 12 built-in themes:
- `default`, `red`, `dark_red`, `green`, `dark_green`
- `blue`, `dark_blue`, `yellow`, `brown`
- `gray`, `dark_gray`, `black`

## 📱 Browser Support

- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Legacy Support:** IE11+ (with polyfills)
- **Mobile:** iOS Safari 12+, Chrome Mobile 90+

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/jAlert.git
   cd jAlert
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
   - Edit source files in `src/`
   - Update documentation as needed
   - Add tests for new features
   - Keep everything backwards compatible, when possible

5. **Run Tests**
   ```bash
   npm test
   npm run test:all
   ```

6. **Build and Test**
   ```bash
   npm run build
   # Open index.html to test manually
   ```

7. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

8. **Create Pull Request**
   - Go to GitHub and create a PR against the `master` branch
   - Include a description of your changes
   - Ensure all tests pass

### Contribution Guidelines

- **Code Style:** Follow existing conventions and use ESLint
- **Testing:** Add tests for new features and ensure all tests pass
- **Documentation:** Update README and inline documentation
- **Backward Compatibility:** Maintain compatibility with existing APIs
- **Performance:** Consider impact on bundle size and performance

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Animate.css** for animation support
- **Font Awesome** for icons
- **Unsplash** for demo images
- **All contributors** who have helped improve jAlert

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/HTMLGuyLLC/jAlert/issues)
- **Chat:** [Gitter](https://gitter.im/jAlert/Lobby)
- **Email:** support@htmlguy.com

---

**Made with ❤️ by HTMLGuy, LLC**