const compiler = require('./compiler');
    fs = require('fs');

function compileFile(filename) {
    let text = fs.readFileSync(filename).toString();
    let tokens = compiler.tokenizer(text);
    let ast = compiler.parser(tokens);
    let result = compiler.codeGenerator(ast);
    filename = filename.substring(0, filename.length - 2);
    fs.writeFile('./' + filename + '.py', result, function(err) {
        if (err)
          console.log("failed");
        else
          console.log("OK");
    })
};

process.argv.forEach(function(val) {
    if (val.slice(-2) == ".c")
        compileFile(val);
});
