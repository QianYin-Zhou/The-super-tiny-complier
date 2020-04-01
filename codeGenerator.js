//3.代码生成器
function codeGenerator(node) {
	switch(node.type) {
		case 'Program':
			return node.body.map(codeGenerator)
				.join('\n');
		case 'ExpressionStatement':
			return (codeGenerator(node.expression) +';');  //加分号美观
		case 'CallExpression':
			return (
				codeGenerator(node.callee) +
				'(' +
					node.arguments.map(codeGenerator)
						.join(', ') +
				')'
			);
		case 'Identifier':
			return node.name;
		case 'NumberLiteral':
			return node.value;
		default:
			throw new TypeError(`西西编译器没看懂你这个字符: ${node.type}`);
	}
}

exports.codeGenerator = codeGenerator;