var app = app || {};

app.main  = (function(w, d, $, _) {  

  var elements = {
    noteField : $('.write-note'),
    noteSubmit : $('.submit-note'),
    noteList : $('.notes'),
    noNotesFound : $('.no-notes-found'),
    status : $('.status'),
    noteCount : $('.status').find('.note-count'),
    likeCount : $('.status').find('.like-count')
  };

  var notes = [];


  var attachEvents = function() {

    elements.noteSubmit.on('click', function(event) {
      event.preventDefault();
      var fieldValue = elements.noteField.val();

      var newNote = new Model({ noteBodyText : fieldValue, liked: false }, notes).save();
      
      new View(newNote, elements.noteList).init();
      
      elements.noteField.val('');

    });

    app.events.subscribe('status:update', updateStatus);

    window.addEventListener('hashchange', function(e) {
      e.preventDefault();
      console.log('hash just changed'); 
      app.router.route();
    });

  };

  var View = function(note, containerEl) {
    var index = notes.indexOf(note),
        that = this;

    this.render = function() {



      this.listItem = $('<li></li>');
      this.paragraph = $('<p></p>');
      this.actions = $('<ul></ul>');
      this.removeButton = $('<li></li>');
      this.likeButton = $('<li></li>');


      this.listItem.addClass('note');
      this.actions.addClass('actions');
      
      this.removeButton.addClass('remove icon-cancel');
      
      this.likeButton.addClass('like icon-heart');


      this.paragraph.text(note.data.noteBodyText);
      

      this.actions.append(this.removeButton);
      this.actions.append(this.likeButton);
      this.listItem.append(this.paragraph);
      this.listItem.append(this.actions);

      if (note.data.liked) {
        this.likeButton.addClass('liked');
      }
      elements.noteList.prepend(this.listItem);

    
      elements.noNotesFound.addClass('hidden');

      return this;     
    };

    this.like = function() {
      note.like(); // update the "liked" in our Model (data)
      console.log('View says: am I liked?', note.data.liked);

      that.likeButton.toggleClass('liked'); 
      app.events.publish('status:update', [notes.length, _.where(notes,{liked : true}).length]);

    };

    this.remove = function() {
      
      console.log('View says: I am a goner');
      that.listItem.remove();
      note.remove(); // update the data by calling the remove method from Model
      
      if(elements.noteList.children().length === 0) {
        elements.noNotesFound.removeClass('hidden');  // Show the "you have no notes yet" message, if all the notes are deleted
      }

      app.events.publish('status:update', [notes.length, _.where(notes,{liked : true}).length]);
    };
    this.attachEvents = function() {
      this.likeButton.on('click', this.like);
      this.removeButton.on('click', this.remove);
    };
    
    this.init = function() {
      app.events.publish('status:update', [notes.length, _.where(notes,{liked : true}).length]);
      this.render();
      this.attachEvents();
      return this;
    };

  };


  var Model = function(noteData, collection) {
   
    this.data = noteData;
    
    this.save = function() {
     
      collection.push(this.data);
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

      return this;
    };
  };

  var initialRender = function() {
    console.log('this is the saved data:', JSON.parse(localStorage.getItem('notes')));

    if(('notes' in localStorage) && (JSON.parse(localStorage.getItem('notes')).length > 0)) {
    
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
      app.events.publish('status:update', [0,0]);
    }
    

  };

  var updateStatus = function(counts) {
      console.log('updating notes count with args', counts);
      elements.noteCount.text(counts[0]);
      elements.likeCount.text(counts[1]);
  };

  
  var init = function() {
    console.log('App init');
    attachEvents();
    initialRender();
    app.router.route();

  };
  
  return {
    init : init,
    notes : notes,
    elements : elements
  };

})(window, document, jQuery, _);

window.addEventListener('DOMContentLoaded', app.main.init);
