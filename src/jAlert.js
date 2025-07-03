/*
	jAlert
	https://github.com/HTMLGuyLLC/jAlert
	Made with love by HTMLGuy, LLC
	MIT Licensed
*/
(function($) {
    'use strict';

    // Date.now is supported in all modern browsers (IE9+)

    // Constants
    const THEMES = ['default', 'green', 'dark_green', 'red', 'dark_red', 'black', 'brown', 'gray', 'dark_gray', 'blue', 'dark_blue', 'yellow', 'orange', 'dark_orange'];
    const SIZES = ['xsm', 'sm', 'md', 'lg', 'xlg', 'full', 'auto'];
    const SIZE_ALIASES = {'xsmall': 'xsm', 'xs': 'xsm', 'small':'sm','medium':'md','large':'lg','xlarge':'xlg'};
    const BACKGROUND_COLORS = ['white', 'black'];

    // Utility functions
    const utils = {
        generateId() {
            return 'ja_' + Date.now().toString() + Math.floor(Math.random() * 100000);
        },

        isElement(obj) {
            return obj && obj.jquery;
        },

        normalizeOptions(options) {
            const normalized = {};
            // Convert any accidentally lowercased keys from options to match defaults
            Object.keys($.fn.jAlert.defaults).forEach(key => {
                const lowerKey = key.toLowerCase();
                if (typeof options[lowerKey] !== 'undefined') {
                    normalized[key] = options[lowerKey];
                }
            });
            return { ...normalized, ...options };
        },

        processContent(content, alert) {
            // If content is a selector (id only) and the element exists, grab its content
            if (content && content.indexOf('#') === 0) {
                const element = $(content);
                if (element.length > 0) {
                    return element.html();
                }
            }

            // If content is a DOM element, grab its HTML
            if (utils.isElement(content)) {
                return content.html();
            }

            return content;
        },

        processIframeVideoUrl(videoObj) {
            let processedUrl = videoObj.src;
                
            // Convert YouTube watch URLs to embed URLs
            if (processedUrl.indexOf('youtube.com/watch?v=') > -1 && processedUrl.indexOf('embed') === -1) {
                processedUrl = processedUrl.replace('watch?v=', 'embed/');
            }
            
            // Only add query parameters for iframe videos (YouTube, Vimeo)
            const isIframeVideo = processedUrl.includes('youtube.com') || processedUrl.includes('vimeo.com');
            
            if (isIframeVideo) {
                // Add video parameters based on video object properties
                const params = new URLSearchParams();
                
                // Handle autoplay (YouTube: autoplay=1, Vimeo: autoplay=1)
                if (videoObj.autoplay) {
                    params.set('autoplay', '1');
                }
                
                // Handle muted (YouTube: mute=1, Vimeo: muted=1)
                if (videoObj.muted) {
                    if (processedUrl.includes('youtube.com')) {
                        params.set('mute', '1');
                    } else if (processedUrl.includes('vimeo.com')) {
                        params.set('muted', '1');
                    }
                }
                
                // Handle controls (YouTube: controls=1, Vimeo: controls=1)
                if (videoObj.controls !== false) {
                    params.set('controls', '1');
                }
                
                // Handle loop (YouTube: loop=1, Vimeo: loop=1)
                if (videoObj.loop) {
                    params.set('loop', '1');
                }
                
                // Handle playsinline for mobile compatibility
                params.set('playsinline', '1');
                
                // Add parameters to URL
                if (params.toString()) {
                    processedUrl += (processedUrl.includes('?') ? '&' : '?') + params.toString();
                }
            }
            
            return processedUrl;
        },

        createIframeVideo(videoObj, options = {}) {
            const {
                maxWidth = '800px',
                maxHeight = '450px',
                onLoad = null,
                onError = null,
                showLoader = true
            } = options;

            // Create iframe element
            const iframe = document.createElement("iframe");
            iframe.src = videoObj.src;
            iframe.className = 'ja_iframe';
            
            // Apply video options as iframe attributes (but skip width/height/maxWidth/maxHeight - let responsive containers handle sizing)
            Object.keys(videoObj).forEach(attr => {
                if (attr === 'maxWidth') {
                    // Skip - handled by options
                } else if (attr === 'maxHeight') {
                    // Skip - handled by options
                } else if (attr !== 'width' && attr !== 'height' && attr !== 'maxWidth' && attr !== 'maxHeight' && attr !== 'src' && attr !== 'type' && attr !== 'embedType') {
                    iframe.setAttribute(attr, videoObj[attr]);
                }
            });
            
            // Create responsive container
            const widthValue = parseFloat(maxWidth);
            const heightValue = parseFloat(maxHeight);
            const aspectRatio = (heightValue / widthValue) * 100;
            
            const responsiveContainer = document.createElement('div');
            responsiveContainer.style.width = maxWidth;
            responsiveContainer.style.maxWidth = '100%';
            responsiveContainer.style.height = '0px';
            responsiveContainer.style.paddingBottom = aspectRatio + '%';
            responsiveContainer.style.position = 'relative';
            responsiveContainer.style.display = 'block';
            
            // Add loader if requested
            if (showLoader) {
                const loaderHtml = document.createElement('div');
                loaderHtml.className = 'ja_loader';
                loaderHtml.setAttribute('role', 'status');
                loaderHtml.setAttribute('aria-label', 'Loading video');
                loaderHtml.innerText = 'Loading...';
                loaderHtml.style.position = 'absolute';
                loaderHtml.style.top = '50%';
                loaderHtml.style.left = '50%';
                loaderHtml.style.transform = 'translate(-50%, -50%)';
                loaderHtml.style.zIndex = '1';
                responsiveContainer.appendChild(loaderHtml);
            }
            
            // Position iframe absolutely inside container
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            
            // Append iframe to responsive container
            responsiveContainer.appendChild(iframe);
            
            // Add event listeners
            const removeLoader = function() {
                if (showLoader) {
                    const loader = responsiveContainer.querySelector('.ja_loader');
                    if (loader) {
                        loader.remove();
                    }
                }
                if (typeof onLoad === 'function') {
                    onLoad(iframe, responsiveContainer);
                }
            };
            
            const handleError = function() {
                if (showLoader) {
                    const loader = responsiveContainer.querySelector('.ja_loader');
                    if (loader) {
                        loader.remove();
                    }
                }
                if (typeof onError === 'function') {
                    onError(iframe, responsiveContainer);
                }
            };
            
            if (iframe.addEventListener) {
                iframe.addEventListener('load', removeLoader, true);
                iframe.addEventListener('error', handleError, true);
            } else if (iframe.attachEvent) {
                iframe.attachEvent("onload", removeLoader);
                iframe.attachEvent("onerror", handleError);
            } else {
                iframe.onload = removeLoader;
                iframe.onerror = handleError;
            }
            
            return {
                iframe: iframe,
                container: responsiveContainer,
                removeLoader: removeLoader,
                handleError: handleError
            };
        },

        createHtml5Video(videoObj, options = {}) {
            const {
                onLoad = null,
                onError = null,
                showLoader = true
            } = options;

            // Use let for maxWidth and maxHeight so they can be reassigned
            let maxWidth = '800px';  // Default responsive width
            let maxHeight = '450px'; // Default responsive height (16:9 ratio)

            // Create HTML5 video element
            const video = document.createElement("video");
            video.src = videoObj.src;
            video.className = 'ja_video_element';
            
            // Apply default attributes for HTML5 video
            if (videoObj.controls) {
                video.setAttribute('controls', 'controls');
            }
            if (videoObj.preload) {
                video.setAttribute('preload', 'metadata');
            }
            
            // Apply video options from video object
            Object.keys(videoObj).forEach(attr => {
                const value = videoObj[attr];
                
                if (attr === 'maxWidth') {
                    maxWidth = value;
                } else if (attr === 'maxHeight') {
                    maxHeight = value;
                } else if (attr !== 'width' && attr !== 'height' && attr !== 'maxWidth' && attr !== 'maxHeight' && attr !== 'src' && attr !== 'type' && attr !== 'embedType') {
                    if (typeof value === 'boolean') {
                        if (value) {
                            // For HTML5 video, boolean attributes should be set as the attribute name
                            video.setAttribute(attr, attr);
                        }
                    } else {
                        video.setAttribute(attr, value);
                    }
                }
            });
            
            // Create responsive container for HTML5 videos
            const videoContainer = document.createElement('div');
            videoContainer.className = 'ja_video';
            
            // Add loader if requested
            if (showLoader) {
                const loaderHtml = document.createElement('div');
                loaderHtml.className = 'ja_loader';
                loaderHtml.setAttribute('role', 'status');
                loaderHtml.setAttribute('aria-label', 'Loading video');
                loaderHtml.innerText = 'Loading...';
                loaderHtml.style.position = 'absolute';
                loaderHtml.style.top = '50%';
                loaderHtml.style.left = '50%';
                loaderHtml.style.transform = 'translate(-50%, -50%)';
                loaderHtml.style.zIndex = '1';
                videoContainer.appendChild(loaderHtml);
            }
            
            // Parse numeric values from maxWidth and maxHeight
            const widthValue = parseFloat(maxWidth);
            const heightValue = parseFloat(maxHeight);
            const aspectRatio = (heightValue / widthValue) * 100;
            
            // Set up responsive container
            videoContainer.style.width = maxWidth;
            videoContainer.style.maxWidth = '100%';
            videoContainer.style.height = '0px';
            videoContainer.style.paddingBottom = aspectRatio + '%';
            videoContainer.style.position = 'relative';
            videoContainer.style.display = 'block';
            
            // Position video absolutely inside container
            video.style.position = 'absolute';
            video.style.top = '0';
            video.style.left = '0';
            video.style.width = '100%';
            video.style.height = '100%';
            
            // Video load/error handlers
            const removeLoader = function() {
                if (showLoader) {
                    const loader = videoContainer.querySelector('.ja_loader');
                    if (loader) {
                        loader.remove();
                    }
                }
                videoContainer.classList.add('ja_video_loaded');
                if (typeof onLoad === 'function') {
                    onLoad(video, videoContainer);
                }
            };
            
            const handleError = function() {
                if (showLoader) {
                    const loader = videoContainer.querySelector('.ja_loader');
                    if (loader) {
                        loader.remove();
                    }
                }
                videoContainer.classList.add('ja_video_loaded'); // Show container even on error
                if (typeof onError === 'function') {
                    onError(video, videoContainer);
                }
            };
            
            if (video.addEventListener) {
                video.addEventListener('loadedmetadata', removeLoader, true);
                video.addEventListener('error', handleError, true);
            } else if (video.attachEvent) {
                video.attachEvent("onloadedmetadata", removeLoader);
                video.attachEvent("onerror", handleError);
            } else {
                video.onloadedmetadata = removeLoader;
                video.onerror = handleError;
            }
            
            // Append video to container
            videoContainer.appendChild(video);
            
            return {
                video: video,
                container: videoContainer,
                removeLoader: removeLoader,
                handleError: handleError
            };
        },

        setupConfirmButtons(alert) {
            if (!alert.content) {
                alert.content = alert.confirmQuestion;
            }

            alert.btns = [
                { 
                    'text': alert.confirmBtnText, 
                    'theme': 'green', 
                    'class': 'confirmBtn', 
                    'closeAlert': true, 
                    'onClick': alert.onConfirm 
                },
                { 
                    'text': alert.denyBtnText, 
                    'theme': 'red', 
                    'class': 'denyBtn', 
                    'closeAlert': true, 
                    'onClick': alert.onDeny 
                }
            ];

            alert.autofocus = alert.confirmAutofocus;
        },

        validateTheme(theme) {
            if (THEMES.indexOf(theme) === -1) {
                console.warn('jAlert Config Error: Invalid theme selection. Using default theme.');
                return false;
            }
            return true;
        },

        validateSize(size) {
            if (size && ((typeof size === 'object' && (typeof size.width === 'undefined' || typeof size.height === 'undefined'))) ) {
                console.warn('jAlert Config Error: Invalid size selection (try a preset or make sure you\'re including height and width in your size object).');
                return false;
            }
            return true;
        },

        validateBackgroundColor(backgroundColor) {
            if (BACKGROUND_COLORS.indexOf(backgroundColor) === -1) {
                console.warn('jAlert Config Error: Invalid background color selection.');
                return false;
            }
            return true;
        },

        getSizeClasses(size) {
            const classes = [];
            
            if (!size) {
                classes.push('ja_sm');
            } else if (typeof size === 'object') {
                // Custom size object - will be handled by styles
            } else {
                // Swap alias for actual size class
                if (typeof SIZE_ALIASES[size] !== 'undefined') {
                    size = SIZE_ALIASES[size];
                }

                // If it's one of the sizes, set the class
                if (SIZES.indexOf(size) > -1) {
                    classes.push('ja_' + size);
                }
                // Otherwise, we assume they provided a px or % width
            }
            
            return classes;
        },

        getSizeStyles(size, alert) {
            const styles = [];
            
            // Get viewport dimensions
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // Add viewport constraints unless screen is very short (150px or less)
            const constrainToViewport = viewportHeight > 150;
            
            if (constrainToViewport) {
                // Calculate total modal overhead:
                // - Modal margins: 30px (15px top + 15px bottom)
                // - Title padding: ~20px (if title exists)
                // - Body padding: 40px (20px top + 20px bottom)
                // - Button area: ~40px (worst case with optBack styling)
                // - Safety buffer: 20px (10px top + 10px bottom)
                // Total overhead: ~150px
                const modalOverhead = 150;
                const sideMargin = 20; // 20px margin on each side
                
                const maxWidth = Math.max(280, viewportWidth - (sideMargin * 2)); // Minimum 280px width
                const maxHeight = Math.max(200, viewportHeight - modalOverhead); // Minimum 200px height
                
                // Note: max-width and max-height removed to allow centering padding calculation for slideshows
            }
            
            if (size && typeof size === 'object') {
                styles.push(`width: ${size.width};`);
                styles.push(`height: ${size.height};`);
            } else if (size && typeof size === 'string' && SIZES.indexOf(size) === -1 && SIZE_ALIASES[size] === undefined) {
                styles.push(`width: ${size};`);
            }
            
            // Add height: auto for auto-sized modals (images and slideshows)
            if (size === 'auto' && alert && (alert.image || alert.slideshow)) {
                styles.push('height: auto;');
            }
            
            return styles;
        },

        createMediaContent(alert) {
            const onload = "onload='$.fn.jAlert.mediaLoaded($(this))'";
            const loader = "<div class='ja_loader' role='status' aria-label='Loading content'>Loading...</div>";

            if (alert.slideshow) {
                // Slideshow functionality
                
                // Add custom classes for slideshow modals
                alert.classes = (alert.classes || '') + ' ja_slideshow_modal';
                
                let content = "<div class='ja_media_wrap ja_slideshow_wrap' role='region' aria-label='Image slideshow'>";
                
                // Add initial loader while slideshow is being set up
                content += loader;
                
                // Ensure body gets loading class for CSS fallback
                alert.onOpen.unshift(function(elem) {
                    elem.find('.ja_body').addClass('ja_loading');
                });
                
                const thumbnailLocation = alert.slideshowOptions ? alert.slideshowOptions.thumbnailLocation || 'bottom' : 'bottom';
                const showThumbnails = alert.slideshowOptions && alert.slideshowOptions.showThumbnails;
                
                // Only support top/bottom thumbnail positioning
                const validThumbnailLocation = (thumbnailLocation === 'top') ? 'top' : 'bottom';
                
                // Add thumbnails at top if enabled
                if (showThumbnails && validThumbnailLocation === 'top') {
                    content += "<div class='ja_slideshow_thumbnails ja_slideshow_thumbnails_top' role='tablist' aria-label='Thumbnail navigation'></div>";
                }
                
                content += "<div class='ja_slideshow_main'>";
                content += "<div class='ja_slideshow_container'>" +
                    "<div class='ja_slideshow_slide' role='img' aria-live='polite'></div>";
                
                // Add side arrows if enabled
                if (alert.slideshowOptions && alert.slideshowOptions.showArrows !== false) {
                    content += "<button type='button' class='ja_slideshow_arrow ja_slideshow_prev' aria-label='Previous image'>&lt;</button>" +
                              "<button type='button' class='ja_slideshow_arrow ja_slideshow_next' aria-label='Next image'>&gt;</button>";
                }
                
                content += "</div>";
                
                // Add counter/dots if enabled (inside ja_slideshow_main)
                if (alert.slideshowOptions && alert.slideshowOptions.showCounter) {
                    if (alert.slideshowOptions.showCounter === 'dots') {
                        content += "<div class='ja_slideshow_dots' role='tablist' aria-label='Slide navigation'></div>";
                    } else if (alert.slideshowOptions.showCounter === 'numbers') {
                        content += "<div class='ja_slideshow_counter' aria-live='polite'>1 / 1</div>";
                    }
                }
                
                content += "</div>";
                
                // Add thumbnails at bottom if enabled
                if (showThumbnails && validThumbnailLocation === 'bottom') {
                    content += "<div class='ja_slideshow_thumbnails ja_slideshow_thumbnails_bottom' role='tablist' aria-label='Thumbnail navigation'></div>";
                }
                
                content += "</div>";

                // Add slideshow functionality to onOpen
                alert.onOpen.unshift(function(elem) {
                    const alertData = elem.data('jAlert');
                    if (!alertData) return; // Safety check
                    
                    const slideshow = alertData.slideshow;
                    const slideshowOptions = alertData.slideshowOptions || {};
                    
                    const container = elem.find('.ja_slideshow_container');
                    const slideContainer = elem.find('.ja_slideshow_slide');
                    const counter = elem.find('.ja_slideshow_counter');
                    const dots = elem.find('.ja_slideshow_dots');
                    // Only support top/bottom thumbnail positioning
                    const validLocation = (slideshowOptions.thumbnailLocation === 'top') ? 'top' : 'bottom';
                    const thumbnails = elem.find('.ja_slideshow_thumbnails_' + validLocation);
                    const prevBtn = elem.find('.ja_slideshow_prev');
                    const nextBtn = elem.find('.ja_slideshow_next');
                    
                    let slides = [];
                    let currentIndex = 0;
                    let autoAdvanceTimer = null;
                    let loadedImages = 0;
                    let totalImages = 0;
                    
                    // Only allow arrays of strings or objects
                    if (Array.isArray(slideshow)) {
                        slides = slideshow.map((slide, index) => {
                            if (typeof slide === 'string') {
                                // Auto-detect video URLs and convert to appropriate object format
                                if (slide.includes('youtube.com') || slide.includes('vimeo.com') || slide.includes('.mp4') || slide.includes('.webm') || slide.includes('.ogg')) {
                                    return { type: 'video', src: slide, index };
                                } else {
                                    return { type: 'image', src: slide, index };
                                }
                            } else if (typeof slide === 'object' && (slide.imageUrl || slide.src)) {
                                // Preserve the original type if specified, otherwise default to image
                                const slideType = slide.type || 'image';
                                const slideSrc = slide.imageUrl || slide.src;
                                const normalizedSlide = { ...slide, type: slideType, src: slideSrc, index };
                                return normalizedSlide;
                            } else {
                                return null;
                            }
                        }).filter(Boolean);
                    }
                    // If not a valid array, show error
                    if (!slides.length) {
                        alertData.instance.closeAlert(true);
                        setTimeout(() => {
                            $.jAlert({
                                title: 'Slideshow Error',
                                content: 'No slides found. Please provide an array of image URLs or slide objects.',
                                theme: 'red',
                                size: 'sm',
                                closeOnClick: true
                            });
                        }, 100);
                        return;
                    }
                    totalImages = slides.length;
                    
                    // Slideshow state management for lifecycle and race condition prevention
                    const slideshowState = {
                        active: true,
                        closing: false,
                        closed: false,
                        endedNaturally: false,
                        hasEndedNaturally: false,
                        
                        isActive() {
                            return this.active && !this.closing && !this.closed;
                        },
                        
                        markClosing() {
                            this.closing = true;
                            this.active = false;
                        },
                        
                        markClosed() {
                            this.closed = true;
                            this.closing = false;
                            this.active = false;
                        },
                        
                        markEndedNaturally() {
                            this.endedNaturally = true;
                            this.hasEndedNaturally = true;
                        },
                        
                        canExecuteCallbacks() {
                            return this.isActive() && !this.closing;
                        }
                    };
                    
                    // Lifecycle event system for slideshow state changes
                    const lifecycleEvents = {
                        listeners: {},
                        emit(event, data) {
                            if (this.listeners[event]) {
                                this.listeners[event].forEach(callback => {
                                    try {
                                        callback(data);
                                    } catch (e) {
                                        console.error('Slideshow lifecycle event error:', e);
                                    }
                                });
                            }
                        },
                        on(event, callback) {
                            if (!this.listeners[event]) {
                                this.listeners[event] = [];
                            }
                            this.listeners[event].push(callback);
                        }
                    };
                    
                    // Simplified slideshow sizing utilities
                    const SlideshowSizing = {
                        // Calculate total modal overhead (title + buttons + thumbnails)
                        calculateModalOverhead(modal, slideshowWrap) {
                            const title = modal.find('.ja_title');
                            const buttons = modal.find('.ja_btn_wrap');
                            const body = modal.find('.ja_body');
                            const thumbnails = modal.find('.ja_slideshow_thumbnails');
                            
                            // Get actual rendered heights with better fallback handling
                            let titleHeight = 0;
                            if (title.length) {
                                if (title.is(':visible')) {
                                    titleHeight = title.outerHeight(true);
                                } else {
                                    // Try to force measure by temporarily showing
                                    const originalDisplay = title.css('display');
                                    const originalVisibility = title.css('visibility');
                                    title.css({ 'display': 'block', 'visibility': 'hidden' });
                                    titleHeight = title.outerHeight(true);
                                    title.css({ 'display': originalDisplay, 'visibility': originalVisibility });
                                }
                                // Fallback for titles that exist but aren't measured properly
                                if (titleHeight === 0 && title.text().trim()) {
                                    titleHeight = 40; // Estimated title height
                                }
                            }
                            
                            let buttonHeight = 0;
                            if (buttons.length) {
                                if (buttons.is(':visible')) {
                                    buttonHeight = buttons.outerHeight(true);
                                } else if (buttons.find('.ja_btn, button, a').length > 0) {
                                    // Estimate button height if buttons exist but aren't visible
                                    buttonHeight = 50; // Estimated button area height
                                }
                            }
                            
                            const bodyPadding = (parseInt(body.css('padding-top')) || 0) + (parseInt(body.css('padding-bottom')) || 0);
                            
                            // For thumbnails, ensure we get the height even if they're being created
                            let thumbnailHeight = 0;
                            if (thumbnails.length) {
                                if (thumbnails.is(':visible')) {
                                    thumbnailHeight = thumbnails.outerHeight(true);
                                } else {
                                    // Check if parent has thumbnails class indicating they should be shown
                                    const slideshowWrapHasThumbnails = modal.find('.ja_slideshow_has_thumbnails').length > 0;
                                    if (slideshowWrapHasThumbnails) {
                                        // If thumbnails exist but aren't visible yet, estimate based on CSS
                                        const isTablet = window.innerWidth >= 481 && window.innerWidth <= 1024;
                                        const isMobile = window.innerWidth <= 480;
                                        if (isMobile) {
                                            thumbnailHeight = 60; // Mobile thumbnail height
                                        } else if (isTablet) {
                                            thumbnailHeight = 70; // Tablet thumbnail height  
                                        } else {
                                            thumbnailHeight = 80; // Desktop thumbnail height
                                        }
                                    }
                                }
                            }
                            
                            // Add modal margins if they exist
                            const modalMargins = (parseInt(modal.css('margin-top')) || 0) + (parseInt(modal.css('margin-bottom')) || 0);
                            
                            // Calculate total with 20px safety margin
                            const total = titleHeight + buttonHeight + bodyPadding + thumbnailHeight + modalMargins + 20;
                            
                            return {
                                title: titleHeight,
                                buttons: buttonHeight,
                                bodyPadding: bodyPadding,
                                thumbnails: thumbnailHeight,
                                modalMargins: modalMargins,
                                total: total
                            };
                        },
                        
                        // Calculate available space for slideshow content
                        calculateAvailableSpace(modal, slideshowWrap, modalSize) {
                            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                            const overhead = this.calculateModalOverhead(modal, slideshowWrap);
                            
                            // For full-screen modals, still calculate properly by subtracting overhead from viewport
                            // This ensures slideshows respect title, thumbnails, buttons, etc.
                            if (modalSize === 'full') {
                                const availableHeight = Math.max(200, viewportHeight - overhead.total);
                                
                                return {
                                    viewport: { width: window.innerWidth, height: viewportHeight },
                                    overhead: overhead,
                                    available: availableHeight
                                };
                            }
                            
                            // For other modal sizes, use traditional overhead calculation
                            return {
                                viewport: { width: window.innerWidth, height: viewportHeight },
                                overhead: overhead,
                                available: Math.max(200, viewportHeight - overhead.total)
                            };
                        },
                        
                        // Setup slideshow container for contain mode (real images)
                        setupContainMode(slideContainer, availableHeight, isAutoSize = false) {
                            // Remove cover mode class if it was previously set
                            slideContainer.removeClass('ja_cover_mode');
                            
                            // For contain mode, always let container size naturally to content
                            slideContainer.css({
                                'width': '100%',
                                'height': 'auto',  // Always auto - let it size to image
                                'display': 'flex',
                                'align-items': 'center',
                                'justify-content': 'center',
                                'overflow': 'hidden',
                                'background': 'none',
                                'padding-bottom': '0'
                            });
                            
                            // For auto-sized modals, reduce available height a bit more to account for dynamic sizing
                            const imageMaxHeight = isAutoSize ? Math.max(200, availableHeight - 50) : availableHeight;
                            
                            return { 
                                mode: 'contain', 
                                maxImageHeight: imageMaxHeight,  // Use adjusted height for images
                                isAutoSize: isAutoSize
                            };
                        },
                        
                        // Setup slideshow container for cover mode (background images)
                        setupCoverMode(slideContainer, availableHeight, isFullScreen = false) {
                            // Get the actual width of the container to create a square
                            let containerWidth = slideContainer.width();
                            
                            // Fallback to parent widths if slideContainer isn't sized yet
                            if (!containerWidth || containerWidth === 0) {
                                const body = slideContainer.closest('.ja_body');
                                const modal = slideContainer.closest('.jAlert');
                                
                                containerWidth = body.width() || modal.width() || 400; // 400px fallback
                            }
                            
                            // Create square dimensions based on actual container width
                            let finalHeight = containerWidth; // Square by default
                            
                                        if (isFullScreen) {
                // For full-screen modals, use more generous constraints
                // Allow up to the full available height, constrained only by viewport
                const maxAllowedHeight = Math.min(availableHeight, window.innerHeight * 0.95);
                finalHeight = Math.min(finalHeight, maxAllowedHeight);
            } else {
                                // For regular modals, apply more conservative constraints
                                const maxAllowedHeight = Math.min(availableHeight * 1.5, window.innerHeight * 0.8);
                                finalHeight = Math.min(finalHeight, maxAllowedHeight);
                            }
                            
                            // Add cover mode class for CSS targeting
                            slideContainer.addClass('ja_cover_mode');
                            
                            slideContainer.css({
                                'width': '100%',
                                'height': finalHeight + 'px',
                                'background-size': 'cover',
                                'background-position': 'center center',
                                'background-repeat': 'no-repeat',
                                'display': 'block',
                                'padding-bottom': '0'
                            });
                            
                                        return { 
                mode: 'cover', 
                height: finalHeight, 
                width: containerWidth
            };
                        },
                        
                        // Create real image element for contain mode (simplified for flexbox)
                        createContainImage(slide, maxImageHeight = null, isAutoSize = false) {
                            // With flexbox layout, we just need max-width/max-height: 100%
                            // The flex container will handle the space allocation
                            const imageStyle = 'max-width: 100%; max-height: 100%; width: auto; height: auto; display: block; object-fit: contain;';
                            
                            return `<img src="${slide.src}" alt="${slide.altText || ''}" class="ja_slideshow_img" style="${imageStyle}">`;
                        },
                        
                        // Apply background image for cover mode
                        applyBackgroundImage(container, slide) {
                            container.css('background-image', `url(${slide.src})`);
                        }
                    };

                    // Function to setup slideshow sizing (replaces complex calculations)
                    function setupSlideshowSizing(elem, slides, alertData, forceRecalculation = false) {
                        if (!slides || slides.length === 0) return;
                        
                        // Find the modal element - if elem is already the modal, use it directly
                        let modalElem;
                        if (elem.hasClass('jAlert')) {
                            modalElem = elem;
                        } else {
                            modalElem = elem.parents('.jAlert:first');
                            if (modalElem.length === 0) {
                                modalElem = elem.closest('.jAlert');
                            }
                        }
                        
                        const slideContainer = elem.find('.ja_slideshow_slide');
                        const slideshowWrap = elem.find('.ja_slideshow_wrap');
                        const slideshowOptions = alertData.slideshowOptions || {};
                        
                        // Get imageSize from slideshowOptions or default to 'contain'
                        const imageSize = slideshowOptions.imageSize || 'contain';
                        const isAutoSize = alertData.size === 'auto';
                        const isFullScreen = alertData.size === 'full';
                        
                        // For forced recalculation or if sizing info doesn't exist, recalculate
                        if (forceRecalculation || !alertData.slideshowSizing) {
                            // Calculate available space for slideshow (pass modal size for special handling)
                            const spaceInfo = SlideshowSizing.calculateAvailableSpace(modalElem, slideshowWrap, alertData.size);
                            
                            // Setup container based on imageSize
                            let setupResult;
                            if (imageSize === 'cover') {
                                // Cover mode: CSS handles the square sizing automatically via aspect-ratio
                                setupResult = { mode: 'cover' };
                            } else {
                                // Default to contain mode
                                setupResult = SlideshowSizing.setupContainMode(slideContainer, spaceInfo.available, isAutoSize);
                            }
                            
                            // Store sizing info for later use
                            alertData.slideshowSizing = {
                                imageSize: imageSize,
                                availableHeight: imageSize === 'cover' ? null : spaceInfo.available, // Cover mode doesn't need height
                                mode: imageSize === 'cover' ? 'cover' : 'contain',
                                isAutoSize: isAutoSize,
                                isFullScreen: isFullScreen,
                                overhead: imageSize === 'cover' ? null : spaceInfo.overhead, // Cover mode doesn't need overhead
                                maxImageHeight: imageSize === 'cover' ? null : (setupResult.maxImageHeight || spaceInfo.available)
                            };
                        }
                        
                        return alertData.slideshowSizing;
                    }
                    
                    // Note: setupSlideshowSizing will be called after thumbnails are created
                    
                    // Enhanced window resize handler with proper debouncing and image updates
                    let resizeTimer = null;
                    $(window).on('resize.ja_slideshow_' + alertData.id, function() {
                        if (slides.length > 0) {
                            // Clear existing timer for debouncing
                            if (resizeTimer) {
                                clearTimeout(resizeTimer);
                            }
                            
                            // Debounced resize handling
                            resizeTimer = setTimeout(() => {
                                // Recalculate sizing info (force recalculation on resize)
                                setupSlideshowSizing(elem, slides, alertData, true);
                                
                                // Update current loaded slide with new sizing
                                updateCurrentSlideOnResize();
                                
                                resizeTimer = null;
                            }, 100); // Increased debounce time for better performance
                        }
                    });
                    
                    // Function to update the current slide when viewport resizes
                    function updateCurrentSlideOnResize() {
                        const slideContainer = elem.find('.ja_slideshow_slide');
                        const currentSlide = slides[currentIndex];
                        
                        if (!currentSlide || currentSlide.type !== 'image') return;
                        
                        const sizingInfo = alertData.slideshowSizing;
                        if (!sizingInfo) return;
                        
                        const imageSize = sizingInfo.imageSize || 'contain';
                        
                        if (imageSize === 'cover') {
                            // For cover mode, CSS handles the square sizing automatically - no JS needed
                        } else {
                            // For contain mode, update max-height of existing image
                            const existingImage = slideContainer.find('img');
                            if (existingImage.length > 0) {
                                const newMaxHeight = sizingInfo.maxImageHeight;
                                if (newMaxHeight && newMaxHeight > 100) {
                                    // Update the max-height style of the existing image
                                    existingImage.css('max-height', newMaxHeight + 'px');
                                }
                            }
                            
                            // Also update container sizing
                            SlideshowSizing.setupContainMode(slideContainer, sizingInfo.availableHeight, sizingInfo.isAutoSize);
                        }
                    }
                    
                    // Create dots if enabled
                    if (slideshowOptions.showCounter === 'dots') {
                        let dotsHTML = '';
                        for (let i = 0; i < slides.length; i++) {
                            dotsHTML += '<button type="button" class="ja_slideshow_dot" data-slide="' + i + '" role="tab" aria-label="Go to slide ' + (i + 1) + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '" tabindex="0"></button>';
                        }
                        dots.html(dotsHTML);
                        // Ensure tabindex is set
                        dots.find('.ja_slideshow_dot').attr('tabindex', '0');
                    }
                    
                    // Create thumbnails if enabled (for slideshows with 1 or more slides)
                    if (slideshowOptions.showThumbnails && slides.length >= 1) {
                        let thumbnailsHTML = '';
                        for (let i = 0; i < slides.length; i++) {
                            const slide = slides[i];
                            let thumbnailSrc = slide.thumbnail;
                            let thumbnailClass = 'ja_slideshow_thumbnail_bg';
                            let thumbnailStyle = '';
                            
                            if (slide.type === 'image') {
                                // For image slides, use thumbnail or fall back to src
                                thumbnailSrc = thumbnailSrc || slide.src;
                                thumbnailStyle = 'background-image: url(' + thumbnailSrc + '); background-size: cover; background-position: center center;';
                            } else if (slide.type === 'video') {
                                // For video slides, use thumbnail or show video icon
                                if (thumbnailSrc) {
                                    thumbnailStyle = 'background-image: url(' + thumbnailSrc + '); background-size: cover; background-position: center center;';
                                } else {
                                    // Default video icon with dark gray background
                                    thumbnailClass += ' ja_slideshow_thumbnail_video';
                                    thumbnailStyle = 'background-color: #2c3e50; position: relative;';
                                }
                            }
                            
                            const thumbnailAlt = slide.altText || slide.caption || 'Slide ' + (i + 1);
                            const thumbnailTitle = slide.title || slide.caption || '';
                            
                            // For video slides without thumbnail, add the play icon
                            if (slide.type === 'video' && !thumbnailSrc) {
                                thumbnailsHTML += '<button type="button" class="ja_slideshow_thumbnail" data-slide="' + i + '" role="tab" aria-label="Go to slide ' + (i + 1) + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '" tabindex="0"' +
                                    (thumbnailTitle ? ' title="' + thumbnailTitle.replace(/"/g, '&quot;') + '"' : '') + ' data-alt="' + thumbnailAlt.replace(/"/g, '&quot;') + '">' +
                                    '<div class="' + thumbnailClass + '" style="' + thumbnailStyle + '"><span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 24px;">&#9654;</span></div>' +
                                    '</button>';
                            } else {
                                // Normal thumbnail button creation
                                thumbnailsHTML += '<button type="button" class="ja_slideshow_thumbnail" data-slide="' + i + '" role="tab" aria-label="Go to slide ' + (i + 1) + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '" tabindex="0"' +
                                    (thumbnailTitle ? ' title="' + thumbnailTitle.replace(/"/g, '&quot;') + '"' : '') + ' data-alt="' + thumbnailAlt.replace(/"/g, '&quot;') + '">' +
                                    '<div class="' + thumbnailClass + '" style="' + thumbnailStyle + '"></div>' +
                                    '</button>';
                            }
                        }
                        thumbnails.html(thumbnailsHTML);
                        // Ensure tabindex is set
                        thumbnails.find('.ja_slideshow_thumbnail').attr('tabindex', '0');
                        
                        // Test thumbnail images and handle loading errors (only for image slides)
                        thumbnails.find('.ja_slideshow_thumbnail').each(function(index) {
                            const thumbnailButton = $(this);
                            const thumbnailBg = thumbnailButton.find('.ja_slideshow_thumbnail_bg');
                            const slide = slides[index];
                            
                            // Safety check: ensure slide exists before accessing properties
                            if (!slide) {
                                console.warn('jAlert: Slide at index', index, 'is undefined or null');
                                return;
                            }
                            
                            // Only test loading for image slides that don't have custom thumbnail
                            if (slide.type === 'image' && !slide.thumbnail) {
                                const thumbnailSrc = slide.src;
                                
                                // Test if the thumbnail image loads
                                const testImg = new Image();
                                testImg.onload = function() {
                                    // Image loaded successfully - no action needed
                                };
                                testImg.onerror = function() {
                                    // Image failed to load - apply error styling
                                    thumbnailBg.addClass('error');
                                    thumbnailButton.attr('title', 'Thumbnail failed to load - Slide ' + (index + 1));
                                };
                                testImg.src = thumbnailSrc;
                            }
                        });
                        
                        // Add layout class to the slideshow wrap
                        elem.find('.ja_slideshow_wrap').addClass('ja_slideshow_has_thumbnails ja_slideshow_thumbnails_' + validLocation);
                    }
                    

                    
                    // Add class to modal to identify it as a slideshow modal (for CSS overrides)
                    const modalElement = elem.parents('.jAlert').first();
                    if (modalElement.length > 0) {
                        modalElement.addClass('ja_slideshow_modal');
                    } else {
                        // Fallback - try finding the modal differently
                        elem.closest('.jAlert').addClass('ja_slideshow_modal');
                    }
                    
                    // Advanced preloading logic with concurrency limit and abort on close
                    alertData._abortPreloadFlag = false;
                    alertData._abortPreload = () => { alertData._abortPreloadFlag = true; };
                    function preloadSlideImages() {
                        if (!slideshowOptions.preload || slides.length <= 1) return;
                        
                        let thumbnailSrcSet = null;
                        if (slideshowOptions.showThumbnails) {
                            thumbnailSrcSet = new Set();
                            for (let i = 0; i < slides.length; i++) {
                                const slide = slides[i];
                                if (!slide) continue; // Skip undefined/null slides
                                const thumbnailSrc = slide.thumbnail || slide.src;
                                if (thumbnailSrc) thumbnailSrcSet.add(thumbnailSrc);
                            }
                        }
                        // Build a list of media to preload (skip those already loaded as thumbnails)
                        const allToPreload = [];
                        for (let i = 0; i < slides.length; i++) {
                            const slide = slides[i];
                            if (!slide) continue; // Skip undefined/null slides
                            if (slide.type === 'image' && slide.src) {
                                if (thumbnailSrcSet && thumbnailSrcSet.has(slide.src)) continue;
                                allToPreload.push({ src: slide.src, index: i, type: 'image' });
                            } else if (slide.type === 'video' && slide.src) {
                                // For videos, we could preload metadata or poster images
                                if (slide.poster && !thumbnailSrcSet.has(slide.poster)) {
                                    allToPreload.push({ src: slide.poster, index: i, type: 'video-poster' });
                                }
                            }
                        }
                        
                        let prioritized = [];
                        let rest = [];
                        if (slideshowOptions.loop) {
                            // First 5 and last 5 (excluding duplicates)
                            const first5 = allToPreload.slice(0, 5);
                            const last5 = allToPreload.slice(-5);
                            const seen = new Set();
                            prioritized = [...first5, ...last5].filter(img => {
                                if (seen.has(img.src)) return false;
                                seen.add(img.src);
                                return true;
                            });
                            rest = allToPreload.filter(img => !seen.has(img.src));
                        } else {
                            // First 10
                            prioritized = allToPreload.slice(0, 10);
                            const seen = new Set(prioritized.map(img => img.src));
                            rest = allToPreload.filter(img => !seen.has(img.src));
                        }
                        const toPreload = [...prioritized, ...rest];
                        
                        let concurrent = 0;
                        let index = 0;
                        const maxConcurrent = 10;
                        function next() {
                            if (alertData._abortPreloadFlag) return;
                            while (concurrent < maxConcurrent && index < toPreload.length) {
                                const src = toPreload[index++].src;
                                concurrent++;
                                const img = new Image();
                                img.onload = img.onerror = function() {
                                    concurrent--;
                                    next();
                                };
                                img.src = src;
                            }
                        }
                        next();
                    }
                    // On modal close, abort preloading
                    if (!alertData._preloadCleanupAdded) {
                        alertData._preloadCleanupAdded = true;
                        if (!Array.isArray(alertData.onClose)) alertData.onClose = [alertData.onClose].filter(Boolean);
                        alertData.onClose.push(function() {
                            if (typeof alertData._abortPreload === 'function') alertData._abortPreload();
                        });
                    }

                    // Initialize slideshow sizing after all elements are created
                    if (slides.length > 0) {
                        // Setup slideshow sizing with a delay to ensure DOM is ready and ALL elements are rendered
                        // This includes thumbnails which may have just been added above
                        setTimeout(() => {
                            // Remove initial slideshow loader now that setup is complete
                            elem.find('.ja_slideshow_wrap > .ja_loader').remove();
                            elem.find('.ja_body').removeClass('ja_loading'); // Remove loading class
                            
                            setupSlideshowSizing(elem, slides, alertData, true); // Force initial calculation
                            
                            // Load first slide AFTER sizing is initialized (critical for cover mode)
                            loadSlide(0, true);
                            
                            // Start preloading other images if enabled (after first slide starts loading)
                            setTimeout(() => {
                                preloadSlideImages();
                            }, 100); // Small delay after first slide starts loading
                        }, 300); // Longer delay to ensure thumbnails and all elements are fully rendered
                    }
                    
                    // Update counter
                    function updateCounter() {
                        if (slideshowOptions.showCounter === 'numbers') {
                            counter.text(`${currentIndex + 1} / ${slides.length}`);
                        } else if (slideshowOptions.showCounter === 'dots') {
                            dots.find('.ja_slideshow_dot').removeClass('active').attr('aria-selected', 'false');
                            dots.find('.ja_slideshow_dot[data-slide="' + currentIndex + '"]').addClass('active').attr('aria-selected', 'true');
                            // Ensure tabindex is preserved
                            dots.find('.ja_slideshow_dot').attr('tabindex', '0');
                        }
                        
                        // Dynamic positioning of dots/counter above captions
                        const currentSlide = slides[currentIndex];
                        const hasCaption = currentSlide && currentSlide.caption;
                        
                        if (hasCaption) {
                            // Find the caption element
                            const captionElement = slideContainer.find('.ja_slideshow_caption');
                            if (captionElement.length > 0) {
                                const captionRect = captionElement[0].getBoundingClientRect();
                                const slideContainerRect = slideContainer[0].getBoundingClientRect();
                                
                                // Calculate position 5px above the caption
                                const captionTop = captionRect.top - slideContainerRect.top;
                                const newBottom = slideContainerRect.height - captionTop + 5;
                                
                                // Apply to both counter and dots
                                if (counter.length > 0) {
                                    counter.css('bottom', newBottom + 'px');
                                }
                                if (dots.length > 0) {
                                    dots.css('bottom', newBottom + 'px');
                                }
                            }
                        } else {
                            // Reset to default position when no caption
                            if (counter.length > 0) {
                                counter.css('bottom', '10px');
                            }
                            if (dots.length > 0) {
                                dots.css('bottom', '10px');
                            }
                        }
                        
                        // Update thumbnails
                        if (slideshowOptions.showThumbnails && thumbnails.length > 0) {
                            thumbnails.find('.ja_slideshow_thumbnail').removeClass('active').attr('aria-selected', 'false');
                            thumbnails.find('.ja_slideshow_thumbnail[data-slide="' + currentIndex + '"]').addClass('active').attr('aria-selected', 'true');
                            // Ensure tabindex is preserved
                            thumbnails.find('.ja_slideshow_thumbnail').attr('tabindex', '0');
                            
                            // Scroll thumbnail into view (horizontal scrolling only for top/bottom)
                            const activeThumbnail = thumbnails.find('.ja_slideshow_thumbnail[data-slide="' + currentIndex + '"]');
                            if (activeThumbnail.length > 0) {
                                const thumbnailsContainer = thumbnails[0];
                                const thumbnailElement = activeThumbnail[0];
                                
                                // Calculate scroll position to center the active thumbnail horizontally
                                const containerWidth = thumbnailsContainer.clientWidth;
                                const thumbnailWidth = thumbnailElement.offsetWidth;
                                const thumbnailLeft = thumbnailElement.offsetLeft;
                                
                                const scrollPosition = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
                                    thumbnailsContainer.scrollLeft = Math.max(0, scrollPosition);
                            }
                        }
                    }
                    
                    // Simplified load slide function
                    function loadSlide(index, isInitialLoad = false) {
                        if (!slideshowState.isActive()) {
                            return;
                        }
                        
                        if (index < 0 || index >= slides.length) return;
                        
                        // Trigger onBeforeSlideChange event (but not for initial load)
                        if (!isInitialLoad && typeof slideshowOptions.onBeforeSlideChange === 'function' && slideshowState.canExecuteCallbacks()) {
                            const result = slideshowOptions.onBeforeSlideChange(alertData.instance, currentIndex + 1, index + 1);
                            if (result === false) return;
                        }
                        
                        currentIndex = index;
                        const slide = slides[index];
                        
                        if (slide.type === 'image') {
                            const slideshowOptions = alertData.slideshowOptions || {};
                            const imageSize = slideshowOptions.imageSize || 'contain';
                            
                            // Clear any existing content
                            slideContainer.empty();
                            
                            // Add loading class immediately to prevent flash/collapse
                            slideContainer.addClass('ja_loading');
                            
                            // Add loader with delay to prevent flicker on cached images
                            let loaderTimer = null;
                            let loaderShown = false;
                            
                            const showLoader = () => {
                                if (!loaderShown) {
                                    const loaderHtml = '<div class="ja_loader" role="status" aria-label="Loading slide">Loading...</div>';
                                    slideContainer.append(loaderHtml);
                                    loaderShown = true;
                                }
                            };
                            
                            // Show loader after 100ms delay (prevents flicker for cached images)
                            loaderTimer = setTimeout(showLoader, 100);
                            
                            if (imageSize === 'cover') {
                                // Cover mode: CSS creates square container, just apply background image
                                slideContainer.addClass('ja_cover_mode');
                                slideContainer.css('background-image', `url(${slide.src})`);
                            } else {
                                // Contain mode: real image element (simplified with flexbox)
                                slideContainer.removeClass('ja_cover_mode');
                                
                                const imageHTML = SlideshowSizing.createContainImage(slide);
                                slideContainer.append(imageHTML);
                            }
                            
                            // Set accessibility attributes
                            slideContainer.attr({
                                'data-alt': slide.altText || slide.caption || 'Slide ' + (currentIndex + 1),
                                'data-title': slide.title || slide.caption || ''
                            });
                            
                            // Add onClick handler if provided
                            if (slide.onClick) {
                                slideContainer.css('cursor', 'pointer');
                                slideContainer.off('click.slideshow').on('click.slideshow', function(e) {
                                    slide.onClick(e, slide, currentIndex + 1, alertData.instance);
                                });
                            } else {
                                slideContainer.css('cursor', '').off('click.slideshow');
                            }
                            
                            // Add caption if available
                            if (slide.caption) {
                                slideContainer.append('<div class="ja_slideshow_caption">' + slide.caption + '</div>');
                                // Update positioning after caption is added (with small delay to ensure rendering)
                                setTimeout(() => updateCounter(), 10);
                            }
                            
                            // Handle image loading - only remove loader when actual slide image loads
                            let loaderStartTime = Date.now();
                            const minLoaderTime = 300; // Minimum 300ms display time
                            
                            const removeLoader = function() {
                                // Cancel loader timer if image loads quickly
                                if (loaderTimer) {
                                    clearTimeout(loaderTimer);
                                    loaderTimer = null;
                                }
                                
                                const loaderCount = slideContainer.find('.ja_loader').length;
                                if (loaderCount > 0 || loaderShown) {
                                    const elapsed = Date.now() - loaderStartTime;
                                    const delay = loaderShown ? Math.max(0, minLoaderTime - elapsed) : 0;
                                    
                                    setTimeout(() => {
                                        slideContainer.find('.ja_loader').remove();
                                        slideContainer.removeClass('ja_loading'); // Remove loading class
                                        loaderShown = false;
                                    }, delay);
                                } else {
                                    // Remove loading class even if loader wasn't shown
                                    slideContainer.removeClass('ja_loading');
                                }
                            };
                            
                            // Listen for the actual image in the slide to load
                            const slideImage = slideContainer.find('img');
                            if (slideImage.length > 0) {
                                slideImage.on('load', function() {
                                    removeLoader();
                                    
                                    // Trigger onContentLoad event
                                    const onContentLoadCallback = (slideshowOptions && slideshowOptions.onContentLoad) || alertData.onContentLoad;
                                    if (typeof onContentLoadCallback === 'function' && slideshowState.canExecuteCallbacks()) {
                                        onContentLoadCallback(alertData.instance, 'image', slideContainer);
                                    }
                                });
                                
                                slideImage.on('error', function() {
                                    removeLoader();
                                    slideContainer.append('<div class="ja_slideshow_error">Failed to load image</div>');
                                });
                                
                                // If image is already loaded (cached), remove loader immediately
                                if (slideImage[0].complete && slideImage[0].naturalHeight !== 0) {
                                    removeLoader();
                                }
                            } else {
                                // No image element found, use temp image to detect load/error
                                const tempImg = new Image();
                                tempImg.onload = function() {
                                    removeLoader();
                                };
                                tempImg.onerror = function() {
                                    removeLoader();
                                    if (slideContainer.find('.ja_slideshow_error').length === 0) {
                                        slideContainer.append('<div class="ja_slideshow_error">Failed to load image</div>');
                                    }
                                };
                                tempImg.src = slide.src;
                            }
                            
                            // Fallback: remove loader after 10 seconds if still present
                            const fallbackTimer = setTimeout(function() {
                                if (slideContainer.find('.ja_loader').length > 0) {
                                    removeLoader();
                                }
                            }, 10000);
                            
                            // Store timer for cleanup
                            if (!slideContainer.data('timers')) {
                                slideContainer.data('timers', []);
                            }
                            slideContainer.data('timers').push(fallbackTimer);
                        } else if (slide.type === 'video') {
                            // Clear any existing content
                            slideContainer.empty();
                            
                            // Add loading class immediately to prevent flash/collapse
                            slideContainer.addClass('ja_loading');
                            
                            // Set accessibility attributes
                            slideContainer.attr({
                                'data-alt': slide.altText || slide.caption || 'Video slide ' + (currentIndex + 1),
                                'data-title': slide.title || slide.caption || ''
                            });
                            
                            // Add onClick handler if provided
                            if (slide.onClick) {
                                slideContainer.css('cursor', 'pointer');
                                slideContainer.off('click.slideshow').on('click.slideshow', function(e) {
                                    slide.onClick(e, slide, currentIndex + 1, alertData.instance);
                                });
                            } else {
                                slideContainer.css('cursor', '').off('click.slideshow');
                            }
                            
                            // Add caption if available
                            if (slide.caption) {
                                slideContainer.append('<div class="ja_slideshow_caption">' + slide.caption + '</div>');
                                // Update positioning after caption is added (with small delay to ensure rendering)
                                setTimeout(() => updateCounter(), 10);
                            }
                            
                            // iframe videos 
                            if (slide.embedType === 'iframe') {
                                // Use the utility function to create iframe video
                                const videoResult = utils.createIframeVideo(slide, {
                                    onLoad: function(iframe, container) {
                                        slideContainer.removeClass('ja_loading');
                                        slideContainer.find('iframe').show();
                                        
                                        // Trigger onContentLoad event
                                        const slideshowOptions = alertData.slideshowOptions || {};
                                        const onContentLoadCallback = (slideshowOptions && slideshowOptions.onContentLoad) || alertData.onContentLoad;
                                        if (typeof onContentLoadCallback === 'function' && slideshowState.canExecuteCallbacks()) {
                                            onContentLoadCallback(alertData.instance, 'video', slideContainer);
                                        }
                                    },
                                    onError: function(iframe, container) {
                                        slideContainer.removeClass('ja_loading');
                                        
                                        // Trigger onContentLoad event even on error for consistency
                                        const slideshowOptions = alertData.slideshowOptions || {};
                                        const onContentLoadCallback = (slideshowOptions && slideshowOptions.onContentLoad) || alertData.onContentLoad;
                                        if (typeof onContentLoadCallback === 'function' && slideshowState.canExecuteCallbacks()) {
                                            onContentLoadCallback(alertData.instance, 'video', slideContainer);
                                        }
                                    }
                                });
                                
                                // Append the container to the slide
                                slideContainer.append(videoResult.container);
                                
                            } else {
                                // Use the utility function to create HTML5 video
                                const videoResult = utils.createHtml5Video(slide, {
                                    onLoad: function(video, container) {
                                        slideContainer.removeClass('ja_loading');
                                        
                                        // Trigger onContentLoad event
                                        const slideshowOptions = alertData.slideshowOptions || {};
                                        const onContentLoadCallback = (slideshowOptions && slideshowOptions.onContentLoad) || alertData.onContentLoad;
                                        if (typeof onContentLoadCallback === 'function' && slideshowState.canExecuteCallbacks()) {
                                            onContentLoadCallback(alertData.instance, 'video', slideContainer);
                                        }
                                    },
                                    onError: function(video, container) {
                                        slideContainer.removeClass('ja_loading');
                                        
                                        // Trigger onContentLoad event even on error for consistency
                                        const slideshowOptions = alertData.slideshowOptions || {};
                                        const onContentLoadCallback = (slideshowOptions && slideshowOptions.onContentLoad) || alertData.onContentLoad;
                                        if (typeof onContentLoadCallback === 'function' && slideshowState.canExecuteCallbacks()) {
                                            onContentLoadCallback(alertData.instance, 'video', slideContainer);
                                        }
                                    }
                                });
                                
                                // Append the container to the slide
                                slideContainer.append(videoResult.container);
                            }
                            
                            // Fallback: remove loader after 10 seconds if still present
                            const fallbackTimer = setTimeout(function() {
                                if (slideContainer.find('.ja_loader').length > 0) {
                                    slideContainer.find('.ja_loader').remove();
                                    slideContainer.removeClass('ja_loading');
                                }
                            }, 10000);
                            
                            // Store timer for cleanup
                            if (!slideContainer.data('timers')) {
                                slideContainer.data('timers', []);
                            }
                            slideContainer.data('timers').push(fallbackTimer);
                        }
                        
                        updateCounter();
                        
                        // Trigger slide onShow callback
                        if (slide.onShow) {
                            setTimeout(() => {
                                slide.onShow(slide, currentIndex + 1, alertData.instance);
                            }, 10);
                        }
                        
                        // Update navigation buttons
                        if (slideshowOptions.loop) {
                            prevBtn.removeClass('disabled');
                            nextBtn.removeClass('disabled');
                        } else {
                            prevBtn.toggleClass('disabled', currentIndex === 0);
                            nextBtn.toggleClass('disabled', currentIndex === slides.length - 1);
                        }
                        
                        // Trigger onSlideChange event (only if modal is still active)
                        // Get slideshowOptions from stored data if closure context is lost
                        const currentSlideshowOptions = slideshowOptions || elem.data('slideshow')?.slideshowOptions;
                        if (typeof currentSlideshowOptions?.onSlideChange === 'function' && slideshowState.canExecuteCallbacks()) {
                            // Check if modal exists and is in DOM before firing callback
                            if (alertData.instance && alertData.instance.length > 0) {
                                // Pass the correct parameters: modal, slideNumber (1-based)
                                currentSlideshowOptions.onSlideChange(alertData.instance, currentIndex + 1);
                            }
                        }
                    }
                    
                    // Navigation functions
                    function nextSlide() {
                        if (!slideshowState.isActive()) {
                            return;
                        }
                        
                        if (currentIndex < slides.length - 1) {
                            loadSlide(currentIndex + 1);
                        } else if (slideshowOptions.loop) {
                            // Trigger onSlideshowLoop event
                            if (typeof slideshowOptions.onSlideshowLoop === 'function') {
                                slideshowOptions.onSlideshowLoop(alertData.instance, 1); // Going to slide 1
                            }
                            // Loop back to first slide
                            loadSlide(0);
                        }
                        // If we're at the last slide and loop is disabled, do nothing
                    }
                    
                    function prevSlide() {
                        if (!slideshowState.isActive()) {
                            return;
                        }
                        
                        if (currentIndex > 0) {
                            loadSlide(currentIndex - 1);
                        } else if (slideshowOptions.loop) {
                            // Trigger onSlideshowLoop event
                            if (typeof slideshowOptions.onSlideshowLoop === 'function') {
                                slideshowOptions.onSlideshowLoop(alertData.instance, slides.length); // Going to last slide
                            }
                            // Loop to last slide
                            loadSlide(slides.length - 1);
                        }
                        // If we're at the first slide and loop is disabled, do nothing
                    }
                    
                    // Auto advance
                    function startAutoAdvance() {
                        if (!slideshowState.isActive()) {
                            return;
                        }
                        
                        if (slideshowOptions.autoAdvance && slideshowOptions.autoAdvanceInterval) {
                            autoAdvanceTimer = setInterval(() => {
                                // Check if we're at the last slide in a non-looping slideshow
                                if (!slideshowOptions.loop && currentIndex === slides.length - 1) {
                                    // Stop auto advance
                                    stopAutoAdvance();
                                    
                                    // Check if we can execute the callback before marking as ended
                                    const canExecute = typeof slideshowOptions.onSlideshowEnd === 'function' && 
                                                      slideshowState.isActive() && 
                                                      alertData.instance && 
                                                      alertData.instance.is(':visible') && 
                                                      alertData.instance.data('slideshow');
                                    
                                    // Mark slideshow as ended naturally
                                    slideshowState.markEndedNaturally();
                                    
                                    // Execute callback if possible
                                    if (canExecute) {
                                        slideshowOptions.onSlideshowEnd(alertData.instance, currentIndex + 1); // 1-based slide number
                                        
                                        // Immediately invalidate the callback to prevent multiple calls
                                        slideshowOptions.onSlideshowEnd = null;
                                    }
                                    // Don't call nextSlide() or restart timer - slideshow is done
                                } else {
                                    nextSlide();
                                }
                            }, slideshowOptions.autoAdvanceInterval);
                        }
                    }
                    
                    function stopAutoAdvance() {
                        if (autoAdvanceTimer) {
                            clearInterval(autoAdvanceTimer);
                            autoAdvanceTimer = null;
                        }
                    }
                    
                    // Event handlers with namespaced events for easier cleanup
                    nextBtn.on('click.ja_slideshow', function() {
                        if (!slideshowState.isActive()) return;
                        
                        stopAutoAdvance();
                        nextSlide();
                        // Only restart auto-advance if slideshow is still active
                        if (slideshowState.isActive()) {
                            startAutoAdvance();
                        }
                    });
                    
                    prevBtn.on('click.ja_slideshow', function() {
                        if (!slideshowState.isActive()) return;
                        
                        stopAutoAdvance();
                        prevSlide();
                        // Only restart auto-advance if slideshow is still active
                        if (slideshowState.isActive()) {
                            startAutoAdvance();
                        }
                    });
                    
                    // Dot click handlers
                    if (slideshowOptions.showCounter === 'dots') {
                        dots.on('click.ja_slideshow', '.ja_slideshow_dot', function() {
                            if (!slideshowState.isActive()) return;
                            
                            const slideIndex = parseInt($(this).data('slide'));
                            if (slideIndex !== currentIndex) {
                                stopAutoAdvance();
                                loadSlide(slideIndex);
                                // Only restart auto-advance if slideshow is still active
                                if (slideshowState.isActive()) {
                                    startAutoAdvance();
                                }
                            }
                        });
                    }
                    
                    // Thumbnail click handlers and drag scrolling setup
                    if (slideshowOptions.showThumbnails && thumbnails.length > 0) {
                        // The thumbnails element itself is the scrollable container (has both classes)
                        setupThumbnailDragScrolling(thumbnails);
                        
                        // Thumbnail click handlers (with drag prevention)
                        thumbnails.on('click.ja_slideshow', '.ja_slideshow_thumbnail', function(e) {
                            if (!slideshowState.isActive()) return;
                            
                            // Check if we were dragging
                            if (thumbnails.data('was-dragging')) {
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                            }
                            
                            const slideIndex = parseInt($(this).data('slide'));
                            if (slideIndex !== currentIndex) {
                                stopAutoAdvance();
                                loadSlide(slideIndex);
                                // Only restart auto-advance if slideshow is still active
                                if (slideshowState.isActive()) {
                                    startAutoAdvance();
                                }
                            }
                        });
                    }
                    
                    // Setup thumbnail drag/touch scrolling functionality
                    function setupThumbnailDragScrolling(thumbnailContainer) {
                        const container = thumbnailContainer[0];
                        if (!container) return;
                        
                        let isDown = false;
                        let startX = 0;
                        let scrollLeft = 0;
                        let hasDragged = false;
                        const dragThreshold = 8; // Pixels to move before it's considered a drag
                        
                        // Mouse events for desktop drag scrolling
                        thumbnailContainer.on('mousedown', function(e) {
                            isDown = true;
                            hasDragged = false;
                            startX = e.pageX;
                            scrollLeft = container.scrollLeft;
                            thumbnailContainer.addClass('dragging');
                            e.preventDefault();
                        });
                        
                        $(document).on('mousemove.thumbnail-drag', function(e) {
                            if (!isDown) return;
                            
                            const x = e.pageX;
                            const distance = Math.abs(x - startX);
                            
                            // Only start dragging if moved beyond threshold
                            if (distance > dragThreshold) {
                                e.preventDefault();
                                hasDragged = true;
                                const walk = (x - startX) * 1.5; // Scroll speed multiplier
                                container.scrollLeft = scrollLeft - walk;
                            }
                        });
                        
                        $(document).on('mouseup.thumbnail-drag', function() {
                            if (isDown) {
                                isDown = false;
                                thumbnailContainer.removeClass('dragging');
                                if (hasDragged) {
                                    thumbnailContainer.data('was-dragging', true);
                                    setTimeout(() => {
                                        thumbnailContainer.removeData('was-dragging');
                                    }, 100);
                                }
                            }
                        });
                        
                        // Touch events for mobile/tablet  
                        let touchStartX = 0;
                        let touchScrollLeft = 0;
                        let touchHasDragged = false;
                        const touchDragThreshold = 15; // Larger threshold for touch
                        
                        thumbnailContainer[0].addEventListener('touchstart', function(e) {
                            touchHasDragged = false;
                            touchStartX = e.touches[0].clientX;
                            touchScrollLeft = container.scrollLeft;
                        }, { passive: true });
                        
                        thumbnailContainer[0].addEventListener('touchmove', function(e) {
                            const touchX = e.touches[0].clientX;
                            const walk = touchStartX - touchX;
                            
                            // Only start scrolling if moved beyond threshold
                            if (Math.abs(walk) > touchDragThreshold) {
                                touchHasDragged = true;
                                container.scrollLeft = touchScrollLeft + walk;
                                // Note: Not calling preventDefault() to avoid passive event warning
                            }
                        }, { passive: true });
                        
                        thumbnailContainer.on('touchend', function() {
                            if (touchHasDragged) {
                                thumbnailContainer.data('was-dragging', true);
                                setTimeout(() => {
                                    thumbnailContainer.removeData('was-dragging');
                                }, 100);
                            }
                        });
                        
                        // Cleanup on modal close
                        thumbnailContainer.data('cleanup-drag', function() {
                            $(document).off('mousemove.thumbnail-drag mouseup.thumbnail-drag');
                        });
                    }
                    
                    // Keyboard navigation
                    if (slideshowOptions.keyboardNav !== false) {
                        $(document).on('keydown.ja_slideshow_' + alertData.id, function(e) {
                            // Check if this modal is still active before responding to keyboard
                            if (!slideshowState.isActive()) {
                                return;
                            }
                            
                            if (e.keyCode === 37) { // Left arrow
                                stopAutoAdvance();
                                prevSlide();
                                // Only restart auto-advance if slideshow is still active
                                if (slideshowState.isActive()) {
                                    startAutoAdvance();
                                }
                            } else if (e.keyCode === 39) { // Right arrow
                                stopAutoAdvance();
                                nextSlide();
                                // Only restart auto-advance if slideshow is still active
                                if (slideshowState.isActive()) {
                                    startAutoAdvance();
                                }
                            }
                        });
                    }
                    
                    // Touch support for mobile devices
                    let touchStartX = 0;
                    let touchEndX = 0;
                    let touchStartHandler, touchEndHandler;
                    
                    // Store touch handlers for cleanup
                    touchStartHandler = function(e) {
                        touchStartX = e.touches[0].clientX;
                    };
                    
                    touchEndHandler = function(e) {
                        touchEndX = e.changedTouches[0].clientX;
                        handleSwipe();
                    };
                    
                    container[0].addEventListener('touchstart', touchStartHandler, { passive: true });
                    container[0].addEventListener('touchend', touchEndHandler, { passive: true });
                    
                    function handleSwipe() {
                        const swipeThreshold = 50;
                        const diff = touchStartX - touchEndX;
                        
                        if (Math.abs(diff) > swipeThreshold) {
                            if (diff > 0) {
                                // Swipe left - next slide
                                stopAutoAdvance();
                                nextSlide();
                                startAutoAdvance();
                            } else {
                                // Swipe right - previous slide
                                stopAutoAdvance();
                                prevSlide();
                                startAutoAdvance();
                            }
                        }
                    }
                    
                    // Pause auto advance on hover
                    if (slideshowOptions.pauseOnHover) {
                        container.on('mouseenter.ja_slideshow', function() { stopAutoAdvance(); });
                        container.on('mouseleave.ja_slideshow', function() { startAutoAdvance(); });
                    }
                    
                    // Store slideshow data for external access (e.g., switchSlide method)
                    elem.data('slideshow', {
                        slides,
                        loadSlide,
                        stopAutoAdvance,
                        startAutoAdvance,
                        getCurrentSlide: () => currentIndex + 1,
                        getTotalSlides: () => slides.length,
                        slideshowOptions // Include slideshowOptions for callback access
                    });

                    // Load first slide after sizing initialization (for all slideshow types)
                    
                    // Start auto advance
                    startAutoAdvance();
                    
                    // Proper cleanup with lifecycle events
                    const slideData = elem.data('jAlert');
                    if (slideData) {
                        // Initialize onClose array if it doesn't exist
                        if (!Array.isArray(slideData.onClose)) {
                            slideData.onClose = [];
                        }
                        
                        // Add proper slideshow cleanup to the Alert instance's onClose
                        const originalOnClose = slideData.onClose;
                        slideData.onClose = function(elem) {
                            
                            // Emit beforeClose lifecycle event
                            lifecycleEvents.emit('beforeClose', elem);
                            
                            // Mark slideshow as closing (prevents new activity)
                            slideshowState.markClosing();
                            
                            // Stop auto advance timer
                            stopAutoAdvance();
                            
                            // Remove document-level event handlers
                            $(document).off('keydown.ja_slideshow_' + alertData.id);
                            $(window).off('resize.ja_slideshow_' + alertData.id);
                            
                            // Clear resize timer to prevent memory leaks
                            if (resizeTimer) {
                                clearTimeout(resizeTimer);
                                resizeTimer = null;
                            }
                            
                            // Clear all slideshow timers to prevent memory leaks
                            const timers = elem.find('.ja_slideshow_slide').data('timers');
                            if (timers && Array.isArray(timers)) {
                                timers.forEach(timer => clearTimeout(timer));
                            }
                            
                            // Remove all slideshow-specific click handlers (using namespaced events)
                            nextBtn.off('click.ja_slideshow');
                            prevBtn.off('click.ja_slideshow');
                            
                            // Remove dot click handlers
                            if (dots && dots.length > 0) {
                                dots.off('click.ja_slideshow');
                            }
                            
                            // Remove thumbnail click handlers and drag events
                            if (thumbnails && thumbnails.length > 0) {
                                thumbnails.off('click.ja_slideshow');
                                const thumbnailCleanup = thumbnails.data('cleanup-drag');
                                if (typeof thumbnailCleanup === 'function') {
                                    thumbnailCleanup();
                                }
                            }
                            
                            // Remove slide-specific click handlers
                            slideContainer.off('click.slideshow');
                            
                            // Remove hover handlers for pause-on-hover
                            if (container && container.length > 0) {
                                container.off('mouseenter.ja_slideshow mouseleave.ja_slideshow');
                                
                                // Remove touch event listeners from DOM element
                                const containerEl = container[0];
                                if (containerEl && touchStartHandler && touchEndHandler) {
                                    containerEl.removeEventListener('touchstart', touchStartHandler);
                                    containerEl.removeEventListener('touchend', touchEndHandler);
                                }
                            }
                            
                            // Invalidate all slideshow callbacks (proper approach)
                            if (slideshowOptions) {
                                slideshowOptions.onSlideChange = null;
                                slideshowOptions.onBeforeSlideChange = null;
                                slideshowOptions.onSlideshowEnd = null;
                                slideshowOptions.onSlideshowLoop = null;
                                slideshowOptions.onContentLoad = null;
                            }
                            
                            // Clear slideshow data
                            elem.removeData('slideshow');
                            
                            // Mark slideshow as closed
                            slideshowState.markClosed();
                            
                            // Emit afterClose lifecycle event
                            lifecycleEvents.emit('afterClose', elem);
                            
                            // Call original onClose if it exists
                            if (typeof originalOnClose === 'function') {
                                originalOnClose(elem);
                            }
                        };
                    }
                });

                return content;
            } else if (alert.image) {
                let content = loader + "<img src='" + alert.image + "' class='ja_img' " + onload;
                if (alert.imageWidth) {
                    content += " style='width: " + alert.imageWidth + "'";
                }
                content += ">";

                // Add to the onOpen callbacks array to handle image loading
                alert.onOpen.unshift(function(elem) {
                    const imgElem = elem.find('.ja_img');
                    const alertData = elem.data('jAlert');
                    
                    // Handle loader removal and auto-sizing
                    imgElem.on('load', function() {
                        // Remove loader when image loads
                        elem.find('.ja_loader').remove();
                        elem.find('.ja_body').removeClass('ja_loading');
                        
                        // Only auto-size if no explicit size was set or size is 'auto'
                        if (!alertData || !alertData.size || alertData.size === 'auto') {
                            // For auto-sized image modals, CSS handles the sizing with width: auto and height: auto
                            // No JavaScript calculations needed - let the modal size naturally to the image
                        }
                    });
                    
                    // Also handle load errors
                    imgElem.on('error', function() {
                        // Remove loader even if image fails to load
                        elem.find('.ja_loader').remove();
                        elem.find('.ja_body').removeClass('ja_loading');
                        // Add error message and error class for CSS fallback
                        elem.find('.ja_body').addClass('ja_error').append('<div class="ja_img_error">Failed to load image</div>');
                    });
                });
                
                // Note: Image modal auto-sizing is now handled by CSS
                // using 'width: auto' and 'height: auto' classes in getSizeStyles()
                // No complex JavaScript calculations needed!

                return content;
            } else if (alert.video) {
                const content = alert.video.embedType === 'iframe' ? loader : loader + "<div class='ja_video'></div>";

                // Add to the onOpen callbacks array to append the video element
                alert.onOpen.unshift(function(elem) {
                    if (alert.video.embedType === 'iframe') {
                        // Use the utility function to create iframe video
                        const videoResult = utils.createIframeVideo(elem.jAlert().video, {
                            onLoad: function(iframe, container) {
                                elem.find('.ja_loader').remove();
                                elem.find('.ja_body').removeClass('ja_loading');
                                $.fn.jAlert.mediaLoaded($(iframe));
                            },
                            onError: function(iframe, container) {
                                elem.find('.ja_loader').remove();
                                elem.find('.ja_body').removeClass('ja_loading');
                                // Still call mediaLoaded for consistency
                                $.fn.jAlert.mediaLoaded($(iframe));
                            }
                        });
                        
                        // Append the container to the body
                        elem.find('.ja_body').append(videoResult.container);
                    } else {
                        // Use the utility function to create HTML5 video
                        const videoResult = utils.createHtml5Video(elem.jAlert().video, {
                            onLoad: function(video, container) {
                                elem.find('.ja_loader').remove();
                                elem.find('.ja_body').removeClass('ja_loading');
                                $.fn.jAlert.mediaLoaded($(video));
                            },
                            onError: function(video, container) {
                                elem.find('.ja_loader').remove();
                                elem.find('.ja_body').removeClass('ja_loading');
                                // Still call mediaLoaded for consistency
                                $.fn.jAlert.mediaLoaded($(video));
                            }
                        });
                        
                        // Replace the existing video container with the new one
                        elem.find('.ja_video').replaceWith(videoResult.container);
                    }
                });

                return content;
            } else if (alert.iframe) {
                const content = loader;

                // Add to the onOpen callbacks array to append the iframe
                alert.onOpen.unshift(function(elem) {
                    const iframe = document.createElement("iframe");
                    
                    // Check if iframe is actually srcdoc content (starts with '<')
                    if (elem.jAlert().iframe.trim().startsWith('<')) {
                        iframe.srcdoc = elem.jAlert().iframe;
                        // Set a data attribute to indicate this is srcdoc content
                        iframe.setAttribute('data-is-srcdoc', 'true');
                    } else {
                        iframe.src = elem.jAlert().iframe;
                    }
                    
                    iframe.className = 'ja_iframe';

                    if (iframe.addEventListener) {
                        iframe.addEventListener('load', function() {
                            elem.find('.ja_loader').remove();
                            elem.find('.ja_body').removeClass('ja_loading');
                            $.fn.jAlert.mediaLoaded($(this));
                        }, true);
                    } else if (iframe.attachEvent) {
                        iframe.attachEvent("onload", function() {
                            elem.find('.ja_loader').remove();
                            elem.find('.ja_body').removeClass('ja_loading');
                            $.fn.jAlert.mediaLoaded($(this));
                        });
                    } else {
                        iframe.onload = function() {
                            elem.find('.ja_loader').remove();
                            elem.find('.ja_body').removeClass('ja_loading');
                            $.fn.jAlert.mediaLoaded($(this));
                        };
                    }

                    elem.find('.ja_body').append(iframe);
                });

                return content;
            } else if (alert.ajax) {
                const content = loader;

                // Store as another var
                const onAjaxCallbacks = alert.onOpen;

                // Overwrite the onOpen to be the ajax call
                alert.onOpen = [function(elem) {
                    $.ajax(elem.jAlert().ajax, {
                        async: true,
                        complete: function(jqXHR, textStatus) {
                            elem.find('.ja_loader').remove();
                            elem.find('.ja_body').append(jqXHR.responseText);

                            // Run onOpen callbacks here
                            onAjaxCallbacks.forEach(function(onAjax) {
                                onAjax(elem);
                            });
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            elem.find('.ja_loader').remove();
                            elem.find('.ja_body').removeClass('ja_loading');
                            alert.onAjaxFail(elem, 'Error getting content: Code: ' + jqXHR.status + ' : Msg: ' + jqXHR.statusText);
                        }
                    });
                }];

                return content;
            }

            return null;
        },

        getBtnHTML(btn, alert) {
            // Set defaults
            btn.href = btn.href || '';
            btn['class'] = btn['class'] || '';
            btn.theme = btn.theme || 'default';
            btn.text = btn.text || '';
            btn.id = btn.id || 'ja_btn_' + utils.generateId();
            btn.target = btn.target || '_self';
            btn.closeAlert = btn.closeAlert !== false;
            btn.ariaLabel = btn.ariaLabel || btn.text;

            // Build button classes - only use ja_btn if no user-provided custom classes
            let buttonClasses = '';
            const customClass = btn['class'].trim();
            
            // Check if this looks like a user-provided custom class (not internal jAlert classes)
            const isUserCustomClass = customClass !== '' && 
                                    !customClass.match(/^(confirmBtn|denyBtn)$/);
            
            if (isUserCustomClass) {
                // User provided custom classes, use only those
                buttonClasses = customClass;
            } else {
                // No user custom classes or internal jAlert classes, use default ja_btn styling
                buttonClasses = 'ja_btn ja_btn_' + btn.theme;
                if (customClass !== '') {
                    // Add internal jAlert classes
                    buttonClasses += ' ' + customClass;
                }
            }

            // Remove handler before adding it to remove dupe handlers
            $('body').off('click', '#' + btn.id);

            // Attach on click handler
            $('body').on('click', '#' + btn.id, function(e) {
                const button = $(this);
                const alertInstance = button.parents('.jAlert').jAlert();

                if (btn.closeAlert) {
                    alertInstance.closeAlert();
                }

                let callbackResponse = true;

                if (typeof btn.onClick === 'function') {
                    callbackResponse = btn.onClick(e, button, alertInstance);
                }

                if (!callbackResponse || btn.closeAlert) {
                    e.preventDefault();
                    return false;
                }

                return callbackResponse;
            });

            if (btn.href) {
                return "<a href='" + btn.href + "' id='" + btn.id + "' target='" + btn.target + "' class='" + buttonClasses + "' aria-label='" + btn.ariaLabel + "'>" + btn.text + "</a> ";
            } else {
                return "<button type='button' id='" + btn.id + "' class='" + buttonClasses + "' aria-label='" + btn.ariaLabel + "'>" + btn.text + "</button> ";
            }
        },

        createAlertHTML(alert, content) {
            const classes = ['animated', 'ja_' + alert.theme];
            const styles = [];
            const backgroundClasses = ['ja_wrap_' + alert.backgroundColor];

            // Add custom classes
            if (alert['class']) {
                classes.push(alert['class']);
            }
            if (alert.classes) {
                classes.push(alert.classes);
            }

            // Handle special cases
            // Automatically enable fullscreen mode when size is 'full'
            if (alert.size === 'full') {
                alert.fullscreen = true;
            }
            
            if (alert.fullscreen) {
                classes.push('ja_fullscreen');
            }
            if (alert.noPadContent) {
                classes.push('ja_no_pad');
            }
            if (!alert.title) {
                classes.push('ja_noTitle');
            }

            // Handle size
            const sizeClasses = utils.getSizeClasses(alert.size);
            const sizeStyles = utils.getSizeStyles(alert.size, alert);
            classes.push(...sizeClasses);
            styles.push(...sizeStyles);

            // Handle iframe height (videos are always responsive now)
            if (alert.iframe && !alert.iframeHeight && alert.size !== 'auto') {
                classes.push('ja_stretch_height');
            }
            
            // Add media modal class for CSS targeting
            if (alert.image || alert.video || alert.iframe) {
                classes.push('ja_media_modal');
            }
            
            // Add slideshow modal class for CSS targeting
            if (alert.slideshow) {
                classes.push('ja_slideshow_modal');
            }

            let html = '<div class="ja_wrap ' + backgroundClasses.join(' ') + '" role="dialog" aria-modal="true" aria-labelledby="' + alert.id + '_title" aria-describedby="' + alert.id + '_content">' +
                '<div class="jAlert ' + classes.join(' ') + '" style="' + styles.join(' ') + '" id="' + alert.id + '" tabindex="-1">';

            // Title and close button
            if (alert.title) {
                html += "<div class='ja_title' id='" + alert.id + "_title'>";
                if (alert.closeBtn) {
                    html += "<button type='button' class='closejAlert ja_close";
                    if (alert.closeBtnAlt) {
                        html += ' ja_close_alt';
                    } else if (alert.closeBtnRoundWhite) {
                        html += ' ja_close_round_white';
                    } else if (alert.closeBtnRound) {
                        html += ' ja_close_round';
                    }
                    html += "' aria-label='Close dialog'><span class='ja_close_x'>&times;</span></button>";
                }
                html += "<div>" + alert.title + "</div></div>";
            } else if (alert.closeBtn) {
                html += "<button type='button' class='closejAlert ja_close";
                if (alert.closeBtnAlt) {
                    html += ' ja_close_alt';
                } else if (alert.closeBtnRoundWhite) {
                    html += ' ja_close_round_white';
                } else if (alert.closeBtnRound) {
                    html += ' ja_close_round';
                }
                html += "' aria-label='Close dialog'><span class='ja_close_x'>&times;</span></button>";
            }

            // Body
            html += '<div class="ja_body" id="' + alert.id + '_content">' + content;

            // Buttons
            if (alert.btns) {
                html += '<div class="ja_btn_wrap ';
                if (alert.btnBackground) {
                    html += 'optBack';
                }
                html += '">';

                if (Array.isArray(alert.btns)) {
                    alert.btns.forEach(function(btn) {
                        if (typeof btn === 'object') {
                            html += utils.getBtnHTML(btn, alert);
                        }
                    });
                } else if (typeof alert.btns === 'object') {
                    html += utils.getBtnHTML(alert.btns, alert);
                } else {
                    console.warn('jAlert Config Error: Incorrect value for btns (must be object or array of objects): ' + alert.btns);
                }

                html += '</div>';
            }

            html += '</div></div></div>';

            return html;
        }
    };

    // 1. Define the Alert class at the top
    class Alert {
        constructor(options) {
            this.options = options;
            this.id = options.id || utils.generateId();
            this.instance = null;
            Object.keys(options).forEach(key => {
                this[key] = options[key];
            });
        }

        set(key, val) {
            this[key] = val;
            return this;
        }

        __set(key, val) {
            return this.set(key, val);
        }

        get(key) {
            return this[key];
        }

        __get(key) {
            return this.get(key);
        }

        animateAlert(which) {
            if (!this.instance || !this.instance.data('jAlert')) return this;
            const jAlertData = this.instance.data('jAlert');
            if (!jAlertData) return this; // Additional guard for undefined data
            if (which === 'hide') {
                if (jAlertData && jAlertData.blurBackground) {
                    $('body').removeClass('ja_blur');
                }
                this.instance.removeClass(this.showAnimation).addClass(this.hideAnimation);
            } else {
                if (jAlertData && jAlertData.blurBackground) {
                    $('body').addClass('ja_blur');
                }
                this.instance.addClass(this.showAnimation).removeClass(this.hideAnimation).show();
            }
            return this;
        }

        closeAlert(remove = true, onClose) {
            if (this.instance && this.instance.data('jAlert')) {
                // Clean up MutationObserver if it exists
                if (this._autoResizeObserver) {
                    this._autoResizeObserver.disconnect();
                    this._autoResizeObserver = null;
                }

                // Call onClose callbacks immediately to clean up slideshow timers and event handlers
                if (typeof onClose === 'function') {
                    onClose(this.instance);
                } else if (typeof this.onClose === 'function') {
                    this.onClose(this.instance);
                }

                this.animateAlert('hide');

                window.setTimeout(() => {
                    const alertWrap = this.instance.parents('.ja_wrap');

                    if (remove) {
                        alertWrap.remove();
                    } else {
                        alertWrap.hide();
                    }

                    if ($('.jAlert:visible').length === 0) {
                        $('html,body').css('overflow', '');
                    }
                }, this.animationTimeout);
            }
            return this;
        }

        showAlert(replaceOthers = true, removeOthers = true, onOpen, onClose) {
            if (replaceOthers) {
                $('.jAlert:visible').each(function() {
                    const alertData = $(this).data('jAlert');
                    if (alertData && typeof alertData.closeAlert === 'function') {
                        alertData.closeAlert(removeOthers);
                    }
                });
            }

            // Put this one above the last one by moving to end of dom
            const wrap = this.instance.parents('.ja_wrap');
            $('body').append(wrap);

            this.animateAlert('show');

            if (typeof onClose === 'function') {
                this.onClose = onClose;
            }

            window.setTimeout(() => {
                if (typeof onOpen === 'function') {
                    onOpen(this.instance);
                }
            }, this.animationTimeout);

            return this;
        }

        resizeModal(width, height) {
            if (!this.instance) {
                console.warn('jAlert: Cannot resize modal that is not currently displayed');
                return this;
            }

            const modal = this.instance;
            const body = modal.find('.ja_body');
            let actualWidth = width;
            let actualHeight = height;

            if (!height) {
                // Auto-fit to content height
                const content = body.children();
                const contentHeight = content.outerHeight();
                actualHeight = contentHeight;
                
                // Set body height to fit content
                body.css('height', contentHeight + 'px');
            } else {
                // Apply specific height
                body.css('height', typeof height === 'number' ? height + 'px' : height);
                actualHeight = height;
            }

            // Update size property
            if (height) {
                this.size = { height: typeof height === 'number' ? height + 'px' : height };
            }

            // Call onResize callback
            if (typeof this.onResize === 'function') {
                this.onResize(this.instance, actualWidth, actualHeight);
            }

            return this;
        }

        autoResize() {
            if (!this.instance) return this;
            const modal = this.instance;
            const body = modal.find('.ja_body');
            
            const content = body.children();
            // Calculate content height
            const contentHeight = content.outerHeight();
            
            // Set body height to fit content
            body.css('height', contentHeight + 'px');
            
            // Call onResize callback
            if (typeof this.onResize === 'function') {
                this.onResize(this.instance, null, contentHeight);
            }
            
            return this;
        }
        resizeToFit() { return this.autoResize(); }

        switchSlide(slideNumber) {
            if (!this.instance) {
                console.warn('jAlert: Cannot switch slide - modal not initialized');
                return this;
            }

            const slideshowData = this.instance.data('slideshow');
            if (!slideshowData) {
                console.warn('jAlert: Cannot switch slide - no slideshow found');
                return this;
            }

            const { slides, loadSlide, stopAutoAdvance, startAutoAdvance } = slideshowData;
            
            // Convert to 0-based index and validate
            const slideIndex = slideNumber - 1;
            if (slideIndex < 0 || slideIndex >= slides.length) {
                console.warn(`jAlert: Invalid slide number ${slideNumber}. Valid range: 1-${slides.length}`);
                return this;
            }

            // Stop auto advance, switch to slide, restart auto advance
            stopAutoAdvance();
            loadSlide(slideIndex);
            startAutoAdvance();

            return this;
        }
    }

    // 2. Define the main plugin function
    $.fn.jAlert = function(options) {
        // Remove focus from current element to prevent multiple popups
        $('body').focus().blur();

        // Block Multiple Instances by running jAlert for each one
        if (this.length > 1) {
            this.each(function() {
                $.fn.jAlert(options);
            });
            return this;
        }

        // If this is an existing jAlert, return it so you can access public methods and properties
        if (typeof $(this)[0] !== 'undefined' && $(this)[0]['jAlert'] !== 'undefined') {
            return $(this)[0]['jAlert'];
        }

                // Normalize options
        options = utils.normalizeOptions(options);

        // Store original options to check if user explicitly set values
        const originalOptions = { ...options };

        // Handle video options
        if (options.video) {
            // Convert string videos to objects first for consistency and simplicity
            if (typeof options.video === 'string') {
                options.video = { src: options.video };
            }
            
            // If embedType is missing, auto-detect it
            if( options.video.embedType === undefined ){
                if( options.video.src.includes('youtube.com') || options.video.src.includes('vimeo.com') ){
                    options.video.embedType = 'iframe';
                    // Only process iframe video URLs for iframe videos
                    options.video.src = utils.processIframeVideoUrl(options.video);
                }else{
                    options.video.embedType = 'html5';
                    // Do NOT process HTML5 video URLs - they should remain unchanged
                }
            }

            // Apply default attributes for videos
            options.video = { ...$.fn.jAlert.videoDefaults, ...options.video };

            // Cannot have these others or it'd conflict
            options.image = undefined;
            options.slideshow = undefined;
            options.iframe = undefined;
        }else if( options.image ){
            // Cannot have these others or it'd conflict
            options.video = undefined;
            options.slideshow = undefined;
            options.iframe = undefined;
        }else if( options.slideshow ){
            // Must be an array of strings or objects
            // Assume it's a single slide if not provided as an array
            if( !Array.isArray(options.slideshow) ){
                options.slideshow = [options.slideshow];
            }
            // Convert string slideshows to objects first for consistency and simplicity
            options.slideshow = options.slideshow.map(slide => {
                if( typeof slide === 'string' ){
                    // Convert string to object with src property
                    slide = { src: slide };
                }

                // If type is missing, auto-detect it
                if( slide.type === undefined ){ 
                    slide.type = 'image';

                    if( slide.src && (slide.src.includes('youtube.com') || slide.src.includes('vimeo.com') 
                        || slide.src.includes('.mp4') || slide.src.includes('.webm') 
                        || slide.src.includes('.ogg')) ){
                            slide.type = 'video';
                    }
                }

                // If embedType is missing, auto-detect it
                if( slide.type === 'video' && slide.embedType === undefined ){ 
                    if( slide.src && (slide.src.includes('youtube.com') || slide.src.includes('vimeo.com')) ){
                        slide.embedType = 'iframe';
                        slide.src = utils.processIframeVideoUrl(slide);
                    }else{
                        slide.embedType = 'html5';
                    }
                }

                // Apply default attributes for videos
                if( slide.type === 'video' ){
                    slide = { ...$.fn.jAlert.videoDefaults, ...slide };
                }

                return slide;
            });

            // Cannot have these others or it'd conflict
            options.video = undefined;
            options.image = undefined;
            options.iframe = undefined;
        }else if( options.iframe ){
            // Cannot have these others or it'd conflict
            options.video = undefined;
            options.image = undefined;
            options.slideshow = undefined;
        }

        if( options.video || options.image || options.slideshow || options.iframe ){
            // Default to no padding for these special modal types, but users can override this
            if (options.noPadContent === undefined) {
                options.noPadContent = true;
            }
        }

        if( options.video || options.image || options.slideshow ){
            if( options.size === undefined ){
                options.size = 'auto';
            }
        }

        // Combine user options with defaults
        options = $.extend({}, $.fn.jAlert.defaults, options);
        
        // Deep merge slideshowOptions if they exist
        if (options.slideshowOptions && $.fn.jAlert.defaults.slideshowOptions) {
            options.slideshowOptions = $.extend({}, $.fn.jAlert.defaults.slideshowOptions, options.slideshowOptions);
        }

        // Set ID
        const alertId = options.id || utils.generateId();
        options.id = alertId;

        // Create alert instance
        const alert = new Alert(options);

        // Process content
        alert.content = utils.processContent(alert.content, alert);

        // Handle picture alias
        if (alert.picture) {
            alert.image = alert.picture;
        }

        // Handle color alias
        if (alert.color) {
            alert.theme = alert.color;
        }

        // Handle width alias
        if (alert.width) {
            alert.size = alert.width;
        }

        // Handle buttons alias
        if (alert.buttons) {
            alert.btns = alert.buttons;
        }

        // Handle confirm type
        if (alert.type === 'confirm') {
            utils.setupConfirmButtons(alert);
        }

        // Validate options and apply corrections
        if( !utils.validateTheme(alert.theme) ){
            alert.theme = 'default';
        }
        if ( !utils.validateSize(alert.size) ){
            alert.size = 'md';
        }
        if( !utils.validateBackgroundColor(alert.backgroundColor) ){
            alert.backgroundColor = 'black';
        }

        // Ensure onOpen is an array
        alert.onOpen = Array.isArray(alert.onOpen) ? alert.onOpen : [alert.onOpen];

        // Create content based on type
        let content = alert.content || '';
        const mediaContent = utils.createMediaContent(alert);
        if (mediaContent) {
            content = mediaContent;
        }

        // Create and add alert to DOM
        const addAlert = () => {
            const html = utils.createAlertHTML(alert, content);
            const alertHTML = $(html);

            if (alert.replaceOtherAlerts) {
                $('.jAlert:visible').each(function() {
                    $(this).jAlert().closeAlert();
                });
            }

            $('body').append(alertHTML);
            $('.jAlert:last').data('jAlert', alert);

            // Cache instance
            alert.instance = $('#' + alert.id);

            // Attach alert object to dom element
            alert.instance[0]['jAlert'] = alert;

            // Prevent scrolling
            $('html,body').css('overflow', 'hidden');

            // Show the new alert
            alert.animateAlert('show');

            // Add close button handler
            if (alert.closeBtn) {
                alert.instance.on('click', '.closejAlert', function(e) {
                    e.preventDefault();
                    $(this).parents('.jAlert:first').closeAlert();
                    return false;
                });
            }

            // Bind mouseup handler to document if this alert has closeOnClick enabled
            if (alert.closeOnClick) {
                $(document).off('mouseup touchstart', $.fn.jAlert.onMouseUp);
                $(document).on('mouseup touchstart', $.fn.jAlert.onMouseUp);
            }

            // Bind on keydown handler to document for ESC key
            if (alert.closeOnEsc) {
                $(document).off('keydown', $.fn.jAlert.onEscKeyDown);
                $(document).on('keydown', $.fn.jAlert.onEscKeyDown);
            }

            // Run onOpen callbacks
            if (alert.onOpen) {
                alert.onOpen.forEach(function(onOpen) {
                    onOpen(alert.instance);
                });
            }

            // Handle autofocus
            if (alert.autofocus) {
                alert.instance.find(alert.autofocus).focus();
            } else {
                alert.instance.focus();
            }

            // Handle auto close
            if (alert.autoClose) {
                $.fn.closeTimer(function() {
                    const currentAlert = $.jAlert('current');
                    if (currentAlert !== false) {
                        currentAlert.closeAlert();
                    }
                }, alert.autoClose);
            }

            return alert.instance;
        };

        // Initialize
        if (!alert.content && !alert.image && !alert.video && !alert.iframe && !alert.ajax && !alert.slideshow) {
            return addAlert();
        } else {
            if (!alert.content) {
                alert.content = '';
            }
            return addAlert();
        }

        // Return the alert object for chaining
        return alert;
    };

    // 3. After $.fn.jAlert is defined, assign the class
    $.fn.jAlert.Alert = Alert;

    // Close timer utility
    $.fn.closeTimer = (function() {
        let timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })(jQuery);

    $.fn.jAlert.videoDefaults = { 
        'controls': true,
        'loop': false,
        'autoplay': false,
        'muted': false,
    };

    // Default settings
    $.fn.jAlert.defaults = {
        'title': false,
        'content': false,
        'noPadContent': false,
        'fullscreen': false,
        'image': false,
        'imageWidth': 'auto',
        'video': false,
        'ajax': false,
        'onAjaxFail': function(alert, errorThrown) {
            // Show error message in the modal instead of closing it
            const elem = alert;
            if (elem && elem.find) {
                elem.find('.ja_loader').remove();
                elem.find('.ja_body').removeClass('ja_loading').addClass('ja_error')
                    .html('<div class="ja_ajax_error">Failed to load content: ' + errorThrown + '</div>');
            } else {
                console.error('jAlert AJAX Error:', errorThrown);
            }
        },
        'iframe': false,
        'iframeHeight': false,
        'slideshow': false, // Array of image URLs (strings) or slide objects (v5.1+)
        'slideshowOptions': {
            'autoAdvance': false,
            'autoAdvanceInterval': 3000,
            'keyboardNav': true,
            'pauseOnHover': false,
            'imageSize': 'contain',              // 'contain' (real images) or 'cover' (background images)
            'loop': true,
            'showArrows': true,
            'showCounter': 'numbers',            // 'numbers', 'dots', or false
            'arrowButtons': null,                // Custom arrow buttons DOM elements
            'showThumbnails': false,
            'thumbnailLocation': 'bottom',       // 'top' or 'bottom' only
            'preload': true,                     // Preload all slideshow images when slideshow opens (first image loads normally, others preload in background for faster navigation)
            // Slideshow callbacks
            'onSlideChange': null,
            'onSlideshowEnd': null,
            'onSlideshowLoop': null,
            'onBeforeSlideChange': null,
            'onContentLoad': null
        },
        'class': '',
        'classes': '',
        'id': false,
        'showAnimation': 'fadeInUp',
        'hideAnimation': 'fadeOutDown',
        'animationTimeout': 600,
        'theme': 'default',
        'backgroundColor': 'black',
        'blurBackground': false,
        'size': false,
        'replaceOtherAlerts': false,
        'closeOnClick': false,
        'closeOnEsc': true,
        'closeBtn': true,
        'closeBtnAlt': false,
        'closeBtnRound': true,
        'closeBtnRoundWhite': false,
        'btns': false,
        'autoClose': false,
        'btnBackground': true,
        'autofocus': false,
        'onOpen': function(alert) {
            return false;
        },
        'onClose': function(alert) {
            return false;
        },
        'onResize': function(alert, width, height) {
            return false;
        },

        'type': 'modal',
        'confirmQuestion': 'Are you sure?',
        'confirmBtnText': 'Yes',
        'denyBtnText': 'No',
        'confirmAutofocus': '.confirmBtn',
        'onConfirm': function(e, btn) {
            e.preventDefault();
            return false;
        },
        'onDeny': function(e, btn) {
            e.preventDefault();
            return false;
        }
    };

    // Event handlers
    $.fn.jAlert.onMouseUp = function(e) {
        const target = e.target || e.srcElement;
        const lastVisibleAlert = $('.jAlert:visible:last');

        if (lastVisibleAlert.length > 0) {
            const alertData = lastVisibleAlert.data('jAlert');
            if (alertData && alertData.closeOnClick) {
                if (!$(target).is('.jAlert *')) {
                    alertData.closeAlert();
                }
            }
        }
    };

    $.fn.jAlert.onEscKeyDown = function(e) {
        if (e.keyCode === 27) {
            const lastVisibleAlert = $('.jAlert:visible:last');
            if (lastVisibleAlert.length > 0) {
                const alertData = lastVisibleAlert.data('jAlert');
                if (alertData && alertData.closeOnEsc) {
                    alertData.closeAlert();
                }
            }
        }
    };

    // Utility functions
    $.fn.attachjAlert = function(e) {
        e.preventDefault();
        $.jAlert($(this).data());
        return false;
    };

    $.jAlert = function(options) {
        // Return current alert
        if (options === 'current') {
            const latest = $('.jAlert:visible:last');
            if (latest.length > 0) {
                return latest.data('jAlert');
            }
            return false;
        }

        // Attach data attributes
        if (options === 'attach') {
            $('[data-jAlert]').off('click', $.fn.attachjAlert).on('click', $.fn.attachjAlert);
            $('[data-jalert]').off('click', $.fn.attachjAlert).on('click', $.fn.attachjAlert);
            return false;
        }

        return $.fn.jAlert(options);
    };

    $.fn.alertOnClick = function(options) {
        $(this).on('click', function(e) {
            e.preventDefault();
            $.jAlert(options);
            return false;
        });
    };

    $.alertOnClick = function(selector, options) {
        $('body').on('click', selector, function(e) {
            e.preventDefault();
            $.jAlert(options);
            return false;
        });
    };

    $.fn.closeAlert = function(remove, onClose) {
        const alertData = $(this).data('jAlert');
        if (alertData && typeof alertData.closeAlert === 'function') {
            alertData.closeAlert(remove, onClose);
        }
    };

    // Media loaded callback
    $.fn.jAlert.mediaLoaded = function(elem) {
        const body = elem.parents('.ja_body');
        const vidWrap = body.find('.ja_video');
        const alert = elem.parents('.jAlert:first');
        const jalert = alert.data('jAlert');

        body.find('.ja_loader').remove();

        if (vidWrap.length > 0) {
            vidWrap.fadeIn('fast');
        } else {
            elem.fadeIn('fast');
        }

        // Handle iframe and video sizing
        if (elem.is('iframe') || elem.hasClass('ja_video_element')) {
            // Check if this is a video or iframe and handle accordingly
            const isVideo = elem.hasClass('ja_video_element');
            const isIframe = elem.is('iframe');
            
            // Only check for responsive containers on video-related iframes
            let isUsingResponsiveContainer = false;
            if (isVideo) {
                // HTML5 video with responsive container
                const videoContainer = elem.parents('.ja_video');
                isUsingResponsiveContainer = videoContainer && videoContainer.length > 0 && 
                    videoContainer.css('padding-bottom') !== '0px' && 
                    videoContainer.css('position') === 'relative';
            } else if (isIframe) {
                // Check if this iframe is a video iframe with responsive wrapper
                // Video iframes with responsive containers are inside dynamically created wrapper divs
                const parentDiv = elem.parent();
                const isVideoIframe = parentDiv.length > 0 && 
                    parentDiv.css('padding-bottom') !== '0px' && 
                    parentDiv.css('position') === 'relative' &&
                    parentDiv.css('height') === '0px'; // This combination indicates a video responsive container
                
                // Only apply responsive logic to video iframes, not regular iframes
                if (isVideoIframe && jalert && jalert.video) {
                    isUsingResponsiveContainer = true;
                }
            }
            
            // Skip sizing if using responsive container - let CSS handle it
            if (isUsingResponsiveContainer) {
                return;
            }
            
            // Only handle explicit height for iframes (videos are always responsive)
            const explicitHeight = isVideo ? false : jalert.iframeHeight;
                
            if (explicitHeight) {
                // Use explicit height when provided (iframes only)
                elem.css('flex', 'unset');
                elem.height(jalert.iframeHeight);
            } else if (jalert && jalert.size === 'auto' && !jalert.video) {
                // Auto-sizing only for regular iframes when explicitly requested (videos now always use responsive containers)
                
                // Calculate available space for auto-sizing
                const modal = jalert.instance;
                const title = modal.find('.ja_title');
                const buttons = modal.find('.ja_btn_wrap');
                const body = modal.find('.ja_body');
                
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;
                
                // Calculate overhead (title + buttons + body padding + modal margins)
                let overhead = 40; // Base margin/padding
                
                if (title.length && title.is(':visible')) {
                    overhead += title.outerHeight(true);
                }
                
                if (buttons.length && buttons.is(':visible')) {
                    overhead += buttons.outerHeight(true);
                }
                
                // Add body padding
                const bodyPaddingTop = parseInt(body.css('padding-top')) || 0;
                const bodyPaddingBottom = parseInt(body.css('padding-bottom')) || 0;
                overhead += bodyPaddingTop + bodyPaddingBottom;
                
                const maxAvailableHeight = Math.max(300, viewportHeight - overhead);
                const defaultWidth = Math.min(viewportWidth * 0.9, 1200); // Max 1200px for iframes
                
                // Add a small delay to ensure iframe content is fully loaded
                setTimeout(() => {
                    try {
                        // Attempt to access iframe content (same-origin only)
                        const iframeDoc = elem[0].contentDocument || elem[0].contentWindow.document;
                        
                        if (iframeDoc && iframeDoc.body) {
                            // Wait a bit more for content to render
                            setTimeout(() => {
                                // Same-origin: measure actual content dimensions with multiple methods
                                const measurements = {
                                    bodyScrollHeight: iframeDoc.body.scrollHeight,
                                    bodyOffsetHeight: iframeDoc.body.offsetHeight,
                                    bodyClientHeight: iframeDoc.body.clientHeight,
                                    bodyScrollWidth: iframeDoc.body.scrollWidth,
                                    bodyOffsetWidth: iframeDoc.body.offsetWidth,
                                    bodyClientWidth: iframeDoc.body.clientWidth,
                                    documentClientHeight: iframeDoc.documentElement.clientHeight,
                                    documentScrollHeight: iframeDoc.documentElement.scrollHeight,
                                    documentOffsetHeight: iframeDoc.documentElement.offsetHeight,
                                    documentScrollWidth: iframeDoc.documentElement.scrollWidth,
                                    documentOffsetWidth: iframeDoc.documentElement.offsetWidth,
                                    documentClientWidth: iframeDoc.documentElement.clientWidth
                                };
                                
                                const contentHeight = Math.max(
                                    measurements.bodyScrollHeight,
                                    measurements.bodyOffsetHeight,
                                    measurements.documentScrollHeight,
                                    measurements.documentOffsetHeight
                                );
                                
                                const contentWidth = Math.max(
                                    measurements.bodyScrollWidth,
                                    measurements.bodyOffsetWidth,
                                    measurements.documentScrollWidth,
                                    measurements.documentOffsetWidth
                                );
                                
                                if (contentHeight > 0 && contentHeight < 10000 && contentWidth > 0 && contentWidth < 10000) { // Sanity checks
                                    // Use content dimensions but constrain to available viewport space
                                    const maxAvailableWidth = Math.min(viewportWidth * 0.95, 1400); // 95% of viewport, max 1400px
                                    const finalHeight = contentHeight > maxAvailableHeight ? maxAvailableHeight : contentHeight;
                                    const finalWidth = contentWidth > maxAvailableWidth ? maxAvailableWidth : contentWidth;
                                    
                                    elem.css({
                                        'flex': 'unset',
                                        'width': finalWidth + 'px',
                                        'height': finalHeight + 'px'
                                    });
                                    
                                    // Don't call autoResize for same-origin iframes - we've already sized them correctly
                                    return; // Exit early to skip the autoResize call below
                                } else {
                                    throw new Error(`Invalid content dimensions: ${contentWidth}x${contentHeight}`);
                                }
                            }, 50); // Additional delay for content rendering
                        } else {
                            throw new Error('Content document not accessible');
                        }
                    } catch (e) {
                        // Cross-origin or content detection failed: use viewport-based sizing for iframes
                        elem.css({
                            'flex': 'unset',
                            'width': defaultWidth + 'px',
                            'height': maxAvailableHeight + 'px'
                        });
                        
                        // We've set explicit dimensions, so don't autoResize
                        if (jalert.instance) {
                            jalert.instance.removeClass('ja_stretch_height');
                        }
                    }
                }, 100); // Small delay to ensure iframe content is accessible
            }
        }

        // Trigger onContentLoad event (check nested slideshow options first, then root level for backward compatibility)
        if (jalert) {
            const onContentLoadCallback = (jalert.slideshowOptions && jalert.slideshowOptions.onContentLoad) || jalert.onContentLoad;
            if (typeof onContentLoadCallback === 'function') {
                let mediaType = 'unknown';
                if (elem.is('img')) {
                    mediaType = 'image';
                } else if (elem.hasClass('ja_video_element')) {
                    mediaType = 'video';
                } else if (elem.is('iframe')) {
                    if (vidWrap.length > 0) {
                        mediaType = 'video';
                    } else {
                        mediaType = 'iframe';
                    }
                }
                onContentLoadCallback(jalert.instance, mediaType, elem);
            }
        }
    };

    // Global resize functions
    $.fn.resizeModal = function(height) {
        const alertData = this.data('jAlert');
        if (alertData && typeof alertData.resizeModal === 'function') {
            return alertData.resizeModal(null, height);
        }
        return this;
    };

    $.resizeModal = function(height) {
        const currentAlert = $.jAlert('current');
        if (currentAlert !== false) {
            return currentAlert.resizeModal(null, height);
        }
        return false;
    };

    $.fn.autoResize = function() {
        const alertData = this.data('jAlert');
        if (alertData && typeof alertData.autoResize === 'function') {
            return alertData.autoResize();
        }
        return this;
    };

    $.fn.resizeToFit = function() {
        const alertData = this.data('jAlert');
        if (alertData && typeof alertData.resizeToFit === 'function') {
            return alertData.resizeToFit();
        }
        return this;
    };

    $.autoResize = function() {
        const currentAlert = $.jAlert('current');
        if (currentAlert !== false) {
            return currentAlert.autoResize();
        }
        return false;
    };

    $.resizeToFit = function() {
        const currentAlert = $.jAlert('current');
        if (currentAlert !== false) {
            return currentAlert.resizeToFit();
        }
        return false;
    };

    $.fn.switchSlide = function(slideNumber) {
        const alertData = this.data('jAlert');
        if (alertData && typeof alertData.switchSlide === 'function') {
            return alertData.switchSlide(slideNumber);
        }
        return this;
    };

    $.switchSlide = function(slideNumber) {
        const currentAlert = $.jAlert('current');
        if (currentAlert !== false) {
            return currentAlert.switchSlide(slideNumber);
        }
        return false;
    };

})(jQuery); 