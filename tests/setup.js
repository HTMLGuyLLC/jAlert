// Jest setup file for jAlert tests
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jquery from 'jquery';

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
const cssPath = path.join(__dirname, '../dist/jAlert.css.min.css');
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

// Load jAlert functions
const functionsPath = path.join(__dirname, '../dist/jAlert-functions.min.js');
if (fs.existsSync(functionsPath)) {
    const functions = fs.readFileSync(functionsPath, 'utf8');
    const loadFunctions = new Function('window', 'document', 'jQuery', '$', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', functions);
    loadFunctions(context, global.document, jquery, jquery, setTimeout, clearTimeout, setInterval, clearInterval);
}

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
        // Close all alerts properly to ensure cleanup
        $('.jAlert').each(function() {
            const jalert = $(this).data('jAlert');
            if (jalert && typeof jalert.closeAlert === 'function') {
                jalert.closeAlert();
            }
        });
        
        // Remove any remaining elements
        $('.jAlert').remove();
        $('.ja_wrap').remove();
        
        // Restore overflow
        $('html,body').css('overflow', '');
        
        // Clean up any remaining event listeners
        $(document).off('keydown.ja_slideshow');
    }
};

// Add Jest globals to global scope
global.jest = {
    fn: () => {
        const mockFn = (...args) => {
            mockFn.mock.calls.push(args);
            return mockFn.mockReturnValue;
        };
        mockFn.mock = {
            calls: [],
            instances: [],
            contexts: [],
            results: []
        };
        mockFn.mockReturnValue = undefined;
        mockFn.mockReturnValueOnce = (value) => {
            mockFn.mockReturnValue = value;
            return mockFn;
        };
        return mockFn;
    }
};

// Clean up after each test
afterEach(() => {
    testUtils.cleanupAlerts();
}); 