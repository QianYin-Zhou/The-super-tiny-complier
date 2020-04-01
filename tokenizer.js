// 1.词法分析器tokenizer
module.exports = function(input) {
	
	var current = 0;
	var tokens = [];
	
	while(current < input.length) {
		var char = input[current];
		
		if(char == '(') {
			tokens.push({ 
				type: 'paren',
				value: '(' ,
			});
			
			current++;
			continue;
		}
		
		if(char == ')') {
			tokens.push({ 
				type: 'paren',
				value: ')' ,
			});
			
			current++;
			continue;
		}
		
		var WHITESPACE = /\s/;
		if (WHITESPACE.test(char)) {   //是否为空格
			current++;
			continue;
		}
		
		var NUMBERS = /[0-9]/;
		if (NUMBERS.test(char)) {
			var value = '';
			while (NUMBERS.test(char)) {	//将数字挨个拼接
				value += char;
				char = input[++current];
			}
			tokens.push({
				type: 'number',
				value: value
			});
			continue;
		}
		
		var LETTERS = /[a-z]/i;
		if (LETTERS.test(char)) {   //函数名
			var value = '';
			while (LETTERS.test(char)) {
				value += char;
				char = input[++current];
			}
			tokens.push({
				type: 'name',
				value: value
			});
			continue;
		}
		
		throw new TypeError(`西西编译器没看懂你这个字符: ${char}`);  //退出while
	}
	
	return tokens;
}
