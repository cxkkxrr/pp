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
	var taskId = $.trim(ppLib.getUrlParam('pid') || '');
	var $packageList = $('#package-list');

	ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/package.do?callback=?', {'action': 'listPackage', 'taskId': taskId}, function(json){
		if(json.errorCode == '0' && !!json.result && json.result.length > 0){
			$packageList.html(template('tpl-result',{'resultList':json.result}));
		}else if(json.errorCode == '99'){
			$packageList.html('登录超时，请重新登录');
		}else if(json.errorCode == '9999'){
			$packageList.html('查询超时，请刷新重试');
		}else{
			$packageList.html('无记录');
		}
	});
})();

;(function(){
	var taskId = $.trim(ppLib.getUrlParam('pid') || '');
	var $packageList = $('#package-list');
	$packageList.on('click', '.updateBtn', function(){
		var $this = $(this);
		var packageId = $this.data('packageid');
		var packageNo = $this.data('packageno');
		var packageVersion = $this.data('packageversion');
		ppLib.alertWindow.show({
			'title': '更新包 - 包号：' + packageNo,
			'content': template('tpl-update-form',{'packageVersion':packageVersion}),
			'button' : '<a href="javascript:;" class="pop_btn pop_btn_red" id="submit-btn">确认提交</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
		});

		var $productPackgeVersion = $('#product-packge-version');
		var $downloadLink = $('#download-link');
		var $uploadFilenameText = $('#upload-filename-text');
		var $uploadFilenameInput = $('#upload-filename-input');
		var $submitBtn = $('#submit-btn');
		var upload = new ppClass.Upload({
			'type': '1', //压缩包
			'fileSizeLimit': '100MB',
			'fileTypes': '*.zip;*.rar',
			'fileTypesDescription': '不超过100MB的文件',
			'buttonPlaceholderId': 'upload-button-placeholder',
			'progressTarget': 'upload-process-box',
			'uploadStartCallback': function(){
				
			},
			'uploadSuccessCallback': function(json, file){
				if(json.errorCode == '0'){
					$uploadFilenameText.html(ppLib.htmlEncode(file.name) + ' 上传成功 <a href="javascript:;" id="delete-upload-file-btn" style="color:#f00;">删除</a>').show();
					$uploadFilenameInput.val(json.result.md5);
				}else if(json.errorCode == '3'){
					alert('上传格式不正确');
				}else if(json.errorCode == '4'){
					alert('上传文件太大');
				}else if(json.errorCode == '99'){
					alert('登录超时，请重新登录');
				}else{
					alert('上传失败，请重试');
				}
			},
			'uploadErrorCallback': function(){
				alert('上传失败，请重试');
			}
		});
		$uploadFilenameText.on('click', '#delete-upload-file-btn', function(){
			$uploadFilenameText.hide().html('');
			$uploadFilenameInput.val('');
			$downloadLink.find('input').trigger('blur');
			return false;
		});


		var isSubmiting = false;
		function doSubmit(){
			if(isSubmiting){
				return;
			}
			var params = {};

			var packageVersionValue = ppFun.checkData($productPackgeVersion.find('input'), 'textInput', true);
			if(packageVersionValue === false){
				alert('请输入新版本号');
				return false;
			}
			if(packageVersion == packageVersionValue){
				alert('新版本号不能与现有版本号重复');
				return false;
			}
			params['packageVersion'] = packageVersionValue;

			if(upload.swfObj && upload.swfObj.getStats().files_queued !== 0){
				alert('文件正在努力上传中~');
				return false;
			}

			var uploadValue = ppFun.checkData($uploadFilenameInput, 'textInput');
			var downloadLinkValue = ppFun.checkData($downloadLink.find('input'), 'textInput');
			if(uploadValue === false && downloadLinkValue === false){
				alert('请上传包文件或者提供安装文件下载链接');
				return false;
			}
			params['md5'] = uploadValue || '';
			params['link'] = downloadLinkValue || '';

			params['taskId'] = taskId;
			params['packageId'] = packageId;
			
			params.action = 'updatePackage';
			$submitBtn.html('提交中...');
			isSubmiting = true;
			ppLib.postEx(PPG.apiBaseUrl + 'appmarket/package.do', params, function(json){
				$submitBtn.html('确认提交');
				isSubmiting = false;
				var errMsg = '';
				if(json.errorCode == '0'){
					alert('您已成功更新包，请等候审核通过。');
					ppLib.reloadLocation();
				}else if(json.errorCode == '1'){
					alert('包文件上传异常，请重新上传。');
				}else if(json.errorCode == '4'){
					alert('更新包待审核中。');
				}else if(json.errorCode == '5'){
					alert('新版本号不能与现有版本号重复。');
				}else if(json.errorCode == '99'){
					alert('登录超时，请重新登录。');
				}else{
					alert('提交失败，请重试['+json.errorCode+']。');
				}
			});	
		}

		$submitBtn.click(function(){
			doSubmit();
			return false;
		});
		return false;
	});
	
	
	
})();


