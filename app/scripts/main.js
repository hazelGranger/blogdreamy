$(document).ready(function(){

	function dealAddress (src){
		return src + ".html";
	}

	function response (data) {
		console.log(data);
		$('.content-container').append(data);
		$('.content-container').addClass("active");
	}

	function getPage(src){
		$.ajax({
			url: dealAddress(src),
			type: "get",
			success: response
		})
	}

	function size(){
		//配置，poster的单个上限或下限
		var poster = {
			widthFloor: 200,
			widthCeiling: 800,
			heightFloor: 200,
			heightCeiling: 800
		}
		var docWidth = $(window).width();
		var docHeight = $(window).height();
		var columnMax = docWidth/poster.widthFloor;
		var columnMin = docWidth/poster.widthCeiling;
		var averageColumn = Math.floor((columnMax + columnMin)/2);
		var posterWidth = docWidth/averageColumn;
		$('.poster').each(function(){
			$(this).css({'width':posterWidth+"px",'height': posterWidth+"px"});
		})
		$('.posters').css({'width': docWidth,'height': docHeight});
		console.log(columnMax,columnMin,averageColumn,posterWidth);
		return averageColumn;

	}

	function position(col_num){
		var posters = $('.poster');
		var left=0;
		var top=0;
		for (var i = 0; i < posters.length; i++) {
			var w = posters.eq(i).width();
			var h = posters.eq(i).height();
			left = (i % col_num) * w;
			top =  Math.floor((i/col_num)) * h;
			posters.eq(i).css({'top': top+"px",'left':left+"px"});
		};
	}

	function getMousePos(event){
		var e =event || window.event;
		console.log({'x': e.screenX,'y':e.screenY});
		return{'x': e.screenX,'y':e.screenY};
	}

	function countTransformOrigin(obj){

		var docWidth = $(window).width();
		var docHeight = $(window).height();
		console.log(obj.x*100/docWidth + "% "+ obj.y*100/docHeight + "% 0px");
		return obj.x*100/docWidth + "% "+ obj.y*100/docHeight + "% 0px";
	}

	position(size());


	$(window).resize(function(){
		position(size());
	});

	$('.poster').click(function(){

		$('.posters').css({'transform-origin':countTransformOrigin(getMousePos(event)),'-webkit-transform-origin':countTransformOrigin(getMousePos(event))});
		$('.posters').addClass("scale-large");
		$(this).css({'transform':'translateY(-'+$(this).height()+'px)','-webkit-transform':'translateY(-'+$(this).height()+'px)'});
		console.log($(this).attr("data-target"));
		getPage($(this).attr("data-target"));
	});
});