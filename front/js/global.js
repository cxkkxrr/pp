;(function(win){
	win.ppLib = {}; //业务无关的库namespace
	win.ppFun = {}; //业务相关的函数namespace
	win.ppClass = {}; //业务相关的类namespace
	template.config('openTag', '{%');
	template.config('closeTag', '%}');
	
	template.helper('convert2star', function (num) {
		num = parseInt(num || 0);
		var count = 5;
		var format = '';
		for(var i = 0; i < count; i++){
			if(i < num){
				format += '<span class="icon_star"></span>';
			}else{
				format += '<span class="icon_star_hui"></span>';
			}
		}
		return format;
	});

	template.helper('convertMsgType', function (id) {
		var typeStr = '';
		switch(id){
			case 1: typeStr = '系统消息'; break;
			case 2: typeStr = '下线通知'; break;

			case 11: typeStr = '上线通知'; break;
			case 12: typeStr = '加包请求'; break;

			case 21: typeStr = '加量通知'; break;
			case 22: typeStr = '广告主委托'; break;

			default: typeStr = '其他';
		}
		return typeStr;
	});
})(window);