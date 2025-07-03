import { jest } from '@jest/globals';
// Jest setup file for jAlert tests
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jquery from 'jquery';

// Make jest available globally
global.jest = jest;

// ESM-compatible __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up jQuery globally first
global.$ = global.jQuery = jquery;

// Ensure window and global are properly set up for UMD
if (typeof window !== 'undefined') {
    window.$ = window.jQuery = jquery;
    // Ensure setTimeout is available on window
    window.setTimeout = setTimeout;
    window.clearTimeout = clearTimeout;
    window.setInterval = setInterval;
    window.clearInterval = clearInterval;
}

// Create a context with proper globals
const context = {
    window: global,
    document: global.document,
    jQuery: jquery,
    $: jquery,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval
};

// Load jAlert CSS
const cssPath = path.join(__dirname, '../dist/jAlert.min.css');
if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf8');
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// Load jAlert JavaScript using a proper context
const jsPath = path.join(__dirname, '../dist/jAlert.min.js');
if (fs.existsSync(jsPath)) {
    const js = fs.readFileSync(jsPath, 'utf8');
    // Use Function constructor to create proper scope with all needed globals
    const loadScript = new Function('window', 'document', 'jQuery', '$', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', js);
    loadScript(context, global.document, jquery, jquery, setTimeout, clearTimeout, setInterval, clearInterval);
}

// Define shortcut functions directly in test environment
// Override the browser's alert and confirm to avoid JSDOM conflicts
if (typeof window !== 'undefined') {
    window.alert = () => {};
    window.confirm = () => {};
}

// Define shortcut functions manually for tests
global.alert = function(title, msg) {
    if (typeof msg === 'undefined') {
        msg = title;
        title = '';
    }
    $.jAlert({
        'title': title,
        'content': msg
    });
};

global.confirm = function(confirmCallback, denyCallback, confirmQuestion) {
    $.jAlert({
        'type': 'confirm', 
        'confirmQuestion': confirmQuestion, 
        'onConfirm': confirmCallback, 
        'onDeny': denyCallback 
    });
};

global.showAlert = function(title, msg, theme) {
    $.jAlert({
        'title': title,
        'content': msg,
        'theme': theme
    });
};

global.successAlert = function(title, msg) {
    if (typeof msg === 'undefined') {
        msg = title;
        title = 'Success';
    }
    global.showAlert(title, msg, 'green');
};

global.errorAlert = function(title, msg) {
    if (typeof msg === 'undefined') {
        msg = title;
        title = 'Error';
    }
    global.showAlert(title, msg, 'red');
};

global.infoAlert = function(title, msg) {
    if (typeof msg === 'undefined') {
        msg = title;
        title = 'Info';
    }
    global.showAlert(title, msg, 'blue');
};

global.warningAlert = function(title, msg) {
    if (typeof msg === 'undefined') {
        msg = title;
        title = 'Warning';
    }
    global.showAlert(title, msg, 'orange');
};

global.blackAlert = function(title, msg) {
    if (typeof msg === 'undefined') {
        msg = title;
        title = 'Warning';
    }
    global.showAlert(title, msg, 'black');
};

global.imageAlert = function(img, imgWidth) {
    if (typeof imgWidth === 'undefined') {
        imgWidth = 'auto';
    }
    $.jAlert({
        'image': img,
        'imageWidth': imgWidth
    });
};

global.videoAlert = function(video) {
    $.jAlert({
        'video': video
    });
};

global.iframeAlert = function(iframe, iframeHeight) {
    if (typeof iframeHeight === 'undefined') {
        iframeHeight = false;
    }
    $.jAlert({
        'iframe': iframe,
        'iframeHeight': iframeHeight
    });
};

global.ajaxAlert = function(url, onOpen) {
    if (typeof onOpen === 'undefined') {
        onOpen = function(alert) {
            return false;
        };
    }
    $.jAlert({
        'ajax': url,
        'onOpen': onOpen
    });
};

global.slideshowAlert = function(images, options) {
    if (typeof options === 'undefined') {
        options = {};
    }
    
    $.jAlert({
        'slideshow': images,
        'slideshowOptions': options
    });
};

// Ensure jAlert is available globally for tests
if (typeof window !== 'undefined' && $.jAlert) window.jAlert = $.jAlert;
if (typeof global !== 'undefined' && $.jAlert) global.jAlert = $.jAlert;

// Mock window methods
Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
});

// Mock document methods
Object.defineProperty(document.documentElement, 'clientWidth', {
    writable: true,
    configurable: true,
    value: 1024,
});

Object.defineProperty(document.documentElement, 'clientHeight', {
    writable: true,
    configurable: true,
    value: 768,
});

