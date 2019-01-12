const compiler = require('./compiler');
    fs = require('fs');

function compileFile(filename) {
    let text = fs.readFileSync(filename).toString();
    let tokens = compiler.tokenizer(text);
    let ast = compiler.parser(tokens);
    compiler.codeGenerator(ast);
};

process.argv.forEach(function(val) {
    if (val.slice(-2) == ".c")
        compileFile(val);
});
