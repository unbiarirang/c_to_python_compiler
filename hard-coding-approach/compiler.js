'use strict';

let TokenType = { Number: 'number', String: 'string', Paren: 'parenthesis', Type: 'type', Name: 'name', Oper: 'operator', Punct: 'punctuation', Statm: 'statement' };

let punctuations = ':;,';
let parenthesis = '{}()[]';
let operators = ['=', '+', '-', '*', '/', '%', '==', '!=', '<', '<=', '>', '>=', '++', '--'];
let types = ['int', 'float', 'double', 'char', 'char*'];
let statements = ['if', 'else', 'for', 'while', 'return'];

/**
 * ============================================================================
 *                                   (/^▽^)/
 *                                THE TOKENIZER!
 * ============================================================================
 */

/**
 * We're gonna start off with our first phase of parsing, lexical analysis, with
 * the tokenizer.
 *
 * We're just going to take our string of code and break it down into an array
 * of tokens.
 *
 *   (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
 */
function tokenizer(input) {
  // A `current` variable for tracking our position in the code like a cursor.
  let current = 0;

  // And a `tokens` array for pushing our tokens to.
  let tokens = [];

  while (current < input.length) {

    // We're also going to store the `current` character in the `input`.
    let char = input[current];

    // skip include header line
    if (char === '#') {
      while (char !== '>') {
        current++;
        char = input[current];
      }
      current++;
      continue;
    }

    if (punctuations.indexOf(char) >= 0) {
      tokens.push({
        type: TokenType.Punct,
        value: char,
      });

      current++;
      continue;
    }

    if (parenthesis.indexOf(char) >= 0) {
      tokens.push({
        type: TokenType.Paren,
        value: char,
      });

      current++;
      continue;
    }

    if (operators.indexOf(char + input[current + 1]) >= 0) {
      tokens.push({
        type: TokenType.Oper,
        value: char + input[current + 1],
      });

      current += 2;
      continue;
    }

    if (operators.indexOf(char) >= 0) {
      tokens.push({
        type: TokenType.Oper,
        value: char,
      });

      current++;
      continue;
    }

    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = '';

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // After that we push our `number` token to the `tokens` array.
      tokens.push({ type: TokenType.Number, value });

      // And we continue on.
      continue;
    }

    // We'll start by checking for the opening quote:
    if (char === '"') {
      // Keep a `value` variable for building up our string token.
      let value = '';

      // We'll skip the opening double quote in our token.
      char = input[++current];

      // Then we'll iterate through each character until we reach another
      // double quote.
      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      // Skip the closing double quote.
      char = input[++current];

      // And add our `string` token to the `tokens` array.
      tokens.push({ type: TokenType.String, value });

      continue;
    }

    let LETTERS = /[a-z_*]/i;
    if (LETTERS.test(char)) {
      let value = '';

      // Again we're just going to loop through all the letters pushing them to
      // a value.
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      if (char.indexOf('*') >= 0 && char.indexOf('*') < char.length - 1)
        throw new TypeError('Wrong type');

      let type;
      if (types.indexOf(value) >= 0) type = TokenType.Type;
      else if (statements.indexOf(value) >= 0) type = TokenType.Statm;
      else type = TokenType.Name;
      // And pushing that value as a token with the type `name` and continuing.
      tokens.push({ type: type, value });

      continue;
    }

    // Finally if we have not matched a character by now, we're going to throw
    // an error and completely exit.
    throw new TypeError('I dont know what this character is: ' + char);
  }

  // Then at the end of our `tokenizer` we simply return the tokens array.
  return tokens;
}

/**
 * ============================================================================
 *                                 ヽ/❀o ل͜ o\ﾉ
 *                                THE PARSER!!!
 * ============================================================================
 */

/**
 * For our parser we're going to take our array of tokens and turn it into an
 * AST.
 *
 *   [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */

