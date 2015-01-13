;(function(){
	$('.select_single').on('click', '.selbtn', function(){
		var $this = $(this);
		if($this.hasClass('selbtn_selected') && ($this.parent().data('canempty') == '1')){
			$this.removeClass('selbtn_selected');
		}else{
			$this.addClass('selbtn_selected').siblings().removeClass('selbtn_selected');
		}
	});

	$('.select_multi').on('click', '.selbtn', function(){
		var $this = $(this);
		if($this.hasClass('selbtn_selected')){
			$this.removeClass('selbtn_selected');
		}else{
			var $parent = $this.parent();
			var maxCount = parseInt($parent.data('max') || 99, 10);
			if($parent.find('.selbtn_selected').length < maxCount){
				$this.addClass('selbtn_selected');
			}
		}
	});

	$.fn.ppGetSelectorValue = function(){
		var $selector = this;
		var result = [];
		$selector.find('.selbtn_selected').each(function(){
			var val = $(this).data('val');
			if(val !== undefined){
				result.push(val);
			}
		});
		return result;
	};
})();