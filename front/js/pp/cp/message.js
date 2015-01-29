;(function(){

	var $searchConditionKeyword = $('#search-condition-keyword');
	var $searchConditionTime = $('#search-condition-time');
	var $searchConditionType = $('#search-condition-type');
	var $resultList = $('#result-list');
	var conditions = {};
	var curPageNum = 1;
	var pageSize = 10;


	var $startTime = $searchConditionTime.find('input').eq(0);
	var $endTime = $searchConditionTime.find('input').eq(1);
	$startTime.attr('disabled', false);
	$endTime.attr('disabled', false);
	var lastStartTimeValue = '', lastEndTimeValue = '';
	function timeChange(){
		var startTimeVal = $.trim($startTime.val());
		var endTimeVal = $.trim($endTime.val());
		conditions.startTime = startTimeVal;
		conditions.endTime = endTimeVal;
		curPageNum = 1;
		loadData();
	}
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
			if(lastStartTimeValue != formated){
				lastStartTimeValue = formated;
				timeChange();
			}
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
			if(lastEndTimeValue != formated){
				lastEndTimeValue = formated;
				timeChange();
			}
		}
	});


	//加载数据
	function loadData(){
		var params = $.extend({}, conditions);
		params.action = 'showMsgByUser';
		params.curPageNum = curPageNum;
		params.pageSize = pageSize;
		ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/internalMsg.do?callback=?', params, function(json){
			if(json.errorCode == '0' && !!json.result && !!json.result.rows && json.result.rows.length > 0){
				$resultList.html(template('tpl-result',{'resultList':json.result.rows}));
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


	//点击关键字搜索
	$searchConditionKeyword.find('.search_btn').click(function(){
		var val = $.trim($searchConditionKeyword.find('input').val());
		if(!val){
			$searchConditionKeyword.find('input').val('');
		}
		conditions.keyword = val;
		loadData();
		return false;
	});

	//点击类型，拉取数据
	$searchConditionType.on('click', '.selbtn', function(){
		var val = $searchConditionType.ppGetSelectorValue().join(',');
		conditions.type = val;
		loadData();
		return false;
	});

	$searchConditionType.find('.selbtn').eq(0).trigger('click');
	//选择时间
	/*$searchConditionTime.find('input').change(function(){
		var startTimeVal = $.trim($searchConditionTime.find('input').eq(0).val());
		var endTimeVal = $.trim($searchConditionTime.find('input').eq(1).val());
		conditions.startTime = startTimeVal;
		conditions.endTime = endTimeVal;
		loadData();
	});*/


	//loadData();
	var $headerMsgNumBox = $('#header-msg-num-box');
	var $sideMsgNumBox = $('#side-msg-num-box');
	$resultList.on('click', '.contLink', function(){
		var $this = $(this);
		$this.parent().html($this.html());
		var mid = $this.data('mid');
		ppLib.postEx(PPG.apiBaseUrl + 'appmarket/internalMsg.do?callback=?', {'action':'readMsg','ids':mid}, function(json){
			if(json.errorCode == '0'){
				var num = parseInt($headerMsgNumBox.find('.num').html(), 10) || 0;
				if(num > 0){
					num--;
				}
				$headerMsgNumBox.find('.num').html(num);
				$sideMsgNumBox.html(num);
				if(num == 0){
					$headerMsgNumBox.hide();
					$sideMsgNumBox.hide();
				}
			}
		});
		return false;
	});
})();