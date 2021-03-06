;(function(){
	var applyId = $.trim(ppLib.getUrlParam('applyId') || '');
	var $pjzhBox = $('#pjzh-box');
	var $evalContentBox = $('#eval-content-box');
	// var $sjgxPoint = $('#sjgx-point');
	// var $nrzmPoint = $('#nrzm-point');
	// var $zgkfPoint = $('#zgkf-point');
	var $totalScore = $('#total-point');

	var $submitBtn = $('#submit-btn');

	var clickPoint = {
		// 'sjgxPoint': 4,
		// 'nrzmPoint': 4,
		// 'zgkfPoint': 4,
		'totalScore': 4
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

	// selectStart($sjgxPoint, 'sjgxPoint');
	// selectStart($nrzmPoint, 'nrzmPoint');
	// selectStart($zgkfPoint, 'zgkfPoint');
	selectStart($totalScore, 'totalScore');
	

	var isSubmiting = false;
	$submitBtn.click(function(){
		if(isSubmiting){
			return false;
		}

		var params = $.extend({}, clickPoint);

		var pjzh = ppFun.checkData($pjzhBox.find('input'), 'textInput', true);
		if(pjzh === false){
			$pjzhBox.find('.err').html('请输入0到100之间的数字');
			return false;
		}
		if(!($.isNumeric(pjzh) && (parseFloat(pjzh) >= 0) && (parseFloat(pjzh) <= 100))){
			$pjzhBox.find('.err').html('请输入0到100之间的数字');
			$pjzhBox.find('input').focus();
			return false;
		}
		$pjzhBox.find('.err').html('');
		params.transform = pjzh;

		var evalContent = ppFun.checkData($evalContentBox.find('textarea'), 'textInput', true);
		if(evalContent === false){
			return false;
		}
		params.comment = encodeURIComponent(evalContent);

		params.action = 'spCommentTask';
		params.applyId = applyId;

		$submitBtn.html('提 交 中...');
		isSubmiting = true;
		ppLib.postEx(PPG.apiBaseUrl + 'appmarket/comment.do', params, function(json){
			$submitBtn.html('确 认 提 交');
			isSubmiting = false;
			if(json.errorCode == '0'){
				ppLib.alertWindow.show({
					'content': '<p>评价成功！</p>',
					'button' : '<a href="mytask.html" class="pop_btn pop_btn_red">确定</a>'
				});
			}else if(json.errorCode == '99'){
				ppLib.alertWindow.show({
					'content': '<p>登录态失效，请重新登录~</p>',
					'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
				});
			}else{
				ppLib.alertWindow.show({
					'content': '<p>评价失败['+json.errorCode+']，请重试~</p>',
					'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
				});
			}
		});
		return false;

		
	});
})();