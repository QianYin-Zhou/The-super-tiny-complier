//2.转换阶段 转换器
exports.transformer = function(ast) {
	var newAst = {
		type: 'Program',
		body: []
	};
	ast._context = newAst.body;
	//调用遍历器
	traverser(ast, {
		NumberLiteral: function(node, parent) {
			parent._context.push({
				type: 'NumberLiteral',
				value: node.value
			});
		},
		CallExpression: function(node, parent) {
			var expression = {
				type: 'CallExpression',
				callee: {
					type: 'Identifier',
					name: node.name
				},
				arguments: []
			};
			node._context = expression.arguments;
			if (parent.type !== 'CallExpression') {
				expression = {
				  type: 'ExpressionStatement',
				  expression: expression
				};
		    }
			parent._context.push(expression);
		}
		
	})
	
	return newAst; //返回新的抽象语法树
}

//遍历器
function traverser(ast, visitor) { 

	function traverseArray(array, parent) {
		array.forEach(function(child) {
			traverseNode(child, parent);
		})
	}
	
	function traverseNode(node, parent) {
		var method = visitor[node.type];
		if(method) {
			method(node, parent);
		}
		
		switch(node.type) {
			case 'Program':
				traverseArray(node.body, node);
				break;
			case 'CallExpression':  //遍历子节点
				traverseArray(node.params, node);
			    break;
			case 'NumberLiteral':
			    break;
			default:
			    throw new TypeError(node.type);
		}
	}
  
	traverseNode(ast, null); //ast树并无父节点
}