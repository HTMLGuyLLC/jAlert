/* 
 *
 *
 jAlert version 4.5.1
 Made with love by Versatility Werks (http://flwebsites.biz)
 MIT Licensed
 *
 *
 */
;(function($) {

	if(!Date.now)
		Date.now = function(){
			return +new Date();
		};

	$.fn.jAlert = function(options) {

        //remove focus from current element so you can't just hit enter a bunch to popup the same alert over and over again
        $('body').focus();
        $('body').blur();

		var themes = ['default', 'green', 'dark_green', 'red', 'dark_red', 'black', 'brown', 'gray', 'dark_gray', 'blue', 'dark_blue', 'yellow'],
            sizes = ['xsm', 'sm', 'md', 'lg', 'xlg', 'full', 'auto'],
            sizeAliases = {'xsmall': 'xsm', 'small':'sm','medium':'md','large':'lg','xlarge':'xlg'},
            backgroundColors = ['white', 'black'],
            styles = [], //array of styles that gets joined together with a space between in a style tag on the jalert div
            classes = ['animated'], //array of classes that get joined together with a space between on the jalert div
            backgroundClasses = []; //array of classes that get joined together with a space between on the jalert background div

		/* Block Multiple Instances by running jAlert for each one */
		if (this.length > 1){
			this.each(function() {
				$.fn.jAlert(options);
			});
			return this;
		}

        /* If this is an existing jAlert, return it so you can access public methods and properties */
        if( typeof $(this)[0] != 'undefined' )
        {
            if( $(this)[0]['jAlert'] != 'undefined' )
            {
                return $(this)[0]['jAlert'];
            }
        }

        /**
         * Use the defaults object to find any accidentally lowercased keys from the options object and convert them.
         */
        $.each($.fn.jAlert.defaults, function(key, val){
           var lowerKey = key.toLowerCase();
           if( typeof options[lowerKey] !== 'undefined' )
           {
               options[key] = options[lowerKey];
           }
        });

		/* Combine user options with default */
		options = $.extend({}, $.fn.jAlert.defaults, options);

		/* If they didn't set an id, just create a random one */
		if( !options.id )
		{
			var unique = Date.now().toString() + Math.floor(Math.random() * 100000);
			var alert_id = 'ja_' + unique;
		}
		else
		{
			var alert_id = options.id;
		}

        /**
         * This is the alert object with the public properties/methods you can call
         * @type {{set: alert.set, __set: alert.__set, get: alert.get, __get: alert.__get, centerAlert: alert.centerAlert, animateAlert: alert.animateAlert, closeAlert: alert.closeAlert, showAlert: alert.showAlert}}
         */
        var alert = {
            set: function(key, val)
            {
                alert[key] = val;
                return alert;
            },
            __set: function(key, val)
            {
                return alert.set(key, val);
            },
            get: function(key)
            {
                return alert[key];
            },
            __get: function(key)
            {
                return alert.get(key);
            },
            centerAlert: function()
            {
                var viewportHeight = $(window).height(),
                    alertHeight = alert.instance.height(),
                    diff = viewportHeight - alertHeight;

                var margin = diff / 2;

                margin = margin > 200 ? margin - 100 : margin;
                margin = margin <= 0 ? 0 : margin;
                margin = margin - 1; //make up for border if any - just brings it up a bit anyway.

                alert.instance.css('margin-top', margin+'px');
                alert.instance.css('margin-bottom', '0px');

                $('body').css('overflow', 'hidden');

                if( diff > 5 )
                {
                    alert.instance.parents('.ja_wrap').css('position', 'fixed');
                }
                else
                {
                    alert.instance.parents('.ja_wrap').css('position', 'absolute');

                    /* Scroll to alert */
                    $('html, body').animate({
                        scrollTop: top - 50
                    }, 200);
                }

                return alert;
            },
            animateAlert: function(which){
                if( which == 'hide' )
                {
                    if( alert.instance.jAlert().blurBackground )
                    {
                        $('body').removeClass('ja_blur');
                    }

                    alert.instance.removeClass(alert.showAnimation).addClass(alert.hideAnimation);
                }
                else
                {
                    if( alert.instance.jAlert().blurBackground )
                    {
                        $('body').addClass('ja_blur');
                    }

                    alert.centerAlert();
                    alert.instance.addClass(alert.showAnimation).removeClass(alert.hideAnimation).show();
                }

                return alert;
            },
            /* Hides an alert and optionally removes it */
            closeAlert: function(remove, onClose)
            {
                if( remove != false )
                {
                    remove = true;
                }
    
                if(alert.instance)
                {
                    alert.instance.unbind('DOMSubtreeModified');
    
                    alert.animateAlert('hide');
    
                    window.setTimeout(function()
                    {
                        var alertWrap = alert.instance.parents('.ja_wrap');
    
                        if( remove )
                        {
                            alertWrap.remove();
                        }
                        else
                        {
                            alertWrap.hide();
                        }
    
                        if(typeof onClose == 'function')
                        {
                            onClose(alert.instance);
                        }
                        else if(typeof alert.onClose == 'function')
                        {
                            alert.onClose(alert.instance);
                        }
    
                        if( $('.jAlert:visible').length > 0 )
                        {
                            $('.jAlert:visible:last').jAlert().centerAlert();
                        }
                        else
                        {
                            $('body').css('overflow', 'auto');
                        }
    
                    }, alert.animationTimeout);
                }

                return alert;
            },
            /* Shows an alert that already exists */
            showAlert: function(replaceOthers, removeOthers, onOpen, onClose){

                if( replaceOthers != false )
                {
                    replaceOthers = true;
                }

                if( removeOthers !== false )
                {
                    removeOthers = true;
                }

                if( replaceOthers )
                {
                    $('.jAlert:visible').jAlert().closeAlert(removeOthers);
                }

                /* Put this one above the last one by moving to end of dom */
                var wrap = alert.instance.parents('.ja_wrap');

                $('body').append(wrap);

                alert.animateAlert('show');

                if( typeof onClose == 'function' )
                {
                    alert.onClose = onClose;
                }

                window.setTimeout(function(){

                    if(typeof onOpen == 'function')
                    {
                        onOpen(alert.instance);
                    }

                }, alert.animationTimeout);

                return alert;
            }
        };

        /**
         * Add all options to the alert object as properties
         */
        $.each(options, function(key, val){
           alert.set(key, val);
        });

        /**
         * Add this instance's unique ID to the alert object
         */
        alert.set('id', alert_id);

        /**
         * If content is a selector (id only) and the element exists, grab it's content
         */
        if( alert.content && alert.content.indexOf('#') === 0 )
        {
            if( $(alert.content).length > 0 )
            {
                alert.content = $(alert.content).html();
            }
        }

        /**
         * Automatically convert a youtube video's URL to the embed version
         */
        if( alert.video && alert.video.indexOf('youtube.com/watch?v=') > -1 && alert.video.indexOf('embed') === -1 )
        {
            alert.video = alert.video.replace('watch?v=', 'embed/');
        }

        /**
         * If this is a confirm popup, set the buttons, content, etc
         */
		if( alert.type == 'confirm' )
		{
			if( !alert.content )
			{
                alert.content = alert.confirmQuestion;
			}

			alert.btns = [
				{ 'text': alert.confirmBtnText, 'theme': 'green', 'class': 'confirmBtn', 'closeAlert': true, 'onClick': alert.onConfirm },
				{ 'text': alert.denyBtnText, 'theme': 'red', 'class': 'denyBtn', 'closeAlert': true, 'onClick': alert.onDeny }
			];

			alert.autofocus = alert.confirmAutofocus;
		}

        /* If used the alias color, swap to theme */
        if( alert.color )
        {
            alert.theme = alert.color;
        }

        /**
         * Make sure theme is a real class
         */
		if( $.inArray(alert.theme, themes) == -1 )
		{
			console.log('jAlert Config Error: Invalid theme selection.');
			return false;
		}

        /**
         * Push the theme to the classes array
         */
		classes.push('ja_'+alert.theme);

		/* If they set custom classes */
		if( alert['class'] )
		{
			classes.push(alert['class']);
		}
		if( alert.classes )
		{
			classes.push(alert.classes);
		}

		//if fullscreen, add class
		if( alert.fullscreen )
        {
            classes.push('ja_fullscreen');
        }

        //if no padding on the content
		if( alert.noPadContent )
        {
            classes.push('ja_no_pad');
        }

		/* If no title, add class */
		if( !alert.title )
		{
			classes.push( 'ja_noTitle' );
		}

        /* If used the alias width, swap to size */
        if( alert.width )
        {
            alert.size = alert.width;
        }

		/* if it's set and it's not in the array of sizes OR it's an object and it's missing width/height */
		if( alert.size && ((typeof alert.size == 'object' && (typeof alert.size.width == 'undefined' || typeof alert.size.height == 'undefined'))) ) {
            console.log('jAlert Config Error: Invalid size selection (try a preset or make sure you\'re including height and width in your size object).');
            return false;
        }
		/* If it's not set, set to md */
		else if( !alert.size )
		{
			classes.push('ja_sm');
		}
		/* If it's set and it's an object */
		else if( typeof alert.size == 'object' )
		{
			styles.push('width: '+alert.size.width+';');
			styles.push('height: '+alert.size.height+';');
            classes.push('ja_setheight');
		}
		/* If it's set and it's not an object */
		else
		{
            //swap alias for actual size class
            if( typeof sizeAliases[alert.size] !== 'undefined' )
            {
                alert.size = sizeAliases[alert.size];
            }

            //if it's one of the sizes, set the class
            if( $.inArray(alert.size, sizes) > -1 )
            {
                classes.push('ja_'+alert.size);
            }
            //otherwise, we assume they provided a px or % width
            else
            {
                styles.push('width: '+alert.size+';');
            }
		}

		/* Add background color class */
		if( $.inArray(alert.backgroundColor, backgroundColors) == -1 )
		{
			console.log('jAlert Config Error: Invalid background color selection.');
			return false;
		}

		backgroundClasses.push('ja_wrap_'+alert.backgroundColor);

		alert.onOpen = [ alert.onOpen ];

		var onload = "onload='$.fn.jAlert.mediaLoaded($(this))'",
				loader = "<div class='ja_loader'>Loading...</div>";

        /**
         * Picture is now an alias for image
         */
        if( alert.picture )
        {
            alert.image = alert.picture;
        }

        /* Creates content */
		if( alert.image )
		{
			alert.content = "<div class='ja_media_wrap'>"+
					loader+
					"<img src='"+alert.image+"' class='ja_img' "+onload+"'";
			if( alert.imageWidth )
			{
				alert.content += " style='width: "+alert.imageWidth+"'";
			}
			alert.content += ">"+
					"</div>";
		}
		else if( alert.video )
		{
			alert.content = "<div class='ja_media_wrap'>"+
					loader+
					"<div class='ja_video'>"+
					"</div>"+
					"</div>";

			/* Add to the onOpen callbacks array to append the iframe and attach the onload callback in a crossbrowser compatible way (IE is a bizitch). */
			alert.onOpen.unshift( function(elem){
				var iframe = document.createElement("iframe");
				iframe.src = elem.jAlert().video;

				if(iframe.addEventListener)
				{
					iframe.addEventListener('load', function(){
						$.fn.jAlert.mediaLoaded($(this));
					}, true)
				}
				else if (iframe.attachEvent){
					iframe.attachEvent("onload", function(){
						$.fn.jAlert.mediaLoaded($(this));
					});
				} else {
					iframe.onload = function(){
						$.fn.jAlert.mediaLoaded($(this));
					};
				}

                elem.find('.ja_video').append(iframe);
			});

		}
		else if( alert.iframe )
		{
			if( !alert.iframeHeight )
			{
				alert.iframeHeight = $(window).height() +'px';
			}

			alert.content = "<div class='ja_media_wrap'>"+
					loader+
					"</div>";

			/* Add to the onOpen callbacks array to append the iframe and attach the onload callback in a crossbrowser compatible way (IE is a bizitch). */
			alert.onOpen.unshift( function(elem){
				var iframe = document.createElement("iframe");
				iframe.src = elem.jAlert().iframe;
				iframe.className = 'ja_iframe';

				if(iframe.addEventListener)
				{
					iframe.addEventListener('load', function(){
						$.fn.jAlert.mediaLoaded($(this));
					}, true)
				}
				else if (iframe.attachEvent){
					iframe.attachEvent("onload", function(){
						$.fn.jAlert.mediaLoaded($(this));
					});
				} else {
					iframe.onload = function(){
						$.fn.jAlert.mediaLoaded($(this));
					};
				}

                elem.find('.ja_media_wrap').append(iframe);
			});
		}
		else if( alert.ajax )
		{
			alert.content = "<div class='ja_media_wrap'>"+
					loader+
					"</div>";

			/* Store as another var */
			onAjaxCallbacks = alert.onOpen;

			/* Overwrite the onOpen to be the ajax call */
			alert.onOpen = [function(elem){
				$.ajax(elem.jAlert().ajax, {
					async: true,
					complete: function(jqXHR, textStatus)
					{
                        elem.find('.ja_media_wrap').replaceWith(jqXHR.responseText);

						/* Run onOpen callbacks here */
						$.each(onAjaxCallbacks, function(index, onAjax){
							onAjax(elem);
						});
					},
					error: function(jqXHR, textStatus, errorThrown)
					{
						alert.onAjaxFail(elem, 'Error getting content: Code: '+jqXHR.status+ ' : Msg: '+jqXHR.statusText);
					}
				});
			}];
		}

		var getBtnHTML = function(btn){

			if(typeof btn.href == 'undefined'){ btn.href = ''; }
			if(typeof btn['class'] == 'undefined'){ btn['class'] = ''; }
			if(typeof btn.theme == 'undefined'){ btn['class'] += ' ja_btn_default'; }else{ btn['class'] += ' ja_btn_'+btn.theme; }
			if(typeof btn.text == 'undefined'){ btn.text = ''; }
			if(typeof btn.id == 'undefined'){ var unique = Date.now().toString() + Math.floor(Math.random() * 100000); btn.id = 'ja_btn_' + unique; }
			if(typeof btn.target == 'undefined'){ btn.target = '_self'; }
			if(typeof btn.closeAlert == 'undefined'){ btn.closeAlert = true; }

			$('body').off('click', '#'+btn.id); //remove handler before adding it to remove dupe handlers

			/* Attach on click handler */
			$('body').on('click', '#'+btn.id, function(e){

				var button = $(this);

				if( btn.closeAlert )
				{
					button.parents('.jAlert').jAlert().closeAlert();
				}

				var callbackResponse = true;

				if( typeof btn.onClick == 'function' )
				{
					callbackResponse = btn.onClick(e, button);
				}

				if( !callbackResponse || btn.closeAlert )
				{
					e.preventDefault();
					return false;
				}

				return callbackResponse;

			});

			return "<a href='"+btn.href+"' id='"+btn.id+"' target='"+btn.target+"' class='ja_btn "+btn['class']+"'>"+btn.text+"</a> ";
		};

		/* Adds a new alert to the dom */
		var addAlert = function(content){

			var html = '';

			html += '<div class="ja_wrap '+backgroundClasses.join(' ')+'">'+
					'<div class="jAlert '+classes.join(' ')+ '" style="' +styles.join(' ')+ '" id="' +alert.id+ '">'+
					'<div>';

			if( alert.closeBtn )
			{
				html += 		"<div class='closejAlert ja_close";
				if( alert.closeBtnAlt )
				{
					html += ' ja_close_alt';
				}
                else if( alert.closeBtnRoundWhite )
                {
                    html += ' ja_close_round_white';
                }
                else if( alert.closeBtnRound )
                {
                    html += ' ja_close_round';
                }
				html += "'>&times;</div>"; //closejAlert has a close handler attached, ja_close is for styling
			}

			if( alert.title )
			{
				html += 		"<div class='ja_title'><div>"+alert.title+"</div></div>";
			}

			html += 			'<div class="ja_body">'+content;


			if( alert.btns )
			{
				html += 			'<div class="ja_btn_wrap ';

				if( alert.btnBackground )
				{
					html += 		'optBack';
				}

				html += 			'">';
			}

			if( typeof alert.btns[0] == 'object' )
			{
				$.each(alert.btns, function(index, btn){
					if( typeof btn == 'object' )
					{
						html += 		getBtnHTML(btn);
					}
				});
			}
			else if( typeof alert.btns == 'object' )
			{
				html += 				getBtnHTML(alert.btns);
			}
			else if( alert.btns )
			{
				console.log('jAlert Config Error: Incorrect value for btns (must be object or array of objects): '+alert.btns);
			}

			if( alert.btns )
			{
				html += 			'</div>';
			}

			html += 			'</div>'+
					'</div>'+
					'</div>'+
					'</div>';

			var alertHTML = $(html);

			if( alert.replaceOtherAlerts )
			{
                var alerts = $('.jAlert:visible');
                alerts.each(function(){
                    $(this).jAlert().closeAlert();
                });
			}

			$('body').append(alertHTML);

            //cache instance
			alert.instance = $('#'+alert.id);

            //attach alert object to dom element
            alert.instance[0]['jAlert'] = alert;

            //doing this now will prevent it from happening mid-animation
            $('body').css('overflow', 'hidden');

            //show the new alert
			alert.animateAlert('show');

            //add close button handler
			if( alert.closeBtn ){

				alert.instance.on('click', '.closejAlert', function(e){
					e.preventDefault();
					$(this).parents('.jAlert:first').jAlert().closeAlert();
					return false;
				});

			}

			/* Bind mouseup handler to document if this alert has closeOnClick enabled */
			if( alert.closeOnClick ){

				/* Unbind if already exists */
				$(document).off('mouseup touchstart', $.fn.jAlert.onMouseUp);

				/* Bind mouseup */
				$(document).on('mouseup touchstart', $.fn.jAlert.onMouseUp);

			}

			/* Bind on keydown handler to document and if esc was pressed, find all visible jAlerts with that close option enabled and close them */
			if( alert.closeOnEsc ){

				/* Unbind if already exists */
				$(document).off('keydown', $.fn.jAlert.onEscKeyDown);

				/* Bind keydown */
				$(document).on('keydown', $.fn.jAlert.onEscKeyDown);

			}

			/* If there are onOpen callbacks, run them. */
			if( alert.onOpen )
			{
				$.each(alert.onOpen, function(index, onOpen){
					onOpen(alert.instance);
				});
			}

			/* If the alert has an element that should be focused by default */
			if( alert.autofocus )
			{
				alert.instance.find(alert.autofocus).focus();
			}
			else
			{
				alert.instance.focus();
			}

			alert.instance.bind("DOMSubtreeModified", function(){
				alert.centerAlert();
			});

			return alert.instance;

		};

		/* Shows an alert based on content type */
		this.initialize = function(){

			if( !alert.content && !alert.image && !alert.video && !alert.iframe && !alert.ajax )
			{
				console.log('jAlert potential error: No content defined');
				return addAlert('');
			}
			else
			{
				if( !alert.content )
				{
					alert.content = '';
				}

				return addAlert(alert.content);
			}

		};

        //initialize
		this.initialize();

        //return the object so you can chain public methods/properties
		return alert;

		/* END OF PLUGIN */
	};

	/* Default alert */
	$.fn.jAlert.defaults = {
		'title': false, //title for the popup (false = don't show)
		'content': false, //html for the popup (replaced if you use image, ajax, or iframe)
        'noPadContent': false, //remove padding from the body
        'fullscreen': false, //make the jAlert completely fullscreen
		'image': false, //adds a centered img tag
		'imageWidth': 'auto', //defaults to max-width: 100%; width: auto;
		'video': false, //adds a responsive iframe video - value is the "src" of the iframe
		'ajax': false, //uses ajax call to get contents
		'onAjaxFail': function(alert, errorThrown){ //callback for when ajax fails
			alert.jAlert().closeAlert();
			errorAlert(errorThrown);
		},
		'iframe': false, //uses iframe as content
		'iframeHeight': false, //string. height of the iframe within the popup (false = 90% of viewport height)
		'class': '', //adds a class to the jAlert (add as many as you want space delimited)
		'classes': '', //add classes to the jAlert (space delimited)
		'id': false, //adds an ID to the jAlert
		'showAnimation': 'fadeInUp',
		'hideAnimation': 'fadeOutDown',
		'animationTimeout': 600, //approx duration of animation to wait until onClose
		'theme': 'default', // red, green, blue, black, default
		'backgroundColor': 'black', //white, black
        'blurBackground': false, //blurs background elements
		'size': false, //false = css default, xsm, sm, md, lg, xlg, full, { height: 200, width: 200 }
		'replaceOtherAlerts': false, //if there's already an open jAlert, remove it first
		'closeOnClick': false, //close the alert when you click anywhere
		'closeOnEsc': true, //close the alert when you click the escape key
		'closeBtn': true, //adds a button to the top right of the alert that allows you to close it
		'closeBtnAlt': false, //alternative close button
        'closeBtnRound': true, //alternative round close button
        'closeBtnRoundWhite': false, //alternative round close button (in white)
		'btns': false, //adds buttons to the popup at the bottom. Pass an object for a single button, or an object of objects for many
		/*
		 Variety of buttons you could create (also, an example of how to pass the object

		 'btns': [
		 {'text':'Open in new window', 'closeAlert':false, 'href': 'http://google.com', 'target':'_new'},
		 {'text':'Cool, close this alert', 'theme': 'blue', 'closeAlert':true},
		 {'text':'Buy Now', 'closeAlert':true, 'theme': 'green', 'onClick': function(){ console.log('You bought it!'); } },
		 {'text':'I do not want it', 'closeAlert': true, 'theme': 'red', 'onClick': function(){ console.log('Did not want it'); } },
		 {'text':'DOA', 'closeAlert': true, 'theme': 'black', 'onClick': function(){ console.log('Dead on arrival'); } }
		 ]
		 */
		'btnBackground': true, //adds optional background to btns
		'autofocus': false, //pass a selector to autofocus on it

		'onOpen': function(alert){ //on open call back. Fires just after the alert has finished rendering
			return false;
		},
		'onClose': function(alert){ //fires when you close the alert
			return false;
		},

		'type': 'modal', //modal, confirm, tooltip

		/* The following only applies when type == 'confirm' */
		'confirmQuestion': 'Are you sure?',
		'confirmBtnText': 'Yes',
		'denyBtnText': 'No',
		'confirmAutofocus': '.confirmBtn', //confirmBtn or denyBtn
		'onConfirm': function(e, btn){
			e.preventDefault();
			console.log('confirmed');
			return false;
		},
		'onDeny': function(e, btn){
			e.preventDefault();
			//console.log('denied');
			return false;
		}
	};

	/** Mouseup on document */
	$.fn.jAlert.onMouseUp = function(e){
        //cross browser
        var target = e.target ? e.target : e.srcElement;

		/* Find top visible jAlert and see if it has closeOnClick enabled */
		var lastVisibleAlert = $('.jAlert:visible:last');

		if( lastVisibleAlert.length > 0 && lastVisibleAlert.jAlert().closeOnClick )
		{
			//close only if clicked outside
            if( !$(target).is('.jAlert *') )
            {
                lastVisibleAlert.jAlert().closeAlert();
            }
		}

	};

	/* Keydown on document (escape key) */
	$.fn.jAlert.onEscKeyDown = function(e){

		/* Escape = 27 */
		if(e.keyCode === 27){

			/* Find top visible jAlert and see if it has closeOnClick enabled */
			var lastVisibleAlert = $('.jAlert:visible:last');

			if( lastVisibleAlert.length > 0 && lastVisibleAlert.jAlert().closeOnEsc )
			{
				lastVisibleAlert.jAlert().closeAlert();
			}

		}

	};

    $.fn.attachjAlert = function(e){
        e.preventDefault();
        $.jAlert($(this).data());
        return false;
    };

	/* If you're not using the DOM (aka, you're not hiding or showing a specific alert, you can just use $.jAlert */
	$.jAlert = function(options){

        /**
         * If you pass "current" to $.jAlert('current'); it should return the top-most visible jAlert
         */
        if( options == 'current' )
        {
            var latest = $('.jAlert:visible:last');
            if( latest.length > 0 )
            {
                return latest.jAlert();
            }

            return false;
        }

        /**
         * Attaches the on-click handler to data-attributes
         */
        if( options == 'attach' )
        {
            /* If there are data attributes for showing jAlerts, add the click handler */
            $('[data-jAlert]').off('click', $.fn.attachjAlert);
            $('[data-jAlert]').on('click', $.fn.attachjAlert);
            $('[data-jalert]').off('click', $.fn.attachjAlert);
            $('[data-jalert]').on('click', $.fn.attachjAlert);

            return false;
        }

		return $.fn.jAlert(options);
	};

	/* Alert on click function - attach to existing dom */
	$.fn.alertOnClick = function(options)
	{
		$(this).on('click', function(e){
			e.preventDefault();
			$.jAlert(options);
			return false;
		});
	};

	/* Alert on click function - global, works for changing dom */
	$.alertOnClick = function(selector, options)
	{
		$('body').on('click', selector, function(e){
			e.preventDefault();
			$.jAlert(options);
			return false;
		});
	};

    $.fn.closeAlert = function(remove, onClose){
        $(this).jAlert().closeAlert(remove, onClose);
    };

	/* Slowed window resize function */
	var $jAlertResizeTimeout;
	$(window).resize(function () {
		window.clearTimeout($jAlertResizeTimeout);
		$jAlertResizeTimeout = window.setTimeout(function(){
			$('.jAlert:visible').each(function(){
				$(this).jAlert().centerAlert();
			});
		}, 200);
	});

	/* Onload callback for iframe, img, etc */
	$.fn.jAlert.mediaLoaded = function(elem){
		var wrap = elem.parents('.ja_media_wrap'),
			vid_wrap = wrap.find('.ja_video'),
            alert = elem.parents('.jAlert:first'),
            jalert = alert.jAlert();

		wrap.find('.ja_loader').remove();

		if( vid_wrap.length > 0 )
		{
			vid_wrap.fadeIn('fast');
		}
		else
		{
			elem.fadeIn('fast');
		}

		//if iframe, add height after load and set display: block
		if( typeof jalert.iframeHeight !== 'undefined' && jalert.iframeHeight )
        {
            elem.css('display', 'block');
            elem.height(jalert.iframeHeight);
        }

        jalert.centerAlert();

	};

	/* END OF ON JQUERY LOAD */
})(jQuery);