# jAlert Test Suite

This directory contains the comprehensive test suite for jAlert, ensuring all functionality works correctly across different environments and scenarios.

## Test Structure

```
tests/
├── setup.js                 # Jest setup file with global utilities
├── unit/                    # Unit tests for individual components
│   ├── core.test.js        # Core jAlert functionality tests
│   └── slideshow.test.js   # Slideshow-specific tests
├── e2e/                     # End-to-end tests using Puppeteer
│   └── integration.test.js # Full integration tests
├── visual/                  # Visual regression tests
│   ├── regression.test.js  # UI consistency tests
│   └── screenshots/        # Generated screenshots
└── README.md               # This file
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### End-to-End Tests Only
```bash
npm run test:e2e
```

### Visual Regression Tests Only
```bash
npm run test:visual
```

### With Coverage
```bash
npm run test:coverage
```

### Watch Mode (for development)
```bash
npm run test:watch
```

## Test Categories

### Unit Tests (`tests/unit/`)
- **Core Functionality**: Basic alert creation, closing, themes, sizes
- **Slideshow Features**: Navigation, looping, keyboard controls, auto-advance
- **Media Handling**: Images, videos, iframes, AJAX content
- **Utility Functions**: Current alert, attachment, programmatic control

### End-to-End Tests (`tests/e2e/`)
- **Real Browser Testing**: Uses Puppeteer for actual browser interaction
- **User Interactions**: Clicking, keyboard navigation, responsive behavior
- **Cross-Browser Compatibility**: Tests work across different viewport sizes
- **Integration Scenarios**: Complete user workflows

### Visual Regression Tests (`tests/visual/`)
- **UI Consistency**: Screenshots to detect visual changes
- **Responsive Design**: Tests on mobile, tablet, and desktop viewports
- **Animation States**: Captures animated elements
- **Theme Variations**: Different alert styles and configurations

## Test Utilities

The `tests/setup.js` file provides global utilities:

- `testUtils.waitForElement()`: Wait for element to be visible
- `testUtils.waitForElementHidden()`: Wait for element to be hidden
- `testUtils.triggerKeyEvent()`: Simulate keyboard events
- `testUtils.cleanupAlerts()`: Clean up all alerts after tests

## Coverage

The test suite aims for comprehensive coverage of:

- ✅ Core alert functionality
- ✅ Slideshow features
- ✅ Media handling (images, videos, iframes)
- ✅ Theme and styling options
- ✅ Responsive behavior
- ✅ Keyboard navigation
- ✅ Animation and effects
- ✅ Button interactions
- ✅ Auto-close functionality
- ✅ Options merging and defaults

## Continuous Integration

The test suite is designed to run in CI environments:

- Headless browser testing with Puppeteer
- No external dependencies for unit tests
- Fast execution for quick feedback
- Coverage reporting for quality metrics

## Adding New Tests

### Unit Tests
1. Create test file in `tests/unit/`
2. Use Jest's `describe()` and `test()` functions
3. Import and test specific functionality
4. Use `testUtils` helpers for common operations

### E2E Tests
1. Create test file in `tests/e2e/`
2. Use Puppeteer for browser automation
3. Test complete user workflows
4. Include responsive design tests

### Visual Tests
1. Create test file in `tests/visual/`
2. Take screenshots of UI states
3. Compare against baseline images
4. Test across different viewport sizes

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up after tests
3. **Async Handling**: Properly handle asynchronous operations
4. **Descriptive Names**: Use clear test descriptions
5. **Coverage**: Aim for high test coverage
6. **Performance**: Keep tests fast and efficient

## Troubleshooting

### Common Issues

1. **Tests failing in CI**: Ensure headless mode is enabled
2. **Image loading issues**: Use reliable placeholder images
3. **Timing issues**: Add appropriate waits for animations
4. **Browser compatibility**: Test across different browsers

### Debug Mode

For debugging, you can run tests with additional logging:

```bash
DEBUG=puppeteer npm run test:e2e
```

Or run Jest in verbose mode:

```bash
npm test -- --verbose
``` 