var express = require('express'),
	app = express(),
	notes = require('./routes/notes');

app.configure(function() {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
});

var sayHi = function(request, response) {
	console.log('oh hai! thanks for pinging me.');
	response.send('Oh hai! thanks for pinging me.')
};




app.get('/', sayHi);
app.get('/notes', notes.findAll);
app.get('/notes/:id', notes.findById);
app.post('/notes', notes.addNote);
app.put('/notes/:id', notes.updateNote);
app.delete('/notes/:id', notes.deleteNote);

app.listen(3000);
console.log('listening on port 3000');