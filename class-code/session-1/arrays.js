// Arrays are comma separated values. Index starts at zero. 
// Mix and match datatypes as you wish.
var shoppingCart = ['banana', 'milk', 'orange', 'light bulb'];

console.log('arrays.js says: typeof shoppingCart is: ', typeof shoppingCart , ' and it has :' , shoppingCart.length , ' members. \n');
console.log('arrays.js says: Notice how "typeof" shoppingCart is object? Yeah. Most things in javascript are objects. We will learn more about this. \n');

// To get a value in an array:
var item = shoppingCart[0];
console.log('arrays.js says: This is the first item of shoppingCart: ', item, '\n');

// Now here are some neat useful array methods. 
// These methods are built in JavaScript.

// push: Add an item to the end of an array
shoppingCart.push('eggs');
console.log('arrays.js says: added 1 item at the last index of shoppingCart. shoppingCart is now: ', shoppingCart, ' and it now has:', shoppingCart.length, ' members. \n');

// pop : Removes an item from the end of array and returns it.
var lastItem = shoppingCart.pop();
console.log('arrays.js says: removed 1 item from the last index of shoppingCart. shoppingCart is now: ', shoppingCart, ' and it now has:', shoppingCart.length, ' members. \n\t\t\t\tThe removed value is: ', lastItem, ' \n');

// shift : Removed an item from the beginning of array and returns it:
var firstItem = shoppingCart.shift();
console.log('arrays.js says: removed 1 item from the first index of shoppingCart. shoppingCart is now: ', shoppingCart, ' and it now has:', shoppingCart.length, ' members. \n\t\t\t\tThe removed value is: ', lastItem, ' \n');

// unshift : Adds N number of elements to the beginning of the array and returns the new length.
var newLength = shoppingCart.unshift('butter', 'lettuce', 'bread');
console.log('arrays.js says: added 3 item to the beginning of shoppingCart. shoppingCart is now: ', shoppingCart, ' and it now has:', newLength, ' members.\n');

// slice : Copies elements from an array and returns the new array. You must define the beginning index, and optionally define the last index:
// Remember: Slice DOES NOT remove any elements from the array. It copies them.
var someItems = shoppingCart.slice(0,3);
console.log('arrays.js says: copied 3 items from index 0 to 3 from shoppingCart and put them in the new array someItems.\n\t\t\t\tshoppingCart is still:', shoppingCart,' and someItems is: ', someItems ,'\n');

// splice : Goes to a certain index in array, removes N elements, and adds N elements to it. It returns an array of removed elements.
var removedItems = shoppingCart.splice(2,3,'beer', 'tea', 'coffee', 'pie', 'beans');
console.log('arrays.js says: went to index 2, deleted 3 items, and added 5 elements. Now shoppingCart is:', shoppingCart ,'\n\t\t\t\tand deleted items stored removedItems are: ', removedItems,'\n');

// reverse : reverses an array
shoppingCart.reverse();
console.log('arrays.js says: reversed shoppingCart. Now shoppingCart is:', shoppingCart ,'\n');

// indexOf : returns the first index of an element in an array:
var beerIndex = shoppingCart.indexOf('beer');
console.log('arrays.js says: first index of beer in shoppingCart is:', beerIndex ,'\n');

// join : returns a string containing all the array elements, separated by what you pass to the join method.
var shoppingCartJoined = shoppingCart.join(' and ');
console.log('arrays.js says: shoppingCartJoined is: ', shoppingCartJoined ,'\n');

// toString : slams all elements together and returns a string. It doesn't allow you to define the separator like "join".
var shoppingCartString = shoppingCart.toString();
console.log('arrays.js says: shoppingCartString is: ', shoppingCartString ,'\n');

