var notes = (function(exports) {

	// we imported the "exports" object and saved a local reference to it.
	// we will be adding stuff to this object later in the module. scroll down and see.

	var mongo, // import mongo
		Server, // save a reference to the Server constructor
		Db, // save a reference to the DB constructor
		BSON, // save a reference to the BSON object (used to generate mongo IDs) 
		server, // this is our mongodb server
		db, // this is our mongodb Database
		init, // the function to kick it all off
		findAll, // function to find all notes
		findById, // function that finds one note
		addNote, // function that adds a note
		updateNote, // function that updates a note
		deleteNote; // function that deletes a note/

	mongo = require('mongodb');
	Server = mongo.Server;
	Db = mongo.Db;
	BSON = mongo.BSONPure;
	server = new Server('localhost', 27017, {auto_reconnect : true});
	db = new Db('finalclass', server);


	db.open(function(err, db) {
		if(!err) {
			console.log('connected to out db');
			db.collection('notes', {strict : true}, function(err, collection) {
				if(err) {
					console.log('the notes collection does not exist yet. create it.');
				}
			});
		}
	});

	findAll = function(req, res) {
		db.collection('notes', function(req, res) {
			db.collection('notes', function(err, collection) {
				collection.find().toArray(function(err, items) {
					console.log('got them notes for ya: ', items);
					res.send(items);
				});
			});
		});
	};

	findById = function(req, res) {
		var id = req.params.id;
		console.log('getting the note:' + id);
		db.collection('notes', function(err, collection) {
			collection.findOne({'_id' : new BSON.ObjectID(id)}, function(err, item) {
				console.log('found you a note ', item);
			});
		});	
	};

	addNote = function(req, res) {
		var note = req.body;
		console.log('adding this little guy: ', note);
		db.collection('notes', function(err, collection) {
			collection.insert(note, {safe : true}, function(err, collection) {
				if(err) {
					console.log('an error has occured');
				} else {
					console.log('note added what what', result[0]);
					res.send(result[0]);
				}
			});
		});
	};

	updateNote = function(req, res) {
		var id = req.params.id,
			note = req.body;
		console.log('updating note ', id, ' -- updated note is: ', note);
		db.collection('notes', function(err, collection) {
			if(err) {
				console.log('an error occured while trying to get the note collection: ', err);
			} else {
				collection.update({'_id' : new BSON.ObjectID(id)}, note, {safe : true}, function(err, result) {
					if(err) {
						console.log('error while updating note:', err);
						res.send({'error' : err});
					} else {
						console.log(result, ' documents update');
						res.send(note);
					}
				});
			}
		});
	};

	deleteNote = function(req, res) {
		var id = req.params.id;
		console.log('deleting: ', id);
		db.collection('notes', function(err, collection) {
			collection.remove({'_id': new BSON.ObjectID(id)}, {safe : true}, function(err, result) {
				if(err) {
					res.send({'error' : err});
				} else {
					console.log('' + result + ' document(s) deleted');
					res.send(req.body);
				}
			});
		});
	};

	init = function() {
		exports.findAll = findAll;
		exports.findById = findById;
		exports.deleteNote = deleteNote;
		exports.updateNote = updateNote;
		exports.addNote = addNote;
	};

	return {
		init : init
	};

})(exports);

notes.init();