/**
* 扩展的具有"跨域"、"超时报错"能力的jQuery post，超时后会自动调用回调函数，参数为{errorCode:9999}。需要通过一个代理页跨域。
* @name $.postEx
* @function
* @param {String} url
* @param {Object} params 入参
* @param {function} callback 回调函数,如果json.errorCode==9999表示超时
* @param {Number} [timeout=20000] 超时时长(毫秒)
* @param {String} [proxyUrl=http://www.pushpie.com/postProxy.html] 代理页的链接
* @param {String} [cmdId] callback回调函数的第二个参数
* @param {String} [documentDomain]
* @example
* $.postEx("http://api.pushpie.com/xx.do", {"userId":"138996301","pageNo":1}, function(json){alert("回调函数")}, 20000);
*/
;(function(){
	ppLib.postEx = function(url,params,callback,timeout,proxyUrl,cmdId,documentDomain){
		proxyUrl = proxyUrl || PPG.baseUrl + "postProxy.html";
		var requestType = Math.floor(Math.random()*10000000);
		var httpFrameDiv = document.createElement("div");
		httpFrameDiv.id = "httpFrameDiv"+requestType;
		httpFrameDiv.style.display = "none";
		document.body.appendChild(httpFrameDiv);
		
		var httpFormDiv = document.createElement("div");
		httpFormDiv.style.display = "none";
		httpFormDiv.id = "httpFormDiv"+requestType;
		document.body.appendChild(httpFormDiv);
		
		if(timeout == null){
			timeout = 20000;
		}
		
		httpFrameDiv.innerHTML = "<iframe id='iframe"+requestType+"' name='iframe"+requestType+"'></iframe>";

		url += (url.indexOf('?') == -1 ? "?" : "&") + "_=" + requestType;
		var htmlStrArr = ["<form action='"+url+"' id='form"+requestType+"' name='form"+requestType+"' method='post' target='iframe"+requestType+"'>"];
		htmlStrArr.push("<input id='requestType' name='requestType' type='text' value='"+requestType+"'></input>");
		if(documentDomain != null){
			htmlStrArr.push("<input id='documentDomain' name='documentDomain' type='text' value='"+documentDomain+"'></input>");
		}else{
			if(document.domain != location.host){
				htmlStrArr.push("<input id='documentDomain' name='documentDomain' type='text' value='"+document.domain+"'></input>");
			}
		}
		htmlStrArr.push("<input id='proxyUrl' name='proxyUrl' type='text' value='"+proxyUrl+"'></input>");
		
		htmlStrArr.push("</form>");
		httpFormDiv.innerHTML = htmlStrArr.join("");
		
		var form = document.getElementById("form"+requestType);
		for(var prop in params){
			var propValue = params[prop]!=null?params[prop]:"";
			
			if(typeof propValue == "string"){
				var ta = document.createElement('textarea');
				ta.id = prop;
				ta.name = prop;
				ta.value = propValue;
				form.appendChild(ta);
			}else{
				var input = document.createElement('input');
				input.type = 'text';
				input.id = prop;
				input.name = prop;
				input.value = propValue;
				form.appendChild(input);
			}
		}
		
		var requestBeginTime = new Date().getTime();
		var isTimeOuted = true;
		window["callback"+requestType] = function(data){
			isTimeOuted = false;
			if(cmdId == null){
				if(callback) callback(data);
			}else{
				if(callback) callback(data,cmdId);
			}
		};
		setTimeout(function(){
			if(isTimeOuted){
				if(cmdId == null){
					if(callback) callback({errorCode:9999});
				}else{
					if(callback) callback({errorCode:9999},cmdId);
				}
			}
			if(window["callback"+requestType] != null){
				window["callback"+requestType] = null;
			}
			if(document.getElementById("httpFrameDiv"+requestType) != null){
				document.body.removeChild(document.getElementById("httpFrameDiv"+requestType));
			}
			if(document.getElementById("httpFormDiv"+requestType) != null){
				document.body.removeChild(document.getElementById("httpFormDiv"+requestType));
			}
		},timeout);
		document.getElementById("form"+requestType).submit();
	};
})();