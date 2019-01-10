const parser = require("./my_c_parser.js").parser;

var source = require('fs').readFileSync(require('path').normalize("code.c"), "utf8");
result = (JSON.stringify(parser.parse(source), null, 2));

require('fs').writeFileSync(require('path').normalize("AST"), result, "utf8");