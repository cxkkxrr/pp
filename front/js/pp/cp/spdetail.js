/*;(function(){
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
})();*/

;(function(){
	var $spPushRecord = $('#sp-push-record');
	var spid = $.trim(ppLib.getUrlParam('sid') || '');
	var curPageNum = 1;
	var pageSize = 10;

	//加载数据
	function loadData(){
		var params = {};
		params.spId = spid;
		params.action = 'getSpDetail';
		params.curPageNum = curPageNum;
		params.pageSize = pageSize;
		ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/task.do?callback=?', params, function(json){
			if(json.errorCode == '0' && !!json.result && !!json.result.rows && json.result.rows.length > 0){
				$spPushRecord.html(template('tpl-sp-push-record', {'resultList':json.result.rows}));
				page.refresh(curPageNum, Math.ceil(json.result.total/pageSize));
			}else if(json.errorCode == '99'){
				$spPushRecord.html('登录超时，请重新登录');
				page.hide();
			}else{
				$spPushRecord.html('无记录');
				page.hide();
			}
		});
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


//委托该渠道推广产品
;(function(){
	var $entrustBtn = $('#entrust-btn');
	$entrustBtn.click(function(){
		ppLib.alertWindow.show({
			'content': '<p>查询中...</p>',
			'button' : ' '
		});
		var $myEntrustProduct = $('#my-entrust-product');
		var params = {};
		params.action = 'commissionSp';
		ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/internalMsg.do?callback=?', params, function(json){
			if(json.errorCode == '0' && !!json.result && !!json.result.rows){
				var len = json.result.rows.length;
				if(len > 0){
					var htmlList = [];
					for(var i = 0; i < len; i++){
						var item = json.result.rows[i];
						htmlList.push('<option value="'+item.taskId+'">'+item.productName+'</option>');
					}
					ppLib.alertWindow.show({
						'content': '<p>请选择委托的产品：<select style="width:160px;" id="my-entrust-product">'+htmlList.html('')+'</select></p>',
						'button' : '<a href="javascript:;" class="pop_btn pop_btn_red">确定委托</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
					});
				}else{
					ppLib.alertWindow.show({
						'content': '<p>您还没有发布产品哦</p>',
						'button' : '<a href="addtask.html" target="_blank" class="pop_btn pop_btn_red">去发布产品</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
					});
				}
			}else if(json.errorCode == '99'){
				ppLib.alertWindow.show({'content': '<p>登录超时，请重新登录</p>'});
			}else{
				ppLib.alertWindow.show({'content': '<p>查询错误，请重试[' + json.errorCode + ']</p>'});
			}
		});
		return false;
	});
})();