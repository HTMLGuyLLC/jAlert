# Changelog

All notable changes to jAlert will be documented in this file.

## [6.0.0] - 2025-07-03

### 🚀 Major Release - Complete Feature Overhaul

jAlert 6.0.0 represents a massive expansion with a complete slideshow system, enhanced video support, and comprehensive media handling capabilities. This release introduces significant new features while maintaining backward compatibility where possible.

### ✨ New Features

- **🎠 Complete Slideshow System**: Revolutionary slideshow functionality with advanced features
  - **Image Navigation**: Next/previous arrows, dot navigation, and number counters
  - **Video Support**: HTML5 videos and YouTube/Vimeo iframes within slideshows
  - **Thumbnail Navigation**: Drag-scrollable thumbnails with top/bottom positioning
  - **Auto-advance**: Configurable intervals with pause-on-hover functionality
  - **Keyboard Navigation**: Arrow key support with proper event cleanup
  - **Responsive Sizing**: Contain and cover modes for optimal image display
  - **Advanced Callbacks**: `onSlideChange`, `onBeforeSlideChange`, `onSlideshowEnd`, `onSlideshowLoop`, `onContentLoad`
  - **Loop Control**: Configurable looping with end-of-slideshow detection
  - **Preloading**: Background image preloading for faster navigation
  - **Touch Support**: Swipe gestures and touch-friendly controls for mobile devices

- **🎥 Enhanced Video Support**: Comprehensive HTML5 video and iframe handling
  - **HTML5 Video**: Full support for all video attributes (controls, autoplay, loop, mute, etc.)
  - **Responsive Containers**: Proper aspect ratio handling with fallback defaults
  - **Video Configuration**: Direct video object properties for complete video configuration
  - **Error Handling**: Robust loading and error states with graceful fallbacks
  - **Utility Functions**: `createHTML5Video()`, `createVideoContainer()`, `setupVideoEventHandlers()`
  - **YouTube/Vimeo**: Enhanced iframe support with responsive containers

- **🖼️ Improved Media Handling**: Enhanced image and iframe support
  - **Auto-sizing**: Intelligent sizing for images, videos, and slideshows
  - **Responsive Design**: Better mobile and tablet support
  - **Error States**: Improved error handling and user feedback
  - **Loader Positioning**: Better loading indicators and positioning

### 🔧 Technical Improvements

- **Performance**: Optimized slideshow rendering and video loading
- **Memory Management**: Comprehensive event cleanup and timer management
- **Error Handling**: Robust validation and fallback mechanisms
- **Accessibility**: Enhanced ARIA attributes and keyboard navigation
- **Mobile Support**: Touch-friendly controls and responsive layouts

### 🐛 Bug Fixes

- **Button Alias**: Fixed missing `buttons` alias for `btns` option - now both `buttons` and `btns` work identically
  - Added proper alias handling so `buttons: [...]` gets converted to `btns: [...]` internally
  - Updated unit tests to verify alias functionality works correctly
- **Responsive Video**: Fixed extreme aspect ratio issues (450% padding-bottom)
- **Event Cleanup**: Proper cleanup of slideshow timers and event handlers
- **Theme Validation**: Invalid themes now return 'default' instead of false
- **Size Defaults**: Media modals now default to 'auto' size for better UX
- **Memory Leaks**: Comprehensive cleanup of MutationObserver and event listeners
- **Button Sizing**: Enlarged buttons on all screen sizes for better touch interaction (8px 14px padding on desktop, 8px 10px on mobile)

### 📚 Documentation

- **Comprehensive API Documentation**: Complete slideshow and video API reference
- **Interactive Demos**: 16 comprehensive demo sections with 200+ examples
- **Test Coverage**: 205 unit tests, 153 E2E tests, and visual regression tests
- **Migration Guide**: Detailed upgrade instructions for existing users

### 🔄 Breaking Changes

- **Default Size Behavior**: Media modals (images, videos, slideshows) now default to `size: 'auto'`
- **Theme Validation**: Invalid themes now return `'default'` instead of `false`
- **Slideshow API**: New slideshow system with different options structure
- **Video API**: Direct video object properties for HTML5 video configuration
- **Default Padding Behavior**: All modals now default to `noPadContent: true` (no padding around content)

### Added
- Video modals and slideshows now support an optional `embedType` property (`'iframe'` for YouTube/Vimeo, `'html5'` for direct video files). If not set, jAlert will auto-detect based on the video URL. If you set the wrong type, it will use what you specify.

### ✨ New Features

