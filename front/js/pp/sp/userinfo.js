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
		'pageBox': '#evaluation-page',
		'changeHandler': function(curPage){
			curPageNum = curPage;
			loadData();
		}
	});

	//加载第一页
	loadData();
})();