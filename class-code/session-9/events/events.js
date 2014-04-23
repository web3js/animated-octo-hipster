var app = app || {};

app.events = (function(w, d, $) {

	var publish = function (name, o) {
       
        console.log("EVENT [" + name + "]", o);
        $(document).trigger(name, [o]);
    
    };

    var subscribe = function (name, callback) {
        
        $(document).on(name, function(event, o){            
            callback(o);
        });

    };

    var unsubscribe = function(name) {

        $(document).off(name);
    
    };

    return {
    	publish : publish,
    	subscribe : subscribe,
        unsubscribe : unsubscribe 
    }; 

})(window, document, jQuery);