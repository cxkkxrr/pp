/*;(function(){
	var pid = $.trim(ppLib.getUrlParam('pid') || '');
	(pid == '') && (alert('该详情不存在~'),window.close());
	var $productName = $('#product-name');
	var $productDetail = $('#product-detail');
	$productName.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {'pid': pid}, function(json){
		(pid == '111') && (alert('该详情不存在~'),window.close());
		$productName.html('<img src="/images/32x32.jpg" width="32" height="32">　微信111');
		$productDetail.append('<p>单价：1.5元　　版本号：2.0.3</p><p>推广中包数量：2　　空闲包数量：3</p><p>推广方式：弹窗、Banner</p>');
	});
})();*/

;(function(){
	var pid = $.trim(ppLib.getUrlParam('pid') || '');
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
		params.taskId = pid;
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

;(function(){
	var $resultList = $('#result-list');

	var isLoading = false;
	$resultList.on('click', '.offlineBtn', function(){
		if(isLoading){
			return false;
		}
		var $this = $(this);
		isLoading = true;
		$this.html('操作中...');
		ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {}, function(json){
			isLoading = false;
			$this.html('下线处理');
			ppLib.alertWindow.show({
				'content': '<p class="bigger">操作成功</p><p>已通知渠道做下线处理</p>',
				'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
			});
		});
		return false;
	});

	$resultList.on('click', '.addFlowBtn', function(){
		if(isLoading){
			return false;
		}
		var $this = $(this);
		isLoading = true;
		$this.html('操作中...');
		ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {}, function(json){
			isLoading = false;
			$this.html('通知加量');
			ppLib.alertWindow.show({
				'content': '<p class="bigger">操作成功</p><p>已通知渠道做加量处理</p>',
				'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
			});
		});
		return false;
	});
})();