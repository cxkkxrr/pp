// ;(function(){
// 	var pid = $.trim(ppLib.getUrlParam('pid') || '');
// 	(pid == '') && (alert('该详情不存在~'),window.close());
// 	var $productName = $('#product-name');
// 	var $productDetail = $('#product-detail');
// 	$productName.html('查询中...');
// 	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {'pid': pid}, function(json){
// 		(pid == '111') && (alert('该详情不存在~'),window.close());
// 		$productName.html('<img src="/images/32x32.jpg" width="32" height="32">　微信111');
// 		$productDetail.append('<p>单价：1.5元　　版本号：2.0.3</p><p>推广中包数量：2　　空闲包数量：3</p><p>推广方式：弹窗、Banner</p>');
// 	});
// })();

;(function(){
	var $productPackgeNum = $('#product-packge-num');
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



	$productPackgeNum.find('input').blur(function(){
		if(ppFun.checkData($productPackgeNum.find('input'), 'textInput') === false){
			$productPackgeNum.find('.err').html('请输入包号');
		}else{
			$productPackgeNum.find('.err').html('');
		}
	}).keyup(function(){
		$productPackgeNum.find('.err').html('');
	});

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

		var packageNoValue = ppFun.checkData($productPackgeNum.find('input'), 'textInput', true);
		if(packageNoValue === false){
			$productPackgeNum.find('.err').html('请输入包号');
			return false;
		}
		$productPackgeNum.find('.err').html('');
		params['packageNo'] = packageNoValue;


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
		params.action = 'addPackage';
		$submitBtn.html('提 交 中...');
		isSubmiting = true;
		ppLib.postEx(PPG.apiBaseUrl + 'appmarket/package.do', params, function(json){
			$submitBtn.html('确 认 提 交');
			isSubmiting = false;
			var errMsg = '';
			if(json.errorCode == '0'){
				ppLib.alertWindow.show({
					'content': '<p class="bigger">新包提交成功！</p><p>您已成功添加新包，请等候审核通过。</p>',
					'button' : '<a href="mytask.html" class="pop_btn pop_btn_red">确定</a>'
				});
			}else if(json.errorCode == '1'){
				errMsg = '包文件上传异常，请重新上传。';
			}else if(json.errorCode == '99'){
				errMsg = '登录超时，请重新登录。';
			}else{
				errMsg = '提交失败，请重试。';
			}
			if(!!errMsg){
				ppLib.alertWindow.show({
					'content': '<p class="bigger">新包提交失败！</p><p>'+errMsg+'['+json.errorCode+']</p>',
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

// ;(function(){
// 	var $packageList = $('#package-list');
// 	var $packageNumInput = $('#package-num-input');
// 	var $uploadErr = $('#upload-err');
// 	var $submitBtn = $('#submit-btn');

// 	function checkExistInUpload(val){
// 		var isExist = false;
// 		$packageList.find('table input').each(function(){
// 			if(val == $(this).val().split('_')[0]){
// 				isExist = true;
// 				return false; //退出each
// 			}
// 		});
// 		return isExist;
// 	}
// 	function checkPackageNum(){
// 		var val = $.trim($packageNumInput.val());
// 		if(/^[0-9]{1,6}$/.test(val)){
// 			if(checkExistInUpload(val)){
// 				$uploadErr.html('该包号已经使用了');
// 				upload.swfObj.setButtonDisabled(true);
// 				return false;
// 			}else{
// 				$uploadErr.html('');
// 				upload.swfObj.setButtonDisabled(false);
// 				return true;
// 			}
// 		}else{
// 			$uploadErr.html('请输入包号(1-6位数字)');
// 			upload.swfObj.setButtonDisabled(true);
// 			return false;
// 		}
// 	}

// 	//设置上传组件
// 	var upload = new ppClass.Upload({
// 		'fileSizeLimit': '100MB',
// 		'fileTypes': '*.zip;*.rar',
// 		'fileTypesDescription': '不超过100MB的文件',
// 		'buttonPlaceholderId': 'upload-button-placeholder',
// 		'progressTarget': 'upload-process-box',
// 		'uploadSuccessCallback': function(json){
// 			var packageNum = $.trim($packageNumInput.val());
// 			$packageNumInput.attr('disabled', false).val('');
// 			$packageList.find('table').append('<tr><td>'+packageNum+'</td><td>'+json.data.r+'<input type="text" style="display:none;" value="'+packageNum+'_'+json.data.r+'"></td><td><a href="javascript:;" class="red deleteBtn">删除</a></td><td></td></tr>');
// 		},
// 		'uploadErrorCallback': function(){
// 			$packageNumInput.attr('disabled', false);
// 			alert('上传失败，请重试~');
// 		},
// 		'preCheckCallback': function(){
// 			if(checkPackageNum()){
// 				$packageNumInput.attr('disabled', true);
// 				return true;
// 			}else{
// 				return false;
// 			}
// 		},
// 		'swfUploadLoadedCallback': function(){
// 			setTimeout(function(){
// 				upload.swfObj.setButtonDisabled(true);
// 			}, 800);
// 		}
// 	});

// 	$packageNumInput.keyup(function(event) {
// 		checkPackageNum();
// 	}).blur(function(event) {
// 		checkPackageNum();
// 	});

// 	$packageList.on('click', '.deleteBtn', function(){
// 		$(this).parent().parent().remove();
// 		checkPackageNum();
// 		return false;
// 	});

// 	var isSubmiting = false;
// 	$submitBtn.click(function(){
// 		if(isSubmiting){
// 			return false;
// 		}
// 		var valueList = [];
// 		$packageList.find('table input').each(function(){
// 			valueList.push($(this).val());
// 		});
// 		if(valueList.length == 0){
// 			alert('请先上传');
// 			return false;
// 		}
// 		$submitBtn.html('提交中...');
// 		isSubmiting = true;
// 		ppLib.postEx(PPG.apiBaseUrl + 'xxx.do', {'value':valueList.join(',')}, function(json){
// 			$submitBtn.html('确认提交');
// 			isSubmiting = false;
// 			//alert(json.rtn);
// 			ppLib.alertWindow.show({
// 				'content': '<p class="bigger">提交成功！</p><p>提交成功。</p>',
// 				'button' : '<a href="#" class="pop_btn pop_btn_red">确定</a>'
// 			});
// 		});
// 	});

// })();