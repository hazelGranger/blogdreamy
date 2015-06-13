$(document).ready(function(){

	var global = {
		averageColumn: null,
		posterNum: $('.poster').length
	}

	//解析 data-target
	function dealAddress (src){
		return src + ".html";
	}

	//将get的资源显示
	function response (data) {
		console.log(data);
		$('.content-container').append(data);
		$('.content-container').addClass("active");
	}

	//ajax发送get请求
	function getPage(src){
		$.ajax({
			url: dealAddress(src),
			type: "get",
			success: response
		})
	}

	//单个poster大小计算
	function size(){
		//配置，poster的单个上限或下限
		var poster = {
			widthFloor: 210,
			widthCeiling: 800,
			heightFloor: 210,
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
		global.averageColumn = averageColumn;
		return averageColumn;

	}

	//poster位置计算
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

	//获取鼠标在dom里的位置（不是在window的位置）
	function getMousePos(event){
		var e =event || window.event;
		console.log({'x': e.screenX,'y':e.screenY + $(document).scrollTop()});
		return{'x': e.screenX,'y':e.screenY + $(document).scrollTop()};
	}

	//获取窗口大小
	function getWindowSize(){
		return {'width': $(window).width(),'height': $(window).height()};
	}

	//计算出posters的transform-origin的值
	function countTransformOrigin(obj){
		var windowSize = getWindowSize();
		console.log(obj.x*100/windowSize.width + "% "+ obj.y*100/windowSize.height + "% 0px");
		return obj.x*100/windowSize.width + "% "+ obj.y*100/windowSize.height + "% 0px";
	}

	function headersResize(){
		var windowSize = getWindowSize();
		$('.article-header-wrap').css({'width': windowSize.width,'height': windowSize.height});
	}

	function getObjPos (obj) {
		return {"top":parseInt(obj.css("top")),
				"btm": parseInt(obj.css("top")) + obj.height(),
				"left": parseInt(obj.css("left")),
				"right": parseInt(obj.css("top")) + obj.width()}
	}

	function getScrollPos () {
		return {"scrollTop":$(document).scrollTop(),"scrollBtm": $(document).scrollTop() + $(window).height()}
	}

	function anchor (obj) {

		if (getObjPos(obj).top < getScrollPos().scrollTop){
			$(document).scrollTop(getObjPos(obj).top);
		}else if (getObjPos(obj).btm > getScrollPos().scrollBtm){
			$(document).scrollTop(getObjPos(obj).btm - $(window).height());
		}
	}
	//obj的中心位置大于还是小于window的中心位置（水平）
	function analyzePos (obj) {
		var objCenter = (getObjPos(obj).top + getObjPos(obj).btm)/2;
		var windowCenter = (getScrollPos().scrollTop + getScrollPos().scrollBtm)/2;
		if (objCenter < windowCenter) {
			return true;
		}else{
			return false;
		}
	}

	function getIndex(obj){

	}

	function getPosterNeighbors(){

	}

	position(size());
	headersResize();


	$(window).resize(function(){
		position(size());
		headersResize();
	});

	$('.poster').click(function(){
		//poster本身.
		anchor($(this));
		$('.posters').css({'transform-origin':countTransformOrigin(getMousePos(event)),'-webkit-transform-origin':countTransformOrigin(getMousePos(event))});
		$('.posters').addClass("scale-large");
		if (analyzePos($(this))) {
			$(this).css({'transform':'translateY(-'+$(this).height()+'px)','-webkit-transform':'translateY(-'+$(this).height()+'px)'});
		}else{
			$(this).css({'transform':'translateY('+$(this).height()+'px)','-webkit-transform':'translateY('+$(this).height()+'px)'});
		}
		
		//内部的显示的文章头图
		$('.article-header-wrap').addClass("article-header-wrap-large");
		$('.article-header').addClass("article-header-large");
		setTimeout(function(){
			// $('.posters').addClass('posters-hidden');
		}, 800);
		console.log($(this).attr("data-target"));
		getPage($(this).attr("data-target"));
	});
});