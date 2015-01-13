
/**
* cookie操作模块
* @name $.pp.cookie
* @example
* $.pp.cookie.get(key); //读取cookie
* $.pp.cookie.remove(key, null); //删除cookie
* $.pp.cookie.set(key, value, {"expires":'forever',"domain":"pushpie.com","path":"/"}); //设置cookie
*/

;(function($){
	$.extend(ppLib, {
		"cookie": (function(){
			function get(key, raw){
				var result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie);
				if(!!result) {
					return !raw ? decodeURIComponent(result[1]) : result[1];
				} else {
					return '';
				}
			}
			function set(key, value, options){
				options = options || {};
				value = value===undefined ? '' : value;
				if (value === null) {
					value = '';
					options.expires = new Date(0);
				}

				if (typeof options.expires === 'number') {
					options.expires = options.expires + ' h';
				}
				if(typeof options.expires === 'string' && options.expires != 'forever') {
					//计时cookie ,根据开发者输入的尾缀定单位
					var t = parseInt(options.expires),
						suffix = options.expires[options.expires.length -1],
						now = new Date();;
					if(suffix=="s"){
						now.setSeconds(now.getSeconds() + t);
					} else if(suffix=="m") {
						now.setMinutes(now.getMinutes() + t);
					} else if(suffix=="h") {
						now.setHours(now.getHours() + t);
					} else if(suffix=="d") {
						now.setDate(now.getDate() + t)
					} else if(suffix=="M") {
						now.setMonth(now.getMonth() + t);
					}
					options.expires = now;
				} else if(options.expires == 'forever') {
					options.expires = new Date(0xfffffffffff);
				}

				return (document.cookie = [
					encodeURIComponent(key), '=',
					options.raw ? String(value) : encodeURIComponent(String(value)),
					options.expires ? '; expires=' + options.expires.toGMTString() : '', // use expires attribute, max-age is not supported by IE
					options.path ? '; path=' + options.path : '; path=/',
					options.domain ? '; domain=' + options.domain : '; domain=.pushpie.com',
					options.secure ? '; secure' : ''
				].join(''));
			}
			function remove(key, options){
				set(key, null, options)
			}
			return {
				'get': get,
				'set': set,
				'remove': remove
			};
		})()
	});
})(jQuery);