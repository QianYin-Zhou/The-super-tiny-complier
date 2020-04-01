### 超小编译器描述
##### 模仿跟着敲的小项目，我认为对于理解编译器原理有一定帮助，顺便学习mocha怎么使用 
>引自掘金社区[文章](https://juejin.im/post/5e802e41e51d4546b659b31b)
- [x] console测试通过
- [x] mocha 暂时不会写
```
	npm run compile   //执行node start.js 返回output
	npm test  //使用 mocha测试
```
#### 编译器原理
##### 大多数编译器可以分成三个阶段：解析（Parsing），转换（Transformation）以及代码生成（Code Generation）
 1. *解析* 是将最初原始的代码转换为一种更加抽象的表示（译者注：即AST）。
 2. *转换* 将对这个抽象的表示做一些处理，让它能做到编译器期望它做到的事情。
 3. *代码生成* 接收处理之后的代码表示，然后把它转换成新的代码。
##### 1.解析阶段
```
	/**
	 * 解析（Parsing）
	 * -------
	 *
	 * 解析一般来说会分成两个阶段：词法分析（Lexical Analysis）和语法分析（Syntactic Analysis）。
	 *
	 * 1. *词法分析*接收原始代码，然后把它分割成一些被称为 Token 的东西，这个过程是在词法分析
	 *    器（Tokenizer或者Lexer）中完成的。
	 *
	 *    Token 是一个数组，由一些代码语句的碎片组成。它们可以是数字、标签、标点符号、运算符，
	 *    或者其它任何东西。
	 *
	 * 2. *语法分析* 接收之前生成的 Token，把它们转换成一种抽象的表示，这种抽象的表示描述了代
	 *    码语句中的每一个片段以及它们之间的关系。这被称为中间表示（intermediate representation）
	 *    或抽象语法树（Abstract Syntax Tree， 缩写为AST）
	 *
	 *    抽象语法树是一个嵌套程度很深的对象，用一种更容易处理的方式代表了代码本身，也能给我们
	 *    更多信息。
	 *
	 * 比如说对于下面这一行代码语句：
	 *
	 *   (add 2 (subtract 4 2))
	 *
	 * 它产生的 Token 看起来或许是这样的：
	 *
	 *   [
	 *     { type: 'paren',  value: '('        },
	 *     { type: 'name',   value: 'add'      },
	 *     { type: 'number', value: '2'        },
	 *     { type: 'paren',  value: '('        },
	 *     { type: 'name',   value: 'subtract' },
	 *     { type: 'number', value: '4'        },
	 *     { type: 'number', value: '2'        },
	 *     { type: 'paren',  value: ')'        },
	 *     { type: 'paren',  value: ')'        }
	 *   ]
	 *
	 * 它的抽象语法树（AST）看起来或许是这样的：
	 *
	 *   {
	 *     type: 'Program',
	 *     body: [{
	 *       type: 'CallExpression',
	 *       name: 'add',
	 *       params: [{
	 *         type: 'NumberLiteral',
	 *         value: '2'
	 *       }, {
	 *         type: 'CallExpression',
	 *         name: 'subtract',
	 *         params: [{
	 *           type: 'NumberLiteral',
	 *           value: '4'
	 *         }, {
	 *           type: 'NumberLiteral',
	 *           value: '2'
	 *         }]
	 *       }]
	 *     }]
	 *   }
	 */
```
##### 2.解析阶段
```
	/**
	 * 转换（Transformation）
	 * --------------
	 *
	 * 编译器的下一步就是转换。它只是把 AST 拿过来然后对它做一些修改。它可以在同种语言下操
	 * 作 AST，也可以把 AST 翻译成全新的语言。
	 *
	 * 下面我们来看看该如何转换 AST。
	 *
	 * 你或许注意到了我们的 AST 中有很多相似的元素，这些元素都有 type 属性，它们被称为 AST
	 * 结点。这些结点含有若干属性，可以用于描述 AST 的部分信息。
	 *
	 * 比如下面是一个“NumberLiteral”结点：
	 *
	 *   {
	 *     type: 'NumberLiteral',
	 *     value: '2'
	 *   }
	 *
	 * 又比如下面是一个“CallExpression”结点：
	 *
	 *   {
	 *     type: 'CallExpression',
	 *     name: 'subtract',
	 *     params: [...nested nodes go here...]
	 *   }
	 *
	 * 当转换 AST 的时候我们可以添加、移动、替代这些结点，也可以根据现有的 AST 生成一个全新
	 * 的 AST
	 *
	 * 既然我们编译器的目标是把输入的代码转换为一种新的语言，所以我们将会着重于产生一个针对
	 * 新语言的全新的 AST。
	 * 
	 *
	 * 遍历（Traversal）
	 * ---------
	 *
	 * 为了能处理所有的结点，我们需要遍历它们，使用的是深度优先遍历。
	 *
	 *   {
	 *     type: 'Program',
	 *     body: [{
	 *       type: 'CallExpression',
	 *       name: 'add',
	 *       params: [{
	 *         type: 'NumberLiteral',
	 *         value: '2'
	 *       }, {
	 *         type: 'CallExpression',
	 *         name: 'subtract',
	 *         params: [{
	 *           type: 'NumberLiteral',
	 *           value: '4'
	 *         }, {
	 *           type: 'NumberLiteral',
	 *           value: '2'
	 *         }]
	 *       }]
	 *     }]
	 *   }
	 *
	 * 对于上面的 AST 的遍历流程是这样的：
	 *
	 *   1. Program - 从 AST 的顶部结点开始
	 *   2. CallExpression (add) - Program 的第一个子元素
	 *   3. NumberLiteral (2) - CallExpression (add) 的第一个子元素
	 *   4. CallExpression (subtract) - CallExpression (add) 的第二个子元素
	 *   5. NumberLiteral (4) - CallExpression (subtract) 的第一个子元素
	 *   6. NumberLiteral (2) - CallExpression (subtract) 的第二个子元素
	 *
	 * 如果我们直接在 AST 内部操作，而不是产生一个新的 AST，那么就要在这里介绍所有种类的抽象，
	 * 但是目前访问（visiting）所有结点的方法已经足够了。
	 *
	 * 使用“访问（visiting）”这个词的是因为这是一种模式，代表在对象结构内对元素进行操作。
	 *
	 * 访问者（Visitors）
	 * --------
	 *
	 * 我们最基础的想法是创建一个“访问者（visitor）”对象，这个对象中包含一些方法，可以接收不
	 * 同的结点。
	 *
	 *   var visitor = {
	 *     NumberLiteral() {},
	 *     CallExpression() {}
	 *   };
	 *
	 * 当我们遍历 AST 的时候，如果遇到了匹配 type 的结点，我们可以调用 visitor 中的方法。
	 *
	 * 一般情况下为了让这些方法可用性更好，我们会把父结点也作为参数传入。
	 */
```
##### 3.代码生成阶段
```
	/**
	 * 代码生成（Code Generation）
	 * ---------------
	 *
	 * 编译器的最后一个阶段是代码生成，这个阶段做的事情有时候会和转换（transformation）重叠，
	 * 但是代码生成最主要的部分还是根据 AST 来输出代码。
	 *
	 * 代码生成有几种不同的工作方式，有些编译器将会重用之前生成的 token，有些会创建独立的代码
	 * 表示，以便于线性地输出代码。但是接下来我们还是着重于使用之前生成好的 AST。
	 *
	 * 我们的代码生成器需要知道如何“打印”AST 中所有类型的结点，然后它会递归地调用自身，直到所
	 * 有代码都被打印到一个很长的字符串中。
	 * 
	 */
```
