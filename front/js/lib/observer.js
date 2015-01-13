/**
* 事件管理Object，基于jQuery事件机制
* @name PPEvent
* @namespace
*/
ppLib.observer = $('<div id="event_'+(new Date()).getTime()+Math.ceil(Math.random()*10000)+'"></div>');
/**
* 用于存储update后的数据
* @private
*/
ppLib.observer._eventData = {};
/**
* 添加一个事件处理程序
* @name ppLib.observer.listen
* @function
* @param {Object} eventType  事件名称(不支持命名空间)
* @param {Object} handler  每当事件触发时执行的函数
* @example
* ppLib.observer.listen('loadUserBonusInfo', function(event, json){alert(json.msg);});
*/
ppLib.observer.listen = function(eventType, handler){
	eventType = eventType.split('.')[0]; //过滤命名空间
	if(ppLib.observer._eventData[eventType] !== undefined){
		handler({type:eventType.split('.')[0]}, ppLib.observer._eventData[eventType].data);
	}
	return ppLib.observer.bind(eventType, null, handler);
}
/**
* 添加一个事件处理程序，最多执行一次
* @name ppLib.observer.listenOne
* @function
* @param {Object} eventType  事件名称(不支持命名空间)
* @param {Object} handler  事件触发时执行的函数
* @example
* ppLib.observer.listenOne('loadUserBonusInfo', function(event, json){alert(json.msg);});
*/
ppLib.observer.listenOne = function(eventType, handler){
	eventType = eventType.split('.')[0]; //过滤命名空间
	if(ppLib.observer._eventData[eventType] !== undefined){
		handler({type:eventType.split('.')[0]}, ppLib.observer._eventData[eventType].data);
		return ppLib.observer;
	}
	return ppLib.observer.one(eventType, null, handler);
}
/**
* 删除一个事件处理程序
* @name ppLib.observer.removeListen
* @function
* @param {Object} eventType  事件名称(不支持命名空间)
* @example
* ppLib.observer.removeListen('loadUserBonusInfo');
*/
ppLib.observer.removeListen = function(eventType){
	eventType = eventType.split('.')[0]; //过滤命名空间
	if(ppLib.observer._eventData[eventType] !== undefined){
		ppLib.observer._eventData[eventType] = undefined;
	}
	return ppLib.observer.unbind(eventType);
}
/**
* 根据绑定的事件类型执行所有的处理程序
* @name ppLib.observer.update
* @function
* @param {Object} eventType  事件名称(不支持命名空间)
* @param {Object} extraParameters  传递给事件处理程序的额外数组参数
* @example
* ppLib.observer.update('loadUserBonusInfo', {rtn:0, data:{a:1}});
*/
ppLib.observer.update = function(eventType, extraParameters){
	eventType = eventType.split('.')[0]; //过滤命名空间
	ppLib.observer._eventData[eventType] = {data:extraParameters};
	return ppLib.observer.trigger(eventType, extraParameters);
}