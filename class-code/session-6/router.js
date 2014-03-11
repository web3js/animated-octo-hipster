var app = app || {};

app.router = (function() {

	var route = function() {
	    var hash = window.location.hash.slice(2);
	    console.log(hash); 
	    if(typeof handle[hash] === 'function') {
	      	requestHandlers[hash]();
	    } else {
			console.log('Could not find what you were looking for. Redirecting to Archive.');
			handle['/']();
	    }
  	};
  	console.log(app);
  	var requestHandlers = {
	    archive : function() {
	      // render archive view
	      console.log('Archive!');
	    },
	    compose : function() {
	      // render compose view
	      console.log('Compose!');
	    }
	  };
	var handle = {};
	handle['/'] = requestHandlers.archive;
	handle['archive'] = requestHandlers.archive;
	handle['compose'] = requestHandlers.compose;

	return {
		route : route
	}

})();