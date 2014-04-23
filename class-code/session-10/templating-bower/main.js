/* 	modular JS for the win! */
/* 	RUN THIS ON A LOCAL SERVER!
	We are sending AJAX requests. WE HAVE TO BE ON A SERVER.
	Doouble clicking on index.html will not work.
	python -m SimpleHTTPServer 3000
	is your go-to simple http server friend.
 */
/*
	We store a local reference to the global objects for internal use in this module.
	This is a highly recommended approach for working with global variables. 
	Remember, we want to stay OUTSIDE of the global namespace (in case of front-end JS, global namespace is 'window')
	as much as possible.
	We want out modules to be safe contained standalone pieces of code that work together like cogs in a clock.
	Becaus we want to avoid accidental tampeting with global objects such as 'document', 'window' and our
	dear libraies 'jQuery' and 'underscore' we store a local reference to them.
	take my advice. :)
	look down there to see how we are passing in the global objects

	here is what the syntax looks like in general:

	var myModule = (function(g1, g2, g3) {     <-------- shortcut names we choose. The order matters. The names don't (banan, orange, cucumber)
		
		console.log(g1, g2, g3); // prints the contents of global1, global2, and global3

	})(global1, global2, global3); <--------- global objects we pass in to our module for local use. 
*/
var kittens = (function(w, d, $, _) {

	/* 	declare are the variables at the top
		and then initialize them one by one.
		this is good practice, and my stylistic choice.
		because when you look at one module, you see an index of all the variables
		withing that modules.
		Like an book index. 
	*/
	var init, 
	fetchData, 
	tpl,
	renderGif;

	/* 
		underscore templating. 
		STEP 1:

		this is the underscore tempate string.
		We are using jQuery to grab the template from index.html (look at index.html comments)
		and then using the convenient .text() method to extrat the textual data out of that element.
		quick .text() rehash:
		
		HTML:
			<div class="my-class">Lorem Ipsum</div>

		JS:
			myText = $('.my-class').text();

		BAM!
	*/
	tpl = $('.gif-tpl').text();
	
	/* 
		underscore templating. 
		STEP 2:
		Compile template string into a template function using the good old
		_.template method.
	*/
	renderGif = _.template(tpl);

	/* 
		Fetch data from giphy API using jQuery AJAX implementation.
		$.getJSON is a short form (wrapper) for $.ajax method.
		Read more about $.ajax here: https://api.jquery.com/jQuery.ajax/
		Read more about $.getJSON here:	http://api.jquery.com/jquery.getjson/
		We didn't really talk about this in class.
		It's farily simple. Looking at one or two examples should get you started.
		Bring the questions!
	*/
	fetchData = function() {
		/* learn how to interact with giphy API: https://github.com/giphy/GiphyAPI */
		$.getJSON('http://api.giphy.com/v1/gifs/search?q=kitten&api_key=dc6zaTOxFJmzC&limit=20', function(result) {
			console.log('data received ', result.data);
			/* Here, we:
				1 - render the gifs: renderGif({gifs : result.data});
					we are basically explicitly telling underscore:
					replace the "gifs" placeholder in our template (look at index.html)
					with this object i'm giving you: result.data.
					Then underscore executes your template with the provided data and magic happens.
				2 - we grab the rendered gifs on the fly using jQuery : $(renderGif({gifs : result.data}));
				3 - we append the awesome gif collection to the element with the class '.gifs' (look at index.html)
					read more on jQuery appendTo: https://api.jquery.com/appendTo/ 
			*/
			$(renderGif({gifs : result.data})).appendTo('.gifs');
		});
	};
	/* 
		Kick off everything!
	*/
	init = function() {
		fetchData();
		console.log('set the kittens free!');
	};
	/*
		Public methods and variables
	*/
	return {
		init : init
	}
/* 
	We pass all the global objects to our modules and store an internal reference to them at the top.
	look all the way up ^^^
*/
})(window, document, jQuery, _);

/* Kick off the module on window load. */
window.onload = kittens.init;