function parser(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (token.type === TokenType.Number) {
      current++;

      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    if (token.type === TokenType.String) {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    if (token.type === TokenType.Name
        && ((tokens[current + 1].type === TokenType.Punct
             && tokens[current + 1].value === ';')
          || (tokens[current + 1].type === TokenType.Paren
             && tokens[current + 1].value === ')'))) {
      current++;

      return {
        type: 'Variable',
        name: token.value
      };
    }

    // 1) int i; 2) char s[200]; 3) int i = 0; 4) int test() {} 5) int test(int x, int y) {}
    if (token.type === TokenType.Type) {
      let node = {};
      let vartype = token.value;

      // skip the type token
      token = tokens[++current];
      let dest = {
        vartype: vartype,
        name: token.value,
      };

      // skip the variable token
      token = tokens[++current];

      // int i;
      if (token.type === TokenType.Punct && token.value === ';') {
        node.type = 'VarDefExpression';
        node.dest = dest;
        node.dest.type = 'Variable';
        current++;
        return node;
      }
      // char s[200];
      else if (token.type === TokenType.Paren && token.value === '[') {
        node.type = 'VarDefExpression';
        node.dest = dest;
        node.dest.type = 'Variable';
        while (token.type !== TokenType.Paren ||
               (token.type === TokenType.Paren && token.value !== ']'))
          token = tokens[++current];

        current += 2;
        return node;
      }
      // int i = 0;
      else if (token.type === TokenType.Oper && token.value === '=') {
        node.type = 'VarDefExpression';
        node.dest = dest;
        node.dest.type = 'Variable';

        // skip the '=' token 
        token = tokens[++current];
        node.src = walk();

        token = tokens[current];
        if (token.type === TokenType.Punct && token.value === ';') {
          current++;
          return node;
        }

        throw new TypeError(token.type + token.value);
      }
      // int test(int x) {}
      else if (token.type === TokenType.Paren && token.value === '(') {
        node.type = 'FuncDefExpression';
        node.dest = dest;
        node.dest.type = 'Identifier'; 
        node.params = [];
        node.body = [];

        // skip the '(' token 
        token = tokens[++current];

        while (
          (token.type !== TokenType.Paren) ||
          (token.type === TokenType.Paren && token.value !== ')')
        ) {
          // we'll call the `walk` function which will return a `node` and we'll
          // push it into our `node.params`.
          //skip the ',' token
          if (token.type === TokenType.Punct && token.value === ',')
            token = tokens[++current];

          node.params.push(walk());
          token = tokens[current];
        }

        // skip the ')' token 
        token = tokens[++current];

        if (token.type === TokenType.Paren && token.value === '{') {
          token = tokens[++current];
          while (
            (token.type !== TokenType.Paren) ||
            (token.type === TokenType.Paren && token.value !== '}')
          ) {
            node.body.push(walk());
            token = tokens[current];
          }

          token = tokens[current];

          if (token.type === TokenType.Paren && token.value === '}') {
            current++;
            return node;
          }

          throw new TypeError(token.type + token.value);
        }

        throw new TypeError(token.type + token.value);
      } // int test(int x, int y) {
      else if ((token.type === TokenType.Paren && token.value === ')')
                || (token.type === TokenType.Punct && token.value ===',')) {
        node = dest;
        node.type = 'Variable';
        return node;
      }
      else
        throw new TypeError(token.type, token.value);
    }

    if (token.type === TokenType.Statm) {
      let node = {};
      switch (token.value) {
        case 'return':
          // skip the 'return' token
          current++;

          node = {
            type: 'RetExpression',
            value: walk()
          };

          token = tokens[current];
          if (token.type === TokenType.Punct && token.value === ';') {
            current++;
            return node;
          }

          break;
        case 'while':
          // skip the 'while' token
          token = tokens[++current];
          if (token.type !== TokenType.Paren || token.value !== '(')
            throw new TypeError(token.type, token.value);

          // skip the '(' token
          token = tokens[++current];
          node = {
            type: 'LoopExpression',
            condition: '',
            action: []
          };

          while (
            (token.type !== TokenType.Paren) ||
            (token.type === TokenType.Paren && token.value !== '{')
          ) {
            node.condition += token.value;
            token = tokens[++current];
          }

          // slice the last ')' character
          node.condition = node.condition.slice(0, -1);

          if (token.type !== TokenType.Paren || token.value !== '{')
            break;
          // skip the '{' token
          token = tokens[++current];

          while (
            (token.type !== TokenType.Paren) ||
            (token.type === TokenType.Paren && token.value !== '}')
          ) {
            node.action.push(walk());
            token = tokens[current];
          }

          // skip the '}' token
          current++;
          return node;
        case 'if':
          // skip the 'if' token
          token = tokens[++current];
          if (token.type !== TokenType.Paren || token.value !== '(')
            throw new TypeError(token.type, token.value);

          // skip the '(' token
          token = tokens[++current];
          node = {
            type: 'CondExpression',
            condition: '',
            true_action: [],
            false_action: []
          };

          while (
            (token.type !== TokenType.Paren) ||
            (token.type === TokenType.Paren && token.value !== '{')
          ) {
            node.condition += token.value;
            token = tokens[++current];
          }

          // slice the last ')' character
          node.condition = node.condition.slice(0, -1);
          if (token.type !== TokenType.Paren || token.value !== '{')
            break;
          // skip the '{' token
          token = tokens[++current];

          while (
            (token.type !== TokenType.Paren) ||
            (token.type === TokenType.Paren && token.value !== '}')
          ) {
            node.true_action.push(walk());
            token = tokens[current];
          }

          if (token.type !== TokenType.Paren || token.value !== '}')
            break;
          // skip the '}' token
          token = tokens[++current];

          if (token && token.type === TokenType.Statm && token.value === 'else') {
            // skip the 'else' token
            token = tokens[++current];

            if (token.type !== TokenType.Paren || token.value !== '{')
              break;
            // skip the '{' token
            token = tokens[++current];

            while (
              (token.type !== TokenType.Paren) ||
              (token.type === TokenType.Paren && token.value !== '}')
            ) {
              node.false_action.push(walk());
              token = tokens[current];
            }

            if (token.type !== TokenType.Paren || token.value !== '}')
              break;

            // skip the '}' token
            current++;
          }
          
          return node;
        default:
          throw new TypeError(token.type, token.value);
      }

      throw new TypeError(token.type, token.value);
    }

    // Next we're going to look for CallExpressions. We start this off when we
    // encounter an open parenthesis.
    // 1) len++;
    // 2) printf("hi");
    // 3) i = 1;
    // 4) i = 1 + 2;//TODO
    if (token.type === TokenType.Name) {
      // skip the name token
      let node = {};
      let name = token.value;
      token = tokens[++current];

      switch (token.type) {
        case TokenType.Oper:
          if (token.value === '++' || token.value === '--') {
            node.type = 'OpExpression';
            node.left = {
              type: 'Variable',
              vartype: 'int',
              name: name
            };
            node.right = {
              type: 'NumberLiteral',
              value: 1
            }

            if (token.value === '++')
              node.op = '+';
            else if (token.value === '--')
              node.op = '-';

            current++;
          }
          else if (token.value === '=') {
            node.type = 'AssginExpresion';
            node.dest = {
              type: 'Variable',
              name: name
            }
            current++;
            node.src = walk();
          }
          else
            throw new TypeError(token.type, token.value);

          break;
        case TokenType.Paren:
          if (token.value !== '(') break;

          node.type = 'CallExpression';
          node.name = name;
          node.params = [];

          // skip the '(' token
          token = tokens[++current];
          while (
            (token.type !== TokenType.Paren) ||
            (token.type === TokenType.Paren && token.value !== ')')
          ) {
            // we'll call the `walk` function which will return a `node` and we'll
            // push it into our `node.params`.
            //skip the ',' token
            if (token.type === TokenType.Punct && token.value === ',')
              token = tokens[++current];

            node.params.push(walk());
            token = tokens[current];
          }
          // skip the ')' token
          current++;
          break;
        default:
          throw new TypeError(token.type, token.value);
      } 

      token = tokens[current];
      if (token.type === TokenType.Punct && token.value === ';') {
        current++;
        return node;
      }

      throw new TypeError(token.type, token.value);

      node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };

      // We'll increment `current` to skip the name token and the parenthesis since we don't care
      // about it in our AST.
      current += 2;
      token = tokens[current];

      while (
        (token.type !== TokenType.Paren) ||
        (token.type === TokenType.Paren && token.value !== ')')
      ) {
        // we'll call the `walk` function which will return a `node` and we'll
        // push it into our `node.params`.
        if (token.type === TokenType.Punct && token.value === ',')
          token = tokens[++current];

        node.params.push(walk());
        token = tokens[current];
      }

      token = tokens[++current];
      if (token.type === TokenType.Punct && token.value === ';') {
        current++;
        return node;
      }

      throw new TypeError(token.type, token.value);
    }

    // Again, if we haven't recognized the token type by now we're going to
    // throw an error.
    throw new TypeError(token.type, token.value);
  }

  // Now, we're going to create our AST which will have a root which is a
  // `Program` node.
  let ast = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  // At the end of our parser we'll return the AST.
  return ast;
}

