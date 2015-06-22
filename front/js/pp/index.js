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
		$loginBox.find('.verify_code_change').trigger('click');
		return false;
	});
	$regTab.click(function(){
		$loginTab.removeClass('cur');
		$regTab.addClass('cur');
		$loginBox.hide();
		$regBox.show();
		$regBox.find('.verify_code_change').trigger('click');
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
		$img.attr('src', 'http://api.pushpie.com/appmarket/authcode.do?_' + (new Date()).getTime() + Math.ceil(Math.random()*1000000));
	}
	$('.verify_code_change').click(function(){
		change($(this).find('img'));
		return false;
	});
})();

//登录
;(function(){
	if(ppLib.getUrlParam('dev') != '1'){
		return;
	}
	var $loginTab = $('#login-tab');
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
				$loginTab.trigger('click');
			}
		}, 7000);
	}else{
		$unLoginedBox.fadeIn('fast');
		$loginTab.trigger('click');
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
				$loginVcodeInput.val('');
				$loginBox.find('.verify_code_change').trigger('click');
			}else if(json.errorCode == 2){
				$errTips.html('密码不正确');
				$loginVcodeInput.val('');
				$loginBox.find('.verify_code_change').trigger('click');
			}else if(json.errorCode == 3){
				$errTips.html('验证码不正确');
				$loginVcodeInput.val('');
				$loginBox.find('.verify_code_change').trigger('click');
			}else if(json.errorCode == 4){
				$errTips.html('此帐号暂未激活，<a href="javascript:;" class="reSendEmail" style="color:#1b66c7;" data-username="'+data.userName+'" data-email="'+json.result+'">重发验证邮件</a>');
				$loginVcodeInput.val('');
				$loginBox.find('.verify_code_change').trigger('click');
			}else if(json.errorCode == 9999){
				$errTips.html('登录超时，请重试');
				$loginVcodeInput.val('');
				$loginBox.find('.verify_code_change').trigger('click');
			}else{
				$errTips.html('登录失败，请重试');
				$loginVcodeInput.val('');
				$loginBox.find('.verify_code_change').trigger('click');
			}
		});
		return false;
	});
})();




//注册
;(function(){
	var $regBox = $('#reg-box');
	var $regUsernameInput = $('#reg-username-input');
	var $regPwdInput = $('#reg-pwd-input');
	var $regCheckPwdInput = $('#reg-check-pwd-input');
	var $regEmailInput = $('#reg-email-input');
	var $regType = $('#reg-type');
	var $regVcodeInput = $('#reg-vcode-input');
	var $regBtn = $('#reg-btn');
	var $unLoginedBox = $('#un-login-box');
	var $loginedBox = $('#logined-box');
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
		//todo
		ppLib.postEx(PPG.apiBaseUrl+'appmarket/register.do?action=register', data, function(json){
			isDoing = false;
			$regBtn.html('注　册');
			if(json.errorCode == 0){ //登录成功
				alert('注册成功，请激活邮箱~');
				$loginedBox.html(template('tpl-logined-send-mail',{
					'userName': data.userName,
					'email': data.email
				}));
				$unLoginedBox.fadeOut('fast');
				$loginedBox.fadeIn('fast');
			}else if(json.errorCode == 2){
				alert('该用户名已经注册了~');
				$regVcodeInput.val('');
				$regBox.find('.verify_code_change').trigger('click');
			}else if(json.errorCode == 3){
				alert('该邮箱已经注册了~');
				$regVcodeInput.val('');
				$regBox.find('.verify_code_change').trigger('click');
			}else if(json.errorCode == 9999){
				alert('注册超时，请重试~');
				$regVcodeInput.val('');
				$regBox.find('.verify_code_change').trigger('click');
			}else{
				alert('注册失败，请重试~');
				$regVcodeInput.val('');
				$regBox.find('.verify_code_change').trigger('click');
			}
		});
		return false;
	});
})();

