/* define the template string with 1 placeholder */
var template = 'Hello <%= name %>';
/* feed the template string to _.underscore - it gives us back a templating function */
var render =  _.template(template);
/* create a super simple data structure */
var data = {name : 'Mani'};
/* feed the data into the templating function  */
var result = render({name : data.name});
/* append the result to body */
$('body').append(result);
/* log the result */
console.log(result);

/* that's all folks! */