# Upgrade Guide - jAlert 5.0.0

This guide will help you upgrade from jAlert 4.x to jAlert 5.0.0.

## 🎉 Good News: No Breaking Changes!

**jAlert 5.0.0 maintains 100% backward compatibility with all existing APIs.** Your existing code will work without any modifications.

## Quick Upgrade

### Option 1: NPM (Recommended)

```bash
# If you're using npm
npm install jalert@5.0.0

# If you're using yarn
yarn add jalert@5.0.0
```

### Option 2: Manual Download

1. Download the latest release from [GitHub](https://github.com/HTMLGuyLLC/jAlert/releases)
2. Replace your existing `jAlert.min.js` and `jAlert.min.css` files
3. Update your HTML references if needed

## File Structure Changes

### Old Structure (4.x)
```
jAlert/
├── src/
│   ├── jAlert.js
│   ├── jAlert.min.js
│   ├── jAlert.css
│   └── jAlert.min.css
```

### New Structure (5.0.0)
```
jAlert/
├── src/          # Source files (development)
├── dist/         # Distribution files (production)
│   ├── jAlert.min.js
│   ├── jAlert.min.css
│   └── jAlert-functions.min.js
```

## HTML Updates

### Minimal Changes Required

If you're using the standard file structure, you may need to update your script references:

```html
<!-- Old (4.x) -->
<script src="src/jAlert.min.js"></script>
<link rel="stylesheet" href="src/jAlert.min.css">

<!-- New (5.0.0) -->
<script src="dist/jAlert.min.js"></script>
<link rel="stylesheet" href="dist/jAlert.min.css">
```

### jQuery Requirement

Ensure you're using jQuery 3.7.0 or later:

```html
<!-- Update jQuery if needed -->
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
```

## New Features You Can Use

### 1. Lightbox Slideshow

Add this to your existing code to create image slideshows:

```javascript
$.jAlert({
    slideshow: [
        'path/to/image1.jpg',
        'path/to/image2.jpg',
        'path/to/image3.jpg'
    ],
    slideshowOptions: {
        autoAdvance: true,
        showArrows: true,
        showCounter: 'dots'
    }
});
```

### 2. Enhanced Options

All existing options work the same, but you now have additional slideshow options:

```javascript
$.jAlert({
    // Your existing options work exactly the same
    title: 'My Alert',
    content: 'My content',
    theme: 'green',
    size: 'md',
    
    // New slideshow feature
    slideshow: ['image1.jpg', 'image2.jpg'],
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

## Browser Compatibility

### Improved Support

- **IE11+** (new ES5 compatibility)
- **Chrome 60+**
- **Firefox 55+**
- **Safari 12+**
- **Edge 79+**

The plugin is now transpiled to ES5, providing better compatibility with older browsers.

## Performance Improvements

- **Smaller bundle size** due to optimized builds
- **Faster loading** with modern build tools
- **Better caching** with optimized assets

## Testing Your Upgrade

### 1. Test Basic Functionality

```javascript
// Test basic alert (should work exactly the same)
$.jAlert({
    title: 'Upgrade Test',
    content: 'If you see this, the upgrade worked!',
    theme: 'green'
});
```

### 2. Test Your Existing Code

Run through your existing jAlert implementations to ensure they work as expected.

### 3. Test New Features (Optional)

Try the new slideshow feature:

```javascript
$.jAlert({
    slideshow: ['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2'],
    slideshowOptions: {
        showArrows: true,
        showCounter: 'numbers'
    }
});
```

## Troubleshooting

### Common Issues

1. **"jQuery is not defined"**
   - Ensure jQuery 3.7.0+ is loaded before jAlert
   - Check script loading order

2. **"jAlert is not defined"**
   - Verify the script path is correct
   - Check that the file was downloaded completely

3. **Styles not loading**
   - Ensure the CSS file is properly linked
   - Check the file path

### Getting Help

- Check the [documentation](https://htmlguyllc.github.io/jAlert/)
- Review the [changelog](CHANGELOG.md)
- Open an issue on [GitHub](https://github.com/HTMLGuyLLC/jAlert/issues)

## Migration Checklist

- [ ] Download jAlert 5.0.0
- [ ] Update file references in HTML
- [ ] Ensure jQuery 3.7.0+ is loaded
- [ ] Test existing functionality
- [ ] Test new slideshow feature (optional)
- [ ] Update documentation references
- [ ] Deploy to staging environment
- [ ] Test in production

## What's Next?

After upgrading, you can:

1. **Explore the new slideshow feature** for image galleries
2. **Review the enhanced documentation** for new options
3. **Consider using npm** for easier future updates
4. **Contribute to the project** with the new development workflow

## Support

If you encounter any issues during the upgrade:

1. Check this guide first
2. Review the [changelog](CHANGELOG.md)
3. Test with a minimal example
4. Open an issue on GitHub with details

---

**Happy upgrading! 🚀** 