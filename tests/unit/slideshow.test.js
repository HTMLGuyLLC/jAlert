describe('jAlert Slideshow Functionality', () => {
    beforeEach(() => {
        testUtils.cleanupAlerts();
    });

    const testImages = [
        'https://via.placeholder.com/300x200/ff0000/ffffff?text=Slide+1',
        'https://via.placeholder.com/300x200/00ff00/ffffff?text=Slide+2',
        'https://via.placeholder.com/300x200/0000ff/ffffff?text=Slide+3'
    ];

    describe('Basic Slideshow', () => {
        test('should create slideshow with array of images', async () => {
            $.jAlert({
                slideshow: testImages
            });

            const alert = await testUtils.waitForElement('.jAlert');
            expect(alert.find('.ja_slideshow_wrap').length).toBe(1);
            expect(alert.find('.ja_slideshow_container').length).toBe(1);
            expect(alert.find('.ja_slideshow_slide').length).toBe(1);
        });

        test('should show first slide by default', async () => {
            $.jAlert({
                slideshow: testImages
            });

            const alert = await testUtils.waitForElement('.jAlert');
            const img = alert.find('.ja_slideshow_img');
            expect(img.length).toBe(1);
            expect(img.attr('src')).toBe(testImages[0]);
        });

        test('should show navigation arrows by default', async () => {
            $.jAlert({
                slideshow: testImages
            });

            const alert = await testUtils.waitForElement('.jAlert');
            expect(alert.find('.ja_slideshow_prev').length).toBe(1);
            expect(alert.find('.ja_slideshow_next').length).toBe(1);
        });

        test('should show counter by default', async () => {
            $.jAlert({
                slideshow: testImages
            });

            const alert = await testUtils.waitForElement('.jAlert');
            expect(alert.find('.ja_slideshow_counter').length).toBe(1);
            expect(alert.find('.ja_slideshow_counter').text()).toBe('1 / 3');
        });
    });

    describe('Navigation Controls', () => {
        test('should navigate to next slide', async () => {
            $.jAlert({
                slideshow: testImages
            });

            const alert = await testUtils.waitForElement('.jAlert');
            alert.find('.ja_slideshow_next').click();
            
            // Wait for slide change
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const img = alert.find('.ja_slideshow_img');
            expect(img.attr('src')).toBe(testImages[1]);
            expect(alert.find('.ja_slideshow_counter').text()).toBe('2 / 3');
        });

        test('should navigate to previous slide', async () => {
            $.jAlert({
                slideshow: testImages
            });

            const alert = await testUtils.waitForElement('.jAlert');
            
            // Go to second slide first
            alert.find('.ja_slideshow_next').click();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Then go back
            alert.find('.ja_slideshow_prev').click();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const img = alert.find('.ja_slideshow_img');
            expect(img.attr('src')).toBe(testImages[0]);
            expect(alert.find('.ja_slideshow_counter').text()).toBe('1 / 3');
        });

        test('should loop to first slide when reaching end', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    loop: true
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            
            // Navigate to last slide
            alert.find('.ja_slideshow_next').click();
            await new Promise(resolve => setTimeout(resolve, 100));
            alert.find('.ja_slideshow_next').click();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Navigate to next (should loop to first)
            alert.find('.ja_slideshow_next').click();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const img = alert.find('.ja_slideshow_img');
            expect(img.attr('src')).toBe(testImages[0]);
            expect(alert.find('.ja_slideshow_counter').text()).toBe('1 / 3');
        });

        test('should loop to last slide when going back from first', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    loop: true
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            
            // Go back from first slide (should loop to last)
            alert.find('.ja_slideshow_prev').click();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const img = alert.find('.ja_slideshow_img');
            expect(img.attr('src')).toBe(testImages[2]);
            expect(alert.find('.ja_slideshow_counter').text()).toBe('3 / 3');
        });

        test('should not loop when loop is disabled', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    loop: false
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            
            // Navigate to last slide
            alert.find('.ja_slideshow_next').click();
            await new Promise(resolve => setTimeout(resolve, 100));
            alert.find('.ja_slideshow_next').click();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Try to navigate to next (should stay on last)
            alert.find('.ja_slideshow_next').click();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const img = alert.find('.ja_slideshow_img');
            expect(img.attr('src')).toBe(testImages[2]);
            expect(alert.find('.ja_slideshow_counter').text()).toBe('3 / 3');
        });
    });

    describe('Keyboard Navigation', () => {
        test('should navigate with arrow keys when enabled', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    keyboardNav: true
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            
            // Right arrow
            testUtils.triggerKeyEvent(39);
            await new Promise(resolve => setTimeout(resolve, 100));
            
            let img = alert.find('.ja_slideshow_img');
            expect(img.attr('src')).toBe(testImages[1]);
            
            // Left arrow
            testUtils.triggerKeyEvent(37);
            await new Promise(resolve => setTimeout(resolve, 100));
            
            img = alert.find('.ja_slideshow_img');
            expect(img.attr('src')).toBe(testImages[0]);
        });

        test('should not navigate with arrow keys when disabled', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    keyboardNav: false
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            
            // Right arrow
            testUtils.triggerKeyEvent(39);
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const img = alert.find('.ja_slideshow_img');
            expect(img.attr('src')).toBe(testImages[0]);
        });
    });

    describe('Auto Advance', () => {
        test('should auto advance when enabled', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    autoAdvance: true,
                    autoAdvanceInterval: 100
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            
            // Wait for auto advance
            await new Promise(resolve => setTimeout(resolve, 150));
            
            const img = alert.find('.ja_slideshow_img');
            expect(img.attr('src')).toBe(testImages[1]);
        });

        test('should pause auto advance on hover when enabled', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    autoAdvance: true,
                    autoAdvanceInterval: 100,
                    pauseOnHover: true
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            const container = alert.find('.ja_slideshow_container');
            
            // Hover to pause
            container.trigger('mouseenter');
            
            // Wait longer than interval
            await new Promise(resolve => setTimeout(resolve, 150));
            
            let img = alert.find('.ja_slideshow_img');
            // Should still be on first image due to hover pause
            expect(img.attr('src')).toBe(testImages[0]);
            
            // Unhover to resume
            container.trigger('mouseleave');
            
            // Wait for auto advance
            await new Promise(resolve => setTimeout(resolve, 150));
            
            img = alert.find('.ja_slideshow_img');
            // Should now be on second image
            expect(img.attr('src')).toBe(testImages[1]);
        });
    });

    describe('Dots Navigation', () => {
        test('should show dots when enabled', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    showCounter: 'dots'
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            expect(alert.find('.ja_slideshow_dots').length).toBe(1);
            expect(alert.find('.ja_slideshow_dot').length).toBe(3);
            expect(alert.find('.ja_slideshow_counter').length).toBe(0);
        });

        test('should navigate to specific slide when dot is clicked', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    showCounter: 'dots'
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            
            // Click on third dot
            alert.find('.ja_slideshow_dot[data-slide="2"]').click();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const img = alert.find('.ja_slideshow_img');
            expect(img.attr('src')).toBe(testImages[2]);
        });

        test('should highlight active dot', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    showCounter: 'dots'
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            
            // First dot should be active
            expect(alert.find('.ja_slideshow_dot[data-slide="0"]').hasClass('active')).toBe(true);
            
            // Click on second dot
            alert.find('.ja_slideshow_dot[data-slide="1"]').click();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Second dot should be active
            expect(alert.find('.ja_slideshow_dot[data-slide="1"]').hasClass('active')).toBe(true);
            expect(alert.find('.ja_slideshow_dot[data-slide="0"]').hasClass('active')).toBe(false);
        });
    });

    describe('Control Visibility', () => {
        test('should hide arrows when disabled', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    showArrows: false
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            expect(alert.find('.ja_slideshow_arrow').length).toBe(0);
        });

        test('should hide counter when disabled', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    showCounter: false
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            expect(alert.find('.ja_slideshow_counter').length).toBe(0);
            expect(alert.find('.ja_slideshow_dots').length).toBe(0);
        });
    });

    describe('Options Merging', () => {
        test('should merge slideshow options with defaults', async () => {
            $.jAlert({
                slideshow: testImages,
                slideshowOptions: {
                    autoAdvance: true,
                    autoAdvanceInterval: 500
                }
            });

            const alert = await testUtils.waitForElement('.jAlert');
            const jAlertInstance = alert.data('jAlert');
            
            // Should have merged options
            expect(jAlertInstance.slideshowOptions.loop).toBe(true); // default
            expect(jAlertInstance.slideshowOptions.autoAdvance).toBe(true); // custom
            expect(jAlertInstance.slideshowOptions.autoAdvanceInterval).toBe(500); // custom
        });
    });
}); 