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
		params.curPageNum = curPageNum;
		params.pageSize = pageSize;
		ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', params, function(json){
			$resultList.show();
			page.refresh(curPageNum, 10);
			(typeof(callback)=='function') && callback();
		});
	}

	//把返回的数据填充表格
	function renderList(){

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
		conditions.balanceType = $balanceType.ppGetSelectorValue().join(',');
		curPageNum = 1;
		isSearching = true;
		$searchBtn.html('搜 索 中...');
		loadData(function(){
			isSearching = false;
			$searchBtn.html('搜 索');
		});
		return false;
	});

})();


;(function(){
	var $resultList = $('#result-list');
	$resultList.on('click' ,'.settleAccountsBtn', function(){
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