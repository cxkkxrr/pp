;(function(){
	var pageAction = ppLib.getUrlParam('action');
	var $quaSpType = $('#qua-sp-type');
	var $typeCompanyForm = $('#type-company-form');
	var $typePeopleForm = $('#type-people-form');
	
	var $quaSystem = $('#qua-system');
	var $quaProductType = $('#qua-product-type');
	var $quaPushType = $('#qua-push-type');
	var $quaAimCrowd = $('#qua-aim-crowd');

	var curSpType = 1;

	var $qua_c_Company = $('#qua-c-company');
	var $qua_c_Address = $('#qua-c-address');
	var $qua_c_Contact = $('#qua-c-contact');
	var $qua_c_Mobile = $('#qua-c-mobile');
	var $qua_c_Website = $('#qua-c-website');
	var $qua_c_Email = $('#qua-c-email');
	var $qua_c_Tel = $('#qua-c-tel');
	var $qua_c_YyzzInput = $('#qua-c-yyzz-input');
	var $qua_c_YyzzImg = $('#qua-c-yyzz-img');
	var $qua_c_YyzzErr = $('#qua-c-yyzz-err');
	var $qua_c_ZzjgInput = $('#qua-c-zzjg-input');
	var $qua_c_ZzjgImg = $('#qua-c-zzjg-img');
	var $qua_c_ZzjgErr = $('#qua-c-zzjg-err');

	var $qua_p_Name = $('#qua-p-name');
	var $qua_p_Mobile = $('#qua-p-mobile');
	var $qua_p_Address = $('#qua-p-address');
	var $qua_p_Website = $('#qua-p-website');
	var $qua_p_Tel = $('#qua-p-tel');
	var $qua_p_Idcard = $('#qua-p-idcard');
	var $qua_p_IdcardInput = $('#qua-p-idcard-input');
	var $qua_p_IdcardImg = $('#qua-p-idcard-img');
	var $qua_p_IdcardErr = $('#qua-p-idcard-err');

	var $submitBtn = $('#submit-btn');

	//设置上传组件
	var uploadYyzz = null;
	var uploadZzjg = null;
	var uploadIdcard = null;
	function initCompanyUpload(){
		uploadYyzz = new ppClass.Upload({
			'type': '0', //图片
			'fileSizeLimit': '3MB',
			'fileTypes': '*.jpg;*.jpeg;*.bmp;*.gif;*.png',
			'fileTypesDescription': '不超过3MB的图片',
			'buttonPlaceholderId': 'upload-button-placeholder-yyzz',
			'progressTarget': 'upload-process-box-yyzz',
			'uploadStartCallback': function(){
				$qua_c_YyzzErr.html('');
			},
			'uploadSuccessCallback': function(json){
				if(json.errorCode == '0'){
					var paht = 'http://120.24.220.18:8080/appmarket/' + json.result.path;
					var thumbnailPath = 'http://120.24.220.18:8080/appmarket/' + json.result.thumbnailPath;
					$qua_c_YyzzImg.html('<a href="'+paht+'" target="_blank"><img src="'+thumbnailPath+'" height="80"></a>').show();
					$qua_c_YyzzInput.val(json.result.md5);
					$qua_c_YyzzErr.html('');
				}else if(json.errorCode == '3'){
					$qua_c_YyzzErr.html('上传格式不正确');
				}else if(json.errorCode == '4'){
					$qua_c_YyzzErr.html('上传文件太大');
				}else if(json.errorCode == '99'){
					$qua_c_YyzzErr.html('登录超时，请重新登录');
				}else{
					$qua_c_YyzzErr.html('上传失败，请重试');
				}
			},
			'uploadErrorCallback': function(){
				$qua_c_YyzzErr.html('上传失败，请重试');
			}
		});

		//设置上传组件
		uploadZzjg = new ppClass.Upload({
			'type': '0', //图片
			'fileSizeLimit': '3MB',
			'fileTypes': '*.jpg;*.jpeg;*.bmp;*.gif;*.png',
			'fileTypesDescription': '不超过3MB的图片',
			'buttonPlaceholderId': 'upload-button-placeholder-zzjg',
			'progressTarget': 'upload-process-box-zzjg',
			'uploadStartCallback': function(){
				$qua_c_ZzjgErr.html('');
			},
			'uploadSuccessCallback': function(json){
				if(json.errorCode == '0'){
					var paht = 'http://120.24.220.18:8080/appmarket/' + json.result.path;
					var thumbnailPath = 'http://120.24.220.18:8080/appmarket/' + json.result.thumbnailPath;
					$qua_c_ZzjgImg.html('<a href="'+paht+'" target="_blank"><img src="'+thumbnailPath+'" height="80"></a>').show();
					$qua_c_ZzjgInput.val(json.result.md5);
					$qua_c_ZzjgErr.html('');
				}else if(json.errorCode == '3'){
					$qua_c_ZzjgErr.html('上传格式不正确');
				}else if(json.errorCode == '4'){
					$qua_c_ZzjgErr.html('上传文件太大');
				}else if(json.errorCode == '99'){
					$qua_c_ZzjgErr.html('登录超时，请重新登录');
				}else{
					$qua_c_ZzjgErr.html('上传失败，请重试');
				}
			},
			'uploadErrorCallback': function(){
				$qua_c_ZzjgErr.html('上传失败，请重试');
			}
		});
	}
	function destroyCompanyUpload(){
		if(uploadYyzz && uploadYyzz.swfObj){
			clearTimeout(uploadYyzz.swfObj.customSettings.loadingTimeout);
			uploadYyzz.swfObj.destroy();
			uploadYyzz.swfObj = null;
			$('#upload-button-yyzz').html('<span id="upload-button-placeholder-yyzz"></span>');
			$('#upload-process-box-yyzz').html('');
		}
		if(uploadZzjg && uploadZzjg.swfObj){
			clearTimeout(uploadZzjg.swfObj.customSettings.loadingTimeout);
			uploadZzjg.swfObj.destroy();
			uploadZzjg.swfObj = null;
			$('#upload-button-zzjg').html('<span id="upload-button-placeholder-zzjg"></span>');
			$('#upload-process-box-zzjg').html('');
		}
	}

	function initPeopleUpload(){
		uploadIdcard = new ppClass.Upload({
			'type': '0', //图片
			'fileSizeLimit': '3MB',
			'fileTypes': '*.jpg;*.jpeg;*.bmp;*.gif;*.png',
			'fileTypesDescription': '不超过3MB的图片',
			'buttonPlaceholderId': 'upload-button-placeholder-idcard',
			'progressTarget': 'upload-process-box-idcard',
			'uploadStartCallback': function(){
				$qua_p_IdcardErr.html('');
			},
			'uploadSuccessCallback': function(json){
				if(json.errorCode == '0'){
					var paht = 'http://120.24.220.18:8080/appmarket/' + json.result.path;
					var thumbnailPath = 'http://120.24.220.18:8080/appmarket/' + json.result.thumbnailPath;
					$qua_p_IdcardImg.html('<a href="'+paht+'" target="_blank"><img src="'+thumbnailPath+'" height="80"></a>').show();
					$qua_p_IdcardInput.val(json.result.md5);
					$qua_p_IdcardErr.html('');
				}else if(json.errorCode == '3'){
					$qua_p_IdcardErr.html('上传格式不正确');
				}else if(json.errorCode == '4'){
					$qua_p_IdcardErr.html('上传文件太大');
				}else if(json.errorCode == '99'){
					$qua_p_IdcardErr.html('登录超时，请重新登录');
				}else{
					$qua_p_IdcardErr.html('上传失败，请重试');
				}
			},
			'uploadErrorCallback': function(){
				$qua_p_IdcardErr.html('上传失败，请重试');
			}
		});
	}
	function destroyPeopleUpload(){
		if(uploadIdcard && uploadIdcard.swfObj){
			clearTimeout(uploadIdcard.swfObj.customSettings.loadingTimeout);
			uploadIdcard.swfObj.destroy();
			uploadIdcard.swfObj = null;
			$('#upload-button-idcard').html('<span id="upload-button-placeholder-idcard"></span>');
			$('#upload-process-box-idcard').html('');
		}
	}
	



	var allItemList = [
		/*{
			g: 4,
			$obj: $quaSpType,
			paramName: 'certificateType',
			type: 'selbtn',
			errMsg: '请选择渠道类型'
		},*/{
			g: 4,
			$obj: $quaSystem,
			paramName: 'os',
			type: 'selbtn',
			errMsg: '请选择操作系统'
		},{
			g: 4,
			$obj: $quaProductType,
			paramName: 'productType',
			type: 'selbtn',
			errMsg: '请选择产品类型'
		},{
			g: 4,
			$obj: $quaPushType,
			paramName: 'expandType',
			type: 'selbtn',
			errMsg: '请选择推广方式'
		},{
			g: 4,
			$obj: $quaAimCrowd,
			paramName: 'crowdLabel',
			type: 'selbtn',
			errMsg: '请选择针对人群'
		},

		{
			g: 1,
			$obj: $qua_c_Company,
			paramName: 'name',
			type: 'textInput',
			errMsg: '请输入公司名字'
		},{
			g: 1,
			$obj: $qua_c_Address,
			paramName: 'address',
			type: 'textInput',
			errMsg: '请输入公司地址'
		},{
			g: 1,
			$obj: $qua_c_Contact,
			paramName: 'contactPerson',
			type: 'textInput',
			errMsg: '请输入对接人'
		},{
			g: 1,
			$obj: $qua_c_Mobile,
			paramName: 'mobileNum',
			type: 'textInput',
			errMsg: '请输入手机号码'
		},{
			g: 1,
			$obj: $qua_c_Website,
			paramName: 'website',
			type: 'textInput',
			errMsg: '请输入公司网址'
		},{
			g: 1,
			$obj: $qua_c_Email,
			paramName: 'email',
			type: 'textInput',
			errMsg: '请输入电子邮箱'
		},{
			g: 1,
			$obj: $qua_c_Tel,
			paramName: 'telephone',
			type: 'textInput',
			errMsg: '请输入固定电话'
		},


		{
			g: 2,
			$obj: $qua_p_Name,
			paramName: 'name',
			type: 'textInput',
			errMsg: '请输入姓名'
		},{
			g: 2,
			$obj: $qua_p_Mobile,
			paramName: 'mobileNum',
			type: 'textInput',
			errMsg: '请输入手机号码'
		},{
			g: 2,
			$obj: $qua_p_Address,
			paramName: 'address',
			type: 'textInput',
			errMsg: '请输入地址'
		},{
			g: 3,
			$obj: $qua_p_Website,
			paramName: 'website',
			type: 'textInput',
			errMsg: '请输入网址'
		},{
			g: 3,
			$obj: $qua_p_Tel,
			paramName: 'telephone',
			type: 'textInput',
			errMsg: '请输入固定电话'
		},{
			g: 2,
			$obj: $qua_p_Idcard,
			paramName: 'idcard',
			type: 'textInput',
			errMsg: '请输入身份证号码'
		}
	];
	var allItemLength = allItemList.length;
	
	for(var i = 0; i < allItemLength; i++){
		if(allItemList[i].g == 1 || allItemList[i].g == 2){
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
	}


	function getCommonFormValue(params){
		for(var i = 0; i < allItemLength; i++){
			var item = allItemList[i];
			var value;
			if(item.g == 4){ //选择控件
				value = ppFun.checkData(item.$obj, item.type, true);
				if(value === false){
					item.$obj.find('.err').html(item.errMsg);
					return false;
				}
				item.$obj.find('.err').html('');
				params[item.paramName] = value;
			}
		}
		return params;
	}

	function getCompanyFormValue(params){
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
			}
		}

		if(pageAction != 'edit'){
			if(uploadYyzz.swfObj && uploadYyzz.swfObj.getStats().files_queued !== 0){
				alert('图片正在努力上传中~');
				return false;
			}

			if(uploadZzjg.swfObj && uploadZzjg.swfObj.getStats().files_queued !== 0){
				alert('图片正在努力上传中~');
				return false;
			}

			var quaYyzzInputValue = ppFun.checkData($qua_c_YyzzInput, 'textInput');
			if(quaYyzzInputValue === false){
				$qua_c_YyzzErr.html('请上传营业执照扫描件');
				return false;
			}
			params['licenseMd5'] = quaYyzzInputValue;


			var quaZzjgInputValue = ppFun.checkData($qua_c_ZzjgInput, 'textInput');
			if(quaZzjgInputValue === false){
				$qua_c_ZzjgErr.html('请上传组织机构代码证');
				return false;
			}
			params['organizationCodeMd5'] = quaZzjgInputValue;
		}

		return params;
	}

	function getPeopleFormValue(params){
		for(var i = 0; i < allItemLength; i++){
			var item = allItemList[i];
			var value;
			if(item.g == 2){ //普通单个输入框
				value = ppFun.checkData(item.$obj.find('input'), item.type, true);
				if(value === false){
					item.$obj.find('.err').html(item.errMsg);
					return false;
				}
				item.$obj.find('.err').html('');
				params[item.paramName] = value;

			}else if(item.g == 3){ //不必填
				value = ppFun.checkData(item.$obj.find('input'), item.type) || '';
				item.$obj.find('.err').html('');
				params[item.paramName] = value;
			}
		}

		if(pageAction != 'edit'){
			if(uploadIdcard.swfObj && uploadIdcard.swfObj.getStats().files_queued !== 0){
				alert('图片正在努力上传中~');
				return false;
			}

			var quaIdcardInputValue = ppFun.checkData($qua_p_IdcardInput, 'textInput');
			if(quaIdcardInputValue === false){
				$qua_p_IdcardErr.html('请上传身份证扫描件');
				return false;
			}
			params['md5'] = quaIdcardInputValue;
		}

		return params;
	}


	var isSubmiting = false;
	function doSubmit(){
		if(isSubmiting){
			return;
		}
		var params = {};
		params = getCommonFormValue(params);
		if(params === false){
			return;
		}
		params = (curSpType == 2) ? getPeopleFormValue(params) : getCompanyFormValue(params);
		if(params === false){
			return;
		}

		$submitBtn.html('提 交 中...');
		isSubmiting = true;
		var urlPath;
		if(ppLib.getUrlParam('action') != 'edit'){//新增
			urlPath = (curSpType == 2) ? 'appmarket/individual.do?action=insertSp' : 'appmarket/corporate.do?action=insertSp';
		}else{//修改
			urlPath = (curSpType == 2) ? 'appmarket/individual.do?action=updateSp' : 'appmarket/corporate.do?action=updateSp';
		}
		ppLib.postEx(PPG.apiBaseUrl + urlPath, params, function(json){
			$submitBtn.html('确 认 提 交');
			isSubmiting = false;
			if(json.errorCode == '0'){
				ppLib.alertWindow.show({
					'content': '<p class="bigger">提交成功！</p><p>您已提交资质审核，请等待审核通过。审核通过后，您将会收到站内信和邮件通知。</p>',
					'button' : '<a href="qualification.html" class="pop_btn pop_btn_red">确定</a>'
				});
			}else if(json.errorCode == '99'){
				ppLib.alertWindow.show({
					'content': '<p class="bigger">任务提交失败！</p><p>登录超时，请重新登录。</p>',
					'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
				});
			}else{
				ppLib.alertWindow.show({
					'content': '<p class="bigger">提交失败！</p><p>提交失败，请重试。'+'['+json.errorCode+']'+'</p>',
					'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
				});
			}
		});
	}
	$submitBtn.click(function(){
		doSubmit();
		return false;
	});





	function chuangeType(){
		var type = $quaSpType.ppGetSelectorValue().join('');
		if(type != curSpType){
			curSpType = type;
			if(curSpType == 2){ //people
				$typeCompanyForm.hide();
				$typePeopleForm.show();
				if(pageAction != 'edit'){
					destroyCompanyUpload();
					initPeopleUpload();
				}
			}else{ //company
				$typeCompanyForm.show();
				$typePeopleForm.hide();
				if(pageAction != 'edit'){
					destroyPeopleUpload();
					initCompanyUpload();
				}
			}
		}
	}
	$quaSpType.on('click', '.selbtn', function(){
		chuangeType();
	});

	chuangeType();
})();