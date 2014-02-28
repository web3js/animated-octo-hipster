var app = app || {};


app.main  = (function() {  
  
  var elements = {
    noteField : document.querySelector('.write-note'),
    noteSubmit : document.querySelector('.submit-note'),
    noteList : document.querySelector('.notes')
  };
  
  var notes = JSON.parse(localStorage.getItem('notes')) || [];

  var attachEvents = function() {

    elements.noteSubmit.addEventListener('click', function(event) {
      event.preventDefault();
        var fieldValue = elements.noteField.value;
        var newNote = new Model(fieldValue);
        notes.push(newNote);
        console.log(newNote);
        new View(newNote, elements.noteList).init();
        localStorage.setItem('notes', JSON.stringify(notes));
        console.log(localStorage.notes);
        elements.noteField.value = '';

    });

    window.addEventListener('hashchange', function() {
      console.log('hash just changed'); 
      route();
    });
  };

  var addAsFirstChild = function(parent, child) {
    var parentNode = parent,
      childNode = child;

    if(parentNode.firstChild) {
      parentNode.insertBefore(child, parent.firstChild);
    } else {
      parentNode.appencChild(child);
    }

  };
  
  requestHandlers = {
    archive : function() {
      // render archive view
    },
    compose : function() {
      // render compose view
    }
  };
  handle = {};

  handle['/'] = requestHandlers.archive;
  handle['archive'] = requestHandlers.archive;
  handle['compose'] = requestHandlers.compose;
  

  var route = function() {
    var hash = window.location.hash.slice(2);
    console.log(hash); 
    if(typeof handle[hash] === 'function') {
      requestHandlers[hash]();
    } else {
      console.log('404 not found');// 404
    }

  };

  var View = function(note, containerEl) {
    var index = notes.indexOf(note);
    
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
    
    var that = this;
    this.like = function() {
      notes[index].liked = !notes[index].liked;
      localStorage.setItem('notes', JSON.stringify(notes));
      console.log('I am liked', notes[index].liked);
      that.likeButton.classList.toggle('liked');
    };
    this.remove = function() {
      console.log('I am a goner');
      notes.splice(index,1);
      localStorage.setItem('notes', JSON.stringify(notes));
      elements.noteList.removeChild(that.listItem);
    };
    this.attachEvents = function() {
      this.likeButton.addEventListener('click', this.like);
      this.removeButton.addEventListener('click', this.remove);
    };
    this.init = function() {
      this.attachEvents();
        return this;
    };

    addAsFirstChild(elements.noteList, this.listItem);
  };


  var Model = function(noteBodyText) {
    this.noteBodyText = noteBodyText;
    this.liked = false;
  };
  
  
  
  var init = function() {
    console.log('App init');
    attachEvents();
    route();
  };
  
  return {
    init : init,
    elements : elements,
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);
