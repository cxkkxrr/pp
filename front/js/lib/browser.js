
/**
* 判断 浏览器/操作系统 类型，使用实例：$.pp.browser.isIE7
* @name $.pp.browser
* @namespace 
* @requires jQuery
* @property {Boolean} isStrict
* @property {String} docMode
* @property {Boolean} isOpera
* @property {Boolean} isOpera10_5
* @property {Boolean} isChrome
* @property {Boolean} isWebKit
* @property {Boolean} isSafari
* @property {Boolean} isSafari2
* @property {Boolean} isSafari3
* @property {Boolean} isSafari4
* @property {Boolean} isSafari5_0
* @property {Boolean} isSafari5
* @property {Boolean} isIE
* @property {Boolean} isIE7
* @property {Boolean} isIE8
* @property {Boolean} isIE9
* @property {Boolean} isIE6
* @property {Boolean} isGecko
* @property {Boolean} isGecko3
* @property {Boolean} isGecko4
* @property {Boolean} isGecko5
* @property {Boolean} isGecko10
* @property {Boolean} isFF3_0
* @property {Boolean} isFF3_5
* @property {Boolean} isFF3_6
* @property {Boolean} isWindows
* @property {Boolean} isMac
* @property {Boolean} isLinux
* @property {Number} chromeVersion
* @property {Number} firefoxVersion
* @property {Number} ieVersion
* @property {Number} operaVersion
* @property {Number} safariVersion
* @property {Number} webKitVersion
* @property {Boolean} isSecure
* @property {Boolean} isSecure
*/
/**
* 获取浏览器/操作系统类型
* @name $.pp.browser.get
* @function
* @param {String} type "browser" or "platform"
* @reutrns {String}
* @example
* $.pp.browser.get('browser'); // 如果23版本的chrome，则返回"chrome_23"
* $.pp.browser.get('platform'); // 如果windows，则返回"windows"
*/
;(function($){
	$.extend(ppLib, {
		"browser":(function(){
			var userAgent = navigator.userAgent.toLowerCase(),
			check = function(regex){
				return regex.test(userAgent);
			},
			version = function (is, regex) {
				var m;
				return (is && (m = regex.exec(userAgent))) ? parseFloat(m[1]) : 0;
			},
			isStrict = document.compatMode == "CSS1Compat",
			docMode = document.documentMode,
			isOpera = check(/opera/),
			isOpera10_5 = isOpera && check(/version\/10\.5/),
			isChrome = check(/\bchrome\b/),
			isWebKit = check(/webkit/),
			isSafari = !isChrome && check(/safari/),
			isSafari2 = isSafari && check(/applewebkit\/4/), 
			isSafari3 = isSafari && check(/version\/3/),
			isSafari4 = isSafari && check(/version\/4/),
			isSafari5_0 = isSafari && check(/version\/5\.0/),
			isSafari5 = isSafari && check(/version\/5/),
			isIE = !isOpera && check(/msie/),
			isIE7 = isIE && ((check(/msie 7/) && docMode != 8 && docMode != 9) || docMode == 7),
			isIE8 = isIE && ((check(/msie 8/) && docMode != 7 && docMode != 9) || docMode == 8),
			isIE9 = isIE && ((check(/msie 9/) && docMode != 7 && docMode != 8) || docMode == 9),
			isIE6 = isIE && check(/msie 6/),
			isGecko = !isWebKit && check(/gecko/),
			isGecko3 = isGecko && check(/rv:1\.9/),
			isGecko4 = isGecko && check(/rv:2\.0/),
			isGecko5 = isGecko && check(/rv:5\./),
			isGecko10 = isGecko && check(/rv:10\./),
			isFF3_0 = isGecko3 && check(/rv:1\.9\.0/),
			isFF3_5 = isGecko3 && check(/rv:1\.9\.1/),
			isFF3_6 = isGecko3 && check(/rv:1\.9\.2/),
			isWindows = check(/windows|win32/),
			isMac = check(/macintosh|mac os x/),
			isLinux = check(/linux/),
			chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
			firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
			ieVersion = version(isIE, /msie (\d+\.\d+)/),
			operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
			safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
			webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
			isSecure = /^https/i.test(window.location.protocol);
			return {
				'isStrict': isStrict,
				'isIEQuirks': isIE && !isStrict,
				'isOpera': isOpera,
				'isOpera10_5': isOpera10_5,
				'isWebKit': isWebKit,
				'isChrome': isChrome,
				'isSafari': isSafari,
				'isSafari3': isSafari3,
				'isSafari4': isSafari4,
				'isSafari5': isSafari5,
				'isSafari5_0': isSafari5_0,
				'isSafari2': isSafari2,
				'isIE': isIE,
				'isIE6': isIE6,
				'isIE7': isIE7,
				'isIE8': isIE8,
				'isIE9': isIE9,
				'isGecko': isGecko,
				'isGecko3': isGecko3,
				'isGecko4': isGecko4,
				'isGecko5': isGecko5,
				'isGecko10': isGecko10,
				'isFF3_0': isFF3_0,
				'isFF3_5': isFF3_5,
				'isFF3_6': isFF3_6,
				'isFF4': 4 <= firefoxVersion && firefoxVersion < 5,
				'isFF5': 5 <= firefoxVersion && firefoxVersion < 6,
				'isFF10': 10 <= firefoxVersion && firefoxVersion < 11,
				'isLinux': isLinux,
				'isWindows': isWindows,
				'isMac': isMac,
				'chromeVersion': chromeVersion,
				'firefoxVersion': firefoxVersion,
				'ieVersion': ieVersion,
				'operaVersion': operaVersion,
				'safariVersion': safariVersion,
				'webKitVersion': webKitVersion,
				'isSecure': isSecure,
				'get': function(type){
					var b = '';
					if(type == 'browser'){
						if(isOpera){
							b = 'opera_' + operaVersion;
						}else if(isChrome){
							b = 'chrome_' + chromeVersion;
						}else if(isSafari){
							b = 'safari_' + safariVersion;
						}else if(isIE){
							b = 'ie_' + ieVersion;
						}else if(isGecko){
							b = 'gecko_' + firefoxVersion;
						}else{
							b = 'others';
						}
					}else if(type == 'platform'){
						if(isLinux){
							b = 'linux';
						}else if(isWindows){
							b = 'windows';
						}else if(isMac){
							b = 'mac';
						}else{
							b = 'others';
						}
					}
					return b;
				}
			};
		})()
	});
})(jQuery);