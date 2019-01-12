# c_to_python_transcriptor

c to python transcriptor in javascript

## jison parser usage

1. `npm install` to install the dependencies first
2. `cd ./jison/`
3. Write the token rules and grammar rules in `my_c_parser.bison`.
4. `c_to_python.js` uses `my_c_parser.bison` as an input (hard coding).
5. `node c_to_python.js palindrome.c` to parse the c code and get `palindrome_AST.json` and `palindromepy`.
6. `node c_to_python.js kmp.c` to parse the c code and get `kmp_AST.json` and `kmp.py`.

#### tips:
you can install bison extension for sytax highlighting.

#### test:
```node test.js code.c```

#### reference:
https://github.com/jamiebuilds/the-super-tiny-compiler
https://github.com/GerHobbelt/jison
https://github.com/zaach/jison
