/* call in the app module we call "kitten" */
var kittens = kittens || {};

/* implement our events module under the "kitten" namespace */
kittens.events = (function(w, d, $) {
    /* 
        publish events.
        here's what it's all about:
            1 - publish an event with a name. This can be whatever string you want.
                Pass whatever data you want along with it.
                Here is an example of passing a config object with the event.
                e.g: 

                    events.publish('this:is:the:name:of:my:event', { sky : 'blue', banana : 'yellow' });
        
        This is a fantastic way to allow our app modules and pieces to talk to one abother.
        This is just a wrapper function for convenience, around jQuery's "trigger" eventing method.
        More on wrapper functions: http://blakeembrey.com/articles/wrapping-javascript-functions/
        More on jQuery trigger: http://api.jquery.com/trigger/
     */
	var publish = function (name, o) {
       
        console.log("EVENT [" + name + "]", o);
        $(document).trigger(name, [o]);
    
    };

    /* 
        subscribe to events. 
        here's what it's all about:
            2 - subscribe to events and invoke callback functions. the data that you passed along using "publish"
                will be magically passed into your callback function. This is a vert powerful feature:
                1st argument to "subscribe" method is the name of event.
                2nd argyment to "subscribe" method is the callback function.
                e.g:
                
                a)

                    events.subscribe('this:is:the:name:of:my:event', function(data) {
                       console.log(data); // puts ->  { sky : 'blue', banana : 'yellow' }
                    });

                Instead of writing the callback function as an anonymous funtion (nameless function) 
                as the second argument of "subscribe", you can also define your function elsewhere and just call it
                in your "subscribe":
                
                b)

                    var callback = function() {
                        console.log(data); // puts ->  { sky : 'blue', banana : 'yellow' }
                    };
                    events.subscribe('this:is:the:name:of:my:event', callback);

                b and a are identical. mostly stylistic choice. I like b better. neater. up to you.

        This is a fantastic way to allow our app modules and pieces to talk to one abother.
        This is just a wrapper function for convenience, around jQuery's "on" eventing method.
        More on wrapper functions: http://blakeembrey.com/articles/wrapping-javascript-functions/
        More on jQuery on: https://api.jquery.com/on/
     */

    var subscribe = function (name, callback) {
        
        $(document).on(name, function(event, o){            
            callback(o);
        });

    };

    /* return public methods to be consumed by other modules (main.js) */
    return {
    	publish : publish,
    	subscribe : subscribe
    }; 

})(window, document, jQuery)