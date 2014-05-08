// revealing module pattern. remember? :D
// passing the global "exports" to the module, in case we wanna add stuff to it.
var server = (function(exports) {
	// list all your local vars
	var express,
		app,
		http,
		notes,
		bodyParser,
		init;

	// instantiate all vars here.
	express = require('express');
	http = require('http');
	notes = require('./routes/notes');
	bodyParser = require('body-parser');

	app = express();
	// set some config for app.
	app.set('port', 9999);
	app.use(bodyParser());
	app.use(express.static(__dirname + '/public'));
	// set up the routes. match routes with functions.
	app.get('/api/notes', notes.findAll);
	app.get('/api/:id', notes.findById);
	app.post('/api/notes', notes.addNote);
	app.put('/api/notes/:id', notes.updateNote);
	app.delete('/api', notes.deleteNote);
	// this is the initiation function. call this and everything kicks off.
	init = function() {
		http.createServer(app).listen(app.get('port'), function() {
			console.log('Magic Happening on port: ', app.get('port'));
		});
	};

	return {
		init : init
	};

})(exports);

server.init();