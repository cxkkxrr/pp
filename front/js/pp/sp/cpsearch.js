//产品搜索
;(function(){
	var $kwInput = $('#kw-input');
	var $kwSearchBtn = $('#kw-search-btn');
	$kwSearchBtn.click(function(){
		var kw = ppFun.checkData($kwInput, 'textInput', true);
		if(kw === false){
			return false;
		}
		var url = 'searchresult.html?st=1&keyword=' + encodeURIComponent(kw) + '&_=' + (+new Date());
		ppLib.windowOpen(url, '_blank');
		return false;
	});
})();

//分类搜索
;(function(){
	var $billingType = $('#billing-type');
	var $unitPrice = $('#unit-price');
	var $system = $('#system');
	var $productType = $('#product-type');
	var $productTypeAppBox = $('#product-type-app-box');
	var $productTypeApp = $('#product-type-app');
	var $productTypeGameBox = $('#product-type-game-box');
	var $productTypeGame = $('#product-type-game');
	var $productSource = $('#product-source');
	var $requirementLabel = $('#requirement-label');
	var $quantity = $('#quantity');
	var $dataCycle = $('#data-cycle');
	var $pushType = $('#push-type');
	var $crowdLabel = $('#crowd-label');
	var $conSearchBtn = $('#con-search-btn');

	
	$productType.on('click', '.selbtn', function(){
		var $this = $(this);
		var type = $this.data('type');
		if(type == 'app'){
			$productTypeAppBox.show();
			$productTypeGameBox.hide();
			$productTypeGameBox.find('.selbtn').removeClass('selbtn_selected');
			$productTypeGameBox.find('.err').html('');

		}else if(type == 'game'){
			$productTypeGameBox.show();
			$productTypeAppBox.hide();
			$productTypeAppBox.find('.selbtn').removeClass('selbtn_selected');
			$productTypeAppBox.find('.err').html('');
		}
	});

	function getFormData(){
		var params = {};
		params.billingType = ppFun.checkData($billingType, 'selbtn', true);;
		if(params.billingType === false){
			$billingType.find('.err').html('请选择计费方式');
			return false;
		}
		$billingType.find('.err').html('');

		params.unitPriceStart = ppFun.checkData($unitPrice.find('input').eq(0), 'gt0numberInput') || '';

		params.unitPriceEnd = ppFun.checkData($unitPrice.find('input').eq(1), 'gt0numberInput') || '';

		params.system = ppFun.checkData($system, 'selbtn', true);
		if(params.system === false){
			$system.find('.err').html('请选择操作系统');
			return false;
		}
		$system.find('.err').html('');

		params.productType = ppFun.checkData($productType, 'selbtn', true);
		if(params.productType === false){
			$productType.find('.err').html('请选择产品类型');
			return false;
		}
		$productType.find('.err').html('');

		var type = $productType.find('.selbtn_selected').data('type');
		params.productSubType = '';
		if(type == 'app'){
			params.productSubType = $productTypeApp.ppGetSelectorValue().join(',');
		}else if(type == 'game'){
			params.productSubType = $productTypeGame.ppGetSelectorValue().join(',');
		}
		
		params.productSource = $productSource.ppGetSelectorValue().join(',');
		params.requirementLabel = $requirementLabel.ppGetSelectorValue().join(',');
		params.quantity = $quantity.ppGetSelectorValue().join(',');
		params.dataCycle = $dataCycle.ppGetSelectorValue().join(',');
		params.pushType = $pushType.ppGetSelectorValue().join(',');
		params.crowdLabel = $crowdLabel.ppGetSelectorValue().join(',');
		return params;
	}

	$conSearchBtn.click(function(){
		var params = getFormData();
		if(params === false){
			return false;
		}
		var url = 'searchresult.html?st=2&' + $.param(params) + '&_=' + (+new Date());
		ppLib.windowOpen(url, '_blank');
		return false;
	});
})();


//推荐
;(function(){
	var $recType = $('#rec-type');
	var $recList = $('#rec-list');
	var conditions = {};
	var curPageNum = 1;
	var pageSize = 5;

	//加载数据
	function loadData(){
		var params = {};
		params.action = 'showTaskOrderByField';
		params = $.extend(params, conditions)
		params.curPageNum = curPageNum;
		params.pageSize = pageSize;
		ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/task.do?callback=?', params, function(json){
			if(json.errorCode == '0' && !!json.result && !!json.result.rows && json.result.rows.length > 0){
				$recList.html(template('tpl-rec',{'recList':json.result.rows}));
				page.refresh(curPageNum, Math.ceil(json.result.total/pageSize));
			}else if(json.errorCode == '99'){
				$recList.html('登录超时，请重新登录');
				page.hide();
			}else{
				$recList.html('无记录');
				page.hide();
			}
		}, null, null, 'getRecData');
	}


	//分页
	var page = new ppClass.Page({
		'pageBox': '#rec-page',
		'changeHandler': function(curPage){
			curPageNum = curPage;
			loadData();
		}
	});


	//点击类型，拉取数据
	$recType.on('click', 'li', function(){
		var $this = $(this);
		if($this.hasClass('cur')){
			return false;
		}
		$this.addClass('cur').siblings().removeClass('cur');
		var val = $this.data('val');
		conditions.field = val;
		curPageNum = 1;
		loadData();
		return false;
	});


	$recType.find('li').first().trigger('click');
})();