/**
 * ============================================================================
 *                               ヾ（〃＾∇＾）ﾉ♪
 *                            THE CODE GENERATOR!!!!
 * ============================================================================
 */

/**
 * Now let's move onto our last phase: The Code Generator.
 *
 * Our code generator is going to recursively call itself to print each node in
 * the tree into one giant string.
 */

let currentfunc;
function codeGenerator(ast) {
  let result = "";
  while(ast.body.length) {
    let temp = ast.body.shift();
    currentfunc = temp.dest.name;
    result += trans(temp, 1);
  } 
  console.log(result);
}

function addtap(indent) {
  let tab = "    ";
  let total ="";
  for(let i = 0; i < indent; i++)
    total += tab;
  return total;
}

function trans(ast, indent) {
  let contents = "";
  let params, bodylist;
  let node = ast;
  if (ast.type == 'FuncDefExpression')
    bodylist = node.body;
  else if (ast.type == 'LoopExpression')
    bodylist = node.action;
  else if (ast.type == 'CondExpression') {
    if (node.true_action.length != 0)
      bodylist = node.true_action;
    else if (node.true_action.length == 0 && node.false_action.length != 0)
      bodylist = node.false_action;
  }

  if (node.type == 'FuncDefExpression' && node.dest.name != 'main'){
    contents += "def " + node.dest.name + "(";
    let param_length = node.params.length;

    if (param_length > 0) {
      for (let i = 1; i < param_length; i++) {
        params = node.params.shift();
        contents += params.name + ", ";
      }
      contents += node.params.shift().name + "):\n";
    }
  }
  while (bodylist.length) {
    let body = bodylist.shift();
    switch (body.type){
      case 'VarDefExpression':
        let dest = body.dest;
        let src = body.src;

        if(currentfunc != 'main')
          contents += addtap(indent);
        contents += dest.name + ' = ';

        if (src != undefined) {
          if (src.type == 'NumberLiteral')
            contents += src.value;
          else if (src.type == 'Variable')
            contents += src.name;
        }
        else
          contents += '\'\'';
      break;
      
      case 'OpExpression':
        let left = body.left;
        let right = body.right;
        let op = body.op;
        if (currentfunc != 'main')
          contents += addtap(indent);
        contents += left.name + ' = ' + left.name + ' ' + op + ' ';
        if (right.type == 'NumberLiteral')
          contents += right.value;
        else if (right.type == 'Variable')
          contents += right.name;
        break;

      case 'CondExpression':
        if (currentfunc != 'main')
          contents += addtap(indent);
        contents += 'if (' + body.condition +'):\n';
        contents += trans(body, indent + 1);

        if (body.false_action.length != 0) {
          contents += 'else:\n';
          contents += trans(body, indent + 1);
        }
        break;
      
      case 'CallExpression':
        let param;
        if (currentfunc == 'main')
          contents += addtap(indent - 1);
        else
          contents += addtap(indent);
        if (body.name == 'printf') {
          contents += 'printf(\"';

          while (body.params.length) {
            param = body.params.shift();
            if (param.type == 'StringLiteral')
              contents += param.value + '\")';
          }
        }
        else if (body.name == 'scanf') {
          while (body.params.length) {
            param = body.params.shift();
            if (param.type == 'Variable')
              contents += param.name + ' = input()';
          }
        }
        break;


      case 'RetExpression':
        if (currentfunc != 'main') {
          contents += addtap(indent);
          contents += 'return ';
          if (body.value.type == 'NumberLiteral')
            contents += body.value.value;
        }
        break;

      case 'LoopExpression':
        if (currentfunc != 'main')
          contents += addtap(indent);

        contents += 'while (' + body.condition + '):\n';
        contents += trans(body, indent + 1);
        break;

      default:
        throw new TypeError(body.type);
    }

    if (body.type != 'CondExpression')
      contents += '\n';
  }
  return contents;
}

/**
 * ============================================================================
 *                                  (۶* ‘ヮ’)۶”
 *                         !!!!!!!!THE COMPILER!!!!!!!!
 * ============================================================================
 */

/**
 * FINALLY! We'll create our `compiler` function. Here we will link together
 * every part of the pipeline.
 *
 *   1. input  => tokenizer   => tokens
 *   2. tokens => parser      => ast
 *   3. ast    => generator   => output
 */

function compiler(input) {
  let tokens = tokenizer(input);
  let ast = parser(tokens);
  let output = codeGenerator(ast);

  return output;
}

// Now I'm just exporting everything...
module.exports = {
  tokenizer,
  parser,
  codeGenerator,
  compiler,
};
