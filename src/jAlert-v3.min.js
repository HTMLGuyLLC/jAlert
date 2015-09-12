/* 
	*
	*
	jAlert v.3
	Made with love by Versatility Werks (http://flwebsites.biz)
	MIT Licensed
	*
	*
*/
;(function($){var $jAlertSelectedOpts={};if(!Date.now)
Date.now=function(){return+new Date();};$.fn.jAlert=function(options){var themes=['default','green','red','black','blue','yellow'],sizes=['xsm','sm','md','lg','xlg','full'],backgroundColors=['white','black'],styles=[],classes=['animated'],backgroundClasses=[];if(this.length>1){this.each(function(){$(this).jAlert(options);});return this;}
options=$.extend({},$.fn.jAlert.defaults,options);if(!options.id)
{var unique=Date.now().toString()+Math.floor(Math.random()*100000);var alert_id='ja_'+unique;}
else
{var alert_id=options.id;}
$jAlertSelectedOpts[alert_id]={};thisAlert=$jAlertSelectedOpts[alert_id];thisAlert.options=options;thisAlert.options.id=alert_id;thisAlert.instance=false;if(thisAlert.options.type=='confirm')
{if(!thisAlert.options.content)
{thisAlert.options.content=thisAlert.options.confirmQuestion;}
thisAlert.options.btns=[{'text':thisAlert.options.confirmBtnText,'theme':'green','class':'confirmBtn','closeAlert':true,'onClick':thisAlert.options.onConfirm},{'text':thisAlert.options.denyBtnText,'theme':'red','class':'denyBtn','closeAlert':true,'onClick':thisAlert.options.onDeny}];thisAlert.options.autofocus=thisAlert.options.confirmAutofocus;}
if($.inArray(thisAlert.options.theme,themes)==-1)
{console.log('jAlert Config Error: Invalid theme selection.');return false;}
classes.push('ja_'+thisAlert.options.theme);if(thisAlert.options.class)
{classes.push(thisAlert.options.class);}
if(thisAlert.options.classes)
{classes.push(thisAlert.options.classes);}
if(!thisAlert.options.title)
{classes.push('ja_noTitle');}
if(thisAlert.options.size&&((typeof thisAlert.options.size=='string'&&$.inArray(thisAlert.options.size,sizes)==-1)||(typeof thisAlert.options.size=='object'&&(typeof thisAlert.options.size.width=='undefined'||typeof thisAlert.options.size.height=='undefined'))))
{console.log('jAlert Config Error: Invalid size selection (try a preset or make sure you\'re including height and width in your size object).');return false;}
else if(!thisAlert.options.size)
{classes.push('ja_sm');}
else if(typeof thisAlert.options.size=='object')
{styles.push('width: '+thisAlert.options.size.width+';');styles.push('height: '+thisAlert.options.size.height+';');}
else
{classes.push('ja_'+thisAlert.options.size);}
if($.inArray(thisAlert.options.backgroundColor,backgroundColors)==-1)
{console.log('jAlert Config Error: Invalid background color selection.');return false;}
backgroundClasses.push('ja_wrap_'+thisAlert.options.backgroundColor);if((typeof thisAlert.options.btns=='object'||typeof thisAlert.options.btns=='array')||thisAlert.options.autofocus){thisAlert.options.closeOnClick=false;}
thisAlert.options.onOpen=[thisAlert.options.onOpen];var onload="onload='$.fn.jAlert.mediaLoaded($(this))'",loader="<div class='ja_loader'>Loading...</div>";if(thisAlert.options.image)
{thisAlert.options.content="<div class='ja_media_wrap'>"+
loader+"<img src='"+thisAlert.options.image+"' class='ja_img' "+onload+"'";if(thisAlert.options.imageWidth)
{thisAlert.options.content+=" style='width: "+thisAlert.options.imageWidth+"'";}
thisAlert.options.content+=">"+"</div>";}
else if(thisAlert.options.video)
{thisAlert.options.content="<div class='ja_media_wrap'>"+
loader+"<div class='ja_video'>"+"</div>"+"</div>";thisAlert.options.onOpen.unshift(function(alert){var iframe=document.createElement("iframe");iframe.src=thisAlert.options.video;if(iframe.addEventListener)
{iframe.addEventListener('load',function(){$.fn.jAlert.mediaLoaded($(this));},true)}
else if(iframe.attachEvent){iframe.attachEvent("onload",function(){$.fn.jAlert.mediaLoaded($(this));});}else{iframe.onload=function(){$.fn.jAlert.mediaLoaded($(this));};}
alert.find('.ja_video').append(iframe);});}
else if(thisAlert.options.iframe)
{if(!thisAlert.options.iframeHeight)
{thisAlert.options.iframeHeight=$(window).height()*0.9+'px';}
thisAlert.options.content="<div class='ja_media_wrap'>"+
loader+"</div>";thisAlert.options.onOpen.unshift(function(alert){var iframe=document.createElement("iframe");iframe.src=thisAlert.options.iframe;iframe.height=thisAlert.options.iframeHeight;iframe.className='ja_iframe';if(iframe.addEventListener)
{iframe.addEventListener('load',function(){$.fn.jAlert.mediaLoaded($(this));},true)}
else if(iframe.attachEvent){iframe.attachEvent("onload",function(){$.fn.jAlert.mediaLoaded($(this));});}else{iframe.onload=function(){$.fn.jAlert.mediaLoaded($(this));};}
alert.find('.ja_media_wrap').append(iframe);});}
else if(thisAlert.options.ajax)
{thisAlert.options.content="<div class='ja_media_wrap'>"+
loader+"</div>";onAjaxCallbacks=thisAlert.options.onOpen;thisAlert.options.onOpen=[function(alert){$.ajax(thisAlert.options.ajax,{async:true,complete:function(jqXHR,textStatus)
{alert.find('.ja_media_wrap').replaceWith(jqXHR.responseText);$.each(onAjaxCallbacks,function(index,onAjax){onAjax(alert);});},error:function(jqXHR,textStatus,errorThrown)
{thisAlert.options.onAjaxFail(alert,'Error getting content: Code: '+jqXHR.status+' : Msg: '+jqXHR.statusText);}});}];}
this.centerAlert=function()
{var viewportHeight=$(window).height(),alertHeight=thisAlert.instance.height(),diff=viewportHeight-alertHeight;var top=diff/2;if(top>200)
{top=top-100;}
if(top<=0)
{top=0;}
thisAlert.instance.css('margin-top',top+'px');$('body').css('overflow','hidden');if(diff>5)
{thisAlert.instance.parents('.ja_wrap').css('position','fixed');}
else
{thisAlert.instance.parents('.ja_wrap').css('position','absolute');$('html, body').animate({scrollTop:top-50},200);}}
var animateAlert=function(which,thisAlert){if(which=='hide')
{thisAlert.removeClass($jAlertSelectedOpts[thisAlert.attr('id')].options.showAnimation).addClass($jAlertSelectedOpts[thisAlert.attr('id')].options.hideAnimation);}
else
{thisAlert.centerAlert();thisAlert.addClass($jAlertSelectedOpts[thisAlert.attr('id')].options.showAnimation).removeClass($jAlertSelectedOpts[thisAlert.attr('id')].options.hideAnimation).show();}}
var getBtnHTML=function(btn){if(typeof btn.href=='undefined'){btn.href='';}
if(typeof btn.class=='undefined'){btn.class='';}
if(typeof btn.theme=='undefined'){btn.class+=' ja_btn_default';}else{btn.class+=' ja_btn_'+btn.theme;}
if(typeof btn.text=='undefined'){btn.text='';}
if(typeof btn.id=='undefined'){var unique=Date.now().toString()+Math.floor(Math.random()*100000);btn.id='ja_btn_'+unique;}
if(typeof btn.target=='undefined'){btn.target='_self';}
if(typeof btn.closeAlert=='undefined'){btn.closeAlert=true;}
$('body').on('click','#'+btn.id,function(e){var button=$(this);if(btn.closeAlert)
{button.parents('.jAlert').closeAlert();}
var callbackResponse=true;if(typeof btn.onClick=='function')
{callbackResponse=btn.onClick(e,button);}
if(!callbackResponse||btn.closeAlert)
{e.preventDefault();return false;}
return callbackResponse;});return"<a href='"+btn.href+"' id='"+btn.id+"' target='"+btn.target+"' class='ja_btn "+btn.class+"'>"+btn.text+"</a> ";}
this.closeAlert=function(remove,onClose){var alertInstance=$(this);if(remove!=false)
{remove=true;}
if(alertInstance.length)
{alertInstance.unbind('DOMSubtreeModified');animateAlert('hide',alertInstance);window.setTimeout(function()
{var alertWrap=alertInstance.parents('.ja_wrap');if(remove)
{alertWrap.remove();}
else
{alertWrap.hide();}
if(typeof onClose=='function')
{onClose(alertInstance);}
else if(typeof $jAlertSelectedOpts[alertInstance.attr('id')].options.onClose=='function')
{$jAlertSelectedOpts[alertInstance.attr('id')].options.onClose(alertInstance);}
if($('.jAlert').length>0)
{$('.jAlert:last').centerAlert();}
else
{$('body').css('overflow','auto');}},$jAlertSelectedOpts[alertInstance.attr('id')].options.animationTimeout);}
return this;}
this.showAlert=function(replaceOthers,removeOthers,onOpen,onClose){var alertInstance=$(this);if(replaceOthers!=false)
{replaceOthers=true;}
if(removeOthers!==false)
{removeOthers=true;}
if(replaceOthers)
{$('.jAlert:visible').closeAlert(removeOthers);}
var wrap=alertInstance.parents('.ja_wrap');$('body').append(wrap);animateAlert('show',alertInstance);if(typeof onClose=='function')
{$jAlertSelectedOpts[alertInstance.attr('id')].options.onClose=onClose;}
window.setTimeout(function(){if(typeof onOpen=='function')
{onOpen(alertInstance);}},$jAlertSelectedOpts[alertInstance.attr('id')].options.animationTimeout);}
var addAlert=function(content){var html='';html+='<div class="ja_wrap '+backgroundClasses.join(' ')+'">'+'<div class="jAlert '+classes.join(' ')+'" style="'+styles.join(' ')+'" id="'+thisAlert.options.id+'">'+'<div>';if(thisAlert.options.closeBtn)
{html+="<div class='closejAlert ja_close";if(thisAlert.options.closeBtnAlt)
{html+=' ja_close_alt';}
html+="'>X</div>";}
if(thisAlert.options.title)
{html+="<div class='ja_title'><div>"+thisAlert.options.title+"</div></div>";}
html+='<div class="ja_body">'+content;if(thisAlert.options.btns)
{html+='<div class="ja_btn_wrap ';if(thisAlert.options.btnBackground)
{html+='optBack';}
html+='">';}
if(typeof thisAlert.options.btns[0]=='object')
{$.each(thisAlert.options.btns,function(index,btn){if(typeof btn=='object')
{html+=getBtnHTML(btn);}});}
else if(typeof thisAlert.options.btns=='object')
{html+=getBtnHTML(thisAlert.options.btns);}
else if(thisAlert.options.btns)
{console.log('jAlert Config Error: Incorrect value for btns (must be object or array of objects): '+thisAlert.options.btns);}
if(thisAlert.options.btns)
{html+='</div>';}
html+='</div>'+'</div>'+'</div>'+'</div>';var alertHTML=$(html);if(thisAlert.options.replaceOtherAlerts)
{$('.jAlert:visible').closeAlert();}
$('body').append(alertHTML);thisAlert.instance=$('#'+thisAlert.options.id);animateAlert('show',thisAlert.instance);if(thisAlert.options.closeBtn){thisAlert.instance.on('click','.closejAlert',function(e){e.preventDefault();$(this).parents('.jAlert').closeAlert();return false;});}
if(thisAlert.options.closeOnClick){$(document).off('mouseup',$.fn.jAlert.onMouseUp);$(document).on('mouseup',$.fn.jAlert.onMouseUp);}
if(thisAlert.options.closeOnEsc){$(document).off('keydown',$.fn.jAlert.onEscKeyDown);$(document).on('keydown',$.fn.jAlert.onEscKeyDown);}
if(thisAlert.options.onOpen)
{$.each(thisAlert.options.onOpen,function(index,onOpen){onOpen(thisAlert.instance);});}
if(thisAlert.options.autofocus)
{thisAlert.instance.find(thisAlert.options.autofocus).focus();}
else
{thisAlert.instance.focus();}
thisAlert.instance.bind("DOMSubtreeModified",function(){thisAlert.instance.centerAlert();});return thisAlert.instance;};this.initialize=function(){if(!thisAlert.options.content&&!thisAlert.options.image&&!thisAlert.options.video&&!thisAlert.options.iframe&&!thisAlert.options.ajax)
{console.log('jAlert potential error: No content defined');return addAlert('');}
else
{if(!thisAlert.options.content)
{thisAlert.options.content='';}
return addAlert(thisAlert.options.content);}}
this.initialize();return this;};$.fn.jAlert.defaults={'title':false,'content':false,'image':false,'imageWidth':'auto','video':false,'ajax':false,'onAjaxFail':function(alert,errorThrown){thisAlert.closeAlert();errorAlert(errorThrown);},'iframe':false,'iframeHeight':false,'class':'','classes':'','id':false,'showAnimation':'fadeInUp','hideAnimation':'fadeOutDown','animationTimeout':600,'theme':'default','backgroundColor':'black','size':false,'replaceOtherAlerts':false,'closeOnClick':false,'closeOnEsc':true,'closeBtn':true,'closeBtnAlt':false,'btns':false,'btnBackground':true,'autofocus':false,'onOpen':function(alert){return false;},'onClose':function(alert){return false;},'type':'modal','confirmQuestion':'Are you sure?','confirmBtnText':'Yes','denyBtnText':'No','confirmAutofocus':'.confirmBtn','onConfirm':function(e,btn){e.preventDefault();console.log('confirmed');return false;},'onDeny':function(e,btn){e.preventDefault();return false;}}
$.fn.jAlert.onMouseUp=function(e){var lastVisibleAlert=$('.jAlert:visible:last');if($jAlertSelectedOpts[lastVisibleAlert.attr('id')].options.closeOnClick)
{lastVisibleAlert.closeAlert();}};$.fn.jAlert.onEscKeyDown=function(e){if(e.keyCode===27){var lastVisibleAlert=$('.jAlert:visible:last');if($jAlertSelectedOpts[lastVisibleAlert.attr('id')].options.closeOnEsc)
{lastVisibleAlert.closeAlert();}}};$.jAlert=function(options){return $.fn.jAlert(options);}
$.fn.alertOnClick=function(options)
{$(this).on('click',function(e){e.preventDefault();$.jAlert(options);return false;});}
$.alertOnClick=function(selector,options)
{$('body').on('click',selector,function(e){e.preventDefault();$.jAlert(options);return false;});}
var $jAlertResizeTimeout;$(window).resize(function(){window.clearTimeout($jAlertResizeTimeout);$jAlertResizeTimeout=window.setTimeout(function(){$('.jAlert:visible').each(function(){$(this).centerAlert();});},200);});$.fn.jAlert.mediaLoaded=function(elem){var wrap=elem.parents('.ja_media_wrap'),vid_wrap=wrap.find('.ja_video');wrap.find('.ja_loader').remove();if(vid_wrap.length>0)
{vid_wrap.fadeIn('fast');}
else
{elem.fadeIn('fast');}
elem.parents('.jAlert').centerAlert();}})(jQuery);