// In this exercise, I'm only commenting the parts pertaining to localstorage
// Find the rest of the comments in the model-view folder under session-5

var app = app || {};

app.main  = (function() {  

  var elements = {
    noteField : document.querySelector('.write-note'),
    noteSubmit : document.querySelector('.submit-note'),
    noteList : document.querySelector('.notes'),
    noNotesFound : document.querySelector('.no-notes-found')
  };

  /* 
    Inititally when we open our app, create an empty array if no localstorage records exist
    fill up the 'notes' array if localstorage has records.
  */

  var notes = JSON.parse(localStorage.getItem('notes')) || [];

  var attachEvents = function() {

    elements.noteSubmit.addEventListener('click', function(event) {
      event.preventDefault();
        var fieldValue = elements.noteField.value;
        
        /* 
          here we are calling the "save" method from our "model"
          Instead of manually pushing the new "model" to the notes "collection"
          we bake the "save" functionality into the model itself
          before we did: notes.push(newNote);
          now we do: (look down ther to find the Model and you'll see the "save" method there)
        */

        var newNote = new Model(fieldValue, notes).save();
        new View(newNote, elements.noteList).init();
        
        // empty the note field
        elements.noteField.value = '';

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
    /*
      We moved all the functionality pertaining to 
      displaying the note to "rendr" method
    */

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

      this.paragraph.innerHTML = note.noteBodyText;
      this.actions.appendChild(this.removeButton);
      this.actions.appendChild(this.likeButton);
      this.listItem.appendChild(this.paragraph);
      this.listItem.appendChild(this.actions);

      addAsFirstChild(elements.noteList, this.listItem);

      /*
        Hide the "You have no notes" message
      */

      elements.noNotesFound.classList.add('hidden');

      return this;     
    };
    /* 
      now that our model and view both have 'like' method,
      We use the like method in our View to:
        call the "like" method on our Model
        update the UI 
    */

    this.like = function() {
      note.like(); // update the "liked" in our Model (data)
      console.log('View says: am I liked?', note.liked);
      that.likeButton.classList.toggle('liked'); // update the UI and show a red heart
    };
    
    /* 
      now that our model and view both have 'remove' method,
      we use them separately for separate reasons.
      Here in our View we only delete the visual representation of our note (our note view)
      AND call the remove method on the same note's "model". Watch:
    */

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
      // render the note  
      this.render();
      // attach all the event listeners
      this.attachEvents();
      return this;
    };

  };


  var Model = function(noteBodyText, collection) {
    this.noteBodyText = noteBodyText;
    this.liked = false;
    
    /*
      save: new functionality we added to the Model. It means: add me to the collection
      of notes, and save me in localstorage
    */

    this.save = function() {
      collection.push(this);
      localStorage.setItem('notes', JSON.stringify(collection));
      return this;
    };

    /*
      like: new functionality we added to the Model. It means: update the "liked" property of the data.
      and update the records in localstorage
    */
    
    this.like = function() {
      this.liked = !this.liked;
      localStorage.setItem('notes', JSON.stringify(notes));
      console.log('Model says: Am I liked?' , this.liked);
    };
    
    /*
      remove: new functionality. It means: remove the DATA from the localstorage and notes collection
    */
    this.remove = function() {
      console.log('Model says: I am a goner');
      collection.splice(collection.indexOf(this), 1);
      localStorage.setItem('notes', JSON.stringify(collection));
      return this;
    };
  };
  
  /* 
    New function.
    read the description below.
    If there are notes in the localstorage, render those notes. If not, show the "you have no notes yet" message.
  */
  var initialRender = function() {
    console.log('this is the saved data:', JSON.parse(localStorage.getItem('notes')));
    /* 
      check to see if our localStorage has "notes"
      AND, see if inside "notes" in localStorage we actually have something stored.
    */
    if(('notes' in localStorage) && (JSON.parse(localStorage.getItem('notes')).length > 0)) {
    
    /*
      localstorage JSON needs to be transformed to Objects so we can use them: JSON.parse() is here to help.
      read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
    */


      var savedNotes = JSON.parse(localStorage.getItem('notes')),
      
      /* Here we load all the notes we read from localStorage to our "notes array"   
      */
      notes = savedNotes.slice();
      
      /* 
        What we gained from JSON.parse is an array. Remember? We pushed our "notes" array to localstorage.
        It is time to iterate on this array!
        we need to use the good old "for loop"
        But we are pro JS coders now. And what pro js coders do,
        is instead of doing:

        for(var i = 0 ; i < array.length; i ++) {
          // do something recursively
        }

        they define the variables used in the for loop ONCE so you don't recreate them everytime!

        var i = 0; // once declared outside the for loop
        var len = array.length // once delcared outside the scope
        i += 1 is the same as i ++ 
        I hear i += 1 is beter than i ++; Don't ask me why. But really, it doesn't matter.
        This is just a "pro tip". You can write your for loops however you want.

      */

      i = 0,
      len = savedNotes.length;
      for(i; i < len; i += 1) {
        new View(savedNotes[i], elements.noteList).init();
      }
    
    } else {
      elements.noNotesFound.classList.remove('hidden'); // if no notes exist in localstorage, show the "you have no notes yer" message
    }

  };
  
  
  var init = function() {
    console.log('App init');
    attachEvents();
    initialRender();

  };
  
  return {
    init : init,
    elements : elements,
    notes: notes
  };

})();

window.addEventListener('DOMContentLoaded', app.main.init);