- **New Orange and Dark Orange Themes**: Added `orange` (bright, readable on light backgrounds) and `dark_orange` (deep orange, white text) themes for alerts and buttons. The `warningAlert` shortcut now uses the orange theme by default. If you want the old yellow warning, use `theme: 'yellow'`.

---

## [5.0.5] - 2025-06-27

### 🛡️ Bug Fixes & Stability Improvements

- **Enhanced Error Handling**: Added comprehensive defensive guards in core methods
  - Fixed `Cannot read properties of undefined (reading 'blurBackground')` error in async scenarios
  - Enhanced `animateAlert()` method with robust instance validation
  - Improved `closeAlert()` method with proper data existence checks
  - Better AJAX error handling with enhanced type checking and null safety

- **Test Infrastructure Improvements**: 
  - Fixed auto-advance slideshow test timing issues (corrected from 3000ms to 2000ms interval)
  - Enhanced test polling mechanism for more reliable E2E testing
  - Improved cleanup procedures in test setup with proper alert instance closure
  - Added comprehensive event listener cleanup for slideshow components

- **CSS Refinements**:
  - Removed unwanted button borders by adding `border: none` to `.ja_btn` selector
  - Improved visual consistency across different button styles

- **Memory Management**:
  - Added proper MutationObserver cleanup in `closeAlert()` method
  - Enhanced garbage collection for async components
  - Better resource management for slideshow event listeners

### 📚 Documentation Updates

- **Comprehensive Testing Guide**: Updated README with detailed test command documentation
  - Added `npm test`, `npm run test:unit`, `npm run test:e2e`, and `npm run test:all` command descriptions
  - Documented test requirements and browser dependencies
  - Added CI/CD environment guidance for headless testing

### 🔄 API Consistency

- **Standardized Method Access**: Improved consistency in internal API usage
  - Unified usage of `.jAlert()` method for accessing plugin instances
  - Enhanced method chaining reliability
  - Better encapsulation of internal plugin data

### 🧪 Testing Enhancements

- **Improved Test Reliability**: Enhanced test stability across different environments
  - Better handling of async timing in browser automation
  - Improved test isolation and cleanup procedures
  - Enhanced visual regression test reliability

---

## [5.0.4] - 2025-06-27

### ✨ New Features

- **🔄 Dynamic Resize Functionality**: Added comprehensive modal resizing capabilities
  - `autoResize()` method to automatically resize modal to fit content
  - `resizeToFit()` alias method for content-based resizing
  - `resizeModal(width, height)` method for manual sizing
  - `autoResizeOnContentChange` option for automatic resizing when content changes
  - Global resize methods: `$.autoResize()`, `$.resizeToFit()`, `$.resizeModal(height)`
  - MutationObserver integration for detecting content changes
  - Comprehensive API documentation and interactive demos

- **📱 Enhanced Mobile/Tablet Support**: Improved button sizing and layout
  - Optimized button sizing for tablet devices (451px - 1024px viewport)
  - Better touch-friendly button padding and font sizes
  - Improved responsive layout for button containers
  - Enhanced user experience on touch devices

### 🔧 Technical Improvements

- **🛡️ Enhanced Error Handling**: Added defensive programming patterns
  - Robust guards in `animateAlert()` method to prevent undefined access errors
  - Improved error handling in `closeAlert()` method
  - Enhanced AJAX error handling with proper type checking
  - Better async scenario handling to prevent race conditions

- **🔗 API Consistency**: Standardized method access patterns
  - Consistent use of `.jAlert()` method instead of `.data('jAlert')` for API access
  - Better encapsulation and error prevention
  - Improved method chaining support

### 🐛 Bug Fixes

- **Async Safety**: Fixed `blurBackground` access errors in async scenarios
- **Test Reliability**: Improved test stability in JSDOM environment
- **AJAX Handling**: Enhanced error handling for AJAX content loading
- **Memory Management**: Better cleanup of MutationObserver instances

### 📚 Documentation

- **Comprehensive Resize Documentation**: Added detailed API documentation
  - Usage examples for all resize methods
  - Configuration options and parameters
  - Advanced usage patterns and best practices
  - Interactive demos with real-time content changes

- **Enhanced Examples**: Added interactive resize demonstrations
  - Manual resize demo with dynamic content changes
  - Auto-resize demo with MutationObserver integration
  - Real-time content transformation examples

### 🧪 Testing

- **Improved Test Coverage**: Enhanced unit tests for resize functionality
- **JSDOM Compatibility**: Fixed test compatibility issues with layout calculations
- **Async Test Handling**: Better handling of async scenarios in test environment
- **Defensive Test Patterns**: Added robust test patterns for edge cases

### 🔄 Breaking Changes

**None!** All changes maintain 100% backward compatibility.

---

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