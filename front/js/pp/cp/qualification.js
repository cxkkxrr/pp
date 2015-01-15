;(function(){
	var $cpType = $('#qualification-cp-type');
	var $company = $('#qualification-company');
	var $address = $('#qualification-address');
	var $contact = $('#qualification-contact');
	var $mobile = $('#qualification-mobile');
	var $website = $('#qualification-website');
	var $tel = $('#qualification-tel');
	var $yyzz = $('#qualification-yyzz');
	var $zzjg = $('#qualification-zzjg');


	$cpType.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {}, function(json){
		$cpType.html('cpType');
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