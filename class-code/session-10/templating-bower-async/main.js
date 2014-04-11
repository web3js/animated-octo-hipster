var kittens = kittens || {};

kittens.main = (function(w, d, $, _) {

	var init, 
	fetchData,
	render,
	tpl,
	renderGif;


	fetchTemplate = function() {
		$.get('./tpl.html', function(tpl) {
			kittens.events.publish('load-complete:template', tpl);
		});
	};

	fetchData = function() {
		$.getJSON('http://api.giphy.com/v1/gifs/search?q=kitten&api_key=dc6zaTOxFJmzC&limit=20', function(result) {
			console.log('data received ', result.data);
			$(renderGif({gifs : result.data})).appendTo('.gifs');
		});
	};


	render = function() {
		kittens.events.subscribe('load-complete:template', function(tpl) {
			renderGif = _.template(tpl);
			fetchData();
		});
	};
	init = function() {
		//fetchData();
		render();
		fetchTemplate();
		console.log('set the kittens free!');
	};

	return {
		init : init
	}

})(window, document, jQuery, _);

window.onload = kittens.main.init;