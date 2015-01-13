/**
* 扩展的具有请求超时报错能力的jQuery getJSON，超时后会自动调用回调函数，参数为{errorCode:9999}
* @name $.getJSONEx
* @function
* @param {String} url
* @param {Object} params 入参
* @param {function} callback 回调函数,如果json.errorCode==9999表示超时
* @param {Number} [timeout=20000] 超时时长(毫秒)
* @param {String} [cmdId] callback回调函数的第二个参数
* @param {String} [uniqueLoadId] 唯一请求id，多次相同的uniqueLoadId请求，只返回最后一次请求结果，其他的抛弃掉
* @example
* $.getJSONEx("http://api.pushpie.com/product/gettimerproduct.do?callback=?", {"pids":"2_3"}, function(json){alert("回调函数")}, 10000);
*/
;(function(){
	var getJSONEx_data = {};//用于抛弃历史请求
	ppLib.getJSONEx = function(url, params, callback, timeout, cmdId, uniqueLoadId){
		var curIndex;
		var isAlreadyTimeout = false;

		if(!!uniqueLoadId){
			!getJSONEx_data[uniqueLoadId] && (getJSONEx_data[uniqueLoadId] = 0);
			curIndex = ++getJSONEx_data[uniqueLoadId];
		}

		if(timeout == null){
			timeout = 20000;
		}

		var timeoutter = setTimeout(function(){
			isAlreadyTimeout = true;
			if(!!uniqueLoadId && (curIndex != getJSONEx_data[uniqueLoadId])){
				return; //抛弃历史请求
			}
			if(cmdId == null){
				if(callback) callback({'errorCode':9999});
			}else{
				if(callback) callback({'errorCode':9999},cmdId);
			}
		},timeout);

		$.getJSON(url, params, function(json){
			clearTimeout(timeoutter);
			if(isAlreadyTimeout){
				return; //已经超时callback过了，抛弃
			}
			if(!!uniqueLoadId && (curIndex != getJSONEx_data[uniqueLoadId])){
				return; //抛弃历史请求结果
			}
			if(cmdId == null){
				if(callback) callback(json);
			}else{
				if(callback) callback(json,cmdId);
			}
		});
	};
})();