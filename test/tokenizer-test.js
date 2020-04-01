const assert = require('assert');
const tokenizer = require('../tokenizer.js');

var input = "(add 2 (subtract 4 2))"; //tokenizer的参数
var tokens = [   //tokenizer的预期值
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'add'      },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'subtract' },
  { type: 'number', value: '4'        },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: ')'        },
  { type: 'paren',  value: ')'        }
];

describe("#tokenizer()", () => {
	
	it('词法分析器tokenizer 测试成功!by cissy', () => {
	    assert.deepStrictEqual(tokenizer(input), tokens);   //strictEqual会报值具有相同的结构，但引用不相等的错误
	});
})