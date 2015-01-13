;(function(){
	var $resultList = $('#result-list');
	var curPageNum = 1;
	var pageSize = 10;
	var conditions = {};
	var searchType = ppLib.getUrlParam('st'); //搜索类型 1：名称搜索  2：分类筛选搜索
	if(searchType == '1'){
		conditions.name = decodeURIComponent(ppLib.getUrlParam('keyword') || '');

	}else if(searchType == '2'){
		conditions.billingMethod = decodeURIComponent(ppLib.getUrlParam('billingType')||'') || undefined;
		conditions.priceFrom = decodeURIComponent(ppLib.getUrlParam('unitPriceStart')||'') || undefined;
		conditions.priceTo = decodeURIComponent(ppLib.getUrlParam('unitPriceEnd')||'') || undefined;
		conditions.os = decodeURIComponent(ppLib.getUrlParam('system')||'') || undefined;
		conditions.productTypeFirst = decodeURIComponent(ppLib.getUrlParam('productType')||'') || undefined;
		conditions.productTypes = decodeURIComponent(ppLib.getUrlParam('productSubType')||'') || undefined;
		conditions.isOfficial = decodeURIComponent(ppLib.getUrlParam('productSource')||'') || undefined;
		conditions.requestLabels = decodeURIComponent(ppLib.getUrlParam('requirementLabel')||'') || undefined;
		conditions.amountLevel = decodeURIComponent(ppLib.getUrlParam('quantity')||'') || undefined;
		conditions.dataCycle = decodeURIComponent(ppLib.getUrlParam('dataCycle')||'') || undefined;
		conditions.expandTypes = decodeURIComponent(ppLib.getUrlParam('pushType')||'') || undefined;
		conditions.crowdLabels = decodeURIComponent(ppLib.getUrlParam('crowdLabel')||'') || undefined;

	}else{
		$resultList.html('参数错误');
		return;
	}
	
	
	

	//加载数据
	function loadData(){
		var params = {};
		if(searchType == 1){
			params.action = 'searchTaskByName';
		}else if(searchType == 2){
			params.action = 'searchTaskByDetail';
		}
		params = $.extend(params, conditions);
		params.curPageNum = curPageNum;
		params.pageSize = pageSize;
		ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/task.do?callback=?', params, function(json){
			if(json.errorCode == '0' && !!json.result && !!json.result.rows && json.result.rows.length > 0){
				$resultList.html(template('tpl-result',{'resultList':json.result.rows}));
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