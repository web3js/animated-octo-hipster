
/* 
	importing the mongodb module to be able to interact with mongo through node.js
*/
var mongo = require('mongodb'),
	/* 
		Storing a reference to mongo's Server constructor.
	*/
	Server = mongo.Server,
	/* 
		Storing a reference to mongo's Database constructor.
	*/
	Db = mongo.Db,
	/* 
		Binary JSON - http://bsonspec.org/ 
	*/
	BSON = mongo.BSONPure,
	/* 
		create the mongoDB server here
	*/
	server = new Server('localhost', 27017, {auto_reconnect : true}),
	/* 
		create the "mynotes" database here.
	*/
	db = new Db('mynotes', server);

/* 
	We use this function to populate our database with some bogus data, if the database doesn't exist.
*/
var populateDB = function() {
 
    var notes = [
	    {
	        title: "I hate thesis",
	        body : "This sucks. I want to sleep."
	    },
	    {
	        title: "I love thesis",
	        body : "actually you know what? thesis went great today."
	    }
	];
 	/* 
 		Order of stuff in mongodb
 		DATABASE ----> COLLECTIONS ----> DOCUMENTS
		this function, gets the "mynotes" collection from the "mynotes" database.
		then, it "inserts" the "notes" array ^ look up ther ^ into the database collection.
 	*/
    db.collection('mynotes', function(err, collection) {
        collection.insert(notes, {safe:true}, function(err, result) {});
    });
 
};

/* 
	This function opens a connection with mongodb server.
	Checks to see if the database exists. If now, it creates it
	and calls populateDB to populate our DB with some data
*/
db.open(function(err, db) {
	if(!err) {
		console.log('connected to mynotes db');
		db.collection('mynotes', {strict : true}, function(err, collection) {
			if(err) {
				console.log('the notes db doesn not exist. creating it now.');
				populateDB();
			}
		});
	}
});
/* 
	REFER TO SERVER.JS to see how we use app.get to match routes with functions.
	we use this function to get all the notes from Database.
	notice how two arguments "req" as in requets and "res" as in response are passed to it.
*/
var findAll = function(req, res) {
	db.collection('mynotes', function(err, collection) {
		collection.find().toArray(function(err, items) {
			console.log(items);
			res.send(items); // send the items with result
		});
	});
};

/* 
	REFER TO SERVER.JS to see how we use app.get to match routes with functions.
	Get 1 note. 
	Notice how the .findOne method is used to retrieve 1 record.
*/
var findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving note: ' + id);
	db.collection('mynotes', function(err, collection) {
		collection.findOne({'_id': new BSON.ObjectID(id) }, function(err, item) {
			res.send(item);
		});  
	});
	
};

/* 
	REFER TO SERVER.JS to see how we use app.get to match routes with functions.
	Add 1 note. 
	Notice how the .insert method is used to add 1 record.
*/
var addNote = function(req, res) {
	var note = req.body;
	console.log('Adding note: ', JSON.stringify(note));
	db.collection('mynotes', function(err, collection) {
		collection.insert(note, {safe : true}, function(err, result) {
			if(err) {
				console.log('an error has occured');
			} else {
				console.log('note successfully added', JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
};
/* 
	REFER TO SERVER.JS to see how we use app.get to match routes with functions.
	update 1 note. 
	Notice how the .update method is used to add 1 record.
	we use the '_id' to find the unique note we need to update
*/
var updateNote = function(req, res) {
	var id = req.params.id,
		note = req.body;

	console.log('updatin note: ', id, ' note update info: ', JSON.stringify(note));
	db.collection('mynotes', function(err, collection) {
		if(err) {
			console.log('an error occured while trying to access "mynotes" collection in the database');
		} else {
			collection.update({'_id' : new BSON.ObjectID(id)}, note, {safe : true}, function(err, result) {
				if(err) {
					console.log('an error occured while trying to update note with ID: ', id, ' Error is: ', err);
					res.send({'error' : 'an error has occured' + err});
				} else {
					console.log(result, ' document(s) updated');
					res.send(note);
				}

			});
		}
	});
};
/* 
	REFER TO SERVER.JS to see how we use app.get to match routes with functions.
	update 1 note. 
	Notice how the .update method is used to add 1 record.
	we use the '_id' to find the unique note we need to update
*/
var deleteNote = function(req, res) {
    var id = req.params.id;
    console.log('Deleting note: ' + id);
    db.collection('mynotes', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
/* 
	make these methods available to modules outside.
	"exports" is an globally accessible object
	so when we add a property to it,
	it is visible and accessible from other modules outside.
	serves the same purpose as "return" did when we developed front-end modules (refer to session 5 code)
	because we export these, we can use them in server.js
	using: notes.findAll, notes.updateNote, etc ---- refer to server.js 
*/
exports.findAll = findAll;
exports.findById = findById;
exports.deleteNote = deleteNote;
exports.updateNote = updateNote;
exports.addNote = addNote; 	
