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
		var poster = {
			widthFloor: 200,
			widthCeiling: 300,
			heightFloor: 200,
			heightCeiling: 300
		}
		var docWidth = $(document).width();
		var docHeight = $(document).height();
		var columnMax = Math.floor(docWidth/poster.widthFloor);
		var columnMin = Math.floor(docWidth/poster.widthCeiling);
		var averageColumn =


		console.log(columnMax,columnMin);

	}

	function position(){
		//配置，poster的单个上限或下限
		

		$(document).width();
		$(document).height();

		$('.poster').each(function (){

		});
	}

	size();

	$(window).resize(function(){
		size();
	});

	$('.poster').click(function(){
		$(this).addClass("scale-large");
		console.log($(this).attr("data-target"));
		getPage($(this).attr("data-target"));
	});
});