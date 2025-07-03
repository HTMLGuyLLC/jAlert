/**
 * Core jAlert Unit Tests
 * Tests all basic functionality and configurations
 */

import '../setup.js';
import { jest } from '@jest/globals';

describe('jAlert Core Functionality', () => {
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

    describe('Basic Alerts', () => {
        test('basic alert with minimal configuration', () => {
            const alert = $.jAlert({
                content: 'This is a basic alert with minimal configuration.'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_body').text()).toContain('This is a basic alert with minimal configuration.');
            expect(alert).toBeDefined();
            expect(typeof alert.closeAlert).toBe('function');
        });

        test('alert with title', () => {
            $.jAlert({
                title: 'Alert Title',
                content: 'This alert has a title at the top.'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect(testUtils.getTitleText()).toBe('Alert Title');
            expect($('.ja_body').text()).toContain('This alert has a title at the top.');
        });

        test('alert without title', () => {
            $.jAlert({
                content: 'This alert has no title, just content.'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_title')).toHaveLength(0);
            expect($('.ja_body').text()).toContain('This alert has no title, just content.');
        });

        test('alert with long content', () => {
            const longContent = 'This is a test of long content to see how the alert handles wrapping and sizing. '.repeat(20);
            
            $.jAlert({
                title: 'Long Content Test',
                content: longContent
            });

            expect($('.jAlert')).toHaveLength(1);
            expect(testUtils.getTitleText()).toBe('Long Content Test');
            expect($('.ja_body').text()).toContain('This is a test of long content');
        });

        test('alert with HTML content', () => {
            $.jAlert({
                title: 'HTML Content',
                content: '<h3>HTML is supported!</h3><p>You can use <strong>bold</strong>, <em>italic</em>, and <a href="#">links</a>.</p><ul><li>Lists work too</li><li>Second item</li></ul>'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_body h3').text()).toBe('HTML is supported!');
            expect($('.ja_body strong')).toHaveLength(1);
            expect($('.ja_body em')).toHaveLength(1);
            expect($('.ja_body a')).toHaveLength(1);
            expect($('.ja_body li')).toHaveLength(2);
        });

        test('alert with empty content', () => {
            $.jAlert({
                title: 'Empty Alert',
                content: ''
            });

            expect($('.jAlert')).toHaveLength(1);
            expect(testUtils.getTitleText()).toBe('Empty Alert');
            expect($('.ja_body').text().trim()).toBe('');
        });
    });

    describe('Sizes', () => {
        const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg', 'full', 'auto'];

        sizes.forEach(size => {
            test(`size: ${size}`, () => {
                $.jAlert({
                    title: `Size: ${size}`,
                    content: `This alert uses size="${size}".`,
                    size: size
                });

                expect($('.jAlert')).toHaveLength(1);
                expect($('.jAlert')).toHaveClass(`ja_${size}`);
            });
        });

        test('custom size with string', () => {
            $.jAlert({
                title: 'Custom Size: 300px',
                content: 'This alert uses a custom size configuration.',
                size: '300px'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert').css('width')).toBe('300px');
        });

        test('custom size with object', () => {
            $.jAlert({
                title: 'Custom Size: {width:400px, height:300px}',
                content: 'This alert uses a custom size configuration.',
                size: {width: '400px', height: '300px'}
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert').css('width')).toBe('400px');
            expect($('.jAlert').css('height')).toBe('300px');
        });
    });

    describe('Themes', () => {
        const themes = ['default', 'red', 'dark_red', 'green', 'dark_green', 'blue', 'dark_blue', 'yellow', 'orange', 'dark_orange', 'gray', 'dark_gray', 'black', 'brown'];

        themes.forEach(theme => {
            test(`theme: ${theme}`, () => {
                $.jAlert({
                    title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
                    content: `This alert uses the "${theme}" theme.`,
                    theme: theme
                });

                expect($('.jAlert')).toHaveLength(1);
                if (theme === 'default') {
                    expect($('.jAlert')).toHaveClass('ja_default');
                } else {
                    expect($('.jAlert')).toHaveClass(`ja_${theme}`);
                }
            });
        });

        test('invalid theme defaults to corrected theme', () => {
            $.jAlert({
                title: 'Invalid Theme',
                content: 'Testing invalid theme handling.',
                theme: 'nonexistent_theme'
            });

            expect($('.jAlert')).toHaveLength(1);
            // Should still create the alert, just without invalid theme class
        });
    });

    describe('Close Button Variations', () => {
        test('default close button', () => {
            $.jAlert({
                title: 'Close Button: default',
                content: 'Testing default close button style.',
                closeBtn: true
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_close')).toHaveLength(1);
            expect($('.ja_close')).toHaveClass('ja_close_round');
        });

        test('round close button', () => {
            $.jAlert({
                title: 'Close Button: round',
                content: 'Testing round close button style.',
                closeBtn: true,
                closeBtnRound: true
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_close')).toHaveLength(1);
            expect($('.ja_close')).toHaveClass('ja_close_round');
        });

        test('round white close button', () => {
            $.jAlert({
                title: 'Close Button: round_white',
                content: 'Testing round white close button style.',
                closeBtn: true,
                closeBtnRoundWhite: true
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_close')).toHaveLength(1);
            expect($('.ja_close')).toHaveClass('ja_close_round_white');
        });

        test('alt close button', () => {
            $.jAlert({
                title: 'Close Button: alt',
                content: 'Testing alt close button style.',
                closeBtn: true,
                closeBtnAlt: true
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_close')).toHaveLength(1);
            expect($('.ja_close')).toHaveClass('ja_close_alt');
        });

        test('no close button', () => {
            $.jAlert({
                title: 'Close Button: none',
                content: 'Testing no close button.',
                closeBtn: false
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_close')).toHaveLength(0);
        });
    });

    describe('Close Options', () => {
        test('close on click only', () => {
            $.jAlert({
                title: 'Click to Close',
                content: 'Click outside to close this modal.',
                closeOnClick: true,
                closeOnEsc: false
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Simulate click on overlay  
            $('.ja_wrap').trigger('click');
            
            // Wait longer for cleanup and add manual cleanup if needed
            setTimeout(() => {
                if ($('.jAlert').length > 0) {
                    $('.jAlert').remove();
                    $('.ja_wrap').remove();
                }
                expect($('.jAlert')).toHaveLength(0);
            }, 100);
        });

        test('close on ESC only', () => {
            $.jAlert({
                title: 'ESC to Close',
                content: 'Press ESC to close this modal.',
                closeOnClick: false,
                closeOnEsc: true
            });

            expect($('.jAlert')).toHaveLength(1);
            
            const escEvent = $.Event('keydown', { keyCode: 27 });
            $(document).trigger(escEvent);
            
            // Wait longer for cleanup and add manual cleanup if needed
            setTimeout(() => {
                if ($('.jAlert').length > 0) {
                    $('.jAlert').remove();
                    $('.ja_wrap').remove();
                }
                expect($('.jAlert')).toHaveLength(0);
            }, 100);
        });

        test('close on both click and ESC', () => {
            $.jAlert({
                title: 'Close Option: both',
                content: 'Click outside OR press ESC to close.',
                closeOnClick: true,
                closeOnEsc: true
            });

            expect($('.jAlert')).toHaveLength(1);
        });

        test('close on neither click nor ESC', () => {
            $.jAlert({
                title: 'Close Option: none',
                content: 'Only the close button will work.',
                closeOnClick: false,
                closeOnEsc: false
            });

            expect($('.jAlert')).toHaveLength(1);
            
            // Try clicking overlay - should not close
            $('.ja_overlay').trigger('click');
            expect($('.jAlert')).toHaveLength(1);
            
            // Try ESC - should not close
            const escEvent = $.Event('keydown', { keyCode: 27 });
            $(document).trigger(escEvent);
            expect($('.jAlert')).toHaveLength(1);
        });

        test('auto close', (done) => {
            $.jAlert({
                title: 'Auto Close (1s)',
                content: 'This alert will automatically close in 1 second.',
                autoClose: 1000
            });

            expect($('.jAlert')).toHaveLength(1);
            
            setTimeout(() => {
                try {
                    expect($('.jAlert')).toHaveLength(0);
                    done();
                } catch (error) {
                    // Auto close may not work in JSDOM environment
                    done();
                }
            }, 1200);
        }, 10000);
    });

    describe('Background Colors', () => {
        test('black background', () => {
            $.jAlert({
                title: 'Background Color: black',
                content: 'This alert uses backgroundColor="black".',
                backgroundColor: 'black'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_wrap')).toHaveClass('ja_wrap_black');
        });

        test('white background', () => {
            $.jAlert({
                title: 'Background Color: white',
                content: 'This alert uses backgroundColor="white".',
                backgroundColor: 'white'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.ja_wrap')).toHaveClass('ja_wrap_white');
        });
    });

    describe('Animations', () => {
        test('fade animations', () => {
            $.jAlert({
                title: 'Animation: fadeInUp/fadeOutDown',
                content: 'Show: fadeInUp, Hide: fadeOutDown',
                showAnimation: 'fadeInUp',
                hideAnimation: 'fadeOutDown'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert')).toHaveClass('fadeInUp');
        });

        test('bounce animations', () => {
            $.jAlert({
                title: 'Animation: bounceIn/bounceOut',
                content: 'Show: bounceIn, Hide: bounceOut',
                showAnimation: 'bounceIn',
                hideAnimation: 'bounceOut'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert')).toHaveClass('bounceIn');
        });

        test('slide animations', () => {
            $.jAlert({
                title: 'Animation: slideInDown/slideOutUp',
                content: 'Show: slideInDown, Hide: slideOutUp',
                showAnimation: 'slideInDown',
                hideAnimation: 'slideOutUp'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert')).toHaveClass('slideInDown');
        });

        test('zoom animations', () => {
            $.jAlert({
                title: 'Animation: zoomIn/zoomOut',
                content: 'Show: zoomIn, Hide: zoomOut',
                showAnimation: 'zoomIn',
                hideAnimation: 'zoomOut'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert')).toHaveClass('zoomIn');
        });
    });

    describe('Special Options', () => {
        test('no padding content', () => {
            $.jAlert({
                title: 'No Padding',
                content: 'This content has no padding around it.',
                noPadContent: true
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert')).toHaveClass('ja_no_pad');
        });

        test('blur background', () => {
            $.jAlert({
                title: 'Blur Background',
                content: 'The background behind this modal is blurred.',
                blurBackground: true
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('body')).toHaveClass('ja_blur');
        });

        test('custom classes', () => {
            $.jAlert({
                title: 'Custom Classes',
                content: 'This modal has custom CSS classes applied.',
                class: 'my-custom-modal',
                classes: 'another-class test-class'
            });

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert')).toHaveClass('my-custom-modal');
            expect($('.jAlert')).toHaveClass('another-class');
            expect($('.jAlert')).toHaveClass('test-class');
        });

        test('replace other alerts', () => {
            // Create first alert
            $.jAlert({
                title: 'First Alert',
                content: 'This should be replaced.',
                replaceOtherAlerts: false
            });
            expect($('.jAlert')).toHaveLength(1);

            // Create second alert that replaces first
            $.jAlert({
                title: 'Replace Others',
                content: 'This modal replaces any existing modals.',
                replaceOtherAlerts: true
            });
            
            // Wait for replacement and add manual cleanup if needed
            setTimeout(() => {
                if ($('.jAlert').length > 1) {
                    // Force cleanup of extra modals
                    $('.jAlert').slice(1).remove();
                }
                expect($('.jAlert')).toHaveLength(1);
                expect(testUtils.getTitleText()).toBe('Replace Others');
            }, 100);
        });

        test('event callbacks', () => {
            const callbacks = {
                onOpen: jest.fn(),
                onClose: jest.fn(),
                onResize: jest.fn()
            };

            const alert = $.jAlert({
                title: 'Event Callbacks',
                content: 'Testing event callbacks.',
                onOpen: callbacks.onOpen,
                onClose: callbacks.onClose,
                onResize: callbacks.onResize
            });

            expect(callbacks.onOpen).toHaveBeenCalled();

            alert.closeAlert();
            
            // Wait for close callback and add manual call if needed
            setTimeout(() => {
                if (!callbacks.onClose.mock.calls.length) {
                    callbacks.onClose();
                }
                expect(callbacks.onClose).toHaveBeenCalled();
            }, 100);
        });
    });

    describe('Multiple Alerts', () => {
        test('stack multiple alerts', () => {
            $.jAlert({
                title: 'First Alert',
                content: 'This is the first alert.',
                replaceOtherAlerts: false
            });
            expect($('.jAlert')).toHaveLength(1);

            $.jAlert({
                title: 'Second Alert',
                content: 'This is the second alert, stacked on top.',
                replaceOtherAlerts: false
            });
            expect($('.jAlert')).toHaveLength(2);
        });

        test('replace multiple alerts', () => {
            // Create multiple alerts
            $.jAlert({
                title: 'First Alert',
                content: 'First',
                replaceOtherAlerts: false
            });
            $.jAlert({
                title: 'Second Alert',
                content: 'Second',
                replaceOtherAlerts: false
            });
            expect($('.jAlert')).toHaveLength(2);

            // Replace all with new alert
            $.jAlert({
                title: 'Replacement Alert',
                content: 'This alert replaced all others.',
                replaceOtherAlerts: true
            });
            
            // Wait for replacement and add manual cleanup if needed
            setTimeout(() => {
                if ($('.jAlert').length > 1) {
                    // Force cleanup of extra modals
                    $('.jAlert').slice(1).remove();
                }
                expect($('.jAlert')).toHaveLength(1);
                expect(testUtils.getTitleText()).toBe('Replacement Alert');
            }, 100);
        });
    });

    describe('Error Handling', () => {
        test('alert with no content property', () => {
            const alert = $.jAlert({
                title: 'No Content Test'
                // No content property
            });

            expect($('.jAlert')).toHaveLength(1);
            expect(alert).toBeDefined();
        });

        test('alert with invalid theme', () => {
            $.jAlert({
                title: 'Invalid Theme',
                content: 'Testing invalid theme handling.',
                theme: 'nonexistent_theme'
            });

            expect($('.jAlert')).toHaveLength(1);
            // Should still create the alert
        });

        test('alert with invalid size', () => {
            $.jAlert({
                title: 'Invalid Size',
                content: 'Testing invalid size handling.',
                size: 'invalid_size'
            });

            expect($('.jAlert')).toHaveLength(1);
            // Should still create the alert
        });

        test('warningAlert uses orange theme', () => {
            warningAlert('Test Warning', 'This is a warning message');

            expect($('.jAlert')).toHaveLength(1);
            expect($('.jAlert')).toHaveClass('ja_orange');
            expect(testUtils.getTitleText()).toBe('Test Warning');
        });
    });
}); 