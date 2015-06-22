;(function(){
	var $searchTypeBox = $('#search-type-box');
	var $searchKeywordBox = $('#search-keyword-box');
	var $kwSearchBtn = $('#kw-search-btn');

	var $system = $('#system');
	var $productType = $('#product-type');
	var $pushType = $('#push-type');
	var $crowdLabel = $('#crowd-label');
	var $comSearchBtn = $('#con-search-btn');

	var $conditionType = $('input[type=radio][name=conditionType]');

	var $searchResult = $('#search-result');
	var $resultList = $('#result-list');
	var conditions = {};
	var curPageNum = 1;
	var pageSize = 10;
	var isSearching = false;


	var searchTabType  = 1; //切换的tab类型
	var searchRealType = 0; //真正搜索的类型 1：条件搜索  2：id搜索

	//加载数据
	function loadData(callback){
		var params = $.extend({}, conditions);
		params.curPageNum = curPageNum;
		params.pageSize = pageSize;
		params.action = searchRealType == 1 ? 'searchSpByDetail' : 'searchSpById';
		isSearching = true;
		$conditionType.attr('disabled', true);
		ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/task.do?callback=?', params, function(json){
			isSearching = false;
			$conditionType.attr('disabled', false);
			(typeof(callback) == 'function') && callback();
			//json = {"errorMsg":null,"result":{"rows":[{"expandTypeList":["PUSH","推荐位"],"idStr":"00002","grade":0,"id":2},{"expandTypeList":["PUSH","推荐位"],"idStr":"00003","grade":5,"id":3}],"total":25},"errorCode":"0"}
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
			$searchResult.show();
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

	//获取分类条件
	function getAllType(){
		var params = {};
		params.os = ppFun.checkData($system, 'selbtn', true);
		if(params.os === false){
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
		params.expandTypes = ppFun.checkData($pushType, 'selbtn', true);
		if(params.expandTypes === false){
			$pushType.find('.err').html('请选择推广方式');
			return false;
		}
		$pushType.find('.err').html('');
		params.crowdLabels = ppFun.checkData($crowdLabel, 'selbtn', true);
		if(params.crowdLabels === false){
			$crowdLabel.find('.err').html('请选择人群标签');
			return false;
		}
		$crowdLabel.find('.err').html('');
		return params;
	}

	//分类搜索
	/*$searchTypeBox.on('click', '.selbtn', function(){
		getAllType();
		$searchKeywordBox.find('input').val('');
		searchRealType = 1;
		curPageNum = 1;
		loadData();
		return false;
	});*/
	$comSearchBtn.click(function(){
		if(isSearching){
			return false;
		}
		var params = getAllType();
		if(params === false){
			return false;
		}
		conditions = params;
		$searchKeywordBox.find('input').val('');
		searchRealType = 1;
		$comSearchBtn.html('搜 索 中...');
		curPageNum = 1;
		loadData(function(){
			$comSearchBtn.html('搜 索');
		});
		return false;
	});


	//ID搜素
	$kwSearchBtn.click(function(){
		if(isSearching){
			return false;
		}
		var val = $.trim($searchKeywordBox.find('input').val());
		if(!val){
			$searchKeywordBox.find('input').val('').focus();
			return false;
		}
		conditions = {'spid': val};
		$searchTypeBox.find('.selbtn').removeClass('selbtn_selected');
		searchRealType = 2;
		$kwSearchBtn.html('搜索中...');
		curPageNum = 1;
		loadData(function(){
			$kwSearchBtn.html('搜索');
		});
		return false;
	});


	//搜素类型
	
	$conditionType.click(function(){
		var val = $(this).val();
		if(val == '2'){
			$searchTypeBox.hide();
			$searchKeywordBox.show();
		}else{
			$searchTypeBox.show();
			$searchKeywordBox.hide();
		}
		if(searchTabType != val){
			searchTabType = val;
			if(searchTabType == searchRealType){
				$searchResult.show();
			}else{
				$searchResult.hide();
			}
		}
	});
})();


//发布产品
/*
certificateStatus(只针对第一次填写)
0:未添加资质审核
1:待审核(第一次填写待审核)
2:审核通过(只要第一次填写通过审核了，以后不管修不修改都是通过了),
3:审核未通过(第一次填写未通过)

certificateChangeStatus
0:没修改(之后修改审核通过和不通过都回到这个状态)
1:修改中
*/
;(function(){
	$('#release-btn').click(function(){
		if(certificateStatus === '2'){
			return true;

		}else if(certificateStatus === '0'){
			ppLib.alertWindow.show({
				'content': '<p class="bigger">您尚未进行资质审核，不能发布任务。</p><p>提交资质信息并审核通过后，方可进行任务发布、任务委托和推广合作。</p>',
				'button': '<a href="qualificationreview.html" target="_blank" class="pop_btn pop_btn_red">前往进行资质审核</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
			});

		}else if(certificateStatus === '1'){
			ppLib.alertWindow.show({
				'content': '<p class="bigger">您的资质信息已经提交，正在审核中。</p><p>提交资质信息并审核通过后，方可进行任务发布、任务委托和推广合作。</p>',
				'button': '<a href="qualification.html" target="_blank" class="pop_btn pop_btn_red">查看资质信息</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
			});

		}else if(certificateStatus === '3'){
			ppLib.alertWindow.show({
				'content': '<p class="bigger">您的资质信息未通过审核，请重新提交</p><p>提交资质信息并审核通过后，方可进行任务发布、任务委托和推广合作。</p>',
				'button': '<a href="qualification.html" target="_blank" class="pop_btn pop_btn_red">修改资质信息</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
			});

		}else{
			ppLib.alertWindow.show({
				'content': '<p>获取资质审核状态失败，请刷新重试。</p>',
				'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">关闭</a>'
			});
		}
		
		return false;
	});
})();