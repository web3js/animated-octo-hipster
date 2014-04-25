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

  var noteTemplate = $('.note-template').text();
  var compiledTemplate = _.template(noteTemplate);

  var attachEvents = function() {

    elements.noteSubmit.on('click', function(event) {
      event.preventDefault();
      var fieldValue = elements.noteField.val();

      var newNote = new Model({ noteBodyText : fieldValue, liked: false }, notes).save();
      
      new View(newNote, elements.noteList).init();
      
      elements.noteField.val('');

    });

    app.events.subscribe('status:update', updateStatus);
    app.events.subscribe('ajax:GETcomplete', initialRender);

  };

  var View = function(note, containerEl) {
    var index = notes.indexOf(note),
        that = this;

    this.render = function() {


      this.$listItem = $(compiledTemplate({note : note.data}));
      this.likeButton = this.$listItem.find('.like');
      this.removeButton = this.$listItem.find('.remove');

      console.log('list item is: ',this.$listItem);

      elements.noteList.prepend(this.$listItem);
      elements.noNotesFound.addClass('hidden');

      return this;     
    };

    
    this.init = function() {
      app.events.publish('status:update', [notes.length, _.where(notes,{liked : true}).length]);
      this.render();
      return this;
    };

  };


  var Model = function(noteData, collection) {
   
    this.data = noteData;
    
    this.save = function() {
      
      var test = JSON.stringify(this.data);
      
      


      return this;
    };

  
  };

  var initialRender = function(fetchedNotes) {
    
    if(fetchedNotes.length > 0) {
    
      console.log('We have notes stored in DB. Saved notes are: ', notes);
      notes = fetchedNotes.slice();

      var i = 0,
      len = fetchedNotes.length, 
      loadedNote;

      for(i; i < len; i += 1) {
        loadedNote = new Model(fetchedNotes[i], notes);  
        new View(loadedNote, elements.noteList).init();
      }
    
    } else {
      elements.noNotesFound.removeClass('hidden');
      app.events.publish('status:update', [0,0]);
    }


  };

  var initialFetch = function() {
    

  };

  var updateStatus = function(counts) {
      console.log('updating notes count with args', counts);
      elements.noteCount.text(counts[0]);
      
  };

  
  var init = function() {
    console.log('App init');
    attachEvents();
    initialFetch();
  };
  
  return {
    init : init,
    notes : notes,
    elements : elements,
    noteTemplate : noteTemplate ,
    compiledTemplate : compiledTemplate
  };

})(window, document, jQuery, _);

window.addEventListener('DOMContentLoaded', app.main.init);
