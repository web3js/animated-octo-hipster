// In javascript, objects are nothing but "key : value" pairs.
// The type of variables don't matter. You can mix and match them in one object.
// Use sensible names:
// For functions use verbs
// For booleans use a word that shows state. We use booleans to keep track of state of things afterall: isClicked, isOpen, isPaused
// Use Camel Casing for long variable names: thiIsOneLongVariableName. It helps with readability.

var playList = {
	songsCount : 4,
	songs : ['Get Lucky', 'Petite Machine', 'Smells Like Teen Spirit', 'Graceland'],
	play : function() {
		// code that plays the song	
	},
	next : function() {
		// code that plays the next song
	},
	prev : function() {
		// code that plays the previous song
	},
	pause : function() {
		// code that pauses the song
	},
	isPaused : false,
	isLooped : true,
	isShuffle : false
};

console.log('objects.js says: This is playList: ', playList, '\n');
console.log('objects.js says: typeof playList is: ', typeof playList, '\n');

// to add a property to an object you can either do:
playList.mood = 'energetic';
// or
playList['owner'] = 'LeBron';

console.log('objects.js says: added to properties to playList. now playList is: ', playList, '\n');


