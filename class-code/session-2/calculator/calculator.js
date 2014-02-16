var calculator = {

	results : [],
	add : function(num1, num2) {
		this.results.push(num1 + num2);
	},
	subtract : function(num1, num2) {
		this.results.push(num1 - num2);
	}, 
	divide : function(num1, num2) {
		this.results.push(num1 / num2);
	},
	multiply : function(num1, num2) {
		this.results.push(num1 * num2);
	},
	remainder : function(num1, num2) {
		this.results.push(num1 % num2);
	}
};