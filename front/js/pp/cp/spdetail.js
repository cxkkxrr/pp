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
	var spid = $.trim(ppLib.getUrlParam('sid') || '');
	var $entrustBtn = $('#entrust-btn');
	$entrustBtn.click(function(){
		//todo:这里要判断资质审核
		if(certificateStatus === '2'){
			//审核通过
		}else if(certificateStatus === '0'){
			ppLib.alertWindow.show({
				'content': '<p class="bigger">您尚未进行资质审核，不能委托任务。</p><p>提交资质审核并通过后，方可进行任务发布、任务委托和推广合作。</p>',
				'button': '<a href="qualificationreview.html" target="_blank" class="pop_btn pop_btn_red">前往进行资质审核</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
			});
			return false;
		}else if(certificateStatus === '1'){
			ppLib.alertWindow.show({
				'content': '<p class="bigger">您的资质信息已经提交，正在审核中。</p><p>提交资质审核并通过后，方可进行任务发布、任务委托和推广合作。</p>',
				'button': '<a href="qualification.html" target="_blank" class="pop_btn pop_btn_red">查看资质信息</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
			});
			return false;
		}else if(certificateStatus === '3'){
			ppLib.alertWindow.show({
				'content': '<p class="bigger">您的资质信息未通过审核，请重新提交</p><p>提交资质审核并通过后，方可进行任务发布、任务委托和推广合作。</p>',
				'button': '<a href="qualification.html" target="_blank" class="pop_btn pop_btn_red">修改资质信息</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
			});
			return false;
		}else{
			ppLib.alertWindow.show({
				'content': '<p>获取资质审核状态失败，请刷新重试。</p>',
				'button': '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">关闭</a>'
			});
			return false;
		}

		ppLib.alertWindow.show({
			'content': '<p>查询中...</p>',
			'button' : ' '
		});
		var params = {
			'action': 'getCommissionTaskList'
		};
		ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/task.do?callback=?', params, function(json){
			if(json.errorCode == '0' && !!json.result){
				var len = json.result.length;
				if(len > 0){
					var htmlList = [];
					for(var i = 0; i < len; i++){
						var item = json.result[i];
						htmlList.push('<option value="'+item.taskId+'">'+item.productName+'</option>');
					}
					ppLib.alertWindow.show({
						'content': '<p>请选择委托的产品：<select style="width:160px;" id="product-select">'+htmlList.join('')+'</select></p>',
						'button' : '<a href="javascript:;" class="pop_btn pop_btn_red" id="sure-entrust-btn">确定委托</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
					});
					var $sureEntrustBtn = $('#sure-entrust-btn');
					var $productSelect = $('#product-select');
					$sureEntrustBtn.one('click', function(){
						var taskId = $productSelect.val();
						if(taskId == ''){
							alert('请选择委托的产品');
							return false;
						}
						ppLib.alertWindow.show({
							'content': '<p>委托中...</p>',
							'button' : ' '
						});
						var params = {
							'action': 'commissionSp',
							'taskId': taskId,
							'spId': spid
						};
						ppLib.postEx(PPG.apiBaseUrl + 'appmarket/internalMsg.do', params, function(json){
							var errMsg = '';
							if(json.errorCode == '0'){
								ppLib.alertWindow.show({
									'content': '<p class="bigger">委托已发送</p><p>渠道将收到您的推广委托，是否进行推广合作将取决于渠道。</p>',
									'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
								});
							}else if(json.errorCode == '99'){
								errMsg = '登录超时，请重新登录。';
							}else{
								errMsg = '委托失败，请重试['+json.errorCode+']。';
							}
							if(!!errMsg){
								ppLib.alertWindow.show({
									'content': '<p>'+errMsg+'</p>',
									'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">关闭</a>'
								});
							}
						});
						return false;
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