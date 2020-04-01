const tokenizer = require('./tokenizer.js');
const parser = require('./parser.js');
const transformer = require('./transformer.js');
const codeGenerator = require('./codeGenerator.js');

var input = "(add 2 (subtract 4 2))";
var tokens = tokenizer.tokenizer(input);
var ast = parser.parser(tokens);
var newAst = transformer.transformer(ast);
var output = codeGenerator.codeGenerator(newAst);


console.log(output);  //"add(2, subtract(4, 2));"
