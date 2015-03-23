;(function(){
	$(document.body).append($('#tpl-side-fix').html());
	$('#back-top').click(function(){
		$('html,body').animate({'scrollTop':0}, 'fast');
	});
})();