function displayPromo(){  //display the promo code, you could get this from PHP to be more secure
	$('.fb-button').replaceWith('<div class="fb-already-connected" style="color: rgb(0, 88, 164);"><b>Thank you for sharing!</b><br> Use the <b>promo code "FB10"</b> during checkout to receive 10% off your plan!</div>');
}

window.fbAsyncInit = function() {
// init the FB JS SDK
FB.init({
  appId      : '591990517558339',               // Replace with your Facebook APP ID
  channelUrl : '//flwebsites.biz/channel.html', // Replace with your domain //Channel file for x-domain comms
  xfbml      : true                             // Look for social plugins on the page
});

$processed = false;

$('.jSave').on('click', function(){
	$.jAlert({
		'title': 'Share and Save',
		'content': "<div style='font-size: 120%;'>It's Easy, Fast, and FREE.</div><br><b>1. <span style='color: rgb(0, 158, 255);'>Connect</span> via Facebook (below).<br><br>2. We'll <span style='color: rgb(0, 158, 255);'>auto-post</span> to your wall.<br><small><i>\"This is a preview of what we will be posting.\"</i></small><br><br>3. You'll get a coupon to <span style='color: rgb(0, 158, 255);'>save</span> 10%!</b><br><br><a class='fb-button jSaveBtn'> Connect & Post</a>",
		'theme': 'black',
		'size': 'sm'
	});
});

$('body').on('click', '.fb-button', function(e){
	e.preventDefault(); 
	
	FB.login(function(response) {
	   if(response.authResponse) {
			FB.api('/me', function(userInfo) {
			if(userInfo.name){
				/* HERE YOU COULD OPTIONALLY USE THEIR NAME, EMAIL, ETC */
				// console.log(userInfo);
				var body = "Check that out. I just used http://flwebsites.biz/jAlert to post this to my wall!"; var link = 'http://flwebsites.biz/jAlert'; // you don't need to send link if you just want to post text
				FB.api('/me/feed', 'post', { message: body, link: link }, function(response) {
					if(response.error){ // if there was an error
						if(response.error.code != 200){ // 200 means they denied the permission to post to their wall, don't do anything
						if(response.error.code != 506){ //506 means the message was posted more than once and denied, just show the discount again
							alert(response.error.message); //show them the error that was returned by facebook for reporting
						}else{
							displayPromo(); 
						}
						}
					}else{
						displayPromo();
						}
				});
			}
			});
	   }
  }, {scope: 'email, publish_actions'}); //you don't need the email permission, but I'd assume you'll want to store it somewhere
  
});

};
// Load the SDK asynchronously
(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/all.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));