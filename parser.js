//2. 语法分析器（Parser)
exports.parser = function (tokens) {
	var current = 0;
	//递归函数
	function walk() {
		var token = tokens[current];
		
		if (token.type === 'number') {
		  current++;
		  return {
		    type: 'NumberLiteral',
		    value: token.value
		  };
		}
		
		if(token.value === '(' && token.type === 'paren') {
			token = tokens[++current];
			var node = {
				type: 'CallExpression',
				name: token.value,
				params: []
			};
			
			token = tokens[++current];
			
			while((token.type !== 'paren') || (token.type === 'paren' && token.value !== ')')) {
				node.params.push(walk());  //递归将嵌套函数正确放置到node中
				token = tokens[current];
			}
			
			current++;
			return node;
		}
		
		throw new TypeError(`西西编译器没看懂你这个字符: ${token.type}`); //way的时候抛出错误节点
	}
	
	var ast = {
	  type: 'Program',
	  body: []
	};
	while (current < tokens.length) {
	  ast.body.push(walk());
	}
	
	
	return ast; // 语法分析器返回 AST 
}