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

        var newNote = new Model({noteBodyText : fieldValue, liked: false}, notes).save();
        new View(newNote, elements.noteList).init();
        
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


  var Model = function(noteData, collection) {
    
    this.data = {
      noteBodyText : noteData.noteBodyText,
      liked : noteData.liked  
    };
    
    this.save = function() {
      collection.push(this.data);
      localStorage.setItem('notes', JSON.stringify(collection));
      return this;
    };
    
    this.like = function() {
      this.data.liked = !this.data.liked;
      collection.splice(collection.indexOf(this.data), 1, this.data);
      localStorage.setItem('notes', JSON.stringify(collection));
      console.log('Model says: Am I liked?' , this.data.liked);
      return this;
    };

    this.remove = function() {
      console.log('Model says: I am a goner');
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
      loadedNote;

      for(i; i < len; i += 1) {
        loadedNote = new Model(savedNotes[i], notes);
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
