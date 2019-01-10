Nodes:



```javascript
// program node
{
    type: "program",
    funcDefs: []       // an array of function definition nodes
}

// function definition node
{
    type: "function definition",
    returnType: "",
    name: "",
    params: [],              // an array of parameter declaration nodes, may be empty
    satements: []            // an array of statement nodes
}

// parameter declaration node
{
    type: "parameter declaration",
    declaredType: "",             // e.g. "int", "void, etc
    name: "",                      // e.g. "a", "i"
    isArray: true,                 // true or false 
    isPointer: true,               // true or false 
}


// statement node
{
    type: "statement",
    statementType: "",          // compound, expression, selection, iteration, jump
    subStatement: {}            // a node of compound Statement, expression statement, selection statement, iteration statement or jump statement
}

// selection statement node
{
    type: "selection statement",
    expr: {},                     // an expression node of the condition
    ifThenStatement: {},         // a statement node of it-then
    elseStatment: {}            // a statement node of else, may be null
}

// iteration statement node
{
    type: "iteration statement",
    loopType: "",                // "while", "doWhile", "for"
    exprs: [],                   // an array of expression nodes,
                                 // only one element when "while" and "doWhile"
                                 // 2 or 3 elements when "for"
    statement: {}                
}

// jump statement
{
    type: "jump statement",
    jumpType: "",                 // "break", "continue", "return"
    expr: {}                      //  only for some "return"s, may be null
}

// expression statement node
{
    type: "expression statment",
    expr: {}                    // a expression node, might be null
}

// compound statement node
{
    type: "compound statment",   // i.e. { }
    declarations: [],            // an array of declaration nodes, may be empty
    statements: []               // an array of statment nodes, may be empty
    
    // note that declarations always precede statements
    // e.g.
    // {
    //     int i = 9;             <== declarations
    //     int j;                 <== declarations
    //
    //     i = 3 * 5;             <== statements
    //     if () {} else {}       <== statements
    // }
}


// declaration node
{
    type: "declaration",
    declaredType: "",             // e.g. "int", "void, etc
    name: "",                      // e.g. "a", "i"
    isArray: true,                 // true or false 
    isPointer: true,               // true or false 
    assignExpr: {}                 // an assginment expression node, may be null
}

    
/*
// init declarator node
//     => (declarator)
//  or => (declarator) = (assignemnt expression) 
//  e.g.  a = 10*8     or     just a
{
    type: "init declarator",
    name: ""
    isPointer
    assignExpr {}                // an initializer node, may be null
}


// declarator node
{
    type: "declarator",
    name: ""                     // e.g. "test", "main", "a", "i"
    isArray: true,                 // true or false 
    isPointer: true,               // true or false 
    assignExpr: {}                 // an assginment expression node
}
*/
    
    

// expression node
{
    type: "expression",
    assignExprs: []     // an array of assignment expression nodes.
    
    // note that assignment expressions should be seperated by "," in one line
    // e.g. a=1, b*=5, c+=2;
} 

// assignment expression node
// e.g. *p += 4 * 8
{
    type: "assignment expression",
    logicalExpr: {},   // a object of a logical expression node.
    
    // if logicalExpr == null, then has the 3 keys below
    unaryExpr: {},    // an unary expression node. e.g. "*p"
    assignOp: "",     // an assign Operator string, e.g. "+=". Just print it directly.
    assignExpr: {}    // another assignment expression node (recursive) 
}


// logical expression node
//    => (bit operation expression)
// or => (logical expression) (operator) (bit operation expression)
{
    type: "logical expression",
    logicalExpr: {},   // null or another logical expression node (recursive)
    op: "",           // null or an operator string, e.g. "&&". Just print it directly.
    bitOpExpr: {},    // an object of a bit operation expression node.
}

// bit operation expression node
//     => (equality expression)
// or  => (bit operation expression) (operator) (equality expression)
{
    type: "bit operation expression"
    bitOpExpr: {}  ,   // null or another bit operation expression node (recursive)
    op: "",           // null or an operator string, e.g. "|". Just print it directly.
    equalityExpr: {}  // an object of a equality expression node.
}

// equality expression node
//     => (relational expression)
// or  => (equality expression) (operator) (relational expression)
{
    type: "equality expression"
    equalityExpr: {},    // null or another equality expression node (recursive)
    op: "",              // null or an operator string, e.g. "=="
    relationalExpr: {}   // an object of a relational expression node.
}

// relational expression node
//     => (shift expression)
// or  => (relational expression) (operator) (shift expression)
{
    type: "relational expression"
    relationalExpr: {},    // null or another relational expression node (recursive)
    op: "",              // null or an operator string, e.g. "<="
    shiftExpr: {}   // an object of a shift expression node.
}

// shift expression node
//     => (additive expression)
// or  => (shift expression) (operator) (additive expression)
{
    type: "shift expression"
    shiftExpr: {},    // null or another shift expression node (recursive)
    op: "",              // null or an operator string, e.g. "<<"
    additiveExpr: {}   // an object of a additive expression node.
}


// additive expression node
//     => (multiplicative expression)
// or  => (additive expression) (operator) (multiplicative expression)
{
    type: "additive expression"
    additiveExpr: {},    // null or another additive expression node (recursive)
    op: "",              // null or an operator string, e.g. "+"
    multiplicativeExpr: {}   // an object of a multiplicative expression node.
}


// multiplicative expression node
//     => (unary expression)
// or  => (multiplicative expression) (operator) (unary expression)
{
    type: "multiplicative expression"
    multiplicativeExpr: {},    // null or another multiplicative expression node (recursive)
    op: "",                    // null or an operator string, e.g. "*"
    unaryExpr: {}              // an object of a unary expression node.
}


// unary expression node
//     => (postfix expression)
// or  => (operator) (unary expression)
{
    type: "unary expression",
    postfixExpr: {},  // an object of a postfix expression node
    
    // if postfixExpr == null, then has 2 keys below
    op: "",           // an operator string, e.g. "&". 
                      // Be careful of "++", "--", "*"(pointer), etc. 
    unaryExpr: {}     // another unary expression node (recursive)
}


// postfix expression node
{
    type: "postfix expression",
    primaryExpr: {},    // an object of a primary expression node
                        // may be null
        
    // if primaryExpr == null, then it has
    postfixExpr: {},    // another posrtfix expression node (recursive)       
    // and one of the following keys:
    expr: {},           // an expression node. 
                        // i.e. (postfix expression)[expression]
                        // e.g. hey[3+4]
        
    identifier: "",     // means its a reference of identifier
                        // i.e. (postfix expression).(identifier)
                        // e.g. hello.hey   or   hello->hey
        
    op: ""              // "++" or "--"
                        // means (postfix expression)++ or (postfix expression)--
                        // watch out! probably no equivilence in Python. 
    
    arguments: []       // an array of assignment expression nodes
                        // means calling a function.
                        // i.e. (postfiex expression)(args)
                        // e.g. hello(arguments[0], arguments[1], arguments[2])
    
    // if expr, identifier, op, arguments are all null, it means calling a function without args.
    // i.e. (postfix expression)()
    // e.g. hello()
}

// primary expression node
{
    type: "primary expression",
    expr: {},  // another expression node
               // i.e. "(" expression ")"    
               // e.g. (3*8/9) + 7
    
    // if expr == null, then has value
    value: ""  // identifier, constant, or string literal
               // e.g.  abc, 1843, "Hello Wolrd"
               // watch out for printf and scanf!
}    






```

