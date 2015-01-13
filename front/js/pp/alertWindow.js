;ppLib.alertWindow = (function($, window){
	$(document.body).append('<div class="compopup" id="pp-popup-box" style="z-index:9999;top:50%;display:none;">\
			<div class="popupcont">\
				<div class="popup_head">\
					<h3 id="pp-popup-title">提示</h3>\
				</div>\
				<div class="multi_module">\
					<div class="cont_txt" style="width:320px;" id="pp-popup-content"></div>\
				</div>\
				<div class="popup_btnwrap" id="pp-popup-btn"></div>\
			</div>\
		</div>\
		<div id="pp-popup-cover" class="cover" style="position:fixed;_position:absolute;width:100%;top:0px;left:0px;z-index:9998;background:#000;display:none;"></div>');

	var $popBox = $('#pp-popup-box');
	var $popBox_title = $('#pp-popup-title');
	var $popBox_content = $('#pp-popup-content');
	var $popBox_btn = $('#pp-popup-btn');
	var $coverBox = $('#pp-popup-cover');
	var $wd = $(window);
	var popBoxHeight = 0;

	$popBox.on('click', '.closeBtn', function(){
		hide();
	});

	//居中
	function center(){
		var curTop = $wd.scrollTop() + (($wd.height() - popBoxHeight) / 2);
		$popBox.css({'top':curTop+'px','margin-top':'0px', 'position':'absolute'});
	}

	//隐藏
	function hide(){
		$popBox.hide();
		$coverBox.hide();
		$wd.unbind('scroll.ppPopUpModule');
	}

	//显示
	function show(config){
		config = config || {};
		$popBox_title.html(config.title || '提示');
		$popBox_content.html(config.content || '');
		$popBox_btn.html(config.button || '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">关闭</a>');
		
		$popBox.show();
		$coverBox.show().css({'opacity':0.5,'height':document.body.clientHeight+'px'});
		popBoxHeight = $popBox.height();

		//处理ie6和非ie6垂直居中
		if(ppLib.browser.isIE6){
			center();
			$wd.unbind('scroll.ppPopUpModule').bind('scroll.ppPopUpModule', function(){
				center();
			});
		}else{
			$popBox.css({'top':'50%','margin-top':'-'+(popBoxHeight/2)+'px'});
		}
	}

	return {
		'show': show,
		'hide': hide
	}
})(jQuery, window);