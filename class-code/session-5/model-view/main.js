/*
  Here we "namespace" our app. Effectively creating an encapsulated object
  including public and private properties and methods.
  The root object here is called "app", which is defined at the very top.
  Everything in our app WILL sit inside this module.

  When we declare:

    var app = app || {};

  What we are doing is, we are first testing to see some other file (another javascript module) 
  somewhere else in our codebase has already created the "app" object.
  If so, it will use that object as a base. 
  But if "app" has not been created yet, we simply fallback to creating it for the first time.

  In human language this line:

    var app = app || {};

  Means: 

    If app has been created, grab it so I can use it and put some more functionality to it.
    If it's not around go ahead and give me a nice clean empty object so I can feel it with 
    my properties and methods.    

*/
var app = app || {};

/* 
  
  In this file, we are writing the logic for one "module" of different modules that sit inside our app's namespace.
  So far, we only have one module. This very file you are looking at.
  This will be the main file. The file that initializes your app, and mediates different modules.
  As we add to our codebase, we will write other modules that will be in charge of other things, and will have other names.
  But we will stick with the name of the file, and keep the filenames consistent with the module name.

  So for example, our app will have the following modules and the file system would look like:

    main.js     ->    app.main
    router.js   ->    app.router
    utils.js    ->    app.utils
    models.js   ->    app.models
    views.js    ->    app.views

  The combination of these files (modules) working together will be our "architecture". 
  Router takes care of tying all the knots and routing requests,
  models contains logic for our data models, view.js will contains view and rendering functionality,
  in utils we keep a bunch of reusable handy functions we might want to use along the way.
  Think of it as your toolbox. And your main.js starts your app and makes sure things are fine.


*/
app.main  = (function() {  

/*
  Again, a reminder. We use an Immediately Invoked Function that returns an object. Which is why app.main is an Object:

    var app = app || {};
    app.main = (function() {
        
        //private stuff
        var somethingPrivate = function() {
          alert('I am private!');
        };

        // public stuff which will be returned below:
        var somethingPublic = function() {
            alert('I am public!');
        };

        return {
          somethingPublic : somethingPublic
        };

    })();

    console.log(app.main);
    // puts: Object {somethingPublic: function}
  */
  
  /*
    Below, we keep a reference to DOM nodes that we use all the time.
    Doing this has multiple benefites.
    Well first of all, you don't have to remember the name of all the classess and ID's in yout HTML
    to be able to grab elements you want. You just look it up once, deine it once and keep referencing it with a nice legible name:


      //instead of having to do this EVERY TIME you need an element: 
      document.querySelector('.run-button').addEventListener('click', run);

      //you just define it once and keep calling it by the name you gave it:
      elements.run.addEventListener('click', run); 

    Also, as your app gets mote complex and grows in markup (longer html files or template files)
    It will get more costly for your browser to traverse all the DOM nodes on yout page to fetch your element.
    It fetches them once, stores a reference to them and keeps calling them by that reference. Better performance, cleaner code, 
    easier maintainability.


  */

  var elements = {
    noteField : document.querySelector('.write-note'),
    noteSubmit : document.querySelector('.submit-note'),
    noteList : document.querySelector('.notes')
  };

  /*
    "notes" is just an array in which we keep our notes.
    I am just assigning it to the "window" object so it is global and I can access it from the console.
  */  
  notes = [];

  /*
    Put all the "event handling" logic here.
    What is event handling you may ask?
    You have used them all over the place:
    click functions are a common example. 
    But events can do much much more and we will learn about this soon.
    Whatever code you have that has anything like:

    elements.el.addEventListener('click', function(e) {
      e.preventDefault();
      // some logic
    });

    Or using jQuery: - which we will run through pretty soon:


      $('el').on('click', function(e) {
        e.preventDefault();
        // some logic
      });
    
    Put all of that in one function.
    We will call them ONCE when initializing our app.
    But don't worry. All our event listeners (i.e: all the buttons that are waiting to be clicked, to run some code)
    Will keep looking out for their events, to do their thing. 
    In technical terms, they will keep "listening" to events, to run their "callback" functions.

  */
  var attachEvents = function() {

    elements.noteSubmit.addEventListener('click', function(event) {
      event.preventDefault();
        var fieldValue = elements.noteField.value;
        var newNote = new Model(fieldValue);
        notes.push(newNote);
        console.log(newNote);
        new View(newNote, elements.noteList).init();
        elements.noteField.value = '';

    });
  }
  /*
    A simple utility function that adds new elements to the beginning of a list.
    The native DOM methods don't suport this.
    parent.appendChild('child'); will add "child" as the last element of "parent"
    so we write it ourselves.
  */

  var addAsFirstChild = function(parent, child) {
    var parentNode = parent,
        childNode = child;

    if(parentNode.firstChild) {
      parentNode.insertBefore(child, parent.firstChild);
    } else {
      parentNode.appencChild(child);
    }

  };
  


  var View = function(model, containerEl) {
    
    // we save a reference to the index of this note model so when we want to delete
    // it from the "notes" array, we know which one to throw away.
    var index = notes.indexOf(model);

    this.listItem = document.createElement('li');
    this.paragraph = document.createElement('p');
    this.actions = document.createElement('ul');
    this.removeButton = document.createElement('li');
    this.likeButton = document.createElement('li');

    this.listItem.classList.add('note');
    this.actions.classList.add('actions');
    this.removeButton.classList.add('remove' ,'icon-cancel');
    this.likeButton.classList.add('like' ,'icon-heart');

    this.paragraph.innerHTML = model.noteBodyText;
    this.actions.appendChild(this.removeButton);
    this.actions.appendChild(this.likeButton);
    this.listItem.appendChild(this.paragraph);
    this.listItem.appendChild(this.actions);     
    
    // When we bind "events" (i.e: click) the context of "this" changes, and it becomes
    // bound to the object we clicked. To escape from that problem, we can save a reference
    // to "this" and call it "that" for example. Then, notice how in the methods that we are calling
    // in our "event" handling (clicking on remove and like button) we refer to the object
    // properties not with "this" but with "that".
    var that = this;

    this.like = function() {
      model.liked = !model.liked;
      console.log('I am liked', model.liked);
      that.likeButton.classList.toggle('liked');
    };
    this.remove = function() {
      console.log('I am a goner');
      // splice: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
      notes.splice(index,1);
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

  /* 
    
    Our app should have nice containers that help of modularize and organize data in predefined shapes.
    This app has only 1 tiny data model: It holds the data for a single note.

    The benefit of creating these pre-made modular containers for our data is a clean, easily
    accessible modular data structure that can be then stored, retrieved, updated and deleted from
    a database easily. In case of working with a database like mongodb for example,
    you will soon see how this way of structuring the data can pay off when communicating with the database.
    (we will discuss databases later in the semester);

    We talked a little about "MVC", and we will cover one of these MV* frameworks
    later in the semster. Either Backbone or Angular. This exercise of creating models
    will prepare you to approach those frameworks with open eyes and with a fundamental 'nderstanding
    of Javascript architecture. Let's read Backbone's definition of a "model":

      "Models are the heart of any JavaScript application, 
      containing the interactive data as well as a large part of the logic surrounding it: 
      conversions, validations, computed properties, and access control."

    For now, we will just keep our data in the "model". Later we will breathe more life into them.
    
  */

  var Model = function(noteBodyText) {
    this.noteBodyText = noteBodyText;
    this.liked = false;
  };
  
  /* 
    Initializing our app.
  */ 
  
  var init = function() {
    console.log('App init');
    attachEvents();
  };
  
  /* 
    returning all the Public properties and methods.  
  */

  return {
    init : init,
    elements : elements,
  };

})();

/* wait for all the elements in the page to load. The fire everything! */
window.addEventListener('DOMContentLoaded', app.main.init);
