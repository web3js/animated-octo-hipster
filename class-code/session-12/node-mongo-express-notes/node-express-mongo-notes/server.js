var express = require('express'),
	app = express(),
	http = require('http'),
	notes = require('./routes/notes');

app.configure(function() {
	app.set('port', process.env.PORT || 9999);
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	
});

app.get('/api/notes', notes.findAll);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
