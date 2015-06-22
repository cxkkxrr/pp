/*;(function(){
	var $userName = $('#user-name');
	var $userRegTime = $('#user-reg-time');
	var $userLastLoginTime = $('#user-last-login-time');
	$userName.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {}, function(json){
		$userName.html('userName');
		$userRegTime.html('userRegTime');
		$userLastLoginTime.html('userLastLoginTime');
	});
})();*/

;(function(){
	var $evaluationList = $('#evaluation-list');
	var curPageNum = 1;
	var pageSize = 5;

	//加载数据
	function loadData(){
		var params = {};
		params.action = 'searchCommentForCp';
		params.curPageNum = curPageNum;
		params.pageSize = pageSize;
		ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/comment.do?callback=?', params, function(json){
			if(json.errorCode == '0' && !!json.result && !!json.result.rows && json.result.rows.length > 0){
				$evaluationList.html(template('evaluation-result',{'resultList':json.result.rows}));
				page.refresh(curPageNum, Math.ceil(json.result.total/pageSize));
			}else if(json.errorCode == '99'){
				$evaluationList.html('登录超时，请重新登录');
				page.hide();
			}else if(json.errorCode == '9999'){
				$evaluationList.html('查询超时，请刷新重试');
				page.hide();
			}else{
				$evaluationList.html('无记录');
				page.hide();
			}
		});
	}

	//分页
	var page = new ppClass.Page({
		'pageBox': '#evaluation-page',
		'changeHandler': function(curPage){
			curPageNum = curPage;
			loadData();
		}
	});

	//加载第一页
	loadData();
})();