// ;(function(){
// 	var pid = $.trim(ppLib.getUrlParam('pid') || '');
// 	var $packageList = $('#package-list');
// 	var $newPackageList = $('#new-package-list');
// 	var $submitBtn = $('#submit-btn');
	
// 	function checkExistInUpload(val){
// 		/*var isExist = false;
// 		$newPackageList.find('table input').each(function(){
// 			if(val == $(this).val().split('_')[0]){
// 				isExist = true;
// 				return false; //退出each
// 			}
// 		});
// 		return isExist;*/
// 		return false;
// 	}

// 	function initUploadItem(idx){
// 		var $packageVInput = $('#package-v-input-'+idx);
// 		var $uploadErr = $('#upload-err-'+idx);

// 		function checkPackage(){
// 			var val = $.trim($packageVInput.val());
// 			if(/^.{1,10}$/.test(val)){
// 				if(checkExistInUpload(val)){
// 					$uploadErr.html('该包号上传新版本了');
// 					upload.swfObj.setButtonDisabled(true);
// 					return false;
// 				}else{
// 					$uploadErr.html('');
// 					upload.swfObj.setButtonDisabled(false);
// 					return true;
// 				}
// 			}else{
// 				$uploadErr.html('请输入版本号(1-10位字符)');
// 				upload.swfObj.setButtonDisabled(true);
// 				return false;
// 			}
// 		}

// 		var upload = new ppClass.Upload({
// 			'fileSizeLimit': '100MB',
// 			'fileTypes': '*.zip;*.rar',
// 			'fileTypesDescription': '不超过100MB的文件',
// 			'buttonPlaceholderId': 'upload-button-placeholder-'+idx,
// 			'progressTarget': 'upload-process-box-'+idx,
// 			'uploadSuccessCallback': function(json){
// 				var packageNum = '1001';
// 				var packageVVal = $.trim($packageVInput.val());
// 				$packageVInput.attr('disabled', true);
// 				upload.swfObj.setButtonDisabled(true);
// 				$newPackageList.find('table').append('<tr><td>'+packageNum+'</td><td>'+packageVVal+'</td><td>'+json.data.r+'<input type="text" style="display:none;" value="'+packageNum+'_'+packageVVal+'_'+json.data.r+'"></td><td><a href="javascript:;" class="red" id="delete-btn-'+idx+'">删除</a></td><td></td></tr>');
// 				$('#delete-btn-'+idx).click(function(){
// 					$(this).parent().parent().remove();
// 					$packageVInput.attr('disabled', false);
// 					upload.swfObj.setButtonDisabled(false);
// 					return false;
// 				});
// 			},
// 			'uploadErrorCallback': function(){
// 				$packageVInput.attr('disabled', false);
// 				alert('上传失败，请重试~');
// 			},
// 			'preCheckCallback': function(){
// 				if(checkPackage()){
// 					$packageVInput.attr('disabled', true);
// 					return true;
// 				}else{
// 					return false;
// 				}
// 			},
// 			'swfUploadLoadedCallback': function(){
// 				setTimeout(function(){
// 					upload.swfObj.setButtonDisabled(true);
// 				}, 800);
// 			}
// 		});

// 		$packageVInput.keyup(function(event) {
// 			checkPackage();
// 		}).blur(function(event) {
// 			checkPackage();
// 		});
// 	}
// 	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {'pid': pid}, function(json){
// 		var len = 5;
// 		var htmlList = [];
// 		for(var i = 0; i < len; i++){
// 			htmlList.push('<tr><td>1001</td><td>1.2.0</td><td><input tyle="text" id="package-v-input-'+i+'" class="intxt packge_v_input"></td><td><div class="uploadbox"><div class="uploadbtn" id="upload-button"><span id="upload-button-placeholder-'+i+'"></span></div><div class="uploadprocess" id="upload-process-box-'+i+'"></div><span class="err" id="upload-err-'+i+'"></span></div></td></tr>');
// 		}
// 		$packageList.find('table').append(htmlList.join(''));
// 		for(var i = 0; i < len; i++){
// 			initUploadItem(i);
// 		}
// 	});


// 	var isSubmiting = false;
// 	$submitBtn.click(function(){
// 		if(isSubmiting){
// 			return false;
// 		}
// 		var valueList = [];
// 		$newPackageList.find('table input').each(function(){
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