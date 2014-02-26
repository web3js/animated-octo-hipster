
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