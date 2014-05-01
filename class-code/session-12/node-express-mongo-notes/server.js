var express = require('express'),
	app = express(),
	http = require('http'),
	notes = require('./routes/notes');

app.configure(function() {
	app.set('port', process.env.PORT || 9999);
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
});

app.get('/api/notes', notes.findAll);
app.get('/api/notes/:id', notes.findById);
app.post('/api/notes', notes.addNote);
app.put('/api/notes/:id', notes.updateNote);
app.delete('/api/notes/:id', notes.deleteNote);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
