# c_to_python_compiler

c to python javascript compiler

## jison parser usage

1. `npm install` to install the dependencies first
2. Write the token rules and grammar rules in bison file
3. `jison my_c_parser.bison` to get `my_c_parser.js`.
4. `node my_c_parser.js code.c` to parse the code and get the AST, but the result is not printed out.
5. Check `parser_usage_example.js` to see how to use the parser in js code and get the result.
6. Run `node parser_usage_example.js` to see the AST of `code.c` printed out.

#### tips:
you can install bison extension for sytax highlighting.

#### test:
```node test.js code.c```

#### reference:
https://github.com/jamiebuilds/the-super-tiny-compiler
