var mongo = require('mongodb'),
	Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure,
	server = new Server('localhost', 27017, {auto_reconnect : true}),
	db = new Db('mynotes', server);


db.open(function(err, db) {
	if(!err) {
		console.log('connected to mynotes db');
		db.collection('mynotes', {strict : true}, function(err, collection) {
			if(err) {
				console.log('the notes db doesn not exist. Go ahead and create some content');
			}
		});
	}
});

var findAll = function(req, res) {
	db.collection('mynotes', function(err, collection) {
		collection.find().toArray(function(err, items) {
			console.log(items);
			res.send(items);
		});
	});
};
var findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving note: ' + id);
	db.collection('mynotes', function(err, collection) {
		collection.findOne({'_id': new BSON.ObjectID(id) }, function(err, item) {
			res.send(item);
		});  
	});
	
};

var addNote = function(req, res) {
	var note = req.body;
	console.log('Adding note: ', note);
	db.collection('mynotes', function(err, collection) {
		collection.insert(note, {safe : true}, function(err, result) {
			if(err) {
				console.log('an error has occured: ', err);
			} else {
				console.log('note successfully added', result[0]);
				res.send(result[0]);
			}
		});
	});
};

var updateNote = function(req, res) {
	var id = req.params.id,
		note = req.body;

	console.log('updatin note: ', id, ' update note info: ', note);
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

var deleteNote = function(req, res) {
    var id = req.params.id;
    console.log(req.params);
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

exports.findAll = findAll;
exports.findById = findById;
exports.deleteNote = deleteNote;
exports.updateNote = updateNote;
exports.addNote = addNote; 	
