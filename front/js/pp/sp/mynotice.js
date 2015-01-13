;(function(){

	var $noticeList = $('#notice-list');
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
		'pageBox': '#notice-page',
		'changeHandler': function(curPage){
			curPageNum = curPage;
			loadData();
		}
	});

	loadData();
})();