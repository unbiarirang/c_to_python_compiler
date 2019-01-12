## jison parser usage

1. `npm install` to install the dependencies first
2. Write the token rules and grammar rules in `my_c_parser.bison`.
3. `c_to_python.js` uses `my_c_parser.bison` as an input (hard coding).
4. `node c_to_python.js kmp.c` to parse the c code and get `kmp_AST.json` and `kmp.py`.
