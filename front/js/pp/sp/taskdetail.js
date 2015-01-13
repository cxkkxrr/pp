;(function(){
	var pid = $.trim(ppLib.getUrlParam('pid') || '');
	(pid == '') && (alert('该详情不存在~'),window.close());

	var $cpDetailTotal = $('#cp-detail-total');
	var $cpBillingType = $('#cp-billing-type');
	var $cpQuantity = $('#cp-quantity');
	var $cpPushRequirement = $('#cp-push-requirement');
	var $cpPushType = $('#cp-push-type');
	var $cpDataCycle = $('#cp-data-cycle');

	$cpDetailTotal.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {'pid': pid}, function(json){
		(pid == '111') && (alert('该详情不存在~'),window.close());
		$cpDetailTotal.html('<li><img src="../images/32x32.jpg" width="32" height="32"></li>\
					<li>微信111</li>\
					<li>包号：123</li>\
					<li><span class="orange">价格：1.5元</span></li>\
					<li><a href="javascript:;" class="b_r btn_gfht">查看官方后台</a></li>');
		$cpBillingType.html('cpBillingType');
		$cpQuantity.html('cpQuantity');
		$cpPushRequirement.html('cpPushRequirement');
		$cpPushType.html('cpPushType');
		$cpDataCycle.html('cpDataCycle');
	});
})();


;(function(){
	var $packageList = $('#data-list');
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
		'pageBox': '#data-page',
		'changeHandler': function(curPage){
			curPageNum = curPage;
			loadData();
		}
	});

	loadData();
})();