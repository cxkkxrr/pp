;(function(){
	ppFun.checkData = function($obj, type, isErrFocus){
		if(type == 'textInput'){ //普通文本
			var value = $.trim($obj.val());
			if(!value){
				isErrFocus && $obj.focus();
				return false;
			}else{
				return value;
			}

		}else if(type == 'gt0numberInput'){ //大于0的数字(可以为小数)
			var value = $.trim($obj.val());
			if($.isNumeric(value) && (parseFloat(value) > 0)){
				return value;
			}else{
				isErrFocus && $obj.focus();
				return false;
			}

		}else if(type == 'selbtn'){ //选择框组件
			var value = $obj.ppGetSelectorValue().join(',');
			if(!value){
				isErrFocus && $(window).scrollTop($obj.offset().top);
				return false;
			}else{
				return value;
			}
		}
	}
})();