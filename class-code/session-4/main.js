var app  = (function() {  
  
  var elements = {
    noteField : document.querySelector('.write-note'),
    noteSubmit : document.querySelector('.submit-note'),
    noteList : document.querySelector('.notes')
  };
  
  var notes = [];
  
  var attachEvents = function() {
    elements.noteSubmit.addEventListener('click', function(event) {
      event.preventDefault();
        var fieldValue = elements.noteField.value;
      notes.push(new Note(fieldValue).init());
        elements.noteField.value = '';
    });
  };
  var Note = function(noteBodyText) {
    this.noteBodyText = noteBodyText;
    this.listItem = document.createElement('li');
    this.paragraph = document.createElement('p');
    this.listItem.classList.add('note');
    this.paragraph.innerHTML = this.noteBodyText;
  this.listItem.appendChild(this.paragraph);
    this.actions = document.createElement('ul');
    this.actions.classList.add('actions');
    this.removeButton = document.createElement('li');
    this.likeButton = document.createElement('li');
    this.removeButton.classList.add('remove' ,'icon-cancel');
    this.likeButton.classList.add('like' ,'icon-heart');
    this.actions.appendChild(this.removeButton);
    this.actions.appendChild(this.likeButton);
    
    this.listItem.appendChild(this.actions);
    elements.noteList.appendChild(this.listItem);
    var that = this;
    this.liked = false;
    this.like = function() {
      that.liked = !that.liked;
      console.log('I am liked', that.liked);
        that.likeButton.classList.toggle('liked');
    };
    this.remove = function() {
      console.log('I am a goner');
        notes.splice(notes.indexOf(that),1);
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
  };
  
  
  
  var init = function() {
    console.log('App init');
    attachEvents();
    // all the functions that make the app run.
  };
  
  return {
    init : init,
    elements : elements,
    Note : Note,
    notes : notes
  };
})();

window.addEventListener('DOMContentLoaded', app.init);

/*
var dude = (function() {
  	
  var name = 'Justin Charles';
  var getName = function() {
  	return name;
  };
  var setName = function(newName) {
  	name = newName;
  };
  
  return { 
    getName : getName,
    setName : setName
  };  
  
})();


var shouter = (function() {
  var shout = function(name) {
     alert(name);
  };
  
  return {
    shout : shout
  };
  
})();
*/
/*
var Person = function(firstName, lastName, age, profession, hobby) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
  this.profession = profession;
  this.hobby = hobby;
};
*/