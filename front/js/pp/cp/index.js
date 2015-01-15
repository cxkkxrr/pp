;(function(){
	var $myProductList = $('#my-product-list');
	var $moneyTotal = $('#money-total');
	var $moneyNoBalance = $('#money-no-balance');

	$myProductList.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxxx.do?callback=?', {}, function(json){
		var htmlList = [];
		for(var i = 0; i < 6; i++){
			htmlList.push('<div class="item"><p class="p_logo"><a href="productdetail.html" target="_blank"><img src="/images/32x32.jpg" width="48" height="48"></a></p><p class="p_name"><a href="productdetail.html" target="_blank">微信</a></p></div>');
		}
		$myProductList.hide().html(htmlList.join('')).fadeIn('slow');
		$moneyTotal.hide().html('<em>￥</em>888888').fadeIn('slow');
		$moneyNoBalance.hide().html('<em>￥</em>12345').fadeIn('slow');
	});
})();

;(function(){
	var isSubmiting = false;
	function doSubmit(val, $submitBtn){
		if(isSubmiting){
			return false;
		}
		$submitBtn.html('发布中...');
		isSubmiting = true;
		ppLib.postEx(PPG.apiBaseUrl + 'xxx.do', {'value':val}, function(json){
			$submitBtn.html('发布');
			isSubmiting = false;
			//alert(json.rtn);
			ppLib.alertWindow.show({
				'content': '<p class="bigger">发布成功！</p><p>发布成功，等待审核</p>',
				'button' : '<a href="javascript:;" class="pop_btn pop_btn_red closeBtn">确定</a>'
			});
		});
	}
	$('.release_notice_btn').click(function(event) {
		ppLib.alertWindow.show({
			'title': '发布公告',
			'content': '<p><textarea id="notice-content" style="width:330px;height:100px;resize:none;"></textarea></p>',
			'button' : '<a href="javascript:;" id="notice-submit-btn" class="pop_btn pop_btn_red">发布</a><a href="javascript:;" class="pop_btn pop_btn_grey closeBtn">关闭</a>'
		});
		$('#notice-submit-btn').click(function(event) {
			var $noticeContent = $('#notice-content');
			var val = $.trim($noticeContent.val());
			if(!val){
				$noticeContent.focus();
				return false;
			}
			doSubmit(val, $(this));
			return false;
		});
		return false;
	});
})();

;(function () {
	function setChart(c){
		var $box = $('#'+c.boxId);
		if($box.attr('isset') == '1'){
			return;
		}
		$box.attr('isset','1').highcharts({
			colors: ['#ffb440'],
			chart: {backgroundColor:'#efefef'},
			credits: {enabled: false},
			exporting: {enabled: false},
			title: {text: null},
			subtitle: {text: null},
			legend: {enabled: false},
			yAxis: {gridLineWidth:0,title: {text: null},labels:{enabled: false}},
			//plotOptions: {line: {dataLabels: {enabled: true},enableMouseTracking: false}},
			tooltip: {headerFormat:'{point.y}',pointFormat: '',hideDelay:0},
			xAxis: {categories: c.categories},
			series: [{data: c.data}]
		});
	}
	/*setChart({
		boxId: 'chart_1',
		categories: ['13', '14', '15', '16', '17', '18','19'],
		data: [807.0, 725.2, 945.5, 814.5, 825.2, 721.5, 925.2]
	});
	setChart({
		boxId: 'chart_2',
		categories: ['13', '14', '15', '16', '17', '18','19'],
		data: [407.0, 425.2, 745.5, 814.5, 925.2, 321.5, 225.2]
	});
	setChart({
		boxId: 'chart_3',
		categories: ['13', '14', '15', '16', '17', '18','19'],
		data: [8007.0, 7205.2, 9045.5, 8014.5, 8205.2, 7201.5, 9205.2]
	});*/



	var $scrollList = $('#scroll-list');
	var $scrollPre = $('#scroll-pre');
	var $scrollNext = $('#scroll-next');
	var totalCount = 0;
	var sWidth = 243;
	var isScrolling = false;
	var marginLeft = 0;
	var curIdx = 1;
	
	$scrollList.html('查询中...');
	ppLib.getJSONEx(PPG.apiBaseUrl + 'xxx.do?callback=?', {}, function(json){
		totalCount = 10;
		var htmlList = [];
		for(var i = 0; i < totalCount; i++){
			htmlList.push('<li class="chart_item"><div class="chart" id="chart_id_'+i+'"></div><div class="p_name"><a href="packagedetail.html" target="_blank"><img src="/images/32x32.jpg" width="48" height="48"> 微信 包号01'+i+'</a></div></li>');
		}
		$scrollList.css({'width':(sWidth*totalCount+100)+'px'}).hide().html(htmlList.join('')).fadeIn('slow');
		if(totalCount > 3){
			$scrollNext.show();
		}
		var firstShow = totalCount > 3 ? 3 : totalCount;
		for(var i = 0; i < firstShow; i++){
			setChart({
				boxId: 'chart_id_'+i,
				categories: ['13', '14', '15', '16', '17', '18','19'],
				data: [8007.0, 7205.2, 9045.5, 8014.5, 8205.2, 7201.5, 9205.2]
			});
		}
	});


	function move(marginLeft){
		if(curIdx >= totalCount-2){
			$scrollNext.hide();
		}else{
			$scrollNext.show();
		}
		if(curIdx <= 1){
			$scrollPre.hide();
		}else{
			$scrollPre.show();
		}
		$scrollList.animate({'margin-left':marginLeft+'px'}, function(){
			isScrolling = false;
			setChart({
				boxId: 'chart_id_'+(curIdx+1),
				categories: ['13', '14', '15', '16', '17', '18','19'],
				data: [8007.0, 7205.2, 9045.5, 8014.5, 8205.2, 7201.5, 9205.2]
			});
		});
	}
	$scrollNext.click(function(){
		if(isScrolling){
			return false;
		}
		isScrolling = true;
		marginLeft -= sWidth;
		curIdx++;
		move(marginLeft);
	});
	$scrollPre.click(function(){
		if(isScrolling){
			return false;
		}
		isScrolling = true;
		marginLeft += sWidth;
		curIdx--;
		move(marginLeft);
	});
})();