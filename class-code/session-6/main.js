var app = app || {};

<<<<<<< HEAD
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

        var newNote = new Model(fieldValue, notes).save();
        new View(newNote, elements.noteList).init();
        
        elements.noteField.value = '';
=======
app.main  = (function(w, d, $) {  

  // Caching elements: instead of document.querySelector we use 
  // the simple $('selector') syntax
  var elements = {
    noteField : $('.write-note'),
    noteSubmit : $('.submit-note'),
    noteList : $('.notes'),
    noNotesFound : $('.no-notes-found')
  };

  var notes = [];


  var attachEvents = function() {

    // instead of "addEventListener" we use jQuery's "on" method. Same result.
    elements.noteSubmit.on('click', function(event) {
      event.preventDefault();
      
      // To get  a field value with jQuery, use the the val() method. 
      var fieldValue = elements.noteField.val();

      var newNote = new Model({ noteBodyText : fieldValue, liked: false }, notes).save();
      
      new View(newNote, elements.noteList).init();
      
      // To reset the field value in jQuery use the val() method and pass in an empty string.
      // It will replace whatever's in the input.
      elements.noteField.val('');
>>>>>>> FETCH_HEAD

    });

    window.addEventListener('hashchange', function(e) {
      e.preventDefault();
      console.log('hash just changed'); 
      app.router.route();
    });

  };

<<<<<<< HEAD
  

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
    
=======
  var View = function(note, containerEl) {
>>>>>>> FETCH_HEAD
    var index = notes.indexOf(note),
        that = this;

    this.render = function() {
<<<<<<< HEAD
      this.listItem = document.createElement('li');
      this.paragraph = document.createElement('p');
      this.actions = document.createElement('ul');
      this.removeButton = document.createElement('li');
      this.likeButton = document.createElement('li');

      this.listItem.classList.add('note');
      this.actions.classList.add('actions');
      this.removeButton.classList.add('remove' ,'icon-cancel');
      this.likeButton.classList.add('like' ,'icon-heart');

      this.paragraph.innerHTML = note.noteBodyText;
      this.actions.appendChild(this.removeButton);
      this.actions.appendChild(this.likeButton);
      this.listItem.appendChild(this.paragraph);
      this.listItem.appendChild(this.actions);

      addAsFirstChild(elements.noteList, this.listItem);

      elements.noNotesFound.classList.add('hidden');
=======

      // instead of document.createElement, we can simply create new elements using the 
      // jQuery syntax below. $('<li></li>') simply creates an empty <li> element for you.
      this.listItem = $('<li></li>');
      this.paragraph = $('<p></p>');
      this.actions = $('<ul></ul>');
      this.removeButton = $('<li></li>');
      this.likeButton = $('<li></li>');


      // no more classList.add() necessary.
      // just use jQuery's element.addClass()
      this.listItem.addClass('note');
      this.actions.addClass('actions');
      
      this.removeButton.addClass('remove icon-cancel');
      
      this.likeButton.addClass('like icon-heart');

      // to change the text inside an element, you no longer have to do:
      // element.innerHTML = 'blah blah'
      // You can simplt say : element.text('here goes the text inside the element!');
      this.paragraph.text(note.data.noteBodyText);
      

      this.actions.append(this.removeButton);
      this.actions.append(this.likeButton);
      this.listItem.append(this.paragraph);
      this.listItem.append(this.actions);

      if (note.data.liked) {
        this.likeButton.addClass('liked');
      }

      // addAsFirstChild is not necessary anymore.
      // we can use jQuery's prepend takes care of that for us.
      elements.noteList.prepend(this.listItem);

      // classList.add and classList.remove is not necessary here anymore.
      // we use jQuery's addClass() and removeClass() methods.
      elements.noNotesFound.addClass('hidden');
>>>>>>> FETCH_HEAD

      return this;     
    };

    this.like = function() {
      note.like(); // update the "liked" in our Model (data)
<<<<<<< HEAD
      console.log('View says: am I liked?', note.liked);
      that.likeButton.classList.toggle('liked'); // update the UI and show a red heart
=======
      console.log('View says: am I liked?', note.data.liked);
      // classList.toggle() is not necessary here anymore.
      // we use jQuery's toggleClass() method.
      that.likeButton.toggleClass('liked'); // update the UI and show a red heart
>>>>>>> FETCH_HEAD
    };

    this.remove = function() {
      console.log('View says: I am a goner');
<<<<<<< HEAD
      elements.noteList.removeChild(that.listItem); // update the UI by removing that list item
      note.remove(); // update the data by calling the remove method from Model
      if(elements.noteList.childElementCount === 0) {
        elements.noNotesFound.classList.remove('hidden');  // Show the "you have no notes yet" message, if all the notes are deleted
      }
    };
    this.attachEvents = function() {
      this.likeButton.addEventListener('click', this.like);
      this.removeButton.addEventListener('click', this.remove);
=======
      that.listItem.remove();
      //elements.noteList.remove(that.listItem); // update the UI by removing that list item
      note.remove(); // update the data by calling the remove method from Model
      // with jQuery, this is how we check for the number of children in an element
      if(elements.noteList.children().length === 0) {
        elements.noNotesFound.removeClass('hidden');  // Show the "you have no notes yet" message, if all the notes are deleted
      }
    };
    this.attachEvents = function() {
      this.likeButton.on('click', this.like);
      this.removeButton.on('click', this.remove);
>>>>>>> FETCH_HEAD
    };
    
    this.init = function() {
      this.render();
      this.attachEvents();
      return this;
    };

  };

<<<<<<< HEAD

  var Model = function(noteBodyText, collection) {
    this.noteBodyText = noteBodyText;
    this.liked = false;
    
    this.save = function() {
      collection.push(this);
      localStorage.setItem('notes', JSON.stringify(collection));
      return this;
    };
    
    this.like = function() {
      this.liked = !this.liked;
      localStorage.setItem('notes', JSON.stringify(notes));
      console.log('Model says: Am I liked?' , this.liked);
    };

    this.remove = function() {
      console.log('Model says: I am a goner');
      collection.splice(collection.indexOf(this), 1);
      localStorage.setItem('notes', JSON.stringify(collection));
=======
  // Here, we changed te Model function to accept an Object instead of just noteBodyText
  // The object contains: {noteBodytext : 'Some text here', liked : false }
  var Model = function(noteData, collection) {
    
    // So noteData is an object we passed to Model (look at the beginning of this file to see that when we create a new note we pass an object to Model function)
    // We read from the arguments (noteData) and create a "data" object.
    this.data = noteData;
    
    this.save = function() {
      // push the "data" of this model to the "collection". Collection here is "notes" array. 
      // Because when we call "new Model", we pass "notes" as the second argument.
      collection.push(this.data);
      // After updating the "notes" array we write it to localstorage
      localStorage.setItem('notes', JSON.stringify(collection));
      return this;
    };

    this.like = function() {
      

      this.data.liked = !this.data.liked;
      var indexToUpdate = collection.indexOf(this.data);


      console.log('Liking item: ', this.data, ' from index: ', indexToUpdate);
      collection.splice(indexToUpdate, 1, this.data);
      
      localStorage.setItem('notes', JSON.stringify(collection));
      
      console.log('Model says: Am I liked?' , this.data.liked);
      
      return this;
    };

    this.remove = function() {
      console.log('Model says: I am a goner : ' , this.data);
      var indexToRemove = collection.indexOf(this.data);
      
      console.log('Removing item: ', this.data, ' from notes:', collection ,'index: ', indexToRemove);
      
      collection.splice(indexToRemove, 1);
      
      console.log('After remove the collection is: ', collection);
      
      localStorage.setItem('notes', JSON.stringify(notes));

>>>>>>> FETCH_HEAD
      return this;
    };
  };

  var initialRender = function() {
    console.log('this is the saved data:', JSON.parse(localStorage.getItem('notes')));

    if(('notes' in localStorage) && (JSON.parse(localStorage.getItem('notes')).length > 0)) {
<<<<<<< HEAD

      var savedNotes = JSON.parse(localStorage.getItem('notes')),
    
      notes = savedNotes.slice();

      i = 0,
      len = savedNotes.length;
      for(i; i < len; i += 1) {
        new View(savedNotes[i], elements.noteList).init();
      }
    
    } else {
      elements.noNotesFound.classList.remove('hidden'); // if no notes exist in localstorage, show the "you have no notes yer" message
    }

  };
  
=======
    
      console.log('We have localStorage. Notes from it are: ', notes);
      
      notes = JSON.parse(localStorage.getItem('notes')).slice();

      var i = 0,
      len = notes.length, 
      loadedNote;

      for(i; i < len; i += 1) {
        loadedNote = new Model(notes[i], notes);  
        new View(loadedNote, elements.noteList).init();
      }
    
    } else {
      elements.noNotesFound.removeClass('hidden');
    }

  };

>>>>>>> FETCH_HEAD
  
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

<<<<<<< HEAD
})();
=======
})(window, document, jQuery);
>>>>>>> FETCH_HEAD

window.addEventListener('DOMContentLoaded', app.main.init);
