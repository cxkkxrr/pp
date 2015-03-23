;(function(){
	$('.logout').live('click', function(){
		ppLib.cookie.remove('sessionid');
		ppLib.cookie.remove('username');
		ppLib.cookie.remove('usertype');
		location.href = '/';
		return false;
	});
})();