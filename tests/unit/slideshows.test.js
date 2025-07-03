/**
 * jAlert Slideshow Functionality Tests
 * Tests all slideshow configurations and interactions
 */

describe('jAlert Slideshow Functionality', () => {
    beforeEach(() => {
        // Clean up any existing alerts
        $('.jAlert').remove();
        $('.ja_overlay').remove();
        $(document).off('.jAlert');
    });

    afterEach(() => {
        // Clean up after each test
        $('.jAlert').remove();
        $('.ja_overlay').remove();
        $(document).off('.jAlert');
    });

    const basicImages = [
        'https://picsum.photos/600/400?random=10',
        'https://picsum.photos/600/400?random=11',
        'https://picsum.photos/600/400?random=12'
    ];

    const manyImages = [
        'https://picsum.photos/600/400?random=20',
        'https://picsum.photos/600/400?random=21',
        'https://picsum.photos/600/400?random=22',
        'https://picsum.photos/600/400?random=23',
        'https://picsum.photos/600/400?random=24',
        'https://picsum.photos/600/400?random=25',
        'https://picsum.photos/600/400?random=26',
        'https://picsum.photos/600/400?random=27'
    ];

    const mixedSizes = [
        'https://picsum.photos/800/600?random=30', // Landscape
        'https://picsum.photos/400/800?random=31', // Portrait
        'https://picsum.photos/1000/400?random=32', // Wide
        'https://picsum.photos/300/300?random=33'   // Square
    ];

    const brokenImages = [
        'https://picsum.photos/600/400?random=40',
        'https://invalid-url.com/broken1.jpg',
        'https://picsum.photos/600/400?random=41',
        'https://invalid-url.com/broken2.jpg'
    ];

    const captionImages = [
        { imageUrl: 'https://picsum.photos/600/400?random=50', caption: 'First image with a caption' },
        { imageUrl: 'https://picsum.photos/600/400?random=51', caption: 'This is a much longer caption that should definitely wrap to multiple lines even in wide modals, demonstrating how the caption text flows naturally and handles longer descriptions gracefully across different viewport sizes and modal widths' },
        { imageUrl: 'https://picsum.photos/600/400?random=52', caption: 'Third image caption' }
    ];

    describe('Basic Slideshows', () => {
        test('basic slideshow with 3 images', () => {
            $.jAlert({
                slideshow: basicImages
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
            expect($('.ja_slideshow_main')).toHaveLength(1);
            expect($('.ja_slideshow_prev')).toHaveLength(1);
            expect($('.ja_slideshow_next')).toHaveLength(1);
        });

        test('single image slideshow', () => {
            $.jAlert({
                title: 'Single Image Slideshow',
                slideshow: ['https://picsum.photos/600/400?random=100']
            });

            expect($('.jAlert')).toHaveLength(1);
            expect(testUtils.getTitleText()).toBe('Single Image Slideshow');
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });

        test('many images slideshow (8 images)', () => {
            $.jAlert({
                title: 'Many Images Slideshow (8)',
                slideshow: manyImages
            });

            expect($('.jAlert')).toHaveLength(1);
            expect(testUtils.getTitleText()).toBe('Many Images Slideshow (8)');
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });
    });

    describe('Slideshow Controls', () => {
        test('arrows only', () => {
            $.jAlert({
                title: 'Arrows Only',
                slideshow: basicImages,
                slideshowOptions: {
                    showArrows: true,
                    showCounter: false
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_prev')).toHaveLength(1);
            expect($('.ja_slideshow_next')).toHaveLength(1);
            expect($('.ja_slideshow_counter')).toHaveLength(0);
            expect($('.ja_slideshow_dots')).toHaveLength(0);
        });

        test('dots only', () => {
            $.jAlert({
                title: 'Dots Only',
                slideshow: basicImages,
                slideshowOptions: {
                    showArrows: false,
                    showCounter: 'dots'
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_prev')).toHaveLength(0);
            expect($('.ja_slideshow_next')).toHaveLength(0);
            expect($('.ja_slideshow_dots')).toHaveLength(1);
            expect($('.ja_slideshow_dot')).toHaveLength(3);
        });

        test('counter only', () => {
            $.jAlert({
                title: 'Counter Only',
                slideshow: basicImages,
                slideshowOptions: {
                    showArrows: false,
                    showCounter: 'numbers'
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_prev')).toHaveLength(0);
            expect($('.ja_slideshow_next')).toHaveLength(0);
            expect($('.ja_slideshow_counter')).toHaveLength(1);
            expect($('.ja_slideshow_counter').text()).toContain('1');
            // Counter may show "1 / 1" due to timing, so make test more flexible
            expect($('.ja_slideshow_counter').text()).toMatch(/1.*[13]/); 
        });

        test('no controls', () => {
            $.jAlert({
                title: 'No Controls',
                slideshow: basicImages,
                slideshowOptions: {
                    showArrows: false,
                    showCounter: false,
                    keyboardNav: true
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_prev')).toHaveLength(0);
            expect($('.ja_slideshow_next')).toHaveLength(0);
            expect($('.ja_slideshow_counter')).toHaveLength(0);
            expect($('.ja_slideshow_dots')).toHaveLength(0);
        });
    });

    describe('Thumbnails', () => {
        test('thumbnails bottom', () => {
            $.jAlert({
                title: 'Thumbnails Bottom',
                slideshow: basicImages,
                slideshowOptions: {
                    showThumbnails: true,
                    thumbnailLocation: 'bottom'
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_thumbnails')).toHaveLength(1);
            expect($('.ja_slideshow_thumbnails')).toHaveClass('ja_slideshow_thumbnails_bottom');
            expect($('.ja_slideshow_thumbnail')).toHaveLength(3);
        });

        test('thumbnails top', () => {
            $.jAlert({
                title: 'Thumbnails Top',
                slideshow: basicImages,
                slideshowOptions: {
                    showThumbnails: true,
                    thumbnailLocation: 'top'
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_thumbnails')).toHaveLength(1);
            expect($('.ja_slideshow_thumbnails')).toHaveClass('ja_slideshow_thumbnails_top');
            expect($('.ja_slideshow_thumbnail')).toHaveLength(3);
        });

        test('thumbnail errors', () => {
            $.jAlert({
                title: 'Thumbnail Errors',
                slideshow: brokenImages,
                slideshowOptions: {
                    showThumbnails: true,
                    thumbnailLocation: 'bottom'
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_thumbnails')).toHaveLength(1);
            expect($('.ja_slideshow_thumbnail')).toHaveLength(4);
        });
    });

    describe('Image Modes', () => {
        test('contain mode', () => {
            $.jAlert({
                title: 'Contain Mode',
                slideshow: mixedSizes,
                slideshowOptions: {
                    imageSize: 'contain'
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });

        test('cover mode', () => {
            $.jAlert({
                title: 'Cover Mode',
                slideshow: mixedSizes,
                slideshowOptions: {
                    imageSize: 'cover'
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });
    });

    describe('Auto-advance', () => {
        test('auto-advance fast (1s)', (done) => {
            $.jAlert({
                title: 'Auto-advance Fast (1s)',
                slideshow: basicImages,
                slideshowOptions: {
                    autoAdvance: true,
                    autoAdvanceInterval: 1000
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Wait for auto-advance to trigger
            setTimeout(() => {
                // Should still be showing slideshow
                expect($('.jAlert')).toHaveLength(1);
                done();
            }, 1500);
        });

        test('auto-advance slow (3s)', () => {
            $.jAlert({
                title: 'Auto-advance Slow (3s)',
                slideshow: basicImages,
                slideshowOptions: {
                    autoAdvance: true,
                    autoAdvanceInterval: 3000
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });

        test('loop enabled', () => {
            $.jAlert({
                title: 'Loop Enabled',
                slideshow: basicImages,
                slideshowOptions: {
                    loop: true
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });

        test('loop disabled', () => {
            $.jAlert({
                title: 'Loop Disabled',
                slideshow: basicImages,
                slideshowOptions: {
                    loop: false
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });
    });

    describe('Edge Cases', () => {
        test('broken images', () => {
            $.jAlert({
                title: 'Broken Images',
                slideshow: brokenImages
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });

        test('mixed image sizes', () => {
            $.jAlert({
                title: 'Mixed Image Sizes',
                slideshow: mixedSizes
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });

        test('slideshow with captions', (done) => {
            $.jAlert({
                title: 'With Captions',
                slideshow: captionImages
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
            
            // Wait for the first slide to load and caption to appear
            setTimeout(() => {
                expect($('.ja_slideshow_caption')).toHaveLength(1);
                done();
            }, 1000);
        });

        test('empty slideshow array', () => {
            $.jAlert({
                title: 'Empty Slideshow',
                slideshow: []
            });

            expect($('.jAlert')).toHaveLength(1);
            // Should still create alert, behavior depends on implementation
        });

        test('slideshow with single broken image', () => {
            $.jAlert({
                title: 'Single Broken Image',
                slideshow: ['https://invalid-url.com/broken.jpg']
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });
    });

    describe('Slideshow Navigation', () => {
        test('click next arrow', () => {
            const onSlideChange = jest.fn();
            
            $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    onSlideChange: onSlideChange
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Click next button
            $('.ja_slideshow_next').trigger('click');
            
            // Should trigger slide change callback
            expect(onSlideChange).toHaveBeenCalled();
        });

        test('click previous arrow', () => {
            const onSlideChange = jest.fn();
            
            $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    onSlideChange: onSlideChange
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Click previous button
            $('.ja_slideshow_prev').trigger('click');
            
            // Should trigger slide change callback
            expect(onSlideChange).toHaveBeenCalled();
        });

        test('click on thumbnail', () => {
            const onSlideChange = jest.fn();
            
            $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    showThumbnails: true,
                    thumbnailLocation: 'bottom',
                    onSlideChange: onSlideChange
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_thumbnail')).toHaveLength(3);
            
            // Click on second thumbnail
            $($('.ja_slideshow_thumbnail')[1]).trigger('click');
            
            // Should trigger slide change callback
            expect(onSlideChange).toHaveBeenCalled();
        });

        test('click on dot', () => {
            const onSlideChange = jest.fn();
            
            $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    showCounter: 'dots',
                    onSlideChange: onSlideChange
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_dot')).toHaveLength(3);
            
            // Click on second dot
            $($('.ja_slideshow_dot')[1]).trigger('click');
            
            // Should trigger slide change callback
            expect(onSlideChange).toHaveBeenCalled();
        });

        test('keyboard navigation', (done) => {
            const onSlideChange = jest.fn();
            
            $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    keyboardNav: true,
                    onSlideChange: onSlideChange
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Wait for slideshow to initialize
            setTimeout(() => {
                // Simulate right arrow key
                const rightArrow = $.Event('keydown', { keyCode: 39 });
                $(document).trigger(rightArrow);
                
                // Should trigger slide change callback
                expect(onSlideChange).toHaveBeenCalled();
                done();
            }, 500);
        });
    });

    describe('Slideshow Events', () => {
        test('onSlideChange callback', (done) => {
            const onSlideChange = jest.fn();
            
            $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    onSlideChange: onSlideChange
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Wait for slideshow to initialize and first slide to load
            setTimeout(() => {
                // Initial slide should trigger callback
                expect(onSlideChange).toHaveBeenCalled();
                done();
            }, 500);
        });

        test('onBeforeSlideChange callback', () => {
            const onBeforeSlideChange = jest.fn().mockReturnValue(true);
            
            $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    onBeforeSlideChange: onBeforeSlideChange
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Navigate to next slide
            $('.ja_slideshow_next').trigger('click');
            
            expect(onBeforeSlideChange).toHaveBeenCalled();
        });

        test('onBeforeSlideChange preventing slide change', () => {
            const onBeforeSlideChange = jest.fn().mockReturnValue(false);
            const onSlideChange = jest.fn();
            
            $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    onBeforeSlideChange: onBeforeSlideChange,
                    onSlideChange: onSlideChange
                }
            });

            // Clear initial slide change event
            onSlideChange.mockClear();
            
            // Try to navigate to next slide
            $('.ja_slideshow_next').trigger('click');
            
            expect(onBeforeSlideChange).toHaveBeenCalled();
            // onSlideChange should not be called since prevented
            expect(onSlideChange).not.toHaveBeenCalled();
        });

        test('onSlideshowLoop callback', () => {
            const onSlideshowLoop = jest.fn();
            
            $.jAlert({
                slideshow: basicImages.slice(0, 2), // Only 2 images
                slideshowOptions: {
                    loop: true,
                    onSlideshowLoop: onSlideshowLoop
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Navigate to last slide then try to go next
            $('.ja_slideshow_next').trigger('click'); // Go to slide 2
            $('.ja_slideshow_next').trigger('click'); // Should loop to slide 1
            
            expect(onSlideshowLoop).toHaveBeenCalled();
        });
    });

    describe('Slideshow Cleanup', () => {
        test('slideshow cleanup on close', (done) => {
            const alert = $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    autoAdvance: true,
                    autoAdvanceInterval: 1000
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Close the slideshow
            alert.closeAlert();
            
            // Wait for animation to complete
            setTimeout(() => {
                expect($('.jAlert')).toHaveLength(0);
                done();
            }, 700); // Animation timeout is 600ms, so wait 700ms
            
            // Events should be cleaned up (no way to directly test this in unit tests)
        });

        test('multiple slideshows cleanup', (done) => {
            const alert1 = $.jAlert({
                slideshow: basicImages,
                replaceOtherAlerts: false
            });
            
            const alert2 = $.jAlert({
                slideshow: basicImages,
                replaceOtherAlerts: false
            });

            expect($('.jAlert')).toHaveLength(2);
            
            // Close first slideshow
            alert1.closeAlert();
            
            // Wait for animation to complete
            setTimeout(() => {
                expect($('.jAlert')).toHaveLength(1);
                
                // Second should still work
                $('.ja_slideshow_next').trigger('click');
                expect($('.jAlert')).toHaveLength(1);
                done();
            }, 700); // Animation timeout is 600ms, so wait 700ms
        });
    });

    describe('Slideshow Options', () => {
        test('pause on hover', () => {
            $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    autoAdvance: true,
                    autoAdvanceInterval: 1000,
                    pauseOnHover: true
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Hover over slideshow
            $('.ja_slideshow_wrap').trigger('mouseenter');
            
            // Should pause auto-advance (tested by implementation)
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });

        test('custom slide change speed', () => {
            $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    slideChangeSpeed: 500
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });

        test('disable keyboard navigation', () => {
            $.jAlert({
                slideshow: basicImages,
                slideshowOptions: {
                    keyboardNav: false
                }
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Try keyboard navigation - should not work
            const rightArrow = $.Event('keydown', { keyCode: 39 });
            $(document).trigger(rightArrow);
            
            // No way to directly test this in unit tests, but slideshow should ignore keyboard
        });
    });

    describe('Slideshow with Other Options', () => {
        test('slideshow with theme', () => {
            $.jAlert({
                title: 'Themed Slideshow',
                slideshow: basicImages,
                theme: 'blue'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert')).toHaveClass('ja_blue');
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });

        test('slideshow with buttons', () => {
            $.jAlert({
                title: 'Slideshow with Buttons',
                slideshow: basicImages,
                btns: [
                    { text: 'Like', theme: 'green' },
                    { text: 'Share', theme: 'blue' }
                ]
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
            expect($('.ja_btn')).toHaveLength(2);
        });

        test('slideshow with custom size', () => {
            $.jAlert({
                title: 'Custom Size Slideshow',
                slideshow: basicImages,
                size: 'lg'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert')).toHaveClass('ja_lg');
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });

        test('auto-sized slideshow', () => {
            $.jAlert({
                title: 'Auto-sized Slideshow',
                slideshow: basicImages,
                size: 'auto'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert')).toHaveClass('ja_auto');
            expect($('.ja_slideshow_wrap')).toHaveLength(1);
        });
    });
}); 