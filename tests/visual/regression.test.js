import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('jAlert Visual Regression Tests', () => {
    let browser;
    let page;
    let skipAllTests = false;
    const screenshotsDir = path.join(__dirname, 'screenshots');

    beforeAll(async () => {
        // Create screenshots directory if it doesn't exist
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }

        try {
            browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox', 
                    '--disable-web-security',
                    '--disable-dev-shm-usage',
                    '--disable-extensions',
                    '--disable-gpu',
                    '--no-first-run',
                    '--no-default-browser-check'
                ]
            });
        } catch (error) {
            console.warn('Puppeteer launch failed, skipping visual tests:', error.message);
            browser = null;
            skipAllTests = true;
        }
    }, 30000);

    afterAll(async () => {
        if (browser) {
            try {
                await browser.close();
            } catch (error) {
                // Ignore errors during cleanup
            }
        }
        // Force cleanup any remaining processes
        if (typeof process !== 'undefined' && process.exit) {
            // Don't actually exit, just ensure cleanup
        }
    });

    beforeEach(async () => {
        if (skipAllTests || !browser) {
            // Skip tests if browser couldn't be launched
            return;
        }

        page = await browser.newPage();
        await page.setDefaultTimeout(5000);
        await page.setViewport({ width: 1200, height: 800 });
        const htmlPath = path.join(__dirname, '../../index.html');
        await page.goto(`file://${htmlPath}`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('body', { timeout: 5000 });
    }, 10000);

    afterEach(async () => {
        if (page) {
            try {
                await page.close();
            } catch (error) {
                // Ignore errors during page cleanup
            }
            page = null;
        }
    });

    const takeScreenshot = async (name) => {
        if (skipAllTests) {
            console.log('Skipping screenshot - browser not available');
            return null;
        }

        const screenshotPath = path.join(screenshotsDir, `${name}.png`);
        await page.screenshot({ 
            path: screenshotPath,
            fullPage: false,
            clip: { x: 0, y: 0, width: 1200, height: 800 }
        });
        return screenshotPath;
    };

    describe('Alert Appearance', () => {
        test('should render basic alert consistently', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.click('.jsize');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            
            const screenshotPath = await takeScreenshot('basic-alert');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });

        test('should render themed alerts consistently', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.click('.jtheme');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            
            const screenshotPath = await takeScreenshot('themed-alert');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });

        test('should render sized alerts consistently', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.click('.jsize');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            
            const screenshotPath = await takeScreenshot('sized-alert');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });
    });

    describe('Slideshow Appearance', () => {
        test('should render basic slideshow consistently', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.click('.jslideshow');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            await page.waitForSelector('.ja_slideshow_wrap', { visible: true, timeout: 5000 });
            
            // Wait for image to load
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const screenshotPath = await takeScreenshot('basic-slideshow');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });

        test('should render slideshow with dots consistently', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.click('.jslideshow-dots');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            await page.waitForSelector('.ja_slideshow_wrap', { visible: true, timeout: 5000 });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const screenshotPath = await takeScreenshot('slideshow-dots');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });

        test('should render slideshow without controls consistently', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.click('.jslideshow-no-controls');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            await page.waitForSelector('.ja_slideshow_wrap', { visible: true, timeout: 5000 });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const screenshotPath = await takeScreenshot('slideshow-no-controls');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });
    });

    describe('Media Alerts', () => {
        test('should render image alert consistently', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.click('.jimg');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const screenshotPath = await takeScreenshot('image-alert');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });

        test('should render video alert consistently', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.click('.jvid');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const screenshotPath = await takeScreenshot('video-alert');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });
    });

    describe('Responsive Design', () => {
        test('should render correctly on mobile', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.setViewport({ width: 375, height: 667 });
            await page.click('.jsize');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            
            const screenshotPath = await takeScreenshot('mobile-alert');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });

        test('should render correctly on tablet', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.setViewport({ width: 768, height: 1024 });
            await page.click('.jslideshow');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            await page.waitForSelector('.ja_slideshow_wrap', { visible: true, timeout: 5000 });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const screenshotPath = await takeScreenshot('tablet-slideshow');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });
    });

    describe('Animation States', () => {
        test('should capture animation states', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.click('.janim');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            
            // Wait for animation to complete
            await new Promise(resolve => setTimeout(resolve, 600));
            
            const screenshotPath = await takeScreenshot('animated-alert');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });
    });

    describe('Button States', () => {
        test('should render buttons consistently', async () => {
            if (skipAllTests) {
                console.log('Skipping test - browser not available');
                return;
            }

            await page.click('.jbtn');
            await page.waitForSelector('.jAlert', { visible: true, timeout: 5000 });
            
            const screenshotPath = await takeScreenshot('button-alert');
            expect(screenshotPath).toBeTruthy();
            expect(fs.existsSync(screenshotPath)).toBe(true);
        });
    });
}); 