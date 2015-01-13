;(function(){
	var pid = $.trim(ppLib.getUrlParam('pid') || '');
	(pid == '') && (alert('该详情不存在~'),window.close());
	var $productName = $('#product-name');
	$productName.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {'pid': pid}, function(json){
		(pid == '111') && (alert('该详情不存在~'),window.close());
		$productName.html('<img src="../images/32x32.jpg" width="32" height="32">　微信111');
	});
})();


;(function(){
	var $pjzhBox = $('#pjzh-box');
	var $evalContentBox = $('#eval-content-box');
	var $sjgxPoint = $('#sjgx-point');
	var $nrzmPoint = $('#nrzm-point');
	var $zgkfPoint = $('#zgkf-point');
	var $ztpjPoint = $('#ztpj-point');

	var $submitBtn = $('#submit-btn');

	var clickPoint = {
		'sjgxPoint': 4,
		'nrzmPoint': 4,
		'zgkfPoint': 4,
		'ztpjPoint': 4
	};

	function setStart($box, onNum){
		$box.find('.icon_star_b').removeClass('icon_star_b_on');
		$box.find('.icon_star_b:lt('+onNum+')').addClass('icon_star_b_on');
	}

	function selectStart($box, param){
		$box.find('.icon_star_b').hover(function(){
			var idx = $(this).index() + 1;
			setStart($box, idx);
		},function(){
			setStart($box, clickPoint[param]);
		});
		$box.find('.icon_star_b').click(function(){
			var idx = $(this).index() + 1;
			clickPoint[param] = idx;
			return false;
		});
	}

	selectStart($sjgxPoint, 'sjgxPoint');
	selectStart($nrzmPoint, 'nrzmPoint');
	selectStart($zgkfPoint, 'zgkfPoint');
	selectStart($ztpjPoint, 'ztpjPoint');
	

	var isSubmiting = false;
	$submitBtn.click(function(){
		if(isSubmiting){
			return false;
		}
		var params = $.extend({}, clickPoint);
		params.pjzh = ppFun.checkData($pjzhBox.find('input'), 'textInput', true);
		if(params.pjzh === false){
			return false;
		}
		params.evalContent = ppFun.checkData($evalContentBox.find('textarea'), 'textInput', true);
		if(params.evalContent === false){
			return false;
		}
		params.evalContent = encodeURIComponent(params.evalContent);

		$submitBtn.html('提 交 中...');
		isSubmiting = true;
		ppLib.postEx(PPG.apiBaseUrl + 'xxx.do', params, function(json){
			$submitBtn.html('确 认 提 交');
			isSubmiting = false;
			//alert(json.rtn);
			ppLib.alertWindow.show({
				'content': '<p class="bigger">提交成功！</p><p>提交成功！</p>',
				'button' : '<a href="mytask.html" class="pop_btn pop_btn_red">确定</a>'
			});
		});
		return false;

		
	});
})();