var app = app || {};

app.main = (function(w, d, $, _) {

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
				liked : false
			}, notes).save();
			new View(newNote, elements.noteList).init();

			elements.noteField.val('');
		});
		app.events.subscribe('status:update', updateStatus);
		app.events.subscribe('ajax:GETcomplete', initialRender);
	};

	var View = function(mode, containerElement) {
		var that = this;

		this.render = function() {
			this.$listItem = $(compiledTemplate({ note : model.data}));
			this.likeButton = this.$listItem.find('.like');
			this.removeButton = this.$listItem.find('.remove');

			elements.noteList.prepend(this.$listItem);
			elements.noNotesFound.addClass('hidden');

			return this;

		};

		this.like = function() {
			model.like();
			that.likeButton.toggleClass('liked');
			return this;
		};
		this.attachEvents = function() {
			this.likeButton.on('click', this.like);
			this.removeButton.on('click', this.remove);
			return this;
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
		var that = this;

		this.save = function() {
			var stringified = JSON.stringify(this.data);
			$.ajax({
				url : '/api/notes',
				type : 'POST',
				data : { note : stringified },
				success : function(data, textStatus, jqXHR) {
					that._id = data._id;
					app.events.publish('ajax:POSTcomplete', data);
				},	
				error : function(jqXHR, textStatus, error) {	
					console.log('Shit went wrong', error);
				};
			});
			return this;
		};

	};
	


})(window, document, jQuery, _);