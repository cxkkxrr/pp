/*;(function(){
	var taskId = $.trim(ppLib.getUrlParam('taskId') || '');
	(taskId == '') && (alert('该详情不存在~'),window.close());
	var $productName = $('#product-name');
	var $productDetail = $('#product-detail');
	$productName.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {'taskId': taskId}, function(json){
		(taskId == '111') && (alert('该详情不存在~'),window.close());
		$productName.html('<img src="/images/32x32.jpg" width="32" height="32">　微信111');
		$productDetail.append('<p>单价：1.5元　　版本号：2.0.3</p><p>推广中包数量：2　　空闲包数量：3</p><p>推广方式：弹窗、Banner</p>');
	});
})();*/

;(function(){
	var taskId = $.trim(ppLib.getUrlParam('taskId') || '');
	var type = $.trim(ppLib.getUrlParam('type') || '');
	var $resultList = $('#result-list');
	if($('#tpl-result-'+type).length == 0){
		$resultList.html('参数错误');
		return;
	}
	var curPageNum = 1;
	var pageSize = 10;

	//加载数据
	function loadData(){
		var params = {};
		params.action = 'taskOrderList';
		params.taskId = taskId;
		params.type = type;
		params.curPageNum = curPageNum;
		params.pageSize = pageSize;
		ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/task.do?callback=?', params, function(json){
			if(json.errorCode == '0' && !!json.result && !!json.result.rows && json.result.rows.length > 0){
				console.log(json.result.rows);
				$resultList.html(template('tpl-result-'+type, {'resultList':json.result.rows}));
				page.refresh(curPageNum, Math.ceil(json.result.total/pageSize));
			}else if(json.errorCode == '99'){
				$resultList.html('登录超时，请重新登录');
				page.hide();
			}else{
				$resultList.html('无记录');
				page.hide();
			}
		});
	}

	//分页
	var page = new ppClass.Page({
		'pageBox': '#result-page',
		'changeHandler': function(curPage){
			curPageNum = curPage;
			loadData();
		}
	});

	loadData();
})();


//进行中
;(function(){
	var $resultList = $('#result-list');
	$resultList.on('click', '.offlineBtn', function(){
		ppLib.alertWindow.show({
			'content': '<p>确定做下线处理?</p>',
			'button': '<a href="javascript:;" class="pop_btn pop_btn_red" id="realOfflineBtn">确定</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
		});
		var applyId = $(this).data('applyid');
		$sureBtn = $('#realOfflineBtn');
		var isLoading = false;
		$sureBtn.one('click', function(){
			if(isLoading){
				return false;
			}
			isLoading = true;
			$sureBtn.html('操作中...');
			var params = {};
			params.action = 'offLine';
			params.applyId = applyId;
			ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/task.do?callback=?', params, function(json){
				isLoading = false;
				$sureBtn.html('确定');
				if(json.errorCode == '0'){
					ppLib.alertWindow.show({
						'content': '<p class="bigger">操作成功</p><p>已通知渠道做下线处理</p>',
						'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
					});
				}else{
					ppLib.alertWindow.show({
						'content': '<p class="bigger">操作失败</p><p>请重试</p>',
						'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
					});
				}
			});
			return false;
		});
		return false;
	});

	$resultList.on('click', '.addFlowBtn', function(){
		ppLib.alertWindow.show({
			'content': '<p>确定通知加量?</p>',
			'button': '<a href="javascript:;" class="pop_btn pop_btn_red" id="realOfflineBtn">确定</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
		});
		var applyId = $(this).data('applyid');
		$sureBtn = $('#realOfflineBtn');
		var isLoading = false;
		$sureBtn.one('click', function(){
			if(isLoading){
				return false;
			}
			isLoading = true;
			$sureBtn.html('操作中...');
			var params = {};
			params.action = 'addAmountMsg';
			params.applyId = applyId;
			ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/internalMsg.do?callback=?', params, function(json){
				isLoading = false;
				$sureBtn.html('确定');
				if(json.errorCode == '0'){
					ppLib.alertWindow.show({
						'content': '<p class="bigger">操作成功</p><p>已通知渠道做加量处理</p>',
						'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
					});
				}else{
					ppLib.alertWindow.show({
						'content': '<p class="bigger">操作失败</p><p>请重试</p>',
						'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
					});
				}
			});
			return false;
		});
		return false;
	});
})();


//待结算


;(function(){
	var $resultList = $('#result-list');

	var isLoading = false;
	$resultList.on('click', '.confirmBtn', function(){
		ppLib.alertWindow.show({
			'content': '<p class="bigger">是否确认该部分数据可结算？</p><p>点击“确认”按钮确认数据可结算，您将进入资金冻结流程。</p>',
			'button': '<a href="javascript:;" class="pop_btn pop_btn_red" id="realOfflineBtn">确定</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
		});
		var applyId = $(this).data('applyid');
		var payDateRange = $this.data('daterange');
		$sureBtn = $('#realOfflineBtn');
		var isLoading = false;
		$sureBtn.one('click', function(){
			if(isLoading){
				return false;
			}
			isLoading = true;
			$sureBtn.html('操作中...');
			var params = {};
			params.action = 'confirmAmount';
			params.applyId = applyId;
			params.payDateRange = payDateRange;
			params.type = 'confirm';
			ppLib.postEx(PPG.apiBaseUrl + 'appmarket/task.do', params, function(json){
				isLoading = false;
				$sureBtn.html('确定');
				if(json.errorCode == '0'){
					ppLib.alertWindow.show({
						'content': '<p class="bigger">操作成功</p><p>已确认结算</p>',
						'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
					});
				}else{
					ppLib.alertWindow.show({
						'content': '<p class="bigger">操作失败</p><p>请重试</p>',
						'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
					});
				}
			});
			return false;
		});
		return false;
	});

	$resultList.on('click', '.noConfirmBtn', function(){
		ppLib.alertWindow.show({
			'content': '<p class="bigger">是否确认该部分数据无法结算？</p><p>点击“确认”按钮确认无法结算，我们的客服人员将与您联系，进行详细的证据获取。</p>',
			'button': '<a href="javascript:;" class="pop_btn pop_btn_red" id="realOfflineBtn">确定</a><a href="javascript:;" class="pop_btn pop_btn_grey">取消</a>'
		});
		var applyId = $(this).data('applyid');
		var payDateRange = $this.data('daterange');
		$sureBtn = $('#realOfflineBtn');
		var isLoading = false;
		$sureBtn.one('click', function(){
			if(isLoading){
				return false;
			}
			isLoading = true;
			$sureBtn.html('操作中...');
			var params = {};
			params.action = 'confirmAmount';
			params.applyId = applyId;
			params.payDateRange = payDateRange;
			params.type = 'notConfirm';
			ppLib.postEx(PPG.apiBaseUrl + 'appmarket/task.do', params, function(json){
				isLoading = false;
				$sureBtn.html('确定');
				if(json.errorCode == '0'){
					ppLib.alertWindow.show({
						'content': '<p class="bigger">操作成功</p><p>已做“无法结算”处理</p>',
						'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
					});
				}else{
					ppLib.alertWindow.show({
						'content': '<p class="bigger">操作失败</p><p>请重试</p>',
						'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
					});
				}
			});
			return false;
		});
		return false;
	});
})();