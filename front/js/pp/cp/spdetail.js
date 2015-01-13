;(function(){
	var spid = $.trim(ppLib.getUrlParam('sid') || '');
	(spid == '') && (alert('该渠道不存在~'),window.close());
	var $spIdBox = $('#sp-id-box');
	var $spPushTypeBox = $('#sp-push-type-box');
	$spIdBox.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {'spid': spid}, function(json){
		(spid == '111') && (alert('该渠道不存在~'),window.close());
		$spIdBox.html('xxxx');
		$spPushTypeBox.html('<a class="selbtn">推荐位</a><a class="selbtn">积分墙</a><a class="selbtn">市场</a>');
	});
})();

;(function(){
	var $spPushRecord = $('#sp-push-record');
	var spid = $.trim(ppLib.getUrlParam('sid') || '');
	var curPageNum = 1;
	var pageSize = 10;

	//加载数据
	function loadData(){
		var params = {};
		params.spid = spid;
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
		'pageBox': '#sp-record-page',
		'changeHandler': function(curPage){
			curPageNum = curPage;
			loadData();
		}
	});

	//加载第一页
	loadData();
})();

;(function(){
	var $entrustBtn = $('#entrust-btn');
	$entrustBtn.click(function(){
		ppLib.alertWindow.show({
			'content': '<p>您确定要委托该渠道推广产品吗？</p>',
			'button' : '<a href="javascript:;" class="pop_btn pop_btn_red">确定</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">关闭</a>'
		});
		return false;
	});
	
})();