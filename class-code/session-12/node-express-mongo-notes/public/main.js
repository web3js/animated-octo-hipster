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

      var newNote = new Model({ 
          noteBodyText : fieldValue,
          liked: false
      }, notes).save();
      new View(newNote, elements.noteList).init();
      
      elements.noteField.val('');

    });

    app.events.subscribe('status:update', updateStatus);
    app.events.subscribe('ajax:GETcomplete', initialRender);

  };

  var View = function(model, containerElement) {
    //console.log('___________________passed note model is:', note);
    var index = notes.indexOf(model),
        that = this;
        //console.log(note);
    this.render = function() {

      this.$listItem = $(compiledTemplate({note : model.data}));
      this.likeButton = this.$listItem.find('.like');
      this.removeButton = this.$listItem.find('.remove');

      //console.log('list item is: ',this.$listItem);

      elements.noteList.prepend(this.$listItem);
      elements.noNotesFound.addClass('hidden');

      return this;     
    };

    this.like = function() {
      model.like(); // update the "liked" in our Model (data)
      that.likeButton.toggleClass('liked'); // update the UI and show a red heart
      return this;
    };

    this.remove = function() {
      model.remove();
      that.$listItem.remove();
      if(containerElement.children().length === 0) {
        elements.noNotesFound.removeClass('hidden'); 
      }
    };
    
    this.attachEvents = function() {
      this.likeButton.on('click', this.like);
      this.removeButton.on('click', this.remove)
      return this;
    };

    this.init = function() {
      console.log('notes is this: ', notes);
      app.events.publish('status:update', [notes.length, _.where(notes,{liked : true}).length]);
      this.render();
      this.attachEvents();
      return this;
    };

  };


  var Model = function(noteData, collection) {
    this.data = noteData;
    var that = this;
    
    this.save = function() {
      
      // 1 - stringify the data
      var stringifiedData  = JSON.stringify(this.data);
      //console.log('Model.save says: stringified the data: ', stringifiedData);
      
      // 2 - Hit our API with a POST request and send the new note along.
      $.ajax({
        url : '/api/notes',
        type : 'POST',
        dataType : 'json',
        data : { note : stringifiedData },
        success : function(data, textStatus, jqXHR) {
          that._id = data._id;
          console.log('######################################################## model save data is: ', data, jqXHR, textStatus);
          
          //collection.push(data);
          app.events.publish('ajax:POSTcomplete', data);
        },
        error : function(jqXHR, textStatus, errorThrown) {
          console.log('wooops! something went wront. Here is the error: ', errorThrown);
        }
      
      });
      
      return this;
    };

  this.remove = function() {
      var id = this['_id'],
        ajaxUrl = '/api/notes/'+id; // add URL to "this"
        console.log('url is: ', ajaxUrl);
      $.ajax({
        url : ajaxUrl,
        type : 'DELETE',
        dataType : 'json',
        success : function(data, textStatus, jqXHR) {
          //window.res  =  res;
          //notes = _.clone(res);
          //app.events.publish('ajax:GETcomplete', notes);
          // Parse the json response
          
         console.log(data, 'delete success'); 
          
        }, error: function(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      }); 
      //console.log('my data is: ', this.data); 
      return this;
    };


    this.like = function() {
      
      var id = this['_id'],
        ajaxUrl = '/api/notes/'+id; // add URL to "this"
      this.data.liked = !this.data.liked;
      var stringifiedData  = JSON.stringify(this.data);
      $.ajax({
        url: ajaxUrl,
        type: 'PUT',
        dataType: 'json',
        data : { note : stringifiedData },
        success : function(data, textStatus, jqXHR) {
          app.events.publish('ajax:PUTcomplete', data);
        },
        error : function(jqXHR, textStatus, errorThrown) {
          console.log('wooops! something went wront. Here is the error: ', errorThrown);
        }
      });
      return this;
    };

  };

  var initialRender = function(notes) {
    if(notes.length > 0) {
      

      var i = 0,
      len = notes.length,
      note, 
      data,
      _id,
      model;
      for(i; i < len; i += 1) {
        note = notes[i];
        //console.log(i, ' note ', note);
        data = JSON.parse(note.note);
        //console.log('___id ', id);
        model = new Model(data, notes);
        model._id = note._id;
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~ initial render created this model: ', model);
        //console.log('____ initialRender says this is the model: ', Model);  
        new View(model, elements.noteList).init();
      }
    
    } else {
      elements.noNotesFound.removeClass('hidden');
      app.events.publish('status:update', [0,0]);
    }


  };

  var initialFetch = function() {
    $.ajax({
      url : '/api/notes',
      type : 'GET',
      dataType : 'json',
      success : function(res) {
        console.log('++++++ res : ', res);
        notes = _.clone(res);
        app.events.publish('ajax:GETcomplete', notes);
        // Parse the json response
        for(var i = 0; i < notes.length; i ++) {
          //console.log('note' + i + ' : ', JSON.parse(notes[i].note));  
        }
        
        
      }
    });
  };

  var updateStatus = function(counts) {
      //console.log('updating notes count with args', counts);
      elements.noteCount.text(counts[0]);
      
  };

  
  var init = function() {
    console.log('App init');
    attachEvents();
    initialFetch();
  };
  
  return {
    init : init,
  };

})(window, document, jQuery, _);

window.addEventListener('DOMContentLoaded', app.main.init);
