# Changelog

All notable changes to jAlert will be documented in this file.

## [5.0.3] - 2025-06-26

### 🐛 Bug Fixes

- **Test Compatibility**: Fixed unit test to account for close button being positioned inside title div
- **Test Selector Update**: Updated test selector from `.ja_title` to `.ja_title > div` to target title text specifically
- **Test Suite**: All 39 tests now pass with new close button positioning structure

## [5.0.2] - 2025-06-26

### 🐛 Bug Fixes

- **Close Button Alignment**: Fixed "x" centering in round close buttons using flexbox and vertical transform
- **Title Bar Positioning**: Moved close button inside title div for proper alignment when title is present
- **Button Type Specifics**: Added specific positioning for different close button types (round, alt) in title bar
- **Slideshow Dots**: Removed border from slideshow dots to prevent squashing appearance
- **Build Output**: Updated webpack config to output CSS as `jAlert.min.css` instead of `jAlert.css.min.css`

### 🔧 Technical Improvements

- Enhanced close button markup with wrapped "x" span for better styling control
- Improved visual consistency across different close button styles
- Better CSS organization and specificity for button positioning

---

## [5.0.1] - 2025-06-26

### ✨ New Features

- **Accessibility Improvements**: Added ARIA attributes and enhanced keyboard navigation
- **Touch Support**: Added swipe gestures for mobile devices
- **Enhanced Navigation**: Improved slideshow controls and user experience

### 🐛 Bug Fixes

- Fixed slideshow navigation controls positioning
- Improved responsive design for mobile devices
- Enhanced error handling and validation

### 📦 Dependencies

- Updated to latest jQuery compatibility
- Improved build process and optimization

---

## [5.0.0] - 2025-06-26

### 🚀 Major Release - Complete Modernization

jAlert has been completely rewritten with modern development practices while maintaining 100% API compatibility. This release focuses on improved performance, better browser support, and enhanced features.

### ✨ New Features

- **🎠 Lightbox Slideshow**: Built-in image slideshow with advanced navigation
  - Next/previous arrow controls
  - Dot navigation or number counter
  - Auto-advance with configurable intervals
  - Keyboard navigation (arrow keys)
  - Pause on hover functionality
  - Loop option to restart at the end
  - Image sizing modes (fit current vs fit largest)
  - Caption support for slides
  - Responsive viewport sizing

- **🔧 Modern Build System**:
  - Webpack 5 for efficient bundling
  - Babel transpilation to ES5 for maximum compatibility
  - PostCSS with Autoprefixer for CSS compatibility
  - Source maps for debugging
  - Optimized production builds

- **🧪 Comprehensive Testing**:
  - Unit tests with Jest
  - End-to-end tests with Puppeteer
  - Visual regression testing
  - Automated test suite

### 🔧 Technical Improvements

- **Performance**: Optimized bundle size and loading
- **Accessibility**: Enhanced keyboard navigation and screen reader support
- **Mobile Support**: Improved responsive design and touch interactions
- **Error Handling**: Better validation and error messages
- **Code Organization**: Modular architecture with improved maintainability

### 🐛 Bug Fixes

- Fixed slideshow options not being deeply merged with defaults
- Fixed loader persistence issues in slideshows
- Fixed fitLargest sizing to respect viewport dimensions
- Fixed legacy file references and cleanup
- Fixed demo and asset organization

### 📦 Dependency Updates

- **jQuery**: Updated to 3.7.0+ (peer dependency)
- **Build Tools**: Modernized to latest versions
- **Browser Support**: ES5 compatible for maximum compatibility

### 🔄 Breaking Changes

**None!** This release maintains 100% backward compatibility with existing APIs.

### 📋 Upgrade Guide

#### For Existing Users

**No code changes required!** The API is identical to previous versions.

1. **Update your files**:
   ```bash
   # Download the new version
   npm install jalert@5.0.0
   # Or download manually from GitHub
   ```

2. **Update your HTML**:
   ```html
   <!-- Old -->
   <script src="jAlert.min.js"></script>
   
   <!-- New (same file, just updated) -->
   <script src="dist/jAlert.min.js"></script>
   ```

3. **Ensure jQuery 3.7.0+**:
   ```html
   <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
   ```

#### For New Users

1. **Install via NPM**:
   ```bash
   npm install jalert
   ```

2. **Include in your project**:
   ```html
   <link rel="stylesheet" href="node_modules/jalert/dist/jAlert.min.css">
   <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
   <script src="node_modules/jalert/dist/jAlert.min.js"></script>
   ```

3. **Start using**:
   ```javascript
   $.jAlert({
       title: 'Hello World',
       content: 'Welcome to jAlert 5.0!'
   });
   ```

### 🎯 New Slideshow Feature

The slideshow feature is the highlight of this release:

```javascript
$.jAlert({
    slideshow: [
        'image1.jpg',
        'image2.jpg', 
        'image3.jpg'
    ],
    slideshowOptions: {
        autoAdvance: true,
        autoAdvanceInterval: 3000,
        showArrows: true,
        showCounter: 'dots', // or 'numbers'
        keyboardNav: true,
        loop: true,
        pauseOnHover: true,
        resizeMode: 'fitLargest' // or 'fitCurrent'
    }
});
```

### 🌐 Browser Compatibility

- **IE11+** (ES5 compatible)
- **Chrome 60+**
- **Firefox 55+**
- **Safari 12+**
- **Edge 79+**

### 📚 Documentation

- Complete API documentation in README
- Interactive demos on the website
- Comprehensive examples for all features
- Development guidelines for contributors

### 🛠️ Development

- Modern development workflow with npm scripts
- Automated testing and quality assurance
- Source maps for debugging
- Optimized build process

---

## [4.6.6] - Previous Release

### Fixed
- Added alert margin to ensure close button visibility

## [4.6.5] - Previous Release

### Fixed
- Fixed scroll issue with flexbox layout

## [4.6.4] - Previous Release

### Changed
- Rewritten alert positioning to use flexbox
- Removed centerAlert method

### Fixed
- All links updated to new GitHub username "HTMLGuyLLC"
- Fixed version references in code
- Fixed Codepen demos
- Fixed NPM package

## [4.6.2] - Previous Release

### Fixed
- Fixed top-margin when alert is larger than screen
- Fixed round close button default font color

## [4.6.1] - Previous Release

### Fixed
- Fixed autoclose option

## [4.6.0] - Previous Release

### Added
- Added autoclose option

## [4.5.1] - Previous Release

### Added
- Added fullscreen option

## [4.5] - Previous Release

### Changed
- Removed minified files from src folder
- Added distribution folder (dist)

### Fixed
- Fixed duplicate button callbacks

## [4.036] - Previous Release

### Changed
- Removed borders for no-title alerts and iframes
- Added box-shadow back

---

For older versions, see the [GitHub releases page](https://github.com/HTMLGuyLLC/jAlert/releases). 