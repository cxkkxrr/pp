;(function(){
	var $productName = $('#product-name');
	var $productVersion = $('#product-version');
	var $productPackgeNum = $('#product-packge-num');
	var $productSize = $('#product-size');
	var $unitPrice = $('#unit-price');
	var $pushDayLimit = $('#push-day-limit');
	var $productType = $('#product-type');
	var $productTypeAppBox = $('#product-type-app-box');
	var $productTypeApp = $('#product-type-app');
	var $productTypeGameBox = $('#product-type-game-box');
	var $productTypeGame = $('#product-type-game');
	var $system = $('#system');
	var $pushType = $('#push-type');
	var $billingType = $('#billing-type');
	var $requirementLabel = $('#requirement-label');
	var $pushRequirement = $('#push-requirement');
	var $quantity = $('#quantity');
	var $dataCycle = $('#data-cycle');
	var $crowdLabel = $('#crowd-label');
	var $uploadFilenameText = $('#upload-filename-text');
	var $uploadFilenameInput = $('#upload-filename-input');
	var $uploadErr = $('#upload-err');
	var $downloadLink = $('#download-link');
	var $submitBtn = $('#submit-btn');

	//设置上传组件
	var upload = new ppClass.Upload({
		'type': '1', //压缩包
		'fileSizeLimit': '100MB',
		'fileTypes': '*.zip;*.rar',
		'fileTypesDescription': '不超过100MB的文件',
		'buttonPlaceholderId': 'upload-button-placeholder',
		'progressTarget': 'upload-process-box',
		'uploadStartCallback': function(){
			$uploadErr.html('');
			$downloadLink.find('.err').html('');
		},
		'uploadSuccessCallback': function(json, file){
			if(json.errorCode == '0'){
				$uploadFilenameText.html(ppLib.htmlEncode(file.name) + ' 上传成功 <a href="javascript:;" id="delete-upload-file-btn" style="color:#f00;">删除</a>').show();
				$uploadFilenameInput.val(json.result.md5);
				$uploadErr.html('');
				$downloadLink.find('.err').html('');
			}else if(json.errorCode == '3'){
				$uploadErr.html('上传格式不正确');
			}else if(json.errorCode == '4'){
				$uploadErr.html('上传文件太大');
			}else if(json.errorCode == '99'){
				$uploadErr.html('登录超时，请重新登录');
			}else{
				$uploadErr.html('上传失败，请重试');
			}
		},
		'uploadErrorCallback': function(){
			$uploadErr.html('上传失败，请重试');
		}
	});
	$uploadFilenameText.on('click', '#delete-upload-file-btn', function(){
		$uploadFilenameText.hide().html('');
		$uploadFilenameInput.val('');
		$downloadLink.find('input').trigger('blur');
		return false;
	});


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


	var allItemList = [
		{
			g: 1,
			$obj: $productName,
			paramName: 'productName',
			type: 'textInput',
			errMsg: '请输入产品名字'
		},{
			g: 1,
			$obj: $productVersion,
			paramName: 'versionNo',
			type: 'textInput',
			errMsg: '请输入版本号'
		},{
			g: 1,
			$obj: $productPackgeNum,
			paramName: 'packageNo',
			type: 'textInput',
			errMsg: '请输入包号'
		},{
			g: 1,
			$obj: $productSize,
			paramName: 'packageSize',
			type: 'gt0numberInput',
			errMsg: '请输入包大小(大于0的数字)'
		},{
			g: 1,
			$obj: $unitPrice,
			paramName: 'unitPrice',
			type: 'gt0numberInput',
			errMsg: '请输入推广单价(大于0的数字)'
		},{
			g: 1,
			$obj: $pushDayLimit,
			paramName: 'days',
			type: 'gt0numberInput',
			errMsg: '请输入推广天数(大于0的数字)'
		},{
			g: 4,
			$obj: $productType,
			paramName: 'productTypeFirst',
			type: 'selbtn',
			errMsg: '请选择产品类型',
			subItem: {
				'app': {
					g: 3,
					$obj: $productTypeApp,
					paramName: 'productType',
					type: 'selbtn',
					errMsg: '请选择产品分类'
				},
				'game': {
					g: 3,
					$obj: $productTypeGame,
					paramName: 'productType',
					type: 'selbtn',
					errMsg: '请选择产品分类'
				}
			}
		},{
			g: 3,
			$obj: $system,
			paramName: 'operatingSystem',
			type: 'selbtn',
			errMsg: '请选择操作系统'
		},{
			g: 3,
			$obj: $pushType,
			paramName: 'expandType',
			type: 'selbtn',
			errMsg: '请选择推广方式'
		},{
			g: 3,
			$obj: $billingType,
			paramName: 'billingMethod',
			type: 'selbtn',
			errMsg: '请选择计费方式'
		},{
			g: 3,
			$obj: $requirementLabel,
			paramName: 'requestLabel',
			type: 'selbtn',
			errMsg: '请选择要求标签'
		},{
			g: 1,
			$obj: $pushRequirement,
			paramName: 'expandRequirement',
			type: 'textInput',
			errMsg: '请输入推广要求'
		},{
			g: 3,
			$obj: $quantity,
			paramName: 'amountLevel',
			type: 'selbtn',
			errMsg: '请选择量级要求'
		},{
			g: 3,
			$obj: $dataCycle,
			paramName: 'dataCycle',
			type: 'selbtn',
			errMsg: '请选择量级要求'
		},{
			g: 3,
			$obj: $crowdLabel,
			paramName: 'productLabel',
			type: 'selbtn',
			errMsg: '请选择人群标签'
		}
	];
	var allItemLength = allItemList.length;
	
	for(var i = 0; i < allItemLength; i++){
		if(allItemList[i].g == 1){
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
		}/*else if(allItemList[i].g == 2){
			(function(item){
				item.$obj.find('input').blur(function(){
					if(ppFun.checkData(item.$obj.find('input').eq(0), item.type) === false || ppFun.checkData(item.$obj.find('input').eq(1), item.type) === false){
						item.$obj.find('.err').html(item.errMsg);
					}else{
						item.$obj.find('.err').html('');
					}
				}).keyup(function(){
					item.$obj.find('.err').html('');
				});
			})(allItemList[i]);
		}*/
	}
	$downloadLink.find('input').blur(function(){
		var uploadValue = ppFun.checkData($uploadFilenameInput, 'textInput');
		var downloadLinkValue = ppFun.checkData($downloadLink.find('input'), 'textInput');
		if(uploadValue === false && downloadLinkValue === false){
			$downloadLink.find('.err').html('请上传包文件或者提供安装文件下载链接');
		}else{
			$downloadLink.find('.err').html('');
			$uploadErr.html('');
		}
	}).keyup(function(){
		$downloadLink.find('.err').html('');
		$uploadErr.html('');
	});


	function getFormValue(){
		var params = {};
		for(var i = 0; i < allItemLength; i++){
			var item = allItemList[i];
			var value;
			if(item.g == 1){ //普通单个输入框
				value = ppFun.checkData(item.$obj.find('input'), item.type, true);
				if(value === false){
					item.$obj.find('.err').html(item.errMsg);
					return false;
				}
				item.$obj.find('.err').html('');
				params[item.paramName] = value;

			}else if(item.g == 2){ //两个个输入框
				/*value = ppFun.checkData(item.$obj.find('input').eq(0), item.type, true);
				if(value === false){
					item.$obj.find('.err').html(item.errMsg);
					return false;
				}
				params[item.paramName[0]] = value;
				value = ppFun.checkData(item.$obj.find('input').eq(1), item.type, true);
				if(value === false){
					item.$obj.find('.err').html(item.errMsg);
					return false;
				}
				item.$obj.find('.err').html('');
				params[item.paramName[1]] = value;*/

			}else if(item.g == 3){ //选择控件
				value = ppFun.checkData(item.$obj, item.type, true);
				if(value === false){
					item.$obj.find('.err').html(item.errMsg);
					return false;
				}
				item.$obj.find('.err').html('');
				params[item.paramName] = value;

			}else if(item.g == 4){ //分类联动
				value = ppFun.checkData(item.$obj, item.type, true);
				if(value === false){
					item.$obj.find('.err').html(item.errMsg);
					return false;
				}
				item.$obj.find('.err').html('');
				params[item.paramName] = value;

				//获取细分类
				var subType = item.$obj.find('.selbtn_selected').data('type')
				var subItem = item.subItem[subType];
				var subTypeValue = ppFun.checkData(subItem.$obj, subItem.type, true);
				if(subTypeValue === false){
					subItem.$obj.find('.err').html(subItem.errMsg);
					return false;
				}
				subItem.$obj.find('.err').html('');
				params[subItem.paramName] = subTypeValue;
			}

		}


		if(upload.swfObj && upload.swfObj.getStats().files_queued !== 0){
			alert('文件正在努力上传中~');
			return false;
		}

		
		var uploadValue = ppFun.checkData($uploadFilenameInput, 'textInput');
		var downloadLinkValue = ppFun.checkData($downloadLink.find('input'), 'textInput');
		if(uploadValue === false && downloadLinkValue === false){
			$downloadLink.find('.err').html('请上传包文件或者提供安装文件下载链接');
			return false;
		}
		$downloadLink.find('.err').html('');
		$uploadErr.html('');
		params['md5'] = uploadValue || '';
		params['link'] = downloadLinkValue || '';

		return params;
	}


	var isSubmiting = false;
	function doSubmit(){
		if(isSubmiting){
			return;
		}
		var params = getFormValue();
		if(params === false){
			return;
		}
		params.action = 'addTask';
		$submitBtn.html('提 交 中...');
		isSubmiting = true;
		ppLib.postEx(PPG.apiBaseUrl + 'appmarket/task.do', params, function(json){
			$submitBtn.html('确 认 提 交');
			isSubmiting = false;
			var errMsg = '';
			if(json.errorCode == '0'){
				ppLib.alertWindow.show({
					'content': '<p class="bigger">任务提交成功！</p><p>您已成功提交任务，请等候审核通过。审核通过后，您的任务会被展示在任务大厅，被渠道看见并可以申请合作。</p>',
					'button' : '<a href="spsearch.html" class="pop_btn pop_btn_red">确定</a>'
				});
			}else if(json.errorCode == '1'){
				errMsg = '包文件上传异常，请重新上传。';
			}else if(json.errorCode == '99'){
				errMsg = '登录超时，请重新登录。';
			}else{
				errMsg = '上传失败，请重试。';
			}
			if(!!errMsg){
				ppLib.alertWindow.show({
					'content': '<p class="bigger">任务提交失败！</p><p>'+errMsg+'['+json.errorCode+']</p>',
					'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">关闭</a>'
				});
			}
		});
	}
	$submitBtn.click(function(){
		doSubmit();
		return false;
	});
})();