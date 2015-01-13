ppClass.Page = function(config){
	config = config || {};
	var _curPage = 1;
	var _totalPage = 0;
	var _$pageBox = $(config.pageBox);
	var _isLoading = false;

	function _setEvent(){
		_$pageBox.on('click', '.pre,.num,.next', function(){
			if(_isLoading){
				return false;
			}
			var num = $(this).data('num');
			if(!!num){
				_curPage = parseInt(num, 10);
				_curPage = _curPage < 1 ? 1 : _curPage;
				_curPage = _curPage > _totalPage ? _totalPage : _curPage;
				_isLoading = true;
				_$pageBox.find('.loading').show();
				(typeof(config.changeHandler) == 'function') && config.changeHandler(_curPage);
			}
			return false;
		});
	}

	this.refresh = function(curPage, totalPage){
		_isLoading = false;

		_curPage = curPage || _curPage;
		_totalPage = totalPage || _totalPage;

		if(_totalPage <= 1){
			_$pageBox.hide().html('');
			return;
		}

		var htmlList = [];
		if(_curPage > 1){
			htmlList.push('<a href="javascript:;" class="icon pre" data-num="' + (_curPage - 1) + '"></a>');
		}else{
			htmlList.push('<a href="javascript:;" class="icon pre pre_dis"></a>');
		}

		for(var i = 1; i <= _totalPage; i++){
			if(i != _curPage){
				htmlList.push('<a href="javascript:;" class="num" data-num="' + i + '">' + i + '</a>');
			}else{
				htmlList.push('<a href="javascript:;" class="num cur" data-num="' + i + '">' + i + '</a>');
			}
		}
		/*<span class="morepage">...</span>*/

		if(_curPage < _totalPage){
			htmlList.push('<a href="javascript:;" class="icon next" data-num="' + (_curPage + 1) + '"></a>');
		}else{
			htmlList.push('<a href="javascript:;" class="icon next next_dis"></a>');
		}
		htmlList.push('<span class="loading" style="display:none;">查询中...</span>');
		//console.log(htmlList)
		_$pageBox.html(htmlList.join('')).show();
	}

	this.hide = function(){
		_$pageBox.hide();
	}

	//this.refresh();
	_$pageBox.hide();
	_setEvent();
};