const Parser = require("jison").Parser;
const fs = require("fs");
const path = require("path");

let source = fs.readFileSync(path.normalize(process.argv[2]), "utf8");
let parser = new Parser(source);
console.log(parser.generate());
//parser.parse()