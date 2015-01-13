;(function(){
	var pid = $.trim(ppLib.getUrlParam('pid') || '');
	(pid == '') && (alert('该详情不存在~'),window.close());
	var $productName = $('#product-name');
	$productName.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {'pid': pid}, function(json){
		(pid == '111') && (alert('该详情不存在~'),window.close());
		$productName.html('<img src="../images/32x32.jpg" width="32" height="32">　微信111　　包号：101　　渠道ID：1000');
	});
})();

;(function(){
	var $packageList = $('#detail-list');
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
		'pageBox': '#detail-page',
		'changeHandler': function(curPage){
			curPageNum = curPage;
			loadData();
		}
	});

	loadData();
})();