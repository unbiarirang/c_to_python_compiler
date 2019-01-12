## jison parser usage

1. `npm install` to install the dependencies first
2. Write the token rules and grammar rules in bison files
3. `jison my_c_parser.bison` to get `my_c_parser.js`.
4. `c_to_python.js` uses `my_c_parser.js` as a module (hard coding).
5. `node c_to_python.js kmp.c` to parse the c code and get the `kmp_AST.json` and `kmp.py`.