// Add custom matchers for DOM testing
expect.extend({
    toHaveClass(received, className) {
        const element = received.jquery ? received : $(received);
        const pass = element.hasClass(className);
        
        return {
            message: () => pass 
                ? `expected element not to have class "${className}"`
                : `expected element to have class "${className}"`,
            pass,
        };
    },
    
    toHaveLength(received, expectedLength) {
        const length = received.length !== undefined ? received.length : received.size;
        const pass = length === expectedLength;
        
        return {
            message: () => pass
                ? `expected length not to be ${expectedLength}`
                : `expected length to be ${expectedLength}, but received ${length}`,
            pass,
        };
    },
    
    toHaveBeenCalled(received) {
        if (!received.mock) {
            return {
                message: () => 'received value must be a mock or spy function',
                pass: false,
            };
        }
        
        const pass = received.mock.calls.length > 0;
        return {
            message: () => pass
                ? 'expected mock function not to have been called'
                : 'expected mock function to have been called',
            pass,
        };
    },
    
    toHaveBeenCalledTimes(received, expectedCalls) {
        if (!received.mock) {
            return {
                message: () => 'received value must be a mock or spy function',
                pass: false,
            };
        }
        
        const actualCalls = received.mock.calls.length;
        const pass = actualCalls === expectedCalls;
        return {
            message: () => pass
                ? `expected mock function not to have been called ${expectedCalls} times`
                : `expected mock function to have been called ${expectedCalls} times, but was called ${actualCalls} times`,
            pass,
        };
    },
    
    toHaveBeenCalledWith(received, ...expectedArgs) {
        if (!received.mock) {
            return {
                message: () => 'received value must be a mock or spy function',
                pass: false,
            };
        }
        
        const pass = received.mock.calls.some(call => 
            call.length === expectedArgs.length &&
            call.every((arg, index) => arg === expectedArgs[index])
        );
        
        return {
            message: () => pass
                ? `expected mock function not to have been called with ${expectedArgs}`
                : `expected mock function to have been called with ${expectedArgs}`,
            pass,
        };
    }
});

// Global test utilities
global.testUtils = {
    // Wait for element to be visible
    waitForElement: (selector, timeout = 1000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const element = $(selector);
                if (element.length > 0) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(check, 10);
                }
            };
            check();
        });
    },

    // Wait for element to be hidden
    waitForElementHidden: (selector, timeout = 1000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const element = $(selector);
                if (element.length === 0) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} still present after ${timeout}ms`));
                } else {
                    setTimeout(check, 10);
                }
            };
            check();
        });
    },

    // Wait for content to be set (for timing issues)
    waitForContent: (selector, expectedContent, timeout = 1000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const element = $(selector);
                if (element.length > 0 && element.text().trim() === expectedContent) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Content "${expectedContent}" not found in ${selector} within ${timeout}ms. Found: "${element.text().trim()}"`));
                } else {
                    setTimeout(check, 10);
                }
            };
            check();
        });
    },

    // Trigger keyboard event
    triggerKeyEvent: (keyCode, type = 'keydown') => {
        const event = new KeyboardEvent(type, {
            keyCode: keyCode,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    },

    // Clean up all alerts
    cleanupAlerts: () => {
        // Stop any running timers
        if (window.clearTimeout) {
            for (let i = 1; i < 9999; i++) window.clearTimeout(i);
        }
        
        // Close all alerts properly to ensure cleanup
        $('.jAlert').each(function() {
            const jalert = $(this).data('jAlert');
            if (jalert && typeof jalert.closeAlert === 'function') {
                jalert.closeAlert(true); // Force removal
            }
        });
        
        // Force remove any remaining elements 
        $('.jAlert').remove();
        $('.ja_wrap').remove();
        $('.ja_overlay').remove();
        
        // Remove blur and other classes
        $('body').removeClass('ja_blur_bg ja_blur');
        
        // Restore overflow
        $('html,body').css('overflow', '');
        
        // Clean up any remaining event listeners
        $(document).off('.jAlert');
        $(document).off('.ja_slideshow');
        $(window).off('.jAlert');
        $(document).off('keydown.ja_slideshow');
        $(document).off('mouseup');
        $(document).off('touchstart');
        $(document).off('keydown');
        
        // Reset any global state
        if ($.fn.jAlert && $.fn.jAlert.onMouseUp) {
            $(document).off('mouseup touchstart', $.fn.jAlert.onMouseUp);
        }
        if ($.fn.jAlert && $.fn.jAlert.onEscKeyDown) {
            $(document).off('keydown', $.fn.jAlert.onEscKeyDown);
        }
    },

    // Get clean title text (without close button)
    getTitleText: (selector = '.ja_title') => {
        const titleElement = $(selector);
        if (titleElement.length === 0) return '';
        
        // Clone the element and remove the close button
        const clone = titleElement.clone();
        clone.find('.ja_close').remove();
        return clone.text().trim();
    }
};

// Clean up after each test
afterEach(() => {
    testUtils.cleanupAlerts();
}); 