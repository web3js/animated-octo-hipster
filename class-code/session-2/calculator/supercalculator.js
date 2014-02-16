var superCalculator = {
	results : {
		add : [],
		multiply : [],
		divide : [],
		subtract : []
	},
	calculate : function(operation, num1, num2) {
		if(operation == 'add') {
			var result = {
				operands : [num1,num2],
				givesUs : num1 + num2
			}
			this.results.add.push(result);
		} else if(operation == 'divide') {
			this.results.divide.push(num1/num2);
		} else if(operation == 'multiply') {
			this.results.multiply.push(num1 * num2);
		} else if(operation == 'subtract') {
			this.results.subtract.push(num1 - num2);
		} else {
			console.log('That ain\'t no operation!');
			return;
		}
	}
};