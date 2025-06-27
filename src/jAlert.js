/*
	jAlert
	https://github.com/HTMLGuyLLC/jAlert
	Made with love by HTMLGuy, LLC
	MIT Licensed
*/
(function($) {
    'use strict';

    // Polyfill for Date.now if not available
    if (!Date.now) {
        Date.now = function() {
            return +new Date();
        };
    }

    // Constants
    const THEMES = ['default', 'green', 'dark_green', 'red', 'dark_red', 'black', 'brown', 'gray', 'dark_gray', 'blue', 'dark_blue', 'yellow'];
    const SIZES = ['xsm', 'sm', 'md', 'lg', 'xlg', 'full', 'auto'];
    const SIZE_ALIASES = {'xsmall': 'xsm', 'small':'sm','medium':'md','large':'lg','xlarge':'xlg'};
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

        processVideoUrl(video) {
            // Automatically convert a youtube video's URL to the embed version
            if (video && video.indexOf('youtube.com/watch?v=') > -1 && video.indexOf('embed') === -1) {
                return video.replace('watch?v=', 'embed/');
            }
            return video;
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
                console.log('jAlert Config Error: Invalid theme selection.');
                return false;
            }
            return true;
        },

        validateSize(size) {
            if (size && ((typeof size === 'object' && (typeof size.width === 'undefined' || typeof size.height === 'undefined'))) ) {
                console.log('jAlert Config Error: Invalid size selection (try a preset or make sure you\'re including height and width in your size object).');
                return false;
            }
            return true;
        },

        validateBackgroundColor(backgroundColor) {
            if (BACKGROUND_COLORS.indexOf(backgroundColor) === -1) {
                console.log('jAlert Config Error: Invalid background color selection.');
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

        getSizeStyles(size) {
            const styles = [];
            
            if (size && typeof size === 'object') {
                styles.push(`width: ${size.width};`);
                styles.push(`height: ${size.height};`);
            } else if (size && typeof size === 'string' && SIZES.indexOf(size) === -1 && SIZE_ALIASES[size] === undefined) {
                styles.push(`width: ${size};`);
            }
            
            return styles;
        },

        createMediaContent(alert) {
            const onload = "onload='$.fn.jAlert.mediaLoaded($(this))'";
            const loader = "<div class='ja_loader'>Loading...</div>";

            if (alert.slideshow) {
                // Slideshow functionality
                alert.noPadContent = true;
                
                let content = "<div class='ja_media_wrap ja_slideshow_wrap' role='region' aria-label='Image slideshow'>" + loader + 
                    "<div class='ja_slideshow_container'>" +
                    "<div class='ja_slideshow_slide' role='img' aria-live='polite'></div>";
                
                // Add side arrows if enabled
                if (alert.slideshowOptions && alert.slideshowOptions.showArrows !== false) {
                    content += "<button type='button' class='ja_slideshow_arrow ja_slideshow_prev' aria-label='Previous image'>&lt;</button>" +
                              "<button type='button' class='ja_slideshow_arrow ja_slideshow_next' aria-label='Next image'>&gt;</button>";
                }
                
                content += "</div>";
                
                // Add counter/dots if enabled
                if (alert.slideshowOptions && alert.slideshowOptions.showCounter) {
                    if (alert.slideshowOptions.showCounter === 'dots') {
                        content += "<div class='ja_slideshow_dots' role='tablist' aria-label='Slide navigation'></div>";
                    } else if (alert.slideshowOptions.showCounter === 'numbers') {
                        content += "<div class='ja_slideshow_counter' aria-live='polite'>1 / 1</div>";
                    }
                }
                
                content += "</div>";

                // Add slideshow functionality to onOpen
                alert.onOpen.unshift(function(elem) {
                    const slideshow = elem.data('jAlert').slideshow;
                    const slideshowOptions = elem.data('jAlert').slideshowOptions || {};
                    const container = elem.find('.ja_slideshow_container');
                    const slideContainer = elem.find('.ja_slideshow_slide');
                    const counter = elem.find('.ja_slideshow_counter');
                    const dots = elem.find('.ja_slideshow_dots');
                    const prevBtn = elem.find('.ja_slideshow_prev');
                    const nextBtn = elem.find('.ja_slideshow_next');
                    
                    let slides = [];
                    let currentIndex = 0;
                    let autoAdvanceTimer = null;
                    let loadedImages = 0;
                    let totalImages = 0;
                    
                    // Initialize slides
                    if (Array.isArray(slideshow)) {
                        // Array of image URLs
                        slides = slideshow.map((src, index) => ({
                            type: 'image',
                            src: src,
                            index: index
                        }));
                    } else if (typeof slideshow === 'string') {
                        // DOM selector
                        const slideElements = $(slideshow).find('.ja_slide, .slide, [data-slide]');
                        slides = slideElements.map(function(index) {
                            const $slide = $(this);
                            const img = $slide.find('img').first();
                            const src = img.attr('src') || img.attr('data-src');
                            const caption = $slide.find('.caption, .slide-caption').text() || img.attr('alt') || '';
                            return {
                                type: 'image',
                                src: src,
                                caption: caption,
                                index: index
                            };
                        }).get();
                    }
                    
                    if (slides.length === 0) {
                        slideContainer.html('<p>No slides found</p>');
                        return;
                    }
                    
                    totalImages = slides.length;
                    
                    // Create dots if enabled
                    if (slideshowOptions.showCounter === 'dots') {
                        let dotsHTML = '';
                        for (let i = 0; i < slides.length; i++) {
                            dotsHTML += '<button type="button" class="ja_slideshow_dot" data-slide="' + i + '" role="tab" aria-label="Go to slide ' + (i + 1) + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '"></button>';
                        }
                        dots.html(dotsHTML);
                    }
                    
                    // Update counter
                    function updateCounter() {
                        if (slideshowOptions.showCounter === 'numbers') {
                            counter.text(`${currentIndex + 1} / ${slides.length}`);
                        } else if (slideshowOptions.showCounter === 'dots') {
                            dots.find('.ja_slideshow_dot').removeClass('active').attr('aria-selected', 'false');
                            dots.find('.ja_slideshow_dot[data-slide="' + currentIndex + '"]').addClass('active').attr('aria-selected', 'true');
                        }
                    }
                    
                    // Load slide
                    function loadSlide(index) {
                        if (index < 0 || index >= slides.length) return;
                        
                        currentIndex = index;
                        const slide = slides[index];
                        
                        if (slide.type === 'image') {
                            const img = $('<img>', {
                                src: slide.src,
                                class: 'ja_img ja_slideshow_img',
                                alt: slide.caption || ''
                            });
                            
                            slideContainer.html(img);
                            
                            // Handle image sizing
                            if (slideshowOptions.resizeMode === 'fitLargest') {
                                // Preload all images to calculate max dimensions
                                let maxWidth = 0, maxHeight = 0;
                                let imagesLoaded = 0;
                                
                                slides.forEach((s, i) => {
                                    const tempImg = new Image();
                                    tempImg.onload = function() {
                                        maxWidth = Math.max(maxWidth, this.width);
                                        maxHeight = Math.max(maxHeight, this.height);
                                        imagesLoaded++;
                                        
                                        if (imagesLoaded === slides.length) {
                                            // Get viewport dimensions
                                            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
                                            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                                            
                                            // Calculate maximum available space (leave some margin)
                                            const maxAvailableWidth = viewportWidth * 0.9;
                                            const maxAvailableHeight = viewportHeight * 0.9;
                                            
                                            // Scale down if larger than viewport
                                            let finalWidth = maxWidth;
                                            let finalHeight = maxHeight;
                                            
                                            if (finalWidth > maxAvailableWidth) {
                                                const scale = maxAvailableWidth / finalWidth;
                                                finalWidth = maxAvailableWidth;
                                                finalHeight = finalHeight * scale;
                                            }
                                            
                                            if (finalHeight > maxAvailableHeight) {
                                                const scale = maxAvailableHeight / finalHeight;
                                                finalHeight = maxAvailableHeight;
                                                finalWidth = finalWidth * scale;
                                            }
                                            
                                            elem.css('width', finalWidth + 'px');
                                            elem.css('height', finalHeight + 'px');
                                        }
                                    };
                                    tempImg.src = s.src;
                                });
                            } else {
                                // Default: resize modal to fit current image
                                img.on('load', function() {
                                    // Get viewport dimensions
                                    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
                                    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                                    
                                    // Calculate maximum available space (leave some margin)
                                    const maxAvailableWidth = viewportWidth * 0.9;
                                    const maxAvailableHeight = viewportHeight * 0.9;
                                    
                                    // Scale down if larger than viewport
                                    let finalWidth = this.width;
                                    let finalHeight = this.height;
                                    
                                    if (finalWidth > maxAvailableWidth) {
                                        const scale = maxAvailableWidth / finalWidth;
                                        finalWidth = maxAvailableWidth;
                                        finalHeight = finalHeight * scale;
                                    }
                                    
                                    if (finalHeight > maxAvailableHeight) {
                                        const scale = maxAvailableHeight / finalHeight;
                                        finalHeight = maxAvailableHeight;
                                        finalWidth = finalWidth * scale;
                                    }
                                    
                                    elem.css('width', finalWidth + 'px');
                                    elem.css('height', finalHeight + 'px');
                                });
                            }
                            
                            // Add caption if available
                            if (slide.caption) {
                                slideContainer.append('<div class="ja_slideshow_caption">' + slide.caption + '</div>');
                            }
                            
                            // Remove loader when image loads
                            img.on('load', function() {
                                elem.find('.ja_loader').remove();
                            });
                        }
                        
                        updateCounter();
                        
                        // Update navigation buttons - only disable if not looping
                        if (slideshowOptions.loop) {
                            prevBtn.removeClass('disabled');
                            nextBtn.removeClass('disabled');
                        } else {
                            prevBtn.toggleClass('disabled', currentIndex === 0);
                            nextBtn.toggleClass('disabled', currentIndex === slides.length - 1);
                        }
                    }
                    
                    // Navigation functions
                    function nextSlide() {
                        if (currentIndex < slides.length - 1) {
                            loadSlide(currentIndex + 1);
                        } else if (slideshowOptions.loop) {
                            // Loop back to first slide
                            loadSlide(0);
                        }
                    }
                    
                    function prevSlide() {
                        if (currentIndex > 0) {
                            loadSlide(currentIndex - 1);
                        } else if (slideshowOptions.loop) {
                            // Loop to last slide
                            loadSlide(slides.length - 1);
                        }
                    }
                    
                    // Auto advance
                    function startAutoAdvance() {
                        if (slideshowOptions.autoAdvance && slideshowOptions.autoAdvanceInterval) {
                            autoAdvanceTimer = setInterval(nextSlide, slideshowOptions.autoAdvanceInterval);
                        }
                    }
                    
                    function stopAutoAdvance() {
                        if (autoAdvanceTimer) {
                            clearInterval(autoAdvanceTimer);
                            autoAdvanceTimer = null;
                        }
                    }
                    
                    // Event handlers
                    nextBtn.on('click', function() {
                        stopAutoAdvance();
                        nextSlide();
                        startAutoAdvance();
                    });
                    
                    prevBtn.on('click', function() {
                        stopAutoAdvance();
                        prevSlide();
                        startAutoAdvance();
                    });
                    
                    // Dot click handlers
                    if (slideshowOptions.showCounter === 'dots') {
                        dots.on('click', '.ja_slideshow_dot', function() {
                            const slideIndex = parseInt($(this).data('slide'));
                            if (slideIndex !== currentIndex) {
                                stopAutoAdvance();
                                loadSlide(slideIndex);
                                startAutoAdvance();
                            }
                        });
                    }
                    
                    // Keyboard navigation
                    if (slideshowOptions.keyboardNav !== false) {
                        $(document).on('keydown.ja_slideshow', function(e) {
                            if (e.keyCode === 37) { // Left arrow
                                stopAutoAdvance();
                                prevSlide();
                                startAutoAdvance();
                            } else if (e.keyCode === 39) { // Right arrow
                                stopAutoAdvance();
                                nextSlide();
                                startAutoAdvance();
                            }
                        });
                    }
                    
                    // Touch support for mobile devices
                    let touchStartX = 0;
                    let touchEndX = 0;
                    
                    container.on('touchstart', function(e) {
                        touchStartX = e.originalEvent.touches[0].clientX;
                    });
                    
                    container.on('touchend', function(e) {
                        touchEndX = e.originalEvent.changedTouches[0].clientX;
                        handleSwipe();
                    });
                    
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
                        container.hover(
                            function() { stopAutoAdvance(); },
                            function() { startAutoAdvance(); }
                        );
                    }
                    
                    // Load first slide
                    loadSlide(0);
                    
                    // Start auto advance
                    startAutoAdvance();
                    
                    // Clean up on close
                    elem.data('jAlert').onClose = function() {
                        stopAutoAdvance();
                        $(document).off('keydown.ja_slideshow');
                    };
                });

                return content;
            } else if (alert.image) {
                // Images should never have padding
                alert.noPadContent = true;

                let content = "<div class='ja_media_wrap'>" + loader + "<img src='" + alert.image + "' class='ja_img' " + onload;
                if (alert.imageWidth) {
                    content += " style='width: " + alert.imageWidth + "'";
                }
                content += "></div>";

                // Add to the onOpen callbacks array to shrink the alert to fit the size of the image
                alert.onOpen.unshift(function(elem) {
                    const imgElem = elem.find('.ja_img');
                    imgElem.on('load', function() {
                        elem.css('width', imgElem.width() + 'px');
                        elem.css('height', imgElem.height() + 'px');
                    });
                });

                return content;
            } else if (alert.video) {
                const content = "<div class='ja_media_wrap'>" + loader + "<div class='ja_video'></div></div>";

                // Add to the onOpen callbacks array to append the iframe
                alert.onOpen.unshift(function(elem) {
                    const iframe = document.createElement("iframe");
                    iframe.src = elem.jAlert().video;
                    iframe.className = 'ja_iframe';

                    if (iframe.addEventListener) {
                        iframe.addEventListener('load', function() {
                            $.fn.jAlert.mediaLoaded($(this));
                        }, true);
                    } else if (iframe.attachEvent) {
                        iframe.attachEvent("onload", function() {
                            $.fn.jAlert.mediaLoaded($(this));
                        });
                    } else {
                        iframe.onload = function() {
                            $.fn.jAlert.mediaLoaded($(this));
                        };
                    }

                    elem.find('.ja_video').append(iframe);
                });

                return content;
            } else if (alert.iframe) {
                const content = "<div class='ja_media_wrap'>" + loader + "</div>";

                // Add to the onOpen callbacks array to append the iframe
                alert.onOpen.unshift(function(elem) {
                    const iframe = document.createElement("iframe");
                    iframe.src = elem.jAlert().iframe;
                    iframe.className = 'ja_iframe';

                    if (iframe.addEventListener) {
                        iframe.addEventListener('load', function() {
                            $.fn.jAlert.mediaLoaded($(this));
                        }, true);
                    } else if (iframe.attachEvent) {
                        iframe.attachEvent("onload", function() {
                            $.fn.jAlert.mediaLoaded($(this));
                        });
                    } else {
                        iframe.onload = function() {
                            $.fn.jAlert.mediaLoaded($(this));
                        };
                    }

                    elem.find('.ja_media_wrap').append(iframe);
                });

                return content;
            } else if (alert.ajax) {
                const content = "<div class='ja_media_wrap'>" + loader + "</div>";

                // Store as another var
                const onAjaxCallbacks = alert.onOpen;

                // Overwrite the onOpen to be the ajax call
                alert.onOpen = [function(elem) {
                    $.ajax(elem.jAlert().ajax, {
                        async: true,
                        complete: function(jqXHR, textStatus) {
                            elem.find('.ja_media_wrap').replaceWith(jqXHR.responseText);

                            // Run onOpen callbacks here
                            onAjaxCallbacks.forEach(function(onAjax) {
                                onAjax(elem);
                            });
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
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
            btn['class'] += ' ja_btn_' + btn.theme;
            btn.text = btn.text || '';
            btn.id = btn.id || 'ja_btn_' + utils.generateId();
            btn.target = btn.target || '_self';
            btn.closeAlert = btn.closeAlert !== false;
            btn.ariaLabel = btn.ariaLabel || btn.text;

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
                return "<a href='" + btn.href + "' id='" + btn.id + "' target='" + btn.target + "' class='ja_btn " + btn['class'] + "' aria-label='" + btn.ariaLabel + "'>" + btn.text + "</a> ";
            } else {
                return "<button type='button' id='" + btn.id + "' class='ja_btn " + btn['class'] + "' aria-label='" + btn.ariaLabel + "'>" + btn.text + "</button> ";
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
            const sizeStyles = utils.getSizeStyles(alert.size);
            classes.push(...sizeClasses);
            styles.push(...sizeStyles);

            // Handle iframe height
            if (alert.iframe && !alert.iframeHeight) {
                classes.push('ja_stretch_height');
            }

            let html = '<div class="ja_wrap ' + backgroundClasses.join(' ') + '" role="dialog" aria-modal="true" aria-labelledby="' + alert.id + '_title" aria-describedby="' + alert.id + '_content">' +
                '<div class="jAlert ' + classes.join(' ') + '" style="' + styles.join(' ') + '" id="' + alert.id + '" tabindex="-1">' +
                '<div>';

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
                    console.log('jAlert Config Error: Incorrect value for btns (must be object or array of objects): ' + alert.btns);
                }

                html += '</div>';
            }

            html += '</div></div></div></div>';

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

                this.animateAlert('hide');

                window.setTimeout(() => {
                    const alertWrap = this.instance.parents('.ja_wrap');

                    if (remove) {
                        alertWrap.remove();
                    } else {
                        alertWrap.hide();
                    }

                    if (typeof onClose === 'function') {
                        onClose(this.instance);
                    } else if (typeof this.onClose === 'function') {
                        this.onClose(this.instance);
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
                $('.jAlert:visible').data('jAlert').jAlert().closeAlert(removeOthers);
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

            if (!height) {
                // Auto-fit to content height
                const content = body.children();
                const contentHeight = content.outerHeight();
                
                // Set body height to fit content
                body.css('height', contentHeight + 'px');
            } else {
                // Apply specific height
                body.css('height', typeof height === 'number' ? height + 'px' : height);
            }

            // Update size property
            if (height) {
                this.size = { height: typeof height === 'number' ? height + 'px' : height };
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
            
            return this;
        }
        resizeToFit() { return this.autoResize(); }
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

        // Process video URL
        if (alert.video) {
            alert.video = utils.processVideoUrl(alert.video);
        }

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

        // Handle confirm type
        if (alert.type === 'confirm') {
            utils.setupConfirmButtons(alert);
        }

        // Validate options
        if (!utils.validateTheme(alert.theme) || 
            !utils.validateSize(alert.size) || 
            !utils.validateBackgroundColor(alert.backgroundColor)) {
            return false;
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

            if (alert.autoResizeOnContentChange) {
                const content = alert.instance.find('.ja_body')[0];
                if (window.MutationObserver && content) {
                    const observer = new MutationObserver(() => {
                        if (alert.instance && document.body.contains(alert.instance[0]) && alert.instance.is(':visible')) {
                            alert.autoResize();
                        }
                    });
                    observer.observe(content, { childList: true, subtree: true, characterData: true });
                    alert._autoResizeObserver = observer;
                }
            }

            return alert.instance;
        };

        // Initialize
        if (!alert.content && !alert.image && !alert.video && !alert.iframe && !alert.ajax) {
            console.log('jAlert potential error: No content defined');
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
            var instance = alert.jAlert && typeof alert.jAlert === 'function' ? alert.jAlert() : null;
            if (instance && typeof instance.closeAlert === 'function' && instance.instance && instance.instance.data('jAlert')) {
                instance.closeAlert();
            }
            if (typeof errorAlert === 'function') {
                errorAlert(errorThrown);
            }
        },
        'iframe': false,
        'iframeHeight': false,
        'slideshow': false,
        'slideshowOptions': {
            'autoAdvance': false,
            'autoAdvanceInterval': 3000,
            'keyboardNav': true,
            'pauseOnHover': false,
            'resizeMode': 'fitCurrent', // 'fitCurrent' or 'fitLargest'
            'loop': true,
            'showArrows': true,
            'showCounter': 'numbers', // 'numbers', 'dots', or false
            'arrowButtons': null // Custom arrow buttons DOM elements
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
        'type': 'modal',
        'confirmQuestion': 'Are you sure?',
        'confirmBtnText': 'Yes',
        'denyBtnText': 'No',
        'confirmAutofocus': '.confirmBtn',
        'onConfirm': function(e, btn) {
            e.preventDefault();
            console.log('confirmed');
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

        if (lastVisibleAlert.length > 0 && lastVisibleAlert.data('jAlert').closeOnClick) {
            if (!$(target).is('.jAlert *')) {
                lastVisibleAlert.data('jAlert').closeAlert();
            }
        }
    };

    $.fn.jAlert.onEscKeyDown = function(e) {
        if (e.keyCode === 27) {
            const lastVisibleAlert = $('.jAlert:visible:last');
            if (lastVisibleAlert.length > 0 && lastVisibleAlert.data('jAlert').closeOnEsc) {
                lastVisibleAlert.data('jAlert').closeAlert();
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
        if ($(this).data('jAlert')) {
            $(this).data('jAlert').closeAlert(remove, onClose);
        }
    };

    // Media loaded callback
    $.fn.jAlert.mediaLoaded = function(elem) {
        const wrap = elem.parents('.ja_media_wrap');
        const vidWrap = wrap.find('.ja_video');
        const alert = elem.parents('.jAlert:first');
        const jalert = alert.data('jAlert');

        wrap.find('.ja_loader').remove();

        if (vidWrap.length > 0) {
            vidWrap.fadeIn('fast');
        } else {
            elem.fadeIn('fast');
        }

        // If iframe, add height after load and set display: block
        if (jalert.iframeHeight) {
            elem.css('flex', 'unset');
            elem.height(jalert.iframeHeight);
        }
    };

    // Global resize functions
    $.fn.resizeModal = function(height) {
        if (this.data('jAlert')) {
            return this.data('jAlert').resizeModal(null, height);
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
        if (this.data('jAlert')) {
            return this.data('jAlert').autoResize();
        }
        return this;
    };

    $.fn.resizeToFit = function() {
        if (this.data('jAlert')) {
            return this.data('jAlert').resizeToFit();
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

})(jQuery); 