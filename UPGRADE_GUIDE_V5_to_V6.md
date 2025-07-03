# Upgrade Guide - jAlert 6.0.0

This guide will help you upgrade from jAlert 5.0.5 to jAlert 6.0.0.

## ⚠️ Important: Breaking Changes Ahead!

**Warning Theme Change:**
- The `warningAlert` shortcut now uses the new orange theme for warnings. If you want the old yellow warning, use `theme: 'yellow'` instead.

**jAlert 6.0.0 introduces significant new features and some breaking changes.** This is a major version update with substantial improvements to video support, slideshow functionality, and overall architecture.

## Quick Upgrade

### Option 1: NPM (Recommended)

```bash
# If you're using npm
npm install jalert@6.0.0

# If you're using yarn
yarn add jalert@6.0.0
```

### Option 2: Manual Download

1. Download the latest release from [GitHub](https://github.com/HTMLGuyLLC/jAlert/releases)
2. Replace your existing `jAlert.min.js` and `jAlert.min.css` files
3. Update your code according to the breaking changes below

## 🔄 Breaking Changes

### 1. Default Size Behavior

**Old (5.0.5):** Modals defaulted to various sizes based on content
**New (6.0.0):** Media modals (images, videos, slideshows) default to `size: 'auto'`

**Migration:**
```javascript
// If you relied on default sizing, explicitly set size
$.jAlert({
    image: 'photo.jpg',
    size: 'lg' // Explicitly set desired size
});
```

### 2. Default Padding Behavior

**Old (5.0.5):** `noPadContent: false` (padding around content)
**New (6.0.0):** `noPadContent: true` (no padding around content)

**Migration:**
```javascript
// If you want padding, explicitly set it
$.jAlert({
    content: 'My content',
    noPadContent: false // Explicitly enable padding
});
```

### 3. Theme Validation

**Old (5.0.5):** Invalid themes returned `false`
**New (6.0.0):** Invalid themes return `'default'`

**Migration:**
```javascript
// Check for 'default' instead of false
const theme = $.jAlert({ theme: 'invalid' });
if (theme === 'default') {
    // Handle invalid theme
}
```

## ✨ New Features

### 1. Complete Slideshow System

**New slideshow functionality:**
```javascript
$.jAlert({
    slideshow: [
        'image1.jpg',
        'image2.jpg',
        'image3.jpg'
    ],
    slideshowOptions: {
        showArrows: true,
        showCounter: 'dots',
        showThumbnails: true,
        thumbnailLocation: 'bottom',
        autoAdvance: true,
        autoAdvanceInterval: 3000,
        keyboardNav: true,
        loop: true,
        pauseOnHover: true,
        imageSize: 'contain' // or 'cover'
    }
});
```

### 2. Video Slideshows

**Mix images and videos in slideshows:**
```javascript
$.jAlert({
    slideshow: [
        'image1.jpg',
        {
            src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            embedType: 'iframe'
        },
        {
            src: 'video.mp4',
            embedType: 'html5'
        }
    ]
});
```

### 3. Enhanced Video Support

**HTML5 video with full configuration:**
```javascript
$.jAlert({
    video: {
        src: 'video.mp4',
        embedType: 'html5',
        controls: true,      // Show video controls
        autoplay: true,      // Auto-play video (requires muted on some browsers)
        muted: true,         // Start muted (required for autoplay)
        loop: true,          // Loop video playback
    }
});
```

**YouTube/Vimeo with enhanced processing:**
```javascript
$.jAlert({
    video: {
        src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // will be automatically converted to the embed url
        embedType: 'iframe',
        autoplay: true,      // Auto-play when modal opens
        muted: true,         // Start muted (required for autoplay)
        controls: true,      // Show player controls
        loop: true           // Loop video playback
    }
});
```

**All video options available:**
- `src` - Video URL (required)
- `embedType` - 'html5' or 'iframe' (auto-detected if not specified)
- `controls` - Show video controls (default: true)
- `autoplay` - Auto-play video (default: false)
- `muted` - Start muted (default: false, required for autoplay)
- `loop` - Loop video playback (default: false)
- `maxWidth` - Maximum responsive width (default: '800px')
- `maxHeight` - Maximum responsive height (default: '450px')

### 4. Advanced Callbacks

**New slideshow callbacks:**
```javascript
$.jAlert({
    slideshow: ['image1.jpg', 'image2.jpg'],
    onSlideChange: function(currentIndex, totalSlides) {
        console.log(`Slide ${currentIndex + 1} of ${totalSlides}`);
    },
    onBeforeSlideChange: function(fromIndex, toIndex) {
        console.log(`Changing from slide ${fromIndex + 1} to ${toIndex + 1}`);
    },
    onSlideshowEnd: function() {
        console.log('Slideshow ended');
    },
    onSlideshowLoop: function() {
        console.log('Slideshow looped');
    }
});
```

## 🔧 Technical Improvements

### 1. Performance Enhancements
- Optimized slideshow rendering
- Better memory management with comprehensive cleanup
- Improved video loading and error handling

### 2. Mobile Support
- Touch-friendly controls
- Responsive layouts
- Swipe gestures for slideshows

### 3. Accessibility
- Enhanced ARIA attributes
- Better keyboard navigation
- Screen reader support

## 📚 API Reference Updates

### New Options

**Slideshow Options:**
- `slideshow` - Array of images/videos
- `slideshowOptions` - Configuration object
- `onSlideChange` - Callback when slide changes
- `onBeforeSlideChange` - Callback before slide change
- `onSlideshowEnd` - Callback when slideshow ends
- `onSlideshowLoop` - Callback when slideshow loops

## 🧪 Testing Your Upgrade

### 1. Test Video Functionality

```javascript
// Test HTML5 video (string format - backwards compatible)
$.jAlert({
    video: 'test.mp4'
});

// Test HTML5 video (object format - enhanced options)
$.jAlert({
    video: {
        src: 'test.mp4',
        embedType: 'html5',
        controls: true,
        autoplay: true,
        muted: true,
        loop: true,
        preload: 'auto'
    }
});

// Test YouTube video (string format - backwards compatible)
$.jAlert({
    video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
});

// Test YouTube video (object format - enhanced options)
$.jAlert({
    video: {
        src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        embedType: 'iframe',
        autoplay: true,
        muted: true,
        controls: true,
        loop: true
    }
});
```

### 2. Test Slideshow Functionality

```javascript
$.jAlert({
    slideshow: [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2',
        'https://picsum.photos/800/600?random=3'
    ],
    slideshowOptions: {
        showArrows: true,
        showCounter: 'dots'
    }
});
```

### 3. Test Default Behavior Changes

```javascript
// Test new default padding behavior
$.jAlert({
    content: 'This should have no padding by default'
});

// Test new default size behavior
$.jAlert({
    image: 'large-image.jpg' // Should default to 'auto' size
});
```

## 🐛 Common Migration Issues

### 1. Video Not Displaying

**Problem:** Video doesn't show after upgrade
**Solution:** String format still works, but object format is recommended for enhanced options

```javascript
// Still works (backwards compatible)
$.jAlert({ video: 'video.mp4' });

// Recommended (enhanced options)
$.jAlert({ 
    video: { 
        src: 'video.mp4',
        embedType: 'html5'
    } 
});
```

### 2. Video Sizing Issues

**Problem:** Videos appear too large or small
**Solution:** Use `maxWidth` and `maxHeight` with `size`: `auto` or undefined (`auto` is default)

```javascript
// Too small
$.jAlert({
    video: {
        src: 'video.mp4',
        size: 'xsm',
    }
});

// Just right, and responsive
$.jAlert({
    video: {
        src: 'video.mp4',
        embedType: 'html5',
        maxWidth: '640px', // set to the true native width of the video and it'll shrink to fit the viewport based on the calculated ratio
        maxHeight: '360px' // set to the true native height of the video and it'll shrink to fit the viewport based on the calculated ratio
    }
});
```

### 3. Padding Issues

**Problem:** Content appears without expected padding
**Solution:** Explicitly set `noPadContent: false` if you want padding

```javascript
$.jAlert({
    content: 'My content',
    noPadContent: false // Explicitly enable padding
});
```

## 📋 Migration Checklist

- [ ] Consider updating video configurations to use object format (optional - string format still works)
- [ ] Add `embedType` property to video configurations if you want explicit control (optional - auto-detection works)
- [ ] Explicitly set `size` for media modals if relying on old default behavior
- [ ] Explicitly set `noPadContent: false` if you want padding around content
- [ ] Test all image functionality (if using)
- [ ] Test all iframe functionality (if using)
- [ ] Test all video functionality (if using)
- [ ] Test slideshow functionality (if using)
- [ ] Test responsive behavior on mobile devices
- [ ] Update documentation references

## 🆘 Getting Help

- Check the [documentation](https://htmlguyllc.github.io/jAlert/)
- Review the [changelog](CHANGELOG.md)
- Open an issue on [GitHub](https://github.com/HTMLGuyLLC/jAlert/issues)

## 🎉 What's New in 6.0.0

- **Complete slideshow system** with advanced navigation
- **Enhanced video support** for HTML5 and iframe videos
- **Responsive video sizing** with consistent behavior
- **Mobile-friendly controls** with touch support
- **Advanced callbacks** for slideshow events
- **Better accessibility** with ARIA attributes
- **Improved performance** with optimized rendering
- **Comprehensive error handling** for robust operation 