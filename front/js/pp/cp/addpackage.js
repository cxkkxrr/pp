;(function(){
	var pid = $.trim(ppLib.getUrlParam('pid') || '');
	(pid == '') && (alert('该详情不存在~'),window.close());
	var $productName = $('#product-name');
	var $productDetail = $('#product-detail');
	$productName.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {'pid': pid}, function(json){
		(pid == '111') && (alert('该详情不存在~'),window.close());
		$productName.html('<img src="../images/32x32.jpg" width="32" height="32">　微信111');
		$productDetail.append('<p>单价：1.5元　　版本号：2.0.3</p><p>推广中包数量：2　　空闲包数量：3</p><p>推广方式：弹窗、Banner</p>');
	});
})();

;(function(){
	var $packageList = $('#package-list');
	var $packageNumInput = $('#package-num-input');
	var $uploadErr = $('#upload-err');
	var $submitBtn = $('#submit-btn');

	function checkExistInUpload(val){
		var isExist = false;
		$packageList.find('table input').each(function(){
			if(val == $(this).val().split('_')[0]){
				isExist = true;
				return false; //退出each
			}
		});
		return isExist;
	}
	function checkPackageNum(){
		var val = $.trim($packageNumInput.val());
		if(/^[0-9]{1,6}$/.test(val)){
			if(checkExistInUpload(val)){
				$uploadErr.html('该包号已经使用了');
				upload.swfObj.setButtonDisabled(true);
				return false;
			}else{
				$uploadErr.html('');
				upload.swfObj.setButtonDisabled(false);
				return true;
			}
		}else{
			$uploadErr.html('请输入包号(1-6位数字)');
			upload.swfObj.setButtonDisabled(true);
			return false;
		}
	}

	//设置上传组件
	var upload = new ppClass.Upload({
		'fileSizeLimit': '100MB',
		'fileTypes': '*.zip;*.rar',
		'fileTypesDescription': '不超过100MB的文件',
		'buttonPlaceholderId': 'upload-button-placeholder',
		'progressTarget': 'upload-process-box',
		'uploadSuccessCallback': function(json){
			var packageNum = $.trim($packageNumInput.val());
			$packageNumInput.attr('disabled', false).val('');
			$packageList.find('table').append('<tr><td>'+packageNum+'</td><td>'+json.data.r+'<input type="text" style="display:none;" value="'+packageNum+'_'+json.data.r+'"></td><td><a href="javascript:;" class="red deleteBtn">删除</a></td><td></td></tr>');
		},
		'uploadErrorCallback': function(){
			$packageNumInput.attr('disabled', false);
			alert('上传失败，请重试~');
		},
		'preCheckCallback': function(){
			if(checkPackageNum()){
				$packageNumInput.attr('disabled', true);
				return true;
			}else{
				return false;
			}
		},
		'swfUploadLoadedCallback': function(){
			setTimeout(function(){
				upload.swfObj.setButtonDisabled(true);
			}, 800);
		}
	});

	$packageNumInput.keyup(function(event) {
		checkPackageNum();
	}).blur(function(event) {
		checkPackageNum();
	});

	$packageList.on('click', '.deleteBtn', function(){
		$(this).parent().parent().remove();
		checkPackageNum();
		return false;
	});

	var isSubmiting = false;
	$submitBtn.click(function(){
		if(isSubmiting){
			return false;
		}
		var valueList = [];
		$packageList.find('table input').each(function(){
			valueList.push($(this).val());
		});
		if(valueList.length == 0){
			alert('请先上传');
			return false;
		}
		$submitBtn.html('提交中...');
		isSubmiting = true;
		ppLib.postEx(PPG.apiBaseUrl + 'xxx.do', {'value':valueList.join(',')}, function(json){
			$submitBtn.html('确认提交');
			isSubmiting = false;
			//alert(json.rtn);
			ppLib.alertWindow.show({
				'content': '<p class="bigger">提交成功！</p><p>提交成功。</p>',
				'button' : '<a href="#" class="pop_btn pop_btn_red">确定</a>'
			});
		});
	});

})();