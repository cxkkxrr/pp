;(function(){
	var $oldPwd = $('#old-pwd');
	var $newPwd = $('#new-pwd');
	var $newPwdCheck = $('#new-pwd-check');
	var $submitBtn = $('#submit-btn');


	function checkOldPwd(isFocus){
		var oldPwdVal = $oldPwd.find('input').val();
		if(oldPwdVal == ''){
			$oldPwd.find('.err').html('请输入原密码');
			isFocus && $oldPwd.find('input').focus();
			return false;
		}
		$oldPwd.find('.err').html('');
		return oldPwdVal;
	}
	function checkNewPwd(isFocus){
		var newPwdVal = $newPwd.find('input').val();
		if(newPwdVal == ''){
			$newPwd.find('.err').html('请输入新密码');
			isFocus && $newPwd.find('input').focus();
			return false;
		}
		if(/\s+/.test(newPwdVal)){
			$newPwd.find('.err').html('密码中不能包含空格');
			isFocus && $newPwd.find('input').focus();
			return false;
		}
		if(!/^[a-zA-Z0-9]{6,16}$/.test(newPwdVal)){
			$newPwd.find('.err').html('密码为6-16个数字、字符');
			isFocus && $newPwd.find('input').focus();
			return false;
		}
		$newPwd.find('.err').html('');
		return newPwdVal;
	}
	function checkNewPwdCheck(isFocus){
		var newPwdCheckVal = $newPwdCheck.find('input').val();
		if(newPwdCheckVal == ''){
			$newPwdCheck.find('.err').html('请再次输入新密码');
			isFocus && $newPwdCheck.find('input').focus();
			return false;
		}
		var newPwdVal = $newPwd.find('input').val();
		if(newPwdCheckVal != newPwdVal){
			$newPwdCheck.find('.err').html('密码不一致');
			isFocus && $newPwdCheck.find('input').focus();
			return false;
		}
		$newPwdCheck.find('.err').html('');
		return newPwdCheckVal;
	}

	$oldPwd.find('input').blur(function(){
		checkOldPwd();
	}).keyup(function(){
		$oldPwd.find('.err').html('');
	});
	$newPwd.find('input').blur(function(){
		if(checkNewPwd() !== false){
			checkNewPwdCheck();
		}
	}).keyup(function(){
		$newPwd.find('.err').html('');
	});
	$newPwdCheck.find('input').blur(function(){
		checkNewPwdCheck();
	}).keyup(function(){
		$newPwdCheck.find('.err').html('');
	});

	function getFormValue(){
		var params = {};
		var oldPwdVal = checkOldPwd(true);
		if(oldPwdVal === false){
			return false;
		}
		var newPwdVal = checkNewPwd(true);
		if(newPwdVal === false){
			return false;
		}
		var newPwdCheckVal = checkNewPwdCheck(true);
		if(newPwdCheckVal === false){
			return false;
		}
		params.oldPwdVal = hex_md5(oldPwdVal);
		params.newPwdVal = hex_md5(newPwdVal);
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

		$submitBtn.html('修 改 中...');
		isSubmiting = true;
		ppLib.postEx(PPG.apiBaseUrl + 'xxx.do', params, function(json){
			$submitBtn.html('确 认 修 改');
			isSubmiting = false;
			ppLib.alertWindow.show({
				'content': '<p>密码修改成功，请重新登录~</p>',
				'button' : '<a href="#" class="pop_btn pop_btn_red">立即登录</a>'
			});
		});
	}
	$submitBtn.click(function(){
		doSubmit();
		return false;
	});
})();