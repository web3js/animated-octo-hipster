/*
	This is the syntax we use in node.js to import other modules
	that we will be using in our application:

	var myModule = require('moduleName');

	Modules fall into three major catgories: 

	1 - Node core modules:
		These are modules that ship with every node.js installation and 
		are standard and widely used in node. like the "http" module.

	2 - npm node modules:
		These are modules you download via npm (node package manager) from npm registry
		(https://www.npmjs.org/) - npm is a convenient way to download and access node modules.
		You can simply use it like so:
		npm install MODULE_NAME - if the module exists in the registry, npm will automatically
		download it for you and put it under node_modules directory in your project.

	3 - Modules you write.
		These are the modules you write for your own project. It is good practice
		to keep the code modular. So get in the habit of breaking your code into different parts
		each in charge of doing its own thing. 
		say you create a module here: routes/notes.js
		you would import it like so: require('routes/notes');
		Note that you can drop the .js when using require to import modules.

	read more about modules here: http://nodejs.org/api/modules.html#modules_core_modules

*/
var express = require('express'),
	/*
		express is the web framework we use to build our app.
		to create an app we simply need to run express();
		read more about express here: http://expressjs.com/4x/api.html
	*/
	app = express(),
	/*
		importing a module we wrote.
	*/
	notes = require('./routes/notes');

/* 
	This is how we configure our express app.
	By passing an anonymous function to the configure function:

	app.configure(function() {
		// here goes your config
	});
*/
app.configure(function() {
	app.use(express.logger('dev')); // log level = dev. defines how much info you need to be logged.
	app.use(express.bodyParser()); // bodyParser allow us to easily parse requests and communicate them with the server
});

/*
	Just a very simple function.
	Remember. In node, functions that deal with requests from user
	and return some sort of response are always passed the two arguments "request" and "response"
	Remember. These names are completely arbitrary.
	You could call them "banana" and "orange" and they would work all the same.
	As long as you maintain the order correctly:

	var doSeomthing = function(req, res) {
		// req is an object that contains everythign that comes through with the request coming from the user (client)
		// res is an object that you can use to send back stuff from the back-end (server) to the user client.
	}
*/
var sayHi = function(request, response) {
	console.log('oh hai! thanks for pinging me.');
	response.send('Oh hai! thanks for pinging me.')
};



/*
	"app.get" allows us to map a "get" request with a function.
	This tells line tells our app to run the "sayHi" function whenever 
	the path "/" is matched. Meaning, when we land on our application. 
	
	In our app, and in general when developing a backend - client app,
	we will deal with FOUR types of requests:
	
	POST
	GET
	PUT
	DELETE
	
	These four are commondly referred to as "CRUD" verbs:
	
	CREATE
	READ
	UPDATE
	DELETE
	
	read more: http://stackoverflow.com/questions/6203231/which-http-methods-match-up-to-which-crud-methods


*/
app.get('/', sayHi);
/*
	Another route we register within our application.
	run notes.findAll whenever the path matches "/notes"
*/
app.get('/notes', notes.findAll);
/* 
	Yet another route. 
	This one helps us find a note with a specific ID
*/
app.get('/notes/:id', notes.findById);
/* 
	This is a route that matches the path '/notes'
	with a POST request. This creates a new note.
	See that we are pairing the function "notes.addNote" with the post request? Yeah!
*/
app.post('/notes', notes.addNote);
/* 
	This is a route that allows us to update an existing note.
	For updating purposes we use the "PUT" request
*/
app.put('/notes/:id', notes.updateNote);
/* 
	And finally, we use the DELETE request to remove a note.
*/
app.delete('/notes/:id', notes.deleteNote);
/* 
	app.listen(port_number) will run our app on the passed in port number.
*/
app.listen(3000);
console.log('listening on port 3000');