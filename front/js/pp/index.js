;(function(){
	var $loginTab = $('#login-tab');
	var $regTab = $('#reg-tab');
	var $loginBox = $('#login-box');
	var $regBox = $('#reg-box');
	$loginTab.click(function(){
		$loginTab.addClass('cur');
		$regTab.removeClass('cur');
		$loginBox.show();
		$regBox.hide();
		return false;
	});
	$regTab.click(function(){
		$loginTab.removeClass('cur');
		$regTab.addClass('cur');
		$loginBox.hide();
		$regBox.show();
		return false;
	});

	$('.login_reg_box .type_radio .item').click(function() {
		$(this).addClass('item_selected').siblings().removeClass('item_selected');
		return false;
	});
})();

//切换验证码
;(function(){
	function change($img){
		$img.attr('src', 'xxx');
	}
	$('.verify_code_change').click(function(){
		change($(this),find('img'));
		return false;
	});
})();

//登录
;(function(){
	if(ppLib.getUrlParam('dev') != '1'){
		return;
	}
	var $loginBox = $('#login-box');
	var $errTips = $('#err-tips');
	var $loginUsernameInput = $('#login-username-input');
	var $loginPwdInput = $('#login-pwd-input');
	var $loginType = $('#login-type');
	var $loginVcodeInput = $('#login-vcode-input');
	var $loginBtn = $('#login-btn');
	var $unLoginedBox = $('#un-login-box');
	var $loginedBox = $('#logined-box');

	if(ppLib.cookie.get('username') != '' && ppLib.cookie.get('usertype') != ''){
		ppLib.getJSONEx(PPG.apiBaseUrl + 'appmarket/user.do?callback=?',{'action':'getUserDetails'},function(json){
			if(json.errorCode == '0'){
				var enterUrl = (json.result.type == 0) ? '/cp/' : '/sp/';
				var typeStr = (json.result.type == 0) ? '[广告主]' : '[渠道商]';
				$loginedBox.html(template('tpl-logined-box',{
					'userName': json.result.userName + ' ' + typeStr,
					'enterUrl': enterUrl
				}));
				$unLoginedBox.fadeOut('fast');
				$loginedBox.fadeIn('fast');
			}else{
				$unLoginedBox.fadeIn('fast');
			}
		}, 7000);
	}else{
		$unLoginedBox.fadeIn('fast');
	}
	

	$loginBox.find('input').bind('keypress.loginBox',function(e){
		if(e.which == 13) {
			$loginBtn.trigger('click');
		}
	});

	function getFormValue(){
		var data = {};
		var userName = ppFun.checkData($loginUsernameInput, 'textInput', true);
		if(userName === false){
			$errTips.html('请输入用户名');
			return false;
		}
		var pwd = $loginPwdInput.val();
		if(pwd == ''){
			$errTips.html('请输入密码');
			$loginPwdInput.focus();
			return false;
		}
		
		var vCode = ppFun.checkData($loginVcodeInput, 'textInput', true);
		if(vCode === false){
			$errTips.html('请输入验证码');
			return false;
		}
		var type = $loginType.find('.item_selected').data('val');
		$errTips.html('');
		data.userName = userName;
		data.password = hex_md5(pwd);
		data.type = type;
		data.vCode = vCode;

		return data;
	}

	var isDoing = false;
	$loginBtn.click(function(){
		if(isDoing){
			return false;
		}
		var data = getFormValue();
		if(data === false){
			return false;
		}
		isDoing = true;
		$loginBtn.html('登　录　中...');
		ppLib.postEx(PPG.apiBaseUrl+'appmarket/login.do?action=login', data, function(json){
			isDoing = false;
			$loginBtn.html('登　录');
			//console.log(json);
			if(json.errorCode == 0){ //登录成功
				var enterUrl = (ppLib.cookie.get('usertype') == '0') ? '/cp/' : '/sp/';
				var typeStr = (ppLib.cookie.get('usertype') == '0') ? '[广告主]' : '[渠道商]';
				$loginedBox.html(template('tpl-logined-box',{
					'userName': ppLib.cookie.get('username') + ' ' + typeStr,
					'enterUrl': enterUrl
				}));
				$unLoginedBox.fadeOut('fast');
				$loginedBox.fadeIn('fast');
				//alert('登录成功~');
			}else if(json.errorCode == 1){
				$errTips.html('用户名不存在');
			}else if(json.errorCode == 2){
				$errTips.html('密码不正确');
			}else if(json.errorCode == 3){
				$errTips.html('类型不正确');
			}else if(json.errorCode == 4){
				$errTips.html('验证码不正确');
			}else if(json.errorCode == 9999){
				$errTips.html('登录超时，请重试');
			}else{
				$errTips.html('登录失败，请重试');
			}
		});
		return false;
	});
})();




//注册
;(function(){
	var $regUsernameInput = $('#reg-username-input');
	var $regPwdInput = $('#reg-pwd-input');
	var $regCheckPwdInput = $('#reg-check-pwd-input');
	var $regEmailInput = $('#reg-email-input');
	var $regType = $('#reg-type');
	var $regVcodeInput = $('#reg-vcode-input');
	var $regBtn = $('#reg-btn');

	function getFormValue(){
		var data = {};
		var userName = ppFun.checkData($regUsernameInput, 'textInput', true);
		if(userName === false){
			return false;
		}
		var pwd = $regPwdInput.val();
		if(pwd == ''){
			$regPwdInput.focus();
			return false;
		}
		var checkPwd = $regCheckPwdInput.val();
		if(checkPwd == ''){
			$regCheckPwdInput.focus();
			return false;
		}
		if(pwd != checkPwd){
			alert('两次输入的密码不一致');
			return false;
		}
		var email = ppFun.checkData($regEmailInput, 'textInput', true);
		if(email === false){
			return false;
		}
		var type = $regType.find('.item_selected').data('val');
		var vCode = ppFun.checkData($regVcodeInput, 'textInput', true);
		if(vCode === false){
			return false;
		}

		data.userName = userName;
		data.password = hex_md5(pwd);
		data.email = email;
		data.type = type;
		data.vCode = vCode;

		return data;
	}

	var isDoing = false;
	$regBtn.click(function(){
		if(isDoing){
			return false;
		}
		var data = getFormValue();
		if(data === false){
			return false;
		}
		isDoing = true;
		$regBtn.html('注　册　中...');
		ppLib.postEx(PPG.apiBaseUrl+'appmarket/register.do?action=register', data, function(json){
			isDoing = false;
			$regBtn.html('注　册');
			if(json.errorCode == 0){ //登录成功
				alert('注册成功~');
			}else if(json.errorCode == 1){

			}else if(json.errorCode == 2){

			}else if(json.errorCode == 3){
				alert('该用户已经注册~');
			}else if(json.errorCode == 4){

			}else if(json.errorCode == 9999){
				alert('注册超时，请重试~');
			}else{
				alert('注册失败，请重试~');
			}
		});
		return false;
	});
})();