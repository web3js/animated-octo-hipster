/* 
  We modified our saved data in localstorage to ONLY save the data ("noteBodyText" and "liked") and NOTHING MORE.
  So, when the app starts, we read the data from localstorage,
  we create a new Model
  we create a new View
  for every single record in the localstorage.
  Look below for comments.
  
*/
var app = app || {};

app.main  = (function() {  

  var elements = {
    noteField : document.querySelector('.write-note'),
    noteSubmit : document.querySelector('.submit-note'),
    noteList : document.querySelector('.notes'),
    noNotesFound : document.querySelector('.no-notes-found')
  };


  var notes = JSON.parse(localStorage.getItem('notes')) || [];

  var attachEvents = function() {

    elements.noteSubmit.addEventListener('click', function(event) {
      event.preventDefault();
        var fieldValue = elements.noteField.value;

        // Below, we are creating a new model, passing:
        //  1 - an object containing noteBodyText and fieldValue
        //  2 - The collection (array) within which our Model will sit
        //  To get a better picture of how Model function is implemented, scroll down
        //  To see the Model function definition.

        var newNote = new Model({ noteBodyText : fieldValue, liked: false }, notes).save();
        
        // Nothing new here. Creating a new View and initializing it.
        new View(newNote, elements.noteList).init();
        
        // Nothing new here. Just clearing the text field
        elements.noteField.value = '';

    });

    window.addEventListener('hashchange', function(e) {
      e.preventDefault();
      console.log('hash just changed'); 
      app.router.route();
    });

  };

  

  var addAsFirstChild = function(parent, child) {
    var parentNode = parent,
      childNode = child;
    if(parentNode.firstChild) {
      parentNode.insertBefore(child, parent.firstChild);
    } else {
      parentNode.appendChild(child);
    }

  };

  var View = function(note, containerEl) {
    var index = notes.indexOf(note),
        that = this;

    this.render = function() {
      this.listItem = document.createElement('li');
      this.paragraph = document.createElement('p');
      this.actions = document.createElement('ul');
      this.removeButton = document.createElement('li');
      this.likeButton = document.createElement('li');

      this.listItem.classList.add('note');
      this.actions.classList.add('actions');
      this.removeButton.classList.add('remove' ,'icon-cancel');
      this.likeButton.classList.add('like' ,'icon-heart');

      this.paragraph.innerHTML = note.data.noteBodyText;
      this.actions.appendChild(this.removeButton);
      this.actions.appendChild(this.likeButton);
      this.listItem.appendChild(this.paragraph);
      this.listItem.appendChild(this.actions);


      // Here, we do a simple check to see the note Model we are rendering 
      // is "liked" or not. If so, we just add a class to it. 
      // Think about the scenario in which you load a note from localstorage that is already "liked"
      // We want to paint that heart red when we start the app.
      if (note.data.liked) {
        this.likeButton.classList.add('liked');
      }


      addAsFirstChild(elements.noteList, this.listItem);

      elements.noNotesFound.classList.add('hidden');

      return this;     
    };

    this.like = function() {
      note.like(); // update the "liked" in our Model (data)
      console.log('View says: am I liked?', note.data.liked);
      that.likeButton.classList.toggle('liked'); // update the UI and show a red heart
    };

    this.remove = function() {
      console.log('View says: I am a goner');
      elements.noteList.removeChild(that.listItem); // update the UI by removing that list item
      note.remove(); // update the data by calling the remove method from Model
      if(elements.noteList.childElementCount === 0) {
        elements.noNotesFound.classList.remove('hidden');  // Show the "you have no notes yet" message, if all the notes are deleted
      }
    };
    this.attachEvents = function() {
      this.likeButton.addEventListener('click', this.like);
      this.removeButton.addEventListener('click', this.remove);
    };
    
    this.init = function() {
      this.render();
      this.attachEvents();
      return this;
    };

  };

  // Here, we changed te Model function to accept an Object instead of just noteBodyText
  // The object contains: {noteBodytext : 'Some text here', liked : false }
  var Model = function(noteData, collection) {
    
    // So noteData is an object we passed to Model (look at the beginning of this file to see that when we create a new note we pass an object to Model function)
    // We read from the arguments (noteData) and create a "data" object.
    this.data = {
      noteBodyText : noteData.noteBodyText,
      liked : noteData.liked  
    };
    
    this.save = function() {
      // push the "data" of this model to the "collection". Collection here is "notes" array. 
      collection.push(this.data);
      // After updating the "notes" array we write it to localstorage
      localStorage.setItem('notes', JSON.stringify(collection));
      return this;
    };
    
    this.like = function() {
      // Remember that we changed "this.liked" to "this.data.liked" because
      // We are storing "liked" and "noteBodytext" in an object now. 
      this.data.liked = !this.data.liked;
      
      // Here, we use the Array.splice method to replace the older version of the model data
      // Stored in the array with the new version.
      // Remmeber Splice works like this:
      // myArray.splice(index, howManyToDelete, whatToReplace);
      collection.splice(collection.indexOf(this.data), 1, this.data);

      // now that we updated the "notes" array we write it to localstorage.
      localStorage.setItem('notes', JSON.stringify(collection));
      console.log('Model says: Am I liked?' , this.data.liked);
      return this;
    };

    this.remove = function() {
      console.log('Model says: I am a goner');
      
      // Again, we use the Array.splice method here. 
      // But in this case, we use splice to delete a specific index of an array.
      // If you DONT pass the third parameter to splice, it will add nothing:
      // myArray(index, howManyToDelete); ---- Nothing is added, or replaced. 
      // Javascript just goes to that index, and takes (in this case) 1 member out.
      collection.splice(collection.indexOf(this), 1);
      localStorage.setItem('notes', JSON.stringify(collection));
      return this;
    };
  };

  var initialRender = function() {
    console.log('this is the saved data:', JSON.parse(localStorage.getItem('notes')));

    if(('notes' in localStorage) && (JSON.parse(localStorage.getItem('notes')).length > 0)) {

      var savedNotes = JSON.parse(localStorage.getItem('notes')),
      notes = savedNotes.slice(),
      i = 0,
      len = savedNotes.length,
      
      // This is new. Because we are only saving the model Data and not the model methods
      // in localstorage, we are going to:
      // 1 - read and parse the data in localstorage
      // 2 - make models
      // 3 - make views
      loadedNote;

      for(i; i < len; i += 1) {
        // This is new. Again, we read the data, we make a Model.
        loadedNote = new Model(savedNotes[i], notes);
        // This didn't change really. We still need to make a View.
        new View(loadedNote, elements.noteList).init();
      }
    
    } else {
      elements.noNotesFound.classList.remove('hidden'); // if no notes exist in localstorage, show the "you have no notes yer" message
    }

  };

  
  var init = function() {
    console.log('App init');
    attachEvents();
    initialRender();
    app.router.route();

  };
  
  return {
    init : init,
    notes : notes
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);
