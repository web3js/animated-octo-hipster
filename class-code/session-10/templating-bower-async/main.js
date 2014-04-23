var kittens = kittens || {};

kittens.main = (function(w, d, $, _) {

	var init, 
	fetchData,
	render,
	tpl,
	renderGif;

	/* 
		Using jQuery get to asynchronously
		more on jQuery $.get : https://api.jquery.com/jQuery.get/ 
		checkout "publish" implementation in events.js
	*/
	fetchTemplate = function() {
		$.get('./tpl.html', function(tpl) {
			kittens.events.publish('load-complete:template', tpl);
			// got to events.js to see how this works.
		});
	};

	/* this is identical to the example in templating-hower folder */
	fetchData = function() {
		$.getJSON('http://api.giphy.com/v1/gifs/search?q=kitten&api_key=dc6zaTOxFJmzC&limit=20', function(result) {
			console.log('data received ', result.data);
			$(renderGif({gifs : result.data})).appendTo('.gifs');
		});
	};

	/*
		because we load in our template asynchronously, we need to wait for this AJAX request 
		to be completed, make sure that we have our template ready before we render.

		OUR TEMPLATE NOW LIVES IN ITS OWN FILE: TPL.HTML ----- LOOK AT IT!
		
		checkout "subscribe" implementation in events.js
	*/
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