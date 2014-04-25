var mongo = require('mongodb'),
	Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure,
	server = new Server('localhost', 27017, {auto_reconnect : true}),
	db = new Db('mynotes', server);

var populateDB = function() {
 
    var notes = [
	    {
	        noteBodyText: "This sucks. I want to sleep.",
	        liked : false
	    },
	    {
	        noteBodyText: "actually you know what? thesis went great today.",
	        liked : false
	    }
	];
 
    db.collection('mynotes', function(err, collection) {
        collection.insert(notes, {safe:true}, function(err, result) {});
    });
 
};

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

var findAll = function(req, res) {
	db.collection('mynotes', function(err, collection) {
		collection.find().toArray(function(err, items) {
			console.log(items);
			res.send(items);
		});
	});
};


exports.findAll = findAll;

