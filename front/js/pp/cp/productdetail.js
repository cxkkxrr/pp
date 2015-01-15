;(function(){
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
})();

;(function(){
	var $packageList = $('#package-list');
	var curPageNum = 1;
	var pageSize = 10;

	//加载数据
	function loadData(){
		var params = {};
		params.curPageNum = curPageNum;
		params.pageSize = pageSize;
		ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', params, function(json){

			page.refresh(curPageNum, 10);
		});
	}

	//把返回的数据填充表格
	function renderList(){

	}

	//分页
	var page = new ppClass.Page({
		'pageBox': '#package-page',
		'changeHandler': function(curPage){
			curPageNum = curPage;
			loadData();
		}
	});

	loadData();
})();

;(function(){
	var $packageList = $('#package-list');

	var isLoading = false;
	$packageList.on('click', '.offlineBtn', function(){
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

	$packageList.on('click', '.addFlowBtn', function(){
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