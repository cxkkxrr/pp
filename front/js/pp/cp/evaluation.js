;(function(){
	var applyId = $.trim(ppLib.getUrlParam('applyId') || '');
	var $evalContentBox = $('#eval-content-box');
	var $totalScore = $('#total-point');

	var $submitBtn = $('#submit-btn');

	var clickPoint = {
		'score': 4
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

	selectStart($totalScore, 'score');
	

	var isSubmiting = false;
	$submitBtn.click(function(){
		if(isSubmiting){
			return false;
		}

		var params = $.extend({}, clickPoint);

		var evalContent = ppFun.checkData($evalContentBox.find('textarea'), 'textInput', true);
		if(evalContent === false){
			return false;
		}
		params.commentContent = encodeURIComponent(evalContent);

		params.action = 'cpCommentApply';
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