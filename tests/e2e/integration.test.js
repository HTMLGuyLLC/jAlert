/**
 * jAlert E2E Integration Tests
 * Tests all functionality using the demo.html page
 */

import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('jAlert E2E Integration Tests', () => {
    let browser;
    let page;
    
    // Helper function to get clean title text (without close button)
    const getTitleText = async (page) => {
        return await page.$eval('.ja_title', el => {
            const clone = el.cloneNode(true);
            const closeBtn = clone.querySelector('.ja_close');
            if (closeBtn) closeBtn.remove();
            return clone.textContent.trim();
        });
    };
    const demoPagePath = `file://${path.resolve(__dirname, '../../demo.html')}`;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    });

    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    });

    beforeEach(async () => {
        page = await browser.newPage();
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

    describe('1. Basic Alerts', () => {
        test('Basic Alert button works', async () => {
            await page.click('button[onclick="basicAlert()"]');
            
            // Wait for modal to appear
            await page.waitForSelector('.jAlert', { timeout: 3000 });
            
            const modalContent = await page.$eval('.ja_body', el => el.textContent);
            expect(modalContent).toContain('This is a basic alert with minimal configuration.');
        });

        test('Alert with Title button works', async () => {
            await page.click('button[onclick="titleAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            const title = await getTitleText(page);
            expect(title).toBe('Alert Title');
            
            const content = await page.$eval('.ja_body', el => el.textContent);
            expect(content).toContain('This alert has a title at the top.');
        });

        test('No Title button works', async () => {
            await page.click('button[onclick="noTitleAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            const titleExists = await page.$('.ja_title');
            expect(titleExists).toBeNull();
            
            const content = await page.$eval('.ja_body', el => el.textContent);
            expect(content).toContain('This alert has no title, just content.');
        });

        test('Long Content button works', async () => {
            await page.click('button[onclick="longContentAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            const title = await getTitleText(page);
            expect(title).toBe('Long Content Test');
            
            const content = await page.$eval('.ja_body', el => el.textContent);
            expect(content).toContain('This is a test of long content');
        });

        test('HTML Content button works', async () => {
            await page.click('button[onclick="htmlContentAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            const h3 = await page.$eval('.ja_body h3', el => el.textContent);
            expect(h3).toBe('HTML is supported!');
            
            const strong = await page.$('.ja_body strong');
            expect(strong).toBeTruthy();
            
            const em = await page.$('.ja_body em');
            expect(em).toBeTruthy();
            
            const link = await page.$('.ja_body a');
            expect(link).toBeTruthy();
        });

        test('Empty Alert button works', async () => {
            await page.click('button[onclick="emptyAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            const title = await getTitleText(page);
            expect(title).toBe('Empty Alert');
            
            const content = await page.$eval('.ja_body', el => el.textContent.trim());
            expect(content).toBe('');
        });
    });

    describe('2. Sizes', () => {
        const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg', 'full', 'auto'];

        sizes.forEach(size => {
            test(`Size ${size} button works`, async () => {
                await page.click(`button[onclick="sizeAlert('${size}')"]`);
                
                await page.waitForSelector('.jAlert');
                
                const hasClass = await page.$eval('.jAlert', (el, size) => {
                    return el.classList.contains(`ja_${size}`);
                }, size);
                expect(hasClass).toBe(true);
                
                const title = await getTitleText(page);
                expect(title).toBe(`Size: ${size}`);
            });
        });

        test('Custom size 300px button works', async () => {
            await page.click('button[onclick="customSizeAlert(\'300px\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const width = await page.$eval('.jAlert', el => getComputedStyle(el).width);
            expect(width).toBe('300px');
        });

        test('Custom W/H button works', async () => {
            await page.click('button[onclick="customSizeAlert({width:\'400px\', height:\'300px\'})"]');
            
            await page.waitForSelector('.jAlert');
            
            const width = await page.$eval('.jAlert', el => getComputedStyle(el).width);
            const height = await page.$eval('.jAlert', el => getComputedStyle(el).height);
            expect(width).toBe('400px');
            expect(height).toBe('300px');
        });
    });

    describe('3. Themes', () => {
        const themes = ['default', 'red', 'dark_red', 'green', 'dark_green', 'blue', 'dark_blue', 'yellow', 'orange', 'dark_orange', 'gray', 'dark_gray', 'black', 'brown'];

        themes.forEach(theme => {
            test(`Theme ${theme} button works`, async () => {
                await page.click(`button[onclick="themeAlert('${theme}')"]`);
                
                await page.waitForSelector('.jAlert');
                
                if (theme === 'default') {
                    const hasThemeClass = await page.$eval('.jAlert', el => {
                        return Array.from(el.classList).some(cls => cls.includes('_theme'));
                    });
                    expect(hasThemeClass).toBe(false);
                } else {
                    const hasClass = await page.$eval('.jAlert', (el, theme) => {
                        return el.classList.contains(`ja_${theme}`);
                    }, theme);
                    expect(hasClass).toBe(true);
                }
                
                const title = await getTitleText(page);
                expect(title).toBe(`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`);
            });
        });
    });

    describe('4. Close Button Variations', () => {
        test('Default Close button works', async () => {
            await page.click('button[onclick="closeBtnAlert(\'default\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const closeBtn = await page.$('.ja_close');
            expect(closeBtn).toBeTruthy();
            
            const hasRound = await page.$eval('.ja_close', el => el.classList.contains('ja_close_round'));
            expect(hasRound).toBe(true);
        });

        test('Round Close button works', async () => {
            await page.click('button[onclick="closeBtnAlert(\'round\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasRound = await page.$eval('.ja_close', el => el.classList.contains('ja_close_round'));
            expect(hasRound).toBe(true);
        });

        test('Round White Close button works', async () => {
            await page.click('button[onclick="closeBtnAlert(\'round_white\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasWhite = await page.$eval('.ja_close', el => el.classList.contains('ja_close_round_white'));
            expect(hasWhite).toBe(true);
        });

        test('Alt Close button works', async () => {
            await page.click('button[onclick="closeBtnAlert(\'alt\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasAlt = await page.$eval('.ja_close', el => el.classList.contains('ja_close_alt'));
            expect(hasAlt).toBe(true);
        });

        test('No Close Button works', async () => {
            await page.click('button[onclick="closeBtnAlert(\'none\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const closeBtn = await page.$('.ja_close');
            expect(closeBtn).toBeNull();
        });
    });

    describe('5. Close Options', () => {
        test('Close on Click works', async () => {
            await page.click('button[onclick="closeOptionAlert(\'click\')"]');
            
            await page.waitForSelector('.jAlert');
            
            // Click on overlay to close
            await page.click('.ja_wrap');
            
            // Wait for modal to close
            await page.waitForSelector('.jAlert', { hidden: true, timeout: 3000 });
            
            const modal = await page.$('.jAlert');
            expect(modal).toBeNull();
        });

        test('Close on ESC works', async () => {
            await page.click('button[onclick="closeOptionAlert(\'esc\')"]');
            
            await page.waitForSelector('.jAlert');
            
            // Press ESC key
            await page.keyboard.press('Escape');
            
            // Wait for modal to close
            await page.waitForSelector('.jAlert', { hidden: true, timeout: 3000 });
            
            const modal = await page.$('.jAlert');
            expect(modal).toBeNull();
        });

        test('Auto Close works', async () => {
            await page.click('button[onclick="autoCloseAlert(1000)"]');
            
            await page.waitForSelector('.jAlert');
            
            // Wait for auto close (1 second + buffer)
            await page.waitForSelector('.jAlert', { hidden: true, timeout: 2000 });
            
            const modal = await page.$('.jAlert');
            expect(modal).toBeNull();
        });
    });

    describe('6. Background Colors', () => {
        test('Black Background button works', async () => {
            await page.click('button[onclick="backgroundColorAlert(\'black\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasBlackBg = await page.$eval('.ja_wrap', el => el.classList.contains('ja_wrap_black'));
            expect(hasBlackBg).toBe(true);
        });

        test('White Background button works', async () => {
            await page.click('button[onclick="backgroundColorAlert(\'white\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasWhiteBg = await page.$eval('.ja_wrap', el => el.classList.contains('ja_wrap_white'));
            expect(hasWhiteBg).toBe(true);
        });
    });

    describe('7. Animations', () => {
        test('Fade animations work', async () => {
            await page.click('button[onclick="animationAlert(\'fadeInUp\', \'fadeOutDown\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasAnimation = await page.$eval('.jAlert', el => el.classList.contains('fadeInUp'));
            expect(hasAnimation).toBe(true);
        });

        test('Bounce animations work', async () => {
            await page.click('button[onclick="animationAlert(\'bounceIn\', \'bounceOut\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasAnimation = await page.$eval('.jAlert', el => el.classList.contains('bounceIn'));
            expect(hasAnimation).toBe(true);
        });
    });

    describe('8. Buttons', () => {
        test('Single Button works', async () => {
            await page.click('button[onclick="singleBtnAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            const button = await page.$('.ja_btn');
            expect(button).toBeTruthy();
            
            const buttonText = await page.$eval('.ja_btn', el => el.textContent);
            expect(buttonText).toBe('Got it!');
            
            const hasBlueClass = await page.$eval('.ja_btn', el => el.classList.contains('ja_btn_blue'));
            expect(hasBlueClass).toBe(true);
        });

        test('Button Themes work', async () => {
            await page.click('button[onclick="btnThemeAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            const buttons = await page.$$('.ja_btn');
            expect(buttons).toHaveLength(4);
            
            const buttonTexts = await page.$$eval('.ja_btn', els => els.map(el => el.textContent));
            expect(buttonTexts).toEqual(['Default', 'Green', 'Red', 'Blue']);
        });

        test('Multiple Buttons work', async () => {
            await page.click('button[onclick="multipleBtnsAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            const buttons = await page.$$('.ja_btn');
            expect(buttons).toHaveLength(4);
        });

        test('Confirm Dialog works', async () => {
            await page.click('button[onclick="confirmAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            const content = await page.$eval('.ja_body', el => el.textContent);
            expect(content).toContain('Are you sure you want to proceed?');
            
            const buttons = await page.$$('.ja_btn');
            expect(buttons).toHaveLength(2);
        });

        test('Custom Button Classes work', async () => {
            await page.click('button[onclick="customClassBtnAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            // Should have buttons in the button wrapper but no ja_btn class
            const customButtons = await page.$$('.ja_btn_wrap button');
            expect(customButtons).toHaveLength(2);
            
            // Should NOT have ja_btn class
            const jaBtnButtons = await page.$$('.ja_btn');
            expect(jaBtnButtons).toHaveLength(0);
            
            // Should have custom classes
            const primaryButton = await page.$('.btn.btn-primary');
            expect(primaryButton).toBeTruthy();
            
            const secondaryButton = await page.$('.btn.btn-secondary');
            expect(secondaryButton).toBeTruthy();
        });
    });

    describe('9. Images', () => {
        test('Normal Image works', async () => {
            await page.click('button[onclick="imageAlert(\'normal\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const img = await page.$('.ja_img');
            expect(img).toBeTruthy();
            
            const src = await page.$eval('.ja_img', el => el.src);
            expect(src).toContain('picsum.photos');
        });

        test('Auto Size Image works', async () => {
            await page.click('button[onclick="imageAlert(\'auto\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasAutoClass = await page.$eval('.jAlert', el => el.classList.contains('ja_auto'));
            expect(hasAutoClass).toBe(true);
            
            const img = await page.$('.ja_img');
            expect(img).toBeTruthy();
        });

        test('Custom Width Image works', async () => {
            await page.click('button[onclick="imageAlert(\'custom_width\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const img = await page.$('.ja_img');
            expect(img).toBeTruthy();
        });

        test('Broken Image works', async () => {
            await page.click('button[onclick="imageAlert(\'broken\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const img = await page.$('.ja_img');
            expect(img).toBeTruthy();
            
            const title = await getTitleText(page);
            expect(title).toBe('Broken Image');
        });
    });

    describe('10. Videos', () => {
        test('MP4 Video works', async () => {
            await page.click('button[onclick="videoAlert(\'mp4\')"]');
            
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.waitForSelector('.ja_video_element');
            
            const title = await getTitleText(page);
            expect(title).toBe('MP4 Video');
            
            const src = await page.$eval('.ja_video_element', el => el.src);
            expect(src).toContain('BigBuckBunny.mp4');
        });

        test('Video with Controls works', async () => {
            await page.click('button[onclick="videoAlert(\'mp4\')"]');
            
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.waitForSelector('.ja_video_element');
            
            const title = await getTitleText(page);
            expect(title).toBe('MP4 Video');
            
            const src = await page.$eval('.ja_video_element', el => el.src);
            expect(src).toContain('BigBuckBunny.mp4');
            
            // Check that controls are present
            const hasControls = await page.$eval('.ja_video_element', el => el.hasAttribute('controls'));
            expect(hasControls).toBe(true);
        });

        test('Video without Controls works', async () => {
            await page.click('button[onclick="videoAlert(\'no_controls\')"]');
            
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.waitForSelector('.ja_video_element');
            
            const title = await getTitleText(page);
            expect(title).toBe('Video without Controls');
            
            // Check that controls are NOT present
            const hasControls = await page.$eval('.ja_video_element', el => el.hasAttribute('controls'));
            expect(hasControls).toBe(false);
        });

        test('Auto Play Video works', async () => {
            await page.click('button[onclick="videoAlert(\'autoplay\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const video = await page.$('.ja_video_element');
            expect(video).toBeTruthy();
            
            const title = await getTitleText(page);
            expect(title).toBe('Auto Play Video (Muted)');
            
            const hasAutoplay = await page.$eval('.ja_video_element', el => el.hasAttribute('autoplay'));
            expect(hasAutoplay).toBe(true);
            
            const isMuted = await page.$eval('.ja_video_element', el => el.hasAttribute('muted'));
            expect(isMuted).toBe(true);
        });

        test('Muted Video works', async () => {
            await page.click('button[onclick="videoAlert(\'muted\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const video = await page.$('.ja_video_element');
            expect(video).toBeTruthy();
            
            const isMuted = await page.$eval('.ja_video_element', el => el.hasAttribute('muted'));
            expect(isMuted).toBe(true);
        });

        test('Looping Video works', async () => {
            await page.click('button[onclick="videoAlert(\'loop\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const video = await page.$('.ja_video_element');
            expect(video).toBeTruthy();
            
            const hasLoop = await page.$eval('.ja_video_element', el => el.hasAttribute('loop'));
            expect(hasLoop).toBe(true);
        });



        test('Max Size Video (Responsive) works', async () => {
            await page.click('button[onclick="videoAlert(\'max_size\')"]');
            
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.waitForSelector('.ja_video_element');
            
            const title = await getTitleText(page);
            expect(title).toBe('Max Size Video (Responsive)');
            
            // Check responsive container setup
            const containerWidth = await page.$eval('.ja_video', el => el.style.width);
            expect(containerWidth).toBe('800px');
            
            const containerPadding = await page.$eval('.ja_video', el => el.style.paddingBottom);
            // 450/800 * 100 = 56.25% 
            expect(containerPadding).toBe('56.25%');
            
            // Video should be positioned absolutely inside container
            const videoPosition = await page.$eval('.ja_video_element', el => el.style.position);
            expect(videoPosition).toBe('absolute');
        });

        test('Responsive Video works', async () => {
            await page.click('button[onclick="videoAlert(\'responsive\')"]');
            
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.waitForSelector('.ja_video_element');
            
            const title = await getTitleText(page);
            expect(title).toBe('Responsive Video');
            
            // Check if the modal has auto size (which is the default for videos)
            const hasAutoSize = await page.$eval('.jAlert', el => el.classList.contains('ja_auto'));
            expect(hasAutoSize).toBe(true);
            
            const width = await page.$eval('.ja_video_element', el => el.style.width || el.getAttribute('width'));
            expect(width).toBe('100%');
        });

        test('Portrait Video works', async () => {
            await page.click('button[onclick="videoAlert(\'portrait\')"]');
            
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_video');
            await page.waitForSelector('.ja_video_element');
            
            const title = await getTitleText(page);
            expect(title).toBe('Portrait Video (9:16)');
            
            const video = await page.$('.ja_video_element');
            expect(video).toBeTruthy();
            
            // Check that the video container exists
            const container = await page.$('.ja_video');
            expect(container).toBeTruthy();
        });

        test('YouTube Video works', async () => {
            await page.click('button[onclick="videoAlert(\'youtube\')"]');
            
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_iframe');
            
            const title = await getTitleText(page);
            expect(title).toBe('YouTube Video (Enhanced URL Processing)');
            
            const src = await page.$eval('.ja_iframe', el => el.src);
            expect(src).toContain('youtube.com/embed');
        });

        test('Vimeo Video works', async () => {
            await page.click('button[onclick="videoAlert(\'vimeo\')"]');
            
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_iframe');
            
            const title = await getTitleText(page);
            expect(title).toBe('Vimeo Video (Enhanced URL Processing)');
            
            const src = await page.$eval('.ja_iframe', el => el.src);
            // Vimeo URLs are processed to add parameters but not converted to player.vimeo.com
            expect(src).toContain('vimeo.com');
            expect(src).toContain('autoplay=1');
        });

        test('YouTube Playlist works', async () => {
            await page.click('button[onclick="videoAlert(\'youtube_playlist\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const iframe = await page.$('.ja_iframe');
            expect(iframe).toBeTruthy();
            
            const title = await getTitleText(page);
            expect(title).toBe('YouTube Playlist');
            
            const src = await page.$eval('.ja_iframe', el => el.src);
            expect(src).toContain('youtube.com/embed/videoseries');
        });

        test('YouTube Responsive works', async () => {
            await page.click('button[onclick="videoAlert(\'youtube_responsive\')"]');
            
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_iframe');
            
            const title = await getTitleText(page);
            expect(title).toBe('YouTube Responsive (Enhanced URL Processing)');
            
            // Check that the responsive container is set up correctly
            const container = await page.$('.ja_iframe').then(iframe => iframe.evaluateHandle(el => el.parentElement));
            expect(container).toBeTruthy();
            
            const containerWidth = await container.evaluate(el => el.style.width);
            expect(containerWidth).toBe('800px');
        });

        test('Broken Video works', async () => {
            await page.click('button[onclick="videoAlert(\'broken\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const video = await page.$('.ja_video_element');
            expect(video).toBeTruthy();
            
            const title = await getTitleText(page);
            expect(title).toBe('Broken Video URL');
            
            const src = await page.$eval('.ja_video_element', el => el.src);
            expect(src).toBe('https://invalid-url.com/broken-video.mp4');
        });


    });

    describe('11. Iframes', () => {
        test('Basic Iframe works', async () => {
            await page.click('button[onclick="iframeAlert(\'basic\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const iframe = await page.$('.ja_iframe');
            expect(iframe).toBeTruthy();
            
            const src = await page.$eval('.ja_iframe', el => el.src);
            expect(src).toContain('httpbin.org');
        });

        test('Custom Height Iframe works', async () => {
            await page.click('button[onclick="iframeAlert(\'custom_height\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const iframe = await page.$('.ja_iframe');
            expect(iframe).toBeTruthy();
            
            const title = await getTitleText(page);
            expect(title).toBe('Custom Height Iframe');
        });

        test('Auto-sizing Iframe (Same-Origin) works', async () => {
            await page.click('button[onclick="iframeAlert(\'auto_local\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasAutoClass = await page.$eval('.jAlert', el => el.classList.contains('ja_auto'));
            expect(hasAutoClass).toBe(true);
            
            const iframe = await page.$('.ja_iframe');
            expect(iframe).toBeTruthy();
        });

        test('Full Screen Iframe works', async () => {
            await page.click('button[onclick="iframeAlert(\'full\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasFullClass = await page.$eval('.jAlert', el => el.classList.contains('ja_full'));
            expect(hasFullClass).toBe(true);
        });
    });

    describe('12. Slideshows', () => {
        test('Basic Slideshow works', async () => {
            await page.click('button[onclick="slideshowAlert(\'basic\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const slideshow = await page.$('.ja_slideshow_wrap');
            expect(slideshow).toBeTruthy();
            
            const prevBtn = await page.$('.ja_slideshow_prev');
            expect(prevBtn).toBeTruthy();
            
            const nextBtn = await page.$('.ja_slideshow_next');
            expect(nextBtn).toBeTruthy();
        });

        test('Single Image Slideshow works', async () => {
            await page.click('button[onclick="slideshowAlert(\'single\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const slideshow = await page.$('.ja_slideshow_wrap');
            expect(slideshow).toBeTruthy();
            
            const title = await getTitleText(page);
            expect(title).toBe('Single Image Slideshow');
        });

        test('Thumbnails Bottom works', async () => {
            await page.click('button[onclick="slideshowAlert(\'thumbs_bottom\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const thumbnails = await page.$('.ja_slideshow_thumbnails');
            expect(thumbnails).toBeTruthy();
            
            const hasBottomClass = await page.$eval('.ja_slideshow_thumbnails', el => 
                el.classList.contains('ja_slideshow_thumbnails_bottom'));
            expect(hasBottomClass).toBe(true);
        });

        test('Cover Mode works', async () => {
            await page.click('button[onclick="slideshowAlert(\'cover\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const slideshow = await page.$('.ja_slideshow_wrap');
            expect(slideshow).toBeTruthy();
            
            const title = await getTitleText(page);
            expect(title).toBe('Cover Mode');
        });

        test('With Captions works', async () => {
            await page.click('button[onclick="slideshowAlert(\'captions\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const slideshow = await page.$('.ja_slideshow_wrap');
            expect(slideshow).toBeTruthy();
            
            // Wait for the first slide to load and caption to appear (up to 5s)
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
                // Not found, print slide HTML for debugging
                const slideContent = await page.$eval('.ja_slideshow_slide', el => el.innerHTML);
                console.log('Slide HTML:', slideContent);
            }
            expect(caption).toBeTruthy();
        });
    });

    describe('13. Ajax', () => {
        test('Ajax JSON Content works', async () => {
            await page.click('button[onclick="ajaxAlert(\'json\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const title = await getTitleText(page);
            expect(title).toBe('Ajax JSON Content');
            
            // Wait for content to load
            await page.waitForFunction(() => {
                const alert = document.querySelector('.jAlert');
                return alert && !alert.classList.contains('ja_loading');
            }, { timeout: 5000 });
            
            // Check that loading class was removed after content loaded
            const hasLoadingClass = await page.$eval('.jAlert', el => el.classList.contains('ja_loading'));
            expect(hasLoadingClass).toBe(false);
        });

        test('Ajax HTML Content works', async () => {
            await page.click('button[onclick="ajaxAlert(\'html\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const title = await getTitleText(page);
            expect(title).toBe('Ajax HTML Content');
        });

        test('Ajax Error works', async () => {
            await page.click('button[onclick="ajaxAlert(\'error\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const title = await getTitleText(page);
            expect(title).toBe('Ajax Error');
        });
    });

    describe('14. Special Options', () => {
        test('No Padding works', async () => {
            await page.click('button[onclick="specialAlert(\'no_pad\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasNoPadClass = await page.$eval('.jAlert', el => el.classList.contains('ja_no_pad'));
            expect(hasNoPadClass).toBe(true);
        });

        test('Blur Background works', async () => {
            await page.click('button[onclick="specialAlert(\'blur_bg\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasBlurClass = await page.$eval('body', el => el.classList.contains('ja_blur'));
            expect(hasBlurClass).toBe(true);
        });

        test('Custom Classes work', async () => {
            await page.click('button[onclick="specialAlert(\'custom_class\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const hasCustomClass = await page.$eval('.jAlert', el => el.classList.contains('my-custom-modal'));
            expect(hasCustomClass).toBe(true);
        });

        test('Replace Others works', async () => {
            await page.click('button[onclick="specialAlert(\'replace_others\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const title = await getTitleText(page);
            expect(title).toBe('Replace Others');
        });
    });

    describe('15. Multiple Alerts', () => {
        test('Stack Alerts works', async () => {
            await page.click('button[onclick="multipleAlert(\'stack\')"]');
            
            // Wait for first alert
            await page.waitForSelector('.jAlert');
            
            // Wait a bit for second alert to appear
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 600);
            
            const alerts = await page.$$('.jAlert');
            expect(alerts.length).toBeGreaterThanOrEqual(1);
        });

        test('Replace Alerts works', async () => {
            await page.click('button[onclick="multipleAlert(\'replace\')"]');
            
            await page.waitForSelector('.jAlert');
            
            // Wait for the first alert to be replaced (should happen after 2 seconds)
            // Wait a bit longer to ensure the replacement happens
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 3000);
            
            // Check that we have exactly one alert
            const alertCount = await page.$$eval('.jAlert', alerts => alerts.length);
            expect(alertCount).toBe(1);
            
            // Check the title - it should be the replacement alert
            const title = await getTitleText(page);
            expect(title).toBe('Replacement Alert');
        });
    });

    describe('16. Error Cases & Edge Tests', () => {
        test('No Content error case works', async () => {
            await page.click('button[onclick="errorAlert(\'no_content\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const title = await getTitleText(page);
            expect(title).toBe('No Content Test');
        });

        test('Invalid Theme error case works', async () => {
            await page.click('button[onclick="errorAlert(\'invalid_theme\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const title = await getTitleText(page);
            expect(title).toBe('Invalid Theme');
        });

        test('Invalid Size error case works', async () => {
            await page.click('button[onclick="errorAlert(\'invalid_size\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const title = await getTitleText(page);
            expect(title).toBe('Invalid Size');
        });
    });

    describe('17. Event Handler Cleanup Tests', () => {
        test('Rapid Open/Close test works', async () => {
            await page.click('button[onclick="eventCleanupTest(\'rapid_open_close\')"]');
            
            await page.waitForSelector('.jAlert');
            
            // Wait for the test to complete
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 1000);
            
            // Check console for errors (this would be implementation specific)
            const logs = await page.evaluate(() => {
                return window.console._logs || [];
            });
        });

        test('Keyboard After Close test works', async () => {
            await page.click('button[onclick="eventCleanupTest(\'keyboard_after_close\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const slideshow = await page.$('.ja_slideshow_wrap');
            expect(slideshow).toBeTruthy();
        });

        test('Multiple Slideshows test works', async () => {
            await page.click('button[onclick="eventCleanupTest(\'multiple_slideshows\')"]');
            
            await page.waitForSelector('.jAlert');
            
            // Wait for multiple slideshows to be created
            await page.evaluate((ms) => new Promise(resolve => setTimeout(resolve, ms)), 500);
            
            const alerts = await page.$$('.jAlert');
            expect(alerts.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('Modal Interactions', () => {
        test('Close button works', async () => {
            await page.click('button[onclick="basicAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            // Click close button
            await page.click('.ja_close');
            
            // Wait for modal to close
            await page.waitForSelector('.jAlert', { hidden: true, timeout: 3000 });
            
            const modal = await page.$('.jAlert');
            expect(modal).toBeNull();
        });

        test('Slideshow navigation works', async () => {
            await page.click('button[onclick="slideshowAlert(\'basic\')"]');
            
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_slideshow_next');
            
            // Click next button
            await page.click('.ja_slideshow_next');
            
            // Should still have slideshow open
            const slideshow = await page.$('.ja_slideshow_wrap');
            expect(slideshow).toBeTruthy();
        });

        test('Button callbacks work', async () => {
            await page.click('button[onclick="singleBtnAlert()"]');
            
            await page.waitForSelector('.jAlert');
            await page.waitForSelector('.ja_btn');
            
            // Set up alert listener
            page.on('dialog', async dialog => {
                expect(dialog.message()).toBe('Button clicked!');
                await dialog.accept();
            });
            
            // Click the button
            await page.click('.ja_btn');
        });
    });

    describe('Responsive Behavior', () => {
        test('Modals work on mobile viewport', async () => {
            await page.setViewport({ width: 375, height: 667 });
            
            await page.click('button[onclick="basicAlert()"]');
            
            await page.waitForSelector('.jAlert');
            
            const modal = await page.$('.jAlert');
            expect(modal).toBeTruthy();
            
            // Check if modal is responsive
            const modalWidth = await page.$eval('.jAlert', el => el.getBoundingClientRect().width);
            expect(modalWidth).toBeLessThanOrEqual(375);
        });

        test('Slideshows work on tablet viewport', async () => {
            await page.setViewport({ width: 768, height: 1024 });
            
            await page.click('button[onclick="slideshowAlert(\'basic\')"]');
            
            await page.waitForSelector('.jAlert');
            
            const slideshow = await page.$('.ja_slideshow_wrap');
            expect(slideshow).toBeTruthy();
        });
    });
}); 