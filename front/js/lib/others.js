//依赖jquery
/**
* 获取字符串长度，中文认为占用两个字符长度
* @returns {Number} 字符串长度
* @example
* var str = '哈哈哈哈aaa';
* str.size(); // returns 11
*/
String.prototype.size = function(){
	return this.replace(/[^\u0000-\u00FF]/gmi, "**").length;
};


/**
* 将 "好长一段字，罗哩罗嗦的" 变成 "好长一段字，罗..."
* @param {number} len 希望返回的字符长度
* @param {boolean} [needDotDotDot=true] 选填，默认true，是否需要“...”（占3个字符）
* @returns {String} 截断的字符串
* @example
* var str = '哈哈a哈哈b';
* str.fixLen(5); // returns "哈..."
* str.fixLen(5,false); // returns "哈哈a"
*/
String.prototype.fixLen = function(len, needDotDotDot){
	if( this.replace(/[^\u0000-\u00FF]/gmi, "**").length <= len ){
		return this.toString();
	}
	var cursor_en = 0,
	cursor = 0;
	needDotDotDot = needDotDotDot==undefined ? true : needDotDotDot;
	var dotLen = needDotDotDot ? 3 : 0;
	for (var cursor = 0; cursor < this.length; cursor++){
		(this.charCodeAt(cursor) > 255) ? cursor_en+=2 : cursor_en++;
		if (cursor_en > len-dotLen){
			break;
		}
	}
	return this.substring(0, cursor)+(needDotDotDot ? '...' : '');
};




/**
* 刷新当前页面模块(避免location.reload引起form重复提交)
* @name $.reloadLocation
* @function
* @example
* $.reloadLocation();
*/
;(function($){
	$.extend(ppLib, {"reloadLocation":function(){
		var hash = location.hash;
		var loc = location.href.replace(hash,"");
		if(loc.indexOf("?") >= 0){
			if(loc.match(/relTime=[^&]*/) != null){
				location.href = loc.replace(/relTime=[^&]*/,"relTime="+new Date().getTime())+hash;
			}else{
				location.href = loc + "&relTime="+new Date().getTime()+hash;
			}
		}else{
			location.href = loc + "?relTime="+new Date().getTime()+hash;
		}
	}})
})(jQuery);



/**
* 模拟window.open，防止window.open被浏览器拦截。目前无法解决异步情况(所有浏览器)下的拦截
* @name $.windowopen
* @function
* @param {String} url
* @param {String} target
* @example
* $.windowopen('http://www.pushpie.com/', '_blank');
* $.windowopen('http://www.pushpie.com/', '_self');
*/
;(function($){
	$.extend(ppLib, {"windowOpen": function(url, target){
		var a = document.createElement("a");
		a.setAttribute("href", url);
		if(target == null){
			target = '';
		}
		a.setAttribute("target", target);
		//a.setAttribute("id", "windowopen_" + (new Date()).getTime() + Math.ceil((Math.random()*100000)));
		document.body.appendChild(a);
		if(a.click){
			a.click();
		}else{
			try{
				var evt = document.createEvent('Event');
				a.initEvent('click', true, true);
				a.dispatchEvent(evt);
			}catch(e){
				window.open(url);
			}
		}
		document.body.removeChild(a);
	}});
})(jQuery);


/**
* 获取url的参数
* @name $.getUrlParam
* @function
* @param {String} [name] 不传值则返回所有参数组成的object
* @param {String} [url] 需要解析的链接，不填默认是location.href
* @returns {String|Object}
* @example
* $.getUrlParam('name'); //返回name对应的参数值
* $.getUrlParam(); //返回所有参数组成的object
*/
;(function($){
	$.extend(ppLib, {"getUrlParam":function(name, url){
		var str = (url || location.href),index = str.indexOf('?'),n,arr,returnOobj={};
		if(index!=-1){
			str = str.substring(index+1);
			arr = str.split('#')[0].split('&');
		}else{
			arr=[];
		}
		for(n=0;n<arr.length;++n){
			arr[n] = arr[n].split('=');
			returnOobj[arr[n][0]] = returnOobj[arr[n][0].toLowerCase()]= arr[n][1];
		}
		if(name){
			return returnOobj[name];
		}else{
			return returnOobj;
		}
	}});
})(jQuery);



/**
* 收藏网页
* @name $.bookMark
* @function
* @param {String} title 收藏网页的名称
* @param {String} url 收藏网页的链接
* @param {Function} [noSupportHandler] 浏览器不支持收藏时需要执行的动作。默认：alert('您的浏览器暂不支持此功能，请Ctrl+D手动收藏~~');
* @example
* $.bookMark('牛X页游平台', 'http://www.pushpie.com/', function(){$('#tips').html('浏览器不支持收藏').show();});
*/
;(function($){
	$.extend(ppLib, {"bookMark": function(title, url, noSupportHandler) {
		var needAlertTips = false;
		if(document.all && window.external) {
			try{
				window.external.addFavorite(url, title);
			}catch(e){
				try{
					window.external.addToFavoritesBar(url, title);  //IE8
				}catch(e){
					needAlertTips = true;
				}
			}
		}else if(window.sidebar) {
			try{
				window.sidebar.addPanel(title, url, "");
			}catch(e){
				needAlertTips = true;
			}
		}else{
			needAlertTips = true;
		}
		if(needAlertTips){
			if(typeof(noSupportHandler) == 'function'){
				noSupportHandler();
			}else{
				alert('您的浏览器暂不支持此功能，请Ctrl+D手动收藏~~');
			}
		}
	}});
})(jQuery);

/**
* 获取url的参数
* 使用实例：
*	<a href="javascript:;" onclick="$.setHome(this,window.location);return false;" target="_self">设为首页</a>
*/

/**
* 设为首页
* @name $.setHome
* @function
* @param {dom} obj 收藏网页的名称
* @param {String} url 设为首页的链接
* @example
* &lt;a href="javascript:;" onclick="$.setHome(this,window.location);return false;" target="_self"&gt;设为首页&lt;/a&gt;
*/
;(function($){
	$.extend(ppLib, {"setHome": function(obj, url){
		try{
			obj.style.behavior='url(#default#homepage)';obj.setHomePage(url);
		}
		catch(e){
			if(window.netscape){
				try{
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
				}catch (e){
					alert("抱歉！您的浏览器不支持直接设为首页。请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为“true”，点击“加入收藏”后忽略安全提示，即可设置成功。");
				}
				try{
					var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
					prefs.setCharPref('browser.startup.homepage',url);
				}catch (e){}
			}else{  
				alert('抱歉，您的浏览器不支持自动设置首页, 请使用浏览器菜单手动设置!');
			}
		}
	}});
})(jQuery);


/**
* 防止IE6背景图片不缓存，重复加载图片
*/
try {
	document.execCommand('BackgroundImageCache', false, true);
} catch(e){};


/**
* 创建一个js class
* @namespace
*/
var Class = {
	/**
	* 创建一个js class
	* @example
	* var MyClass = Class.create();
	* MyClass.prototype = {
	*	//构造函数
	*	initialize: function(){}
	* }
	* var myClass = new MyClass(); //自动执行initialize
	*/
	create:function(){
		return function(){
			this.initialize.apply(this,arguments);
		};
	}
};