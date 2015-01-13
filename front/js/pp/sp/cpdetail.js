/*;(function(){
	var pid = $.trim(ppLib.getUrlParam('pid') || '');
	//(pid == '') && (alert('该详情不存在~'),window.close());

	var $cpDetailTotal = $('#cp-detail-total');
	var $cpBillingType = $('#cp-billing-type');
	var $cpQuantity = $('#cp-quantity');
	var $cpPushRequirement = $('#cp-push-requirement');
	var $cpPushType = $('#cp-push-type');
	var $cpDataCycle = $('#cp-data-cycle');
	var $cpDetailIntro = $('#cp-detail-intro');
	var $cpDetailImgs = $('#cp-detail-imgs');

	$cpDetailTotal.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {'pid': pid}, function(json){
		//(pid == '111') && (alert('该详情不存在~'),window.close());
		$cpDetailTotal.html('<li><img src="../images/32x32.jpg" width="32" height="32"></li>\
					<li>微信111</li>\
					<li>版本号：123</li>\
					<li>包大小：10M</li>\
					<li><span class="orange">价格：1.5元</span></li>\
					<li><a href="javascript:;" class="b_r btn_gzcp">关注该产品</a></li>\
					<li><a href="javascript:;" class="b_r btn_sqrw">申请任务</a></li>\
					<li><a href="javascript:;" class="b_r btn_qqjb">请求加包</a></li>\
					<li><span class="red">暂时没有可用包</span></li>');
		$cpBillingType.html('cpBillingType');
		$cpQuantity.html('cpQuantity');
		$cpPushRequirement.html('cpPushRequirement');
		$cpPushType.html('cpPushType');
		$cpDataCycle.html('cpDataCycle');
		$cpDetailIntro.html('360手机助手是吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦吧啦');
		$cpDetailImgs.html('<img src="" width="115" height="190"><img src="" width="115" height="190"><img src="" width="115" height="190">');
	},100);
})();*/


;(function(){
	var pid = $.trim(ppLib.getUrlParam('pid') || '');
	var $sqrwBtn = $('#sqrw-btn');
	var $qqjbBtn = $('#qqjb-btn');
	var isDoing = false;

	//申请任务
	function doSqrw(){
		if(isDoing){
			return;
		}
		var params = {};
		params.taskId = pid;
		params.action = 'applyTask';
		$sqrwBtn.html('申请中...');
		isDoing = true;
		ppLib.postEx(PPG.apiBaseUrl + 'appmarket/task.do', params, function(json){
			$sqrwBtn.html('申请任务');
			isDoing = false;
			var errMsg = '';
			if(json.errorCode == '0'){
				ppLib.alertWindow.show({
					'content': '<p class="bigger">申请成功，请等待审核通过。</p><p>您已成功提交了任务申请，请等待系统审核。审核通过后，您将会收到邮件和站内信通知，请注意查收。</p>',
					'button' : '<a href="'+location.href+'" class="pop_btn pop_btn_red closeBtn">确定</a>'
				});
			}else if(json.errorCode == '1'){ //任务申请中，请等待审核
				ppLib.alertWindow.show({
					'content': '<p class="bigger">申请成功，请等待审核通过。</p><p>您已成功提交过任务申请，请等待系统审核。审核通过后，您将会收到邮件和站内信通知，请注意查收。</p>',
					'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
				});
			}else if(json.errorCode == '2'){ //已经申请通过
				ppLib.alertWindow.show({
					'content': '<p class="bigger">您已经成功申请过了。</p><p>您已经成功申请过了</p>',
					'button' : '<a href="'+location.href+'" class="pop_btn pop_btn_red closeBtn">确定</a>'
				});
			}else if(json.errorCode == '99'){
				errMsg = '登录超时，请重新登录。';
			}else{
				errMsg = '申请失败，请重试。';
			}
			if(!!errMsg){
				ppLib.alertWindow.show({
					'content': '<p class="bigger">申请失败！</p><p>'+errMsg+'['+json.errorCode+']</p>',
					'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">关闭</a>'
				});
			}
		});
	}
	$sqrwBtn.click(function(){
		doSqrw();
		return false;
	});


	//请求加包
	function doQqjb(){
		if(isDoing){
			return;
		}
		var params = {};
		params.taskId = pid;
		params.action = 'addPackageForSpApply';
		$qqjbBtn.html('操作中...');
		isDoing = true;
		ppLib.postEx(PPG.apiBaseUrl + 'appmarket/task.do', params, function(json){
			$qqjbBtn.html('请求加包');
			isDoing = false;
			var errMsg = '';
			if(json.errorCode == '0'){
				ppLib.alertWindow.show({
					'content': '<p class="bigger">请求发送成功。</p><p>您的加包请求已发送，广告主将收到您的请求然后决定是否加包，请耐心等待。</p>',
					'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
				});
			}else if(json.errorCode == '99'){
				errMsg = '登录超时，请重新登录。';
			}else{
				errMsg = '请求发送失败，请重试。';
			}
			if(!!errMsg){
				ppLib.alertWindow.show({
					'content': '<p class="bigger">请求发送失败。</p><p>'+errMsg+'['+json.errorCode+']</p>',
					'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">关闭</a>'
				});
			}
		});
	}
	$qqjbBtn.click(function(){
		doQqjb();
		return false;
	});
})();

;(function(){
	var pid = $.trim(ppLib.getUrlParam('pid') || '');
	var $evaluationList = $('#evaluation-list');
	var curPageNum = 1;
	var pageSize = 10;

	//加载数据
	function loadData(){
		var params = {};
		params.action = 'searchCommentByTaskId';
		params.taskId = pid;
		params.curPageNum = curPageNum;
		params.pageSize = pageSize;
		ppLib.getJSONEx(PPG.apiBaseUrl + '/appmarket/comment.do?callback=?', params, function(json){
			if(json.errorCode == '0' && !!json.result && !!json.result.rows && json.result.rows.length > 0){
				$evaluationList.html(template('tpl-evaluation',{'evaluationList':json.result.rows}));
				page.refresh(curPageNum, Math.ceil(json.result.total/pageSize));
			}else if(json.errorCode == '99'){
				$evaluationList.html('登录超时，请重新登录');
				page.hide();
			}else{
				$evaluationList.html('无记录');
				page.hide();
			}
		});
	}


	//分页
	var page = new ppClass.Page({
		'pageBox': '#evaluation-page',
		'changeHandler': function(curPage){
			curPageNum = curPage;
			loadData();
		}
	});

	loadData();
})();