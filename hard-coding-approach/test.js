const compiler = require('./compiler');
    fs = require('fs');

function compileFile(filename) {
    let text = fs.readFileSync(filename).toString();
    //console.log(text);
    let tokens = compiler.tokenizer(text);
    //console.log(tokens);
    let ast = compiler.parser(tokens);
    compiler.go(ast);
};

process.argv.forEach(function(val) {
    console.log(val);
    if (val.slice(-2) == ".c")
        compileFile(val);
});
