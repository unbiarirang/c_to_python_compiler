'use strict';

let TokenType = { Number: 'number', String: 'string', Paren: 'parenthesis', Type: 'type', Name: 'name', Oper: 'operator', Punct: 'punctuation', Statm: 'statement' };

let punctuations = ':;,';
let parenthesis = '{}()[]';
let operators = ['=', '+', '-', '*', '/', '%', '==', '!=', '<', '<=', '>', '>=', '++', '--'];
let types = ['int', 'float', 'double', 'char', 'char*'];
let statements = ['if', 'else', 'for', 'while', 'return'];

function tokenizer(input) {

  // A `current` variable for tracking our position in the code like a cursor.
  let current = 0;

  // And a `tokens` array for pushing our tokens to.
  let tokens = [];

  // We start by creating a `while` loop where we are setting up our `current`
  // variable to be incremented as much as we want `inside` the loop.
  //
  // We do this because we may want to increment `current` many times within a
  // single loop because our tokens can be any length.
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

    // Moving on, we're now going to check for whitespace. This is interesting
    // because we care that whitespace exists to separate characters, but it
    // isn't actually important for us to store as a token. We would only throw
    // it out later.
    //
    // So here we're just going to test for existence and if it does exist we're
    // going to just `continue` on.
    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // The next type of token is a number. This is different than what we have
    // seen before because a number could be any number of characters and we
    // want to capture the entire sequence of characters as one token.
    //
    //   (add 123 456)
    //        ^^^ ^^^
    //        Only two separate tokens
    //
    // So we start this off when we encounter the first number in a sequence.
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {

      // We're going to create a `value` string that we are going to push
      // characters to.
      let value = '';

      // Then we're going to loop through each character in the sequence until
      // we encounter a character that is not a number, pushing each character
      // that is a number to our `value` and incrementing `current` as we go.
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // After that we push our `number` token to the `tokens` array.
      tokens.push({ type: TokenType.Number, value });

      // And we continue on.
      continue;
    }

    // We'll also add support for strings in our language which will be any
    // text surrounded by double quotes (").
    //
    //   (concat "foo" "bar")
    //            ^^^   ^^^ string tokens
    //
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

    // The last type of token will be a `name` token. This is a sequence of
    // letters instead of numbers, that are the names of functions in our lisp
    // syntax.
    //
    //   (add 2 4)
    //    ^^^
    //    Name token
    //
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

// Okay, so we define a `parser` function that accepts our array of `tokens`.
function parser(tokens) {

  // Again we keep a `current` variable that we will use as a cursor.
  let current = 0;

  // But this time we're going to use recursion instead of a `while` loop. So we
  // define a `walk` function.
  function walk() {

    // Inside the walk function we start by grabbing the `current` token.
    let token = tokens[current];

    // We're going to split each type of token off into a different code path,
    // starting off with `number` tokens.
    //
    // We test to see if we have a `number` token.
    if (token.type === TokenType.Number) {

      // If we have one, we'll increment `current`.
      current++;

      // And we'll return a new AST node called `NumberLiteral` and setting its
      // value to the value of our token.
      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    // If we have a string we will do the same as number and create a
    // `StringLiteral` node.
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
      console.log('Variable: ', token.value);

      return {
        type: 'Variable',
        name: token.value
      };
    }

    // 1) int i; 2) char s[200]; 3) int i = 0; 4) int test() {} 5) int test(int x, int y) {}
    if (token.type === TokenType.Type) {
      let node = {};
      let vartype = token.value;
        //type: 'DefExpression',
        //name: token.value,
        //src: { type: 'Variable', vartype: token.value },
        //dest: '',

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
        //let type;

        //if (token.type === TokenType.String) type = 'StringLiteral';
        //else if (token.type === TokenType.Number) type = 'NumberLiteral';
        //else if (token.type === TokenType.Name) type = 'Identifier';
        //else throw new TypeError(token.type, token.value);

        //if (type === 'StringLiteral' || type === 'NumberLiteral') {
        //  node.src = {
        //    type: type,
        //    value: token.value,
        //  };
        //} else {
        //  node.src = {
        //    type: type,
        //    name: token.value,
        //  };
        //}

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
      // We create a base node with the type `CallExpression`, and we're going
      // to set the name as the current token's value since the next token after
      // the open parenthesis is the name of the function.
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

  // And we're going to kickstart our `walk` function, pushing nodes to our
  // `ast.body` array.
  //
  // The reason we are doing this inside a loop is because our program can have
  // `CallExpression` after one another instead of being nested.
  //
  //   (add 2 2)
  //   (subtract 4 2)
  //
  while (current < tokens.length) {
    ast.body.push(walk());
  }

  // At the end of our parser we'll return the AST.
  return ast;
}

/**
 * ============================================================================
 *                                 ⌒(❀>◞౪◟<❀)⌒
 *                               THE TRAVERSER!!!
 * ============================================================================
 */

/**
 * So now we have our AST, and we want to be able to visit different nodes with
 * a visitor. We need to be able to call the methods on the visitor whenever we
 * encounter a node with a matching type.
 *
 *   traverse(ast, {
 *     Program: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *
 *     CallExpression: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *
 *     NumberLiteral: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *   });
 */

// So we define a traverser function which accepts an AST and a
// visitor. Inside we're going to define two functions...
function traverser(ast, visitor) {

  // A `traverseArray` function that will allow us to iterate over an array and
  // call the next function that we will define: `traverseNode`.
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  // `traverseNode` will accept a `node` and its `parent` node. So that it can
  // pass both to our visitor methods.
  function traverseNode(node, parent) {

    // We start by testing for the existence of a method on the visitor with a
    // matching `type`.
    let methods = visitor[node.type];

    // If there is an `enter` method for this node type we'll call it with the
    // `node` and its `parent`.
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    // Next we are going to split things up by the current node type.
    switch (node.type) {

      // We'll start with our top level `Program`. Since Program nodes have a
      // property named body that has an array of nodes, we will call
      // `traverseArray` to traverse down into them.
      //
      // (Remember that `traverseArray` will in turn call `traverseNode` so  we
      // are causing the tree to be traversed recursively)
      case 'Program':
        traverseArray(node.body, node);
        break;

      // Next we do the same with `CallExpression` and traverse their `params`.
      case 'CallExpression':
        traverseArray(node.params, node);
        break;

      case 'DefExpression':
        traverseNode(node.dest, node);
        traverseNode(node.src, node);

      // In the cases of `NumberLiteral` and `StringLiteral` we don't have any
      // child nodes to visit, so we'll just break.
      case 'NumberLiteral':
      case 'StringLiteral':
      case 'Variable':
      case 'Semicolon':
        break;

      // And again, if we haven't recognized the node type then we'll throw an
      // error.
      default:
        throw new TypeError(node.type);
    }

    // If there is an `exit` method for this node type we'll call it with the
    // `node` and its `parent`.
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  // Finally we kickstart the traverser by calling `traverseNode` with our ast
  // with no `parent` because the top level of the AST doesn't have a parent.
  traverseNode(ast, null);
}

/**
 * ============================================================================
 *                                   ⁽(◍˃̵͈̑ᴗ˂̵͈̑)⁽
 *                              THE TRANSFORMER!!!
 * ============================================================================
 */

/**
 * Next up, the transformer. Our transformer is going to take the AST that we
 * have built and pass it to our traverser function with a visitor and will
 * create a new ast.
 *
 * ----------------------------------------------------------------------------
 *   Original AST                     |   Transformed AST
 * ----------------------------------------------------------------------------
 *   {                                |   {
 *     type: 'Program',               |     type: 'Program',
 *     body: [{                       |     body: [{
 *       type: 'CallExpression',      |       type: 'ExpressionStatement',
 *       name: 'add',                 |       expression: {
 *       params: [{                   |         type: 'CallExpression',
 *         type: 'NumberLiteral',     |         callee: {
 *         value: '2'                 |           type: 'Identifier',
 *       }, {                         |           name: 'add'
 *         type: 'CallExpression',    |         },
 *         name: 'subtract',          |         arguments: [{
 *         params: [{                 |           type: 'NumberLiteral',
 *           type: 'NumberLiteral',   |           value: '2'
 *           value: '4'               |         }, {
 *         }, {                       |           type: 'CallExpression',
 *           type: 'NumberLiteral',   |           callee: {
 *           value: '2'               |             type: 'Identifier',
 *         }]                         |             name: 'subtract'
 *       }]                           |           },
 *     }]                             |           arguments: [{
 *   }                                |             type: 'NumberLiteral',
 *                                    |             value: '4'
 * ---------------------------------- |           }, {
 *                                    |             type: 'NumberLiteral',
 *                                    |             value: '2'
 *                                    |           }]
 *  (sorry the other one is longer.)  |         }
 *                                    |       }
 *                                    |     }]
 *                                    |   }
 * ----------------------------------------------------------------------------
 */

// So we have our transformer function which will accept the lisp ast.
function transformer(ast) {

  // We'll create a `newAst` which like our previous AST will have a program
  // node.
  let newAst = {
    type: 'Program',
    body: [],
  };

  // Next I'm going to cheat a little and create a bit of a hack. We're going to
  // use a property named `context` on our parent nodes that we're going to push
  // nodes to their parent's `context`. Normally you would have a better
  // abstraction than this, but for our purposes this keeps things simple.
  //
  // Just take note that the context is a reference *from* the old ast *to* the
  // new ast.
  ast._context = newAst.body;

  // We'll start by calling the traverser function with our ast and a visitor.
  traverser(ast, {

    // The first visitor method accepts any `NumberLiteral`
    NumberLiteral: {
      // We'll visit them on enter.
      enter(node, parent) {
        // We'll create a new node also named `NumberLiteral` that we will push to
        // the parent context.
        // parent._context.push({
        //   type: 'NumberLiteral',
        //   value: node.value,
        // });
      },
    },

    // Next we have `StringLiteral`
    StringLiteral: {
      enter(node, parent) {
        // parent._context.push({
        //   type: 'StringLiteral',
        //   value: node.value,
        // });
      },
    },

    Variable: {
      enter(node, parent) {
        // parent._context.push({
        //   type: 'Variable',
        //   name: node.name,
        // });
      },
    },

    DefExpression: {
      enter(node, parent) {
        parent._context.push(node);
      }
    },

    // Next up, `CallExpression`.
    CallExpression: {
      enter(node, parent) {

        if (node.name === 'printf') node.name = 'print';

        // We start creating a new node `CallExpression` with a nested
        // `Identifier`.
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };

        // Next we're going to define a new context on the original
        // `CallExpression` node that will reference the `expression`'s arguments
        // so that we can push arguments.
        node._context = expression.arguments;

        // Then we're going to check if the parent node is a `CallExpression`.
        // If it is not...
        if (parent.type !== 'CallExpression') {

          // We're going to wrap our `CallExpression` node with an
          // `ExpressionStatement`. We do this because the top level
          // `CallExpression` in JavaScript are actually statements.
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }

        // Last, we push our (possibly wrapped) `CallExpression` to the `parent`'s
        // `context`.
        parent._context.push(expression);
      },
    }
  });

  // At the end of our transformer function we'll return the new ast that we
  // just created.
  return newAst;
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

function codeGenerator(node) {

  // We'll break things down by the `type` of the `node`.
  switch (node.type) {

    // If we have a `Program` node. We will map through each node in the `body`
    // and run them through the code generator and join them with a newline.
    case 'Program':
      return node.body.map(codeGenerator)
        .join('\n');

    // For `ExpressionStatement` we'll call the code generator on the nested
    // expression and we'll add a semicolon...
    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression) // + ';' // << (...because we like to code the *correct* way)
      );

    // For `CallExpression` we will print the `callee`, add an open
    // parenthesis, we'll map through each node in the `arguments` array and run
    // them through the code generator, joining them with a comma, and then
    // we'll add a closing parenthesis.
    case 'CallExpression':
      return (
        codeGenerator(node.callee) +
        '(' +
        node.arguments.map(codeGenerator)
          .join(', ') +
        ')'
      );

    case 'DefExpression':
      return (
        codeGenerator(node.dest) + ' = ' + codeGenerator(node.src)
      );

    // For `Identifier` we'll just return the `node`'s name.
    case 'Identifier':
    case 'Variable':
      return node.name;

    // For `NumberLiteral` we'll just return the `node`'s value.
    case 'NumberLiteral':
      return node.value;

    // For `StringLiteral` we'll add quotations around the `node`'s value.
    case 'StringLiteral':
      return '"' + node.value + '"';

    // And if we haven't recognized the node, we'll throw an error.
    default:
      throw new TypeError(node.type);
  }
}

var currentfunc;
function go(ast){
  var result = "";
  while(ast.body.length){
    //console.log(ast.body.shift());
    var temp = ast.body.shift();
    currentfunc = temp.dest.name;
    result += trans(temp, 1);
  } 
  console.log(result);
}
function addtap(indent){
  var tab = "    ";
  var total ="";
  for(var i = 0; i < indent; i++)
    total += tab;
  return total;
}

function trans(ast, indent){
  var contents = "";
  var params;
  var bodylist;
  //console.log(ast);
  if(ast.type == 'FuncDefExpression'){
    var node = ast;
    bodylist = node.body;
  }
  else if(ast.type == 'LoopExpression'){
    var node = ast;
    bodylist = node.action;
  }
  else if(ast.type == 'CondExpression'){
    var node = ast;
    if(node.true_action.length != 0)
      bodylist = node.true_action;
    else if(node.true_action.length == 0 && node.false_action.length != 0)
      bodylist = node.false_action;
  }

  if (node.type == 'FuncDefExpression' && node.dest.name != 'main'){
    contents += "def " + node.dest.name + "(";
    var param_length = node.params.length;
    if(param_length > 0){
      for(var i = 1; i < param_length; i++){
        params = node.params.shift();
        contents += params.name + ", ";
      }
      contents += node.params.shift().name + "):\n";
    }
  }
  while(bodylist.length){
    var body = bodylist.shift();
    switch (body.type){
      case 'VarDefExpression':
        var dest = body.dest;
        var src = body.src;
        //contents += tab;
        if(currentfunc != 'main')
          contents += addtap(indent);
        contents += dest.name + ' = ';

        if(src != undefined){
          if(src.type == 'NumberLiteral'){
            contents += src.value;
          }
          else if(src.type == 'Variable'){
            contents += src.name;
          }
        }
        else{
          contents += '\'\'';
        }
      break;
      
      case 'OpExpression':
        var left = body.left;
        var right = body.right;
        var op = body.op;
        if(currentfunc != 'main')
          contents += addtap(indent);
        contents += left.name + ' = ' + left.name + ' ' + op + ' ';
        if(right.type == 'NumberLiteral'){
          contents += right.value;
        }
        else if(right.type == 'Variable'){
          contents += right.name;
        }
        break;
      case 'CondExpression':
        if(currentfunc != 'main')
          contents += addtap(indent);
        contents += 'if (' + body.condition +'):\n';
        contents += trans(body, indent + 1);
        if(body.false_action.length != 0){
          contents += 'else:\n';
          contents += trans(body, indent + 1);
        }
        break;
      
      case 'CallExpression':
        var param;
        if (currentfunc == 'main')
          contents += addtap(indent - 1);
        else
          contents += addtap(indent);
        if(body.name == 'printf'){
          contents += 'printf(\"';
          while(body.params.length){
            param = body.params.shift();
            if(param.type == 'StringLiteral')
              contents += param.value + '\")';
          }
        }
        else if(body.name == 'scanf'){
          //console.log(body);
          while(body.params.length){
            param = body.params.shift();
            if(param.type == 'Variable')
              contents += param.name + ' = input()';
          }
        }
        break;


      case 'RetExpression':
        if(currentfunc != 'main'){
          contents += addtap(indent);
          contents += 'return ';
          if(body.value.type == 'NumberLiteral')
            contents += body.value.value;
        }
        break;

      case 'LoopExpression':
        if(currentfunc != 'main')
          contents += addtap(indent);
        contents += 'while (' + body.condition + '):\n';
        contents += trans(body, indent + 1);
        break;
      default:
        throw new TypeError(body.type);
    }
    if(body.type != 'CondExpression')
      contents += '\n';
  }
  //}//end of while
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
 *   3. ast    => transformer => newAst
 *   4. newAst => generator   => output
 */






function compiler(input) {
  let tokens = tokenizer(input);
  console.log('=====tokens=====');
  console.log(tokens);
  let ast = parser(tokens);
  console.log('=====ast=====');
  console.log(JSON.stringify(ast, null, 4));
  let newAst = transformer(ast);
  console.log('=====new ast=====');
  console.log(JSON.stringify(newAst, null, 4));
  let output = codeGenerator(newAst);

  // and simply return the output!
  return output;
}

// Now I'm just exporting everything...
module.exports = {
  tokenizer,
  parser,
  traverser,
  transformer,
  codeGenerator,
  compiler,
  go,
};

let input = `
#include <stdio.h>
#include <string.h>

int test(char* s, int len) {
    int i = 0;
	int j = len;
    len--;
    while (i < j) {
        if (s[i] != s[j]) {
			return 0;
        }
        i++;
        j--;
    }
    return 1;
}
int main() {
    char s[200];
    printf("Enter the string to test: ");
    scanf("%s", s);
    if (test(s, strlen(s))) {
		printf("true");
    }
    else {
		printf("false");
    }
    return 0;
}
`;
// let input2 = 'int i = 0; int j = i;';
// let input3 = 'int main(int x, int y) { int a = 1; int b = 2; }';
// let input4 = 'printf("The string is palindromic.\n");';
// let input5 = 'add(1, 2);';
// let input6 = 'char s[200];';
// let input7 = 'i++; j--;'
// let input8 = 'i = 0;';
// let input9 = 'i = j;';
// let input10 = 'return 1;';
// let input11 = 'return x;';
// let input12 = 'while (i < j) { int x = 1; return x; }';
// let input13 = 'if (test(s, strlen(s))) {}';
// let input14 = 'if (s[i] == s[j]) { return 1; } else { return 0; }';
// let input15 = 'int test(char* s, int len) {}';
// let input16 = 'scanf("%s", s);';
// let output = compiler(input);
// console.log('=====output=====');
// console.log(output);
