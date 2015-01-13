/**
* 将含有html等特殊字符转义(编码)
* @name $.html_encode
* @function
* @param {String} str 需要编码的字符串
* @reutrns {String} 编码后的字符串
* @example
* $.html_encode("&lt;p&gt;li&lt;/p&gt;");
*/
/**
* 将含有html等特殊字符转义(解码)
* @name $.html_decode
* @function
* @param {String} str 需要解码的字符串
* @reutrns {String} 解码后的字符串
* @example
* $.html_decode("&amp;lt;p&amp;gt;li&amp;lt;/p&amp;gt;");
*/
;(function($){
	$.extend(ppLib, {"htmlEncode":function(str) {
		var s = "";
		if (str==null || typeof(str)=='undefined' || str.length == 0) {return "";}
		s = str.replace(/&/g, "&amp;");
		s = s.replace(/</g, "&lt;");
		s = s.replace(/>/g, "&gt;");
		s = s.replace(/ /g, "&nbsp;");
		s = s.replace(/\'/g, "'");
		s = s.replace(/\"/g, "&quot;");
		//s = s.replace(/\n/g, "<br>");
		return s;
	},"htmlDecode":function(str){
		var s = "";
		if (str.length == 0) {return "";}
		s = str.replace(/&amp;/g, "&");
		s = s.replace(/&lt;/g, "<");
		s = s.replace(/&gt;/g, ">");
		s = s.replace(/&nbsp;/g, " ");
		s = s.replace(/'/g, "\'");
		s = s.replace(/&quot;/g, "\"");
		//s = s.replace(/<br>/g, "\n");
		return s;
	}});
})(jQuery);