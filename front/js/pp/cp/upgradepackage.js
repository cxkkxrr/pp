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
	var pid = $.trim(ppLib.getUrlParam('pid') || '');
	var $packageList = $('#package-list');

	ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/package.do?callback=?', {'action': 'listPackage', 'taskId': pid}, function(json){
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