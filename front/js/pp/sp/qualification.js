;(function(){
	var $spType = $('#qualification-sp-type');
	var $pushSystem = $('#qualification-system');
	var $pushProductType = $('#qualification-product-type');
	var $pushType = $('#qualification-push-type');
	var $aimCrowd = $('#qualification-aim-crowd');
	var $company = $('#qualification-company');
	var $address = $('#qualification-address');
	var $contact = $('#qualification-contact');
	var $mobile = $('#qualification-mobile');
	var $website = $('#qualification-website');
	var $tel = $('#qualification-tel');
	var $yyzz = $('#qualification-yyzz');
	var $zzjg = $('#qualification-zzjg');


	$spType.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {}, function(json){
		$spType.html('spType');
		$pushSystem.html('pushSystem');
		$pushProductType.html('pushProductType');
		$pushType.html('pushType');
		$aimCrowd.html('aimCrowd');
		$company.html('company');
		$address.html('address');
		$contact.html('contact');
		$mobile.html('mobile');
		$website.html('website');
		$tel.html('tel');
		$yyzz.attr('href','/images/108.jpg').html('<img src="/images/108.jpg" height="80">');
		$zzjg.attr('href','/images/108.jpg').html('<img src="/images/108.jpg" height="80">');
	});
})();