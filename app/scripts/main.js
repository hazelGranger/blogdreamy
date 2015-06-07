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

	$('.poster').click(function(){
		$(this).addClass("scale-large");
		console.log($(this).attr("data-target"));
		getPage($(this).attr("data-target"));
	});
});