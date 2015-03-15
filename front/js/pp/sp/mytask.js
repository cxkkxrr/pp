;(function(){
	var $productName = $('#product-name');
	var $pushTime = $('#push-time');
	var $balanceType = $('#balance-type');
	var $searchBtn = $('#search-btn');
	var $resultList = $('#result-list');
	var conditions = {};
	var curPageNum = 1;
	var pageSize = 10;

	var $startTime = $pushTime.find('input').eq(0);
	var $endTime = $pushTime.find('input').eq(1);

	$startTime.attr('disabled', false);
	$endTime.attr('disabled', false);
	$startTime.DatePicker({
		format:'Y-m-d',
		date: '',
		current: '',
		starts: 1,
		onBeforeShow: function(){
			//$startTime.DatePickerSetDate('2014-11-18', true);
		},
		onChange: function(formated, dates){
			$startTime.val(formated);
			$startTime.DatePickerHide();
		}
	});
	$endTime.DatePicker({
		format:'Y-m-d',
		date: '',
		current: '',
		starts: 1,
		onBeforeShow: function(){
			//$startTime.DatePickerSetDate('2014-11-18', true);
		},
		onChange: function(formated, dates){
			$endTime.val(formated);
			$endTime.DatePickerHide();
		}
	});

	//加载数据
	function loadData(callback){
		var params = $.extend({}, conditions);
		params.action = 'getSpApplyList';
		params.curPageNum = curPageNum;
		params.pageSize = pageSize;
		ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/task.do?callback=?', params, function(json){
			if(json.errorCode == '0' && !!json.result && !!json.result.rows && json.result.rows.length > 0){
				$resultList.html(template('tpl-result',{'resultList':json.result.rows, 'listType':params.type}));
				page.refresh(curPageNum, Math.ceil(json.result.total/pageSize));
			}else if(json.errorCode == '99'){
				$resultList.html('登录超时，请重新登录');
				page.hide();
			}else if(json.errorCode == '9999'){
				$resultList.html('查询超时，请刷新重试');
				page.hide();
			}else{
				$resultList.html('无记录');
				page.hide();
			}
			(typeof(callback)=='function') && callback();
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


	//点击搜索
	var isSearching = false;
	$searchBtn.click(function(){
		if(isSearching){
			return false;
		}
		conditions = {};
		conditions.productName = ppFun.checkData($productName.find('input'), 'textInput') || '';
		conditions.pushTimeStart = ppFun.checkData($startTime, 'textInput') || '';
		conditions.pushTimeEnd = ppFun.checkData($endTime, 'textInput') || '';
		conditions.type = $balanceType.ppGetSelectorValue().join(',');
		curPageNum = 1;
		isSearching = true;
		$searchBtn.html('搜 索 中...');
		loadData(function(){
			isSearching = false;
			$searchBtn.html('搜 索');
		});
		return false;
	});

	$balanceType.find('.selbtn').eq(0).addClass('selbtn_selected');
	$searchBtn.trigger('click');

})();


;(function(){
	var $resultList = $('#result-list');
	$resultList.on('click' ,'.settleAccountsBtn', function(){
		var $this = $(this);
		var applyId = $this.data('applyid');
		ppLib.alertWindow.show({
			'content': '<p class="bigger">结算申请</p><p>产品名字：xxx</p><p>推广时间：xxx</p><p>单价：xxx</p><p>量级总计：xxx</p><p>金额总计：xxx</p>',
			'button' : '<a href="javascript:;" class="pop_btn pop_btn_red" id="real-settle-accounts-btn">确认提交申请</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
		});
		var isLoading = false;
		var $btn = $('#real-settle-accounts-btn');
		$btn.click(function(){
			if(isLoading){
				return false;
			}
			isLoading = true;
			$btn.html('申请中...');
			ppLib.postEx(PPG.apiBaseUrl + 'appmarket/bill/spApply.do', {'applyId': applyId}, function(json){
				isLoading = false;
				$btn.html('确认提交申请');
				ppLib.alertWindow.show({
					'content': '<p class="bigger">申请成功1！</p><p>申请成功！</p>',
					'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
				});
			});
			return false;
		});
		return false;
	});
})();

;(function(){
	var $resultList = $('#result-list');
	$resultList.on('click' ,'.stopPushBtn', function(){
		ppLib.alertWindow.show({
			'content': '<p class="bigger">停止推广申请</p><p>产品名字：xxx</p><p>推广时间：xxx</p><p>单价：xxx</p><p>量级总计：xxx</p><p>金额总计：xxx</p>',
			'button' : '<a href="javascript:;" class="pop_btn pop_btn_red" id="real-stop-push-btn">确认提交申请</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
		});
		var isLoading = false;
		var $btn = $('#real-stop-push-btn');
		$btn.click(function(){
			if(isLoading){
				return false;
			}
			isLoading = true;
			$btn.html('申请中...');
			ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {}, function(json){
				isLoading = false;
				$btn.html('确认提交申请');
				ppLib.alertWindow.show({
					'content': '<p class="bigger">申请成功！</p><p>申请成功！</p>',
					'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
				});
			});
			return false;
		});
		return false;
	});
})();