const parser = require("./my_c_parser.js").parser;

var source = require('fs').readFileSync(require('path').normalize("code.c"), "utf8");
console.log(JSON.stringify(parser.parse(source), null, 4));