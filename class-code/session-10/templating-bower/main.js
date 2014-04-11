var kittens = (function(w, d, $, _) {

	var init, 
	fetchData, 
	tpl,
	renderGif;

	tpl = $('.gif-tpl').text();
	renderGif = _.template(tpl);

	fetchData = function() {
		$.getJSON('http://api.giphy.com/v1/gifs/search?q=kitten&api_key=dc6zaTOxFJmzC&limit=20', function(result) {
			console.log('data received ', result.data);
			$(renderGif({gifs : result.data})).appendTo('.gifs');
		});
	};
	init = function() {
		fetchData();
		console.log('set the kittens free!');
	};

	return {
		init : init
	}

})(window, document, jQuery, _);

window.onload = kittens.init;