var advancedCalculator = {
	results : {
		add : [],
		multiply : [],
		divide : [],
		subtract : []
	},
	calculate : function() {
		var args = Array.prototype.slice.call(arguments),
			operation = args.shift(),
			output,
			i,
			result = {},
			calcError = {
				name : 'Calculation Error',
				message : 'Seems like you did not enter the calculation method right. Try add, subtract, multiply and divide'
			}
			len = args.length;
			args.sort(function(a, b) {
				return b - a;
			});
		
		try {
			switch(operation) {
				case 'add':
					output = 0;
					for(i = 0; i < len; i ++) {
						output += args[i];
					}
					result['output'] = output;
					result['operands'] = args;
					this.results.add.push(result);
					console.log(this.results);
					result = {};
					output = 0;
					break;

				case 'subtract':
					output = args[0];
					for(i = 1; i < len; i ++) {
						output -= args[i];
					}
					result['output'] = output;
					result['operands'] = args;
					this.results.subtract.push(result);
					console.log(this.results);
					result = {};
					output = 0;
					break;
				case 'divide':
					output = args[0];
					for(i = 1; i < len; i ++) {
						output /= args[i];
					}
					result['output'] = output;
					result['operands'] = args;
					this.results.divide.push(result);
					result = {};
					output = 0;
					break;
				case 'multiply':
					output = 1;
					for(i = 0; i < len; i ++){
						output *= args[i];
					}
					result['output'] = output;
					result['operands'] = args;
					this.results.multiply.push(result);
					result = {};
					output = 0;
					break;
				default:
					throw calcError;
					break;
			}
		} catch(error) {
			console.log(error.name, ' : ', error.message);
		}

	}
};