//重发邮件
;(function(){
	var $unLoginedBox = $('#un-login-box');
	var $loginedBox = $('#logined-box');
	var isLoading = false;
	$('#banner').on('click', '.reSendEmail', function(){
		if(isLoading){
			return false;
		}
		var $this = $(this);
		var userName = $this.data('username');
		var email = $this.data('email');
		isLoading = true;
		var orignHtml = $this.html();
		$this.html('发送中...');
		ppLib.postEx(PPG.apiBaseUrl+'appmarket/register.do?action=resendEmail', {'userName':userName, 'email':email}, function(json){
			isLoading = false;
			if(json.errorCode == 0){ //登录成功
				alert('激活邮件发送成功~');
				$loginedBox.html(template('tpl-logined-send-mail',{
					'userName': userName,
					'email': email
				}));
				$unLoginedBox.fadeOut('fast');
				$loginedBox.fadeIn('fast');
			}else if(json.errorCode == 3){
				alert('邮箱已经激活了，请重新登录~');
				location.reload();
			}else{
				alert('激活邮件发送失败，请重试~');
				$this.html(orignHtml);
			}
		});
		return false;
	});
})();

//修改邮箱
;(function(){
	var $unLoginedBox = $('#un-login-box');
	var $loginedBox = $('#logined-box');
	$('#banner').on('click', '.changeEmail', function(){
		var $this = $(this);
		var email = $this.data('email');
		var userName = $this.data('username');
		ppLib.alertWindow.show({
			'title': '更换邮箱地址',
			'content': '<p>用户名：'+userName+'</p><p style="margin-top:10px;">旧邮箱：'+email+'</p><p style="margin-top:10px;">新邮箱：<input type="text" id="changeEmail_newEmail" class="intxt" style="height:25px;" /></p><p style="margin-top:10px;">密　码：<input type="password" id="changeEmail_password" class="intxt" style="height:25px;" /></p>',
			'button' : '<a href="javascript:;" class="pop_btn pop_btn_red" id="real-change-emain-btn">确定更换</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">取消</a>'
		});
		var $newEmailInput = $('#changeEmail_newEmail');
		var $passwordInput = $('#changeEmail_password');
		var $realChangeEmainBtn = $('#real-change-emain-btn');
		var isLoading = false;
		$realChangeEmainBtn.unbind('click').bind('click', function(){
			if(isLoading){
				return false;
			}
			var newEmailVal = $.trim($newEmailInput.val());
			var passwordVal = $passwordInput.val();
			if(!newEmailVal){
				alert('请输入新邮箱');
				return false;
			}
			if(newEmailVal == email){
				alert('新邮箱不能和旧邮箱相同');
				return false;
			}
			if(!passwordVal){
				alert('请输入密码');
				return false;
			}
			$realChangeEmainBtn.html('更换中...');
			isLoading = true;
			ppLib.postEx(PPG.apiBaseUrl+'appmarket/register.do?action=changeEmail', {'userName':userName, 'password':hex_md5(passwordVal), 'email':newEmailVal}, function(json){
				isLoading = false;
				$realChangeEmainBtn.html('确定更换');
				if(json.errorCode == 0){ //登录成功
					alert('更换成功，我们已经向您的新邮箱'+newEmailVal+'发送了一封激活邮件，请点击邮件中的链接完成注册！');
					$loginedBox.html(template('tpl-logined-send-mail',{
						'userName': userName,
						'email': newEmailVal
					}));
					$unLoginedBox.fadeOut('fast');
					$loginedBox.fadeIn('fast');
					ppLib.alertWindow.hide()
				}else if(json.errorCode == 1){
					alert('邮箱格式不正确~');
				}else if(json.errorCode == 3){
					alert('密码不正确~');
					$passwordInput.val('');
				}else if(json.errorCode == 4){
					alert('旧邮箱已经激活绑定，无法更换~');
				}else if(json.errorCode == 6){
					alert('邮箱已经被其他人注册~');
				}else{
					alert('更换失败，请重试~');
					$passwordInput.val('');
				}
			});
			return false;
		});
		return false;
	});
})();