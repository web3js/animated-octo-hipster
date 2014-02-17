var app = (function(w, d) {

	var DOM = {
		'write-note-form' : d.querySelector('.write-note-form'),
		'write-note' : d.querySelector('.write-note'),
		'submit-note' :  d.querySelector('.submit-note'),
		'notes' : d.querySelector('.notes')
	};

	var sanitize = function(string) {
		return string.replace(/(^\s+|\s+$)/g,'');
	};
	var attachEvents = function() {
		DOM['submit-note'].addEventListener('click', function(e) {
			e.preventDefault();
			notes.push(new Note(sanitize(DOM['write-note'].value), DOM['notes']).init());
			DOM['write-note'].value = '';
		});
	};

	var Note = function(text, list) {
		this.text = text;
		this.list = list;
		this.listItem = d.createElement('li');
		this.paragraph = d.createElement('p');
		this.actions = d.createElement('ul');
		this.likeButton = d.createElement('li');
		this.removeButton = d.createElement('li');
		this.liked = false;
		
		var that = this; // We will use this var in like(); and remove(); method. 
		this.like = function() {
			/* 	NOTE: in the context of this function
				whenever you need to call a method or property
				from Note(); scope, instead of calling: "this.liked", use "that.liked"
				Will explain this in class Thursday
			 */

			// implement the method logic.
			// This method should:
			// 1 - Toggle the class ".liked" to the like button.
			// 2 - Toggle the "liked" boolean.
		};
		this.remove = function() {
			/* 	NOTE: in the context of this function
				whenever you need to call a method or property
				from Note(); scope, instead of calling: "this.liked", use "that.liked"
				Will explain this in class Thursday
			 */

			// implement the method logic.
			// This method should:
			// 1 - Delete the note from the screen
			// 2 - Delete the note from the "notes" array
		};
		this.attachEvents = function() {
			this.likeButton.addEventListener('click', function() {
				// Call the like method here.
			});
			this.removeButton.addEventListener('click', function() {
				// Call the remove method here.
			});
		};
		this.init = function() {
			this.listItem.className += 'note';
			this.paragraph.innerHTML = this.text;
			this.listItem.appendChild(this.paragraph);
			this.actions.className += 'actions';
			this.likeButton.className += 'like icon-heart';
			this.removeButton.className += 'remove icon-cancel';
			this.actions.appendChild(this.removeButton);
			this.actions.appendChild(this.likeButton);
			this.listItem.appendChild(this.paragraph);
			this.listItem.appendChild(this.actions);
			this.list.appendChild(this.listItem);
			this.attachEvents();
			return this;
		}

	};

	var notes = [];

	var init = function() {
		console.log('App init');
		attachEvents();
	};

	return {
		DOM : DOM,
		attachEvents : attachEvents,
		init : init,
		notes : notes
	};


})(window, document);

window.addEventListener('DOMContentLoaded', app.init);

