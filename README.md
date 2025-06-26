[![Join the chat at https://gitter.im/jAlert/Lobby](https://badges.gitter.im/jAlert/Lobby.svg)](https://gitter.im/jAlert/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![Packagist](https://img.shields.io/badge/License-MIT-blue.svg)
![Codeship](https://img.shields.io/badge/Build-Passing-green.svg)
[![npm](https://img.shields.io/badge/NPM-v5.0.0-blue.svg)](https://npmjs.com/package/jAlert)

**🚀 Version 5.0.0 - Now Modernized!** This plugin has been completely rewritten with modern JavaScript practices (ES6+) while maintaining API compatibility. Requires jQuery 3.7.0+ and modern browsers.

# jAlert - jQuery Modal/Popup/Lightbox Plugin

A simple, lightweight jQuery plugin for creating modals, popups, lightboxes, and alerts. **ES5 compatible** for maximum browser support.

## Features

- **Modal/Popup/Lightbox**: Create beautiful modal dialogs, popups, and lightboxes
- **Slideshow**: Built-in image slideshow with navigation controls
- **Multiple Themes**: 12 built-in themes (default, green, red, blue, etc.)
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Accessible**: Keyboard navigation and screen reader support
- **Lightweight**: Minimal footprint with no external dependencies
- **ES5 Compatible**: Works in all modern browsers and IE11+

## Requirements

- **jQuery 3.7.0+** (peer dependency)
- **Modern browsers** (IE11+, Chrome, Firefox, Safari, Edge)

## Installation

### NPM
```bash
npm install jalert
```

### Manual
Download the latest release and include the files:
```html
<link rel="stylesheet" href="dist/jAlert.min.css">
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
<script src="dist/jAlert.min.js"></script>
```

## Quick Start

```javascript
// Basic alert
$.jAlert({
    title: 'Hello World',
    content: 'This is a simple alert!'
});

// Image lightbox
$.jAlert({
    image: 'path/to/image.jpg',
    title: 'My Image'
});

// Slideshow
$.jAlert({
    slideshow: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
    slideshowOptions: {
        autoAdvance: true,
        showArrows: true,
        showCounter: 'dots'
    }
});
```

## API Documentation

### Basic Usage
```javascript
$.jAlert(options)
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | false | Alert title |
| `content` | string | false | Alert content (HTML supported) |
| `theme` | string | 'default' | Theme color (default, green, red, blue, etc.) |
| `size` | string/object | 'sm' | Size preset or custom dimensions |
| `closeBtn` | boolean | true | Show close button |
| `closeOnEsc` | boolean | true | Close on ESC key |
| `closeOnClick` | boolean | false | Close on background click |

### Media Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `image` | string | false | Image URL for lightbox |
| `video` | string | false | Video URL (YouTube supported) |
| `iframe` | string | false | Iframe URL |
| `ajax` | string | false | AJAX URL to load content |

### Slideshow Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `slideshow` | array/string | false | Array of images or selector |
| `slideshowOptions.autoAdvance` | boolean | false | Auto-advance slides |
| `slideshowOptions.showArrows` | boolean | true | Show navigation arrows |
| `slideshowOptions.showCounter` | string | 'numbers' | Counter type ('numbers', 'dots') |
| `slideshowOptions.keyboardNav` | boolean | true | Enable keyboard navigation |
| `slideshowOptions.loop` | boolean | true | Loop slideshow |

## Examples

### Basic Alert
```javascript
$.jAlert({
    title: 'Success!',
    content: 'Your action was completed successfully.',
    theme: 'green'
});
```

### Image Lightbox
```javascript
$.jAlert({
    image: 'https://example.com/image.jpg',
    title: 'Beautiful Image',
    size: 'lg'
});
```

### Slideshow with Controls
```javascript
$.jAlert({
    slideshow: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
    ],
    slideshowOptions: {
        autoAdvance: true,
        autoAdvanceInterval: 3000,
        showArrows: true,
        showCounter: 'dots',
        keyboardNav: true,
        loop: true
    }
});
```

### Custom Size
```javascript
$.jAlert({
    content: 'Custom sized alert',
    size: {
        width: '600px',
        height: '400px'
    }
});
```

### AJAX Content
```javascript
$.jAlert({
    ajax: '/api/content',
    title: 'Dynamic Content'
});
```

## Browser Compatibility

- **IE11+** (ES5 compatible)
- **Chrome 60+**
- **Firefox 55+**
- **Safari 12+**
- **Edge 79+**

## Development

### Setup
```bash
git clone https://github.com/HTMLGuyLLC/jAlert.git
cd jAlert
npm install
```

### Build
```bash
npm run build      # Production build
npm run dev        # Development with watch
```

### Testing
```bash
npm run test       # Unit tests
npm run test:e2e   # End-to-end tests
npm run test:all   # All tests
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation for API changes
- Ensure ES5 compatibility is maintained

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### 5.0.0
- **Major rewrite** with modern build system
- **Slideshow feature** with navigation controls
- **ES5 compatibility** for maximum browser support
- **Improved accessibility** and keyboard navigation
- **Better mobile support** and responsive design
- **Comprehensive test suite** with unit, e2e, and visual tests
- **Modern development workflow** with Webpack, Babel, and PostCSS

### Previous Versions
- See [GitHub releases](https://github.com/HTMLGuyLLC/jAlert/releases) for older versions

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

## 📖 Demo & Documentation

**Live Demo:** https://htmlguyllc.github.io/jAlert/

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

jQuery 3.7.0+ (ES6+ features require modern browsers)

**Browser Support:**
- Chrome 60+
- Firefox 55+ 
- Safari 12+
- Edge 79+
- Internet Explorer 11+

**Node.js Requirements:**
- Node.js 14.0.0+
- npm 6.0.0+

## 🔄 Compatibility

**Important:** Version 5.0.0 is a complete rewrite with modern ES6+ JavaScript. While the API remains the same, the requirements have changed:

### ✅ What's Compatible:
- All existing API calls and options
- Plugin initialization methods
- Event handlers and callbacks
- CSS classes and styling

### ⚠️ What Changed:
- **jQuery:** Now requires 3.7.0+ (was 1.7+)
- **Browsers:** Modern browsers only (was IE6+)
- **Build:** Uses modern build tools (was manual)

### 🔧 Migration Guide:
If you're upgrading from v4.x:
1. Update jQuery to 3.7.0+
2. Test in modern browsers
3. No code changes needed (API is identical)

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

Getting the files
=======
Available on NPM (https://www.npmjs.com/package/jAlert):
```html
npm install jAlert
```