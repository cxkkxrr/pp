;(function(){
	var $formBox = $('#form-box');
	var $bankName = $('#bank-name');
	var $bankSite = $('#bank-site');
	var $bankCardName = $('#bank-card-name');
	var $bankCardNumber = $('#bank-card-number');
	var $editBtn = $('#edit-btn');
	var $submitBtn = $('#submit-btn');

	function showView(){
		$formBox.find('.txt').show();
		$editBtn.show();
		$formBox.find('.r_lb .red').hide();
		$formBox.find('input').hide();
		$submitBtn.hide();
	}
	function showEdit(){
		$formBox.find('.txt').hide();
		$editBtn.hide();
		$formBox.find('.r_lb .red').show();
		$formBox.find('input').show();
		$submitBtn.show();
	}

	function loadData(callback){
		ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {}, function(json){
			var json = {'result':{'bankName':'','bankSite':'','bankCardName':'bankCardName','bankCardNumber':''}};
			$bankName.find('.txt').html(json.result.bankName || '未填写');
			$bankSite.find('.txt').html(json.result.bankSite || '未填写');
			$bankCardName.find('.txt').html(json.result.bankCardName || '未填写');
			$bankCardNumber.find('.txt').html(json.result.bankCardNumber || '未填写');

			$bankName.find('input').val(json.result.bankName || '');
			$bankSite.find('input').val(json.result.bankSite || '');
			$bankCardName.find('input').val(json.result.bankCardName || '');
			$bankCardNumber.find('input').val(json.result.bankCardNumber || '');

			(typeof(callback) == 'function') && callback();
		});
	}
	
	$editBtn.click(function(){
		showEdit();
		return false;
	});




	var allItemList = [
		{
			$obj: $bankName,
			paramName: 'bankName',
			type: 'textInput',
			errMsg: '请输入银行名称'
		},{
			$obj: $bankSite,
			paramName: 'bankSite',
			type: 'textInput',
			errMsg: '请输入开户行'
		},{
			$obj: $bankCardName,
			paramName: 'bankCardName',
			type: 'textInput',
			errMsg: '请输入开户名'
		},{
			$obj: $bankCardNumber,
			paramName: 'bankCardNumber',
			type: 'textInput',
			errMsg: '请输入账号'
		}
	];
	var allItemLength = allItemList.length;
	for(var i = 0; i < allItemLength; i++){
		(function(item){
			item.$obj.find('input').blur(function(){
				if(ppFun.checkData(item.$obj.find('input'), item.type) === false){
					item.$obj.find('.err').html(item.errMsg);
				}else{
					item.$obj.find('.err').html('');
				}
			}).keyup(function(){
				item.$obj.find('.err').html('');
			});
		})(allItemList[i]);
	}

	

	var isSubmiting = false;
	function doSubmit(){
		if(isSubmiting){
			return;
		}

		var params = {};
		for(var i = 0; i < allItemLength; i++){
			var item = allItemList[i];
			var value = ppFun.checkData(item.$obj.find('input'), item.type, true);
			if(value === false){
				item.$obj.find('.err').html(item.errMsg);
				return false;
			}
			item.$obj.find('.err').html('');
			params[item.paramName] = value;
		}

		$submitBtn.html('提 交 中...');
		isSubmiting = true;
		ppLib.postEx(PPG.apiBaseUrl + 'xxx.do', params, function(json){
			$submitBtn.html('确 认 提 交');
			isSubmiting = false;
			//alert(json.rtn);
			ppLib.alertWindow.show({
				'content': '<p class="bigger">提交成功！</p><p>提交成功！</p>',
				'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
			});
			loadData(function(){
				showView();
			});
		});
	}
	$submitBtn.click(function(){
		doSubmit();
		return false;
	});



	loadData(function(){
		showView();
	});
})();