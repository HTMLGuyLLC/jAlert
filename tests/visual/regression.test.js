/**
 * jAlert Visual Regression Tests
 * Tests visual appearance and captures screenshots for comparison
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('jAlert Visual Regression Tests', () => {
    let browser;
    let page;
    const demoPagePath = `file://${path.resolve(__dirname, '../../demo.html')}`;
    const screenshotDir = path.join(__dirname, 'screenshots');

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        // Ensure screenshots directory exists
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });
        await page.goto(demoPagePath);
        
        // Wait for page to load completely
        await page.waitForSelector('h1', { timeout: 5000 });
        await page.waitForFunction(() => typeof $ !== 'undefined');
        await page.waitForFunction(() => typeof $.jAlert !== 'undefined');
    });

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    });

    describe('Basic Alert Appearances', () => {
        test('Basic alert visual appearance', async () => {
            await page.click('button[onclick="basicAlert()"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'basic-alert.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Alert with title visual appearance', async () => {
            await page.click('button[onclick="titleAlert()"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'title-alert.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('HTML content alert visual appearance', async () => {
            await page.click('button[onclick="htmlContentAlert()"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'html-content-alert.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Size Variations', () => {
        const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'];

        sizes.forEach(size => {
            test(`Size ${size} visual appearance`, async () => {
                await page.click(`button[onclick="sizeAlert('${size}')"]`);
                await page.waitForSelector('.jAlert');
                
                const screenshot = await page.screenshot({
                    path: path.join(screenshotDir, `size-${size}.png`),
                    fullPage: false
                });
                expect(screenshot).toBeTruthy();
            });
        });

        test('Full screen size visual appearance', async () => {
            await page.click(`button[onclick="sizeAlert('full')"]`);
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'size-full.png'),
                fullPage: true
            });
            expect(screenshot).toBeTruthy();
        });

        test('Custom size visual appearance', async () => {
            await page.click('button[onclick="customSizeAlert({width:\'400px\', height:\'300px\'})"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'size-custom.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Theme Variations', () => {
        const themes = ['default', 'red', 'dark_red', 'green', 'dark_green', 'blue', 'dark_blue', 'yellow', 'orange', 'dark_orange', 'gray', 'dark_gray', 'black', 'brown'];

        themes.forEach(theme => {
            test(`Theme ${theme} visual appearance`, async () => {
                await page.click(`button[onclick="themeAlert('${theme}')"]`);
                await page.waitForSelector('.jAlert');
                
                const screenshot = await page.screenshot({
                    path: path.join(screenshotDir, `theme-${theme}.png`),
                    fullPage: false
                });
                expect(screenshot).toBeTruthy();
            });
        });
    });

    describe('Close Button Variations', () => {
        test('Default close button visual appearance', async () => {
            await page.click('button[onclick="closeBtnAlert(\'default\')"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'close-btn-default.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Round close button visual appearance', async () => {
            await page.click('button[onclick="closeBtnAlert(\'round\')"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'close-btn-round.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Round white close button visual appearance', async () => {
            await page.click('button[onclick="closeBtnAlert(\'round_white\')"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'close-btn-round-white.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Alt close button visual appearance', async () => {
            await page.click('button[onclick="closeBtnAlert(\'alt\')"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'close-btn-alt.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('No close button visual appearance', async () => {
            await page.click('button[onclick="closeBtnAlert(\'none\')"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'close-btn-none.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Background Colors', () => {
        test('Black background visual appearance', async () => {
            await page.click('button[onclick="backgroundColorAlert(\'black\')"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'background-black.png'),
                fullPage: true
            });
            expect(screenshot).toBeTruthy();
        });

        test('White background visual appearance', async () => {
            await page.click('button[onclick="backgroundColorAlert(\'white\')"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'background-white.png'),
                fullPage: true
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Button Styles', () => {
        test('Single button visual appearance', async () => {
            await page.click('button[onclick="singleBtnAlert()"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'single-button.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Multiple buttons visual appearance', async () => {
            await page.click('button[onclick="btnThemeAlert()"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'multiple-buttons.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Button background visual appearance', async () => {
            await page.click('button[onclick="btnBackgroundAlert()"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'button-background.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Confirm dialog visual appearance', async () => {
            await page.click('button[onclick="confirmAlert()"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'confirm-dialog.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Media Content', () => {
        test('Image alert visual appearance', async () => {
            await page.click('button[onclick="imageAlert(\'normal\')"]');
            await page.waitForSelector('.jAlert');
            
            // Wait for image to load
            await page.waitForSelector('.ja_img');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1000);
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'image-alert.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Auto size image visual appearance', async () => {
            await page.click('button[onclick="imageAlert(\'auto\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_img');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1000);
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'image-auto-size.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Broken image visual appearance', async () => {
            await page.click('button[onclick="imageAlert(\'broken\')"]');
            await page.waitForSelector('.jAlert');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 2000); // Wait for error state
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'image-broken.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Iframe alert visual appearance', async () => {
            await page.click('button[onclick="iframeAlert(\'basic\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_iframe');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 2000); // Wait for iframe to load
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'iframe-alert.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Video Content', () => {
        test('HTML5 video visual appearance', async () => {
            await page.click('button[onclick="videoAlert(\'mp4\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1000); // Wait for video element
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'video-html5.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Video with controls visual appearance', async () => {
            await page.click('button[onclick="videoAlert(\'mp4\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1000);
            
            const screenshot = await page.screenshot();
            expect(screenshot).toBeTruthy();
            expect(screenshot.length).toBeGreaterThan(0);
        });

        test('Responsive video visual appearance', async () => {
            await page.click('button[onclick="videoAlert(\'responsive\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1000);
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'video-responsive.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Portrait video visual appearance', async () => {
            await page.click('button[onclick="videoAlert(\'portrait\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1000);
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'video-portrait.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('YouTube video visual appearance', async () => {
            await page.click('button[onclick="videoAlert(\'youtube\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_iframe');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 2000); // Wait for YouTube iframe
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'video-youtube.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Vimeo video visual appearance', async () => {
            await page.click('button[onclick="videoAlert(\'vimeo\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_iframe');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 2000); // Wait for Vimeo iframe
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'video-vimeo.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });



        test('Video with no title visual appearance', async () => {
            await page.click('button[onclick="videoAlert(\'no_title\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1000);
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'video-no-title.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });



        test('Broken video visual appearance', async () => {
            await page.click('button[onclick="videoAlert(\'broken\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 2000); // Wait for error state
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'video-broken.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });



        test('Max size video (responsive) visual appearance', async () => {
            await page.click('button[onclick="videoAlert(\'max_size\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1000);
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'video-max-size-responsive.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Slideshow Appearances', () => {
        test('Basic slideshow visual appearance', async () => {
            await page.click('button[onclick="slideshowAlert(\'basic\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_slideshow_wrap');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1500); // Wait for slideshow to initialize
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'slideshow-basic.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Slideshow with thumbnails visual appearance', async () => {
            await page.click('button[onclick="slideshowAlert(\'thumbs_bottom\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_slideshow_thumbnails');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1500);
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'slideshow-thumbnails.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Slideshow with captions visual appearance', async () => {
            await page.click('button[onclick="slideshowAlert(\'captions\')"]');
            await page.waitForSelector('.jAlert');
            
            let caption = null;
            try {
                // Wait for the slide image to load first
                await page.waitForFunction(() => {
                    const img = document.querySelector('.ja_slideshow_img');
                    return img && img.complete && img.naturalHeight > 0;
                }, { timeout: 5000 });
                
                // Then wait for the caption to be rendered
                await page.waitForSelector('.ja_slideshow_caption', { timeout: 5000 });
                caption = await page.$('.ja_slideshow_caption');
            } catch (e) {
                const slideContent = await page.$eval('.ja_slideshow_slide', el => el.innerHTML);
                console.log('Slide HTML:', slideContent);
            }
            expect(caption).toBeTruthy();
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'slideshow-captions.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Slideshow cover mode visual appearance', async () => {
            await page.click('button[onclick="slideshowAlert(\'cover\')"]');
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_slideshow_wrap');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1500);
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'slideshow-cover.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Special Styling', () => {
        test('No padding content visual appearance', async () => {
            await page.click('button[onclick="specialAlert(\'no_pad\')"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'no-padding.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Blur background visual appearance', async () => {
            await page.click('button[onclick="specialAlert(\'blur_bg\')"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'blur-background.png'),
                fullPage: true
            });
            expect(screenshot).toBeTruthy();
        });

        test('Custom classes visual appearance', async () => {
            await page.click('button[onclick="specialAlert(\'custom_class\')"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'custom-classes.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Loading and Error States', () => {
        test('AJAX loading state visual appearance', async () => {
            await page.click('button[onclick="ajaxAlert(\'json\')"]');
            await page.waitForSelector('.jAlert');
            
            // Capture loading state immediately
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'ajax-loading.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Image loading state visual appearance', async () => {
            await page.click('button[onclick="imageAlert(\'normal\')"]');
            await page.waitForSelector('.jAlert');
            
            // Capture before image loads
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'image-loading.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Slideshow loading state visual appearance', async () => {
            await page.click('button[onclick="slideshowAlert(\'basic\')"]');
            await page.waitForSelector('.jAlert');
            
            // Capture initial loading state
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'slideshow-loading.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Responsive Design', () => {
        test('Mobile viewport visual appearance', async () => {
            await page.setViewport({ width: 375, height: 667 });
            await page.click('button[onclick="basicAlert()"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'mobile-basic.png'),
                fullPage: true
            });
            expect(screenshot).toBeTruthy();
        });

        test('Mobile slideshow visual appearance', async () => {
            await page.setViewport({ width: 375, height: 667 });
            await page.click('button[onclick="slideshowAlert(\'basic\')"]');
            await page.waitForSelector('.jAlert');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1500);
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'mobile-slideshow.png'),
                fullPage: true
            });
            expect(screenshot).toBeTruthy();
        });

        test('Tablet viewport visual appearance', async () => {
            await page.setViewport({ width: 768, height: 1024 });
            await page.click('button[onclick="multipleBtnsAlert()"]');
            await page.waitForSelector('.jAlert');
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'tablet-buttons.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Tablet slideshow with thumbnails visual appearance', async () => {
            await page.setViewport({ width: 768, height: 1024 });
            await page.click('button[onclick="slideshowAlert(\'thumbs_bottom\')"]');
            await page.waitForSelector('.jAlert');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1500);
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'tablet-slideshow-thumbs.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Animation States', () => {
        test('Fade animation visual appearance', async () => {
            await page.click('button[onclick="animationAlert(\'fadeInUp\', \'fadeOutDown\')"]');
            await page.waitForSelector('.jAlert');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 200); // Capture during animation
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'animation-fade.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });

        test('Bounce animation visual appearance', async () => {
            await page.click('button[onclick="animationAlert(\'bounceIn\', \'bounceOut\')"]');
            await page.waitForSelector('.jAlert');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 200);
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'animation-bounce.png'),
                fullPage: false
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Multi-Modal States', () => {
        test('Stacked alerts visual appearance', async () => {
            await page.click('button[onclick="multipleAlert(\'stack\')"]');
            await page.waitForSelector('.jAlert');
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 600); // Wait for second alert
            
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'stacked-alerts.png'),
                fullPage: true
            });
            expect(screenshot).toBeTruthy();
        });
    });

    describe('Demo Page Overview', () => {
        test('Full demo page visual appearance', async () => {
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'demo-page-full.png'),
                fullPage: true
            });
            expect(screenshot).toBeTruthy();
        });

        test('Demo page header visual appearance', async () => {
            const screenshot = await page.screenshot({
                path: path.join(screenshotDir, 'demo-page-header.png'),
                clip: { x: 0, y: 0, width: 1280, height: 400 }
            });
            expect(screenshot).toBeTruthy();
        });
    });
}); 