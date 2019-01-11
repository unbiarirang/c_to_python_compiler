%lex
%options easy_keyword_rules

O   [0-7]
D   [0-9]
NZ  [1-9]
L   [a-zA-Z_]
A   [a-zA-Z_0-9]
H   [a-fA-F0-9]
HP  (0[xX])
E   ([Ee][+-]?{D}+)
P   ([Pp][+-]?{D}+)
FS  ("f"|"F"|"l"|"L")
IS  ((("u"|"U")("l"|"L"|"ll"|"LL")?)|(("l"|"L"|"ll"|"LL")("u"|"U")?))
CP  ("u"|"U"|"L")
SP  ("u8"|"u"|"U"|"L")
ES  (\\([\?\\abfnrtv]|[0-7]{1,3}|"x"[a-fA-F0-9]+))
WS  [" "\t\v\n\f\r]

%%

"//".*                  { /* consume //-comment */ }
"#".*                   { /* consume #-header */ }
"auto"                  { return 'AUTO'; }
"break"                 { return 'BREAK'; }
"case"                  { return 'CASE'; }
"char"                  { return 'CHAR'; }
"const"                 { return 'CONST'; }
"continue"              { return 'CONTINUE'; }
"default"               { return 'DEFAULT'; }
"do"                    { return 'DO'; }
"double"                { return 'DOUBLE'; }
"else"                  { return 'ELSE'; }
"enum"                  { return 'ENUM'; }
"extern"                { return 'EXTERN'; }
"float"                 { return 'FLOAT'; }
"for"                   { return 'FOR'; }
"goto"                  { return 'GOTO'; }
"if"                    { return 'IF'; }
"inline"                { return 'INLINE'; }
"int"                   { return 'INT'; }
"long"                  { return 'LONG'; }
"register"              { return 'REGISTER'; }
"restrict"              { return 'RESTRICT'; }
"return"                { return 'RETURN'; }
"short"                 { return 'SHORT'; }
"signed"                { return 'SIGNED'; }
"sizeof"                { return 'SIZEOF'; }
"static"                { return 'STATIC'; }
"struct"                { return 'STRUCT'; }
"switch"                { return 'SWITCH'; }
"typedef"               { return 'TYPEDEF'; }
"union"                 { return 'UNION'; }
"unsigned"              { return 'UNSIGNED'; }
"void"                  { return 'VOID'; }
"volatile"              { return 'VOLATILE'; }
"while"                 { return 'WHILE'; }
"_Alignas"              { return 'ALIGNAS'; }
"_Alignof"              { return 'ALIGNOF'; }
"_Atomic"               { return 'ATOMIC'; }
"_Bool"                 { return 'BOOL'; }
"_Complex"              { return 'COMPLEX'; }
"_Generic"              { return 'GENERIC'; }
"_Imaginary"            { return 'IMAGINARY'; }
"_Noreturn"             { return 'NORETURN'; }
"_Static_assert"        { return 'STATIC_ASSERT'; }
"_Thread_local"         { return 'THREAD_LOCAL'; }
"__func__"              { return 'FUNC_NAME'; }

{L}{A}*                 { return 'IDENTIFIER'; }

{HP}{H}+{IS}?           { return 'CONSTANT'; }
{NZ}{D}*{IS}?           { return 'CONSTANT'; }
"0"{O}*{IS}?            { return 'CONSTANT'; }
{CP}?"'"([^'\\\n]|{ES})+"'"     
                        { return 'CONSTANT'; }

{D}+{E}{FS}?            { return 'CONSTANT'; }
{D}*"."{D}+{E}?{FS}?    { return 'CONSTANT'; }
{D}+"."{E}?{FS}?        { return 'CONSTANT'; }
{HP}{H}+{P}{FS}?        { return 'CONSTANT'; }
{HP}{H}*"."{H}+{P}{FS}?         
                        { return 'CONSTANT'; }
{HP}{H}+"."{P}{FS}?     { return 'CONSTANT'; }

({SP}?\"([^\"\\\n]|{ES})*\"{WS}*)+   
                        { return 'STRING_LITERAL'; }

"..."                   { return 'ELLIPSIS'; }
">>="                   { return 'RIGHT_ASSIGN'; }
"<<="                   { return 'LEFT_ASSIGN'; }
"+="                    { return 'ADD_ASSIGN'; }
"-="                    { return 'SUB_ASSIGN'; }
"*="                    { return 'MUL_ASSIGN'; }
"/="                    { return 'DIV_ASSIGN'; }
"%="                    { return 'MOD_ASSIGN'; }
"&="                    { return 'AND_ASSIGN'; }
"^="                    { return 'XOR_ASSIGN'; }
"|="                    { return 'OR_ASSIGN'; }
">>"                    { return 'RIGHT_OP'; }
"<<"                    { return 'LEFT_OP'; }
"++"                    { return 'INC_OP'; }
"--"                    { return 'DEC_OP'; }
"->"                    { return 'PTR_OP'; }
"&&"                    { return 'AND_OP'; }
"||"                    { return 'OR_OP'; }
"<="                    { return 'LE_OP'; }
">="                    { return 'GE_OP'; }
"=="                    { return 'EQ_OP'; }
"!="                    { return 'NE_OP'; }
";"                     { return ';'; }
("{"|"<%")              { return '{'; }
("}"|"%>")              { return '}'; }
","                     { return ','; }
":"                     { return ':'; }
"="                     { return '='; }
"("                     { return '('; }
")"                     { return ')'; }
("["|"<:")              { return '['; }
("]"|":>")              { return ']'; }
"."                     { return '.'; }
"&"                     { return '&'; }
"!"                     { return '!'; }
"~"                     { return '~'; }
"-"                     { return '-'; }
"+"                     { return '+'; }
"*"                     { return '*'; }
"/"                     { return '/'; }
"%"                     { return '%'; }
"<"                     { return '<'; }
">"                     { return '>'; }
"^"                     { return '^'; }
"|"                     { return '|'; }
"?"                     { return '?'; }

{WS}+                   { /* whitespace separates tokens */ }
.                       { /* discard bad characters */ }
%%
/lex
%token IDENTIFIER CONSTANT STRING_LITERAL SIZEOF

%token PTR_OP INC_OP DEC_OP LEFT_OP RIGHT_OP LE_OP GE_OP EQ_OP NE_OP

%token AND_OP OR_OP MUL_ASSIGN DIV_ASSIGN MOD_ASSIGN ADD_ASSIGN

%token SUB_ASSIGN LEFT_ASSIGN RIGHT_ASSIGN AND_ASSIGN

%token XOR_ASSIGN OR_ASSIGN TYPE_NAME



%token TYPEDEF EXTERN STATIC AUTO REGISTER

%token CHAR SHORT INT LONG SIGNED UNSIGNED FLOAT DOUBLE CONST VOLATILE VOID

%token STRUCT UNION ENUM ELLIPSIS



%token CASE DEFAULT IF ELSE SWITCH WHILE DO FOR GOTO CONTINUE BREAK RETURN



%nonassoc IF_WITHOUT_ELSE

%nonassoc ELSE



%start program

%%

program
    : function_definitions { return {type: "program", funcDefs: $1}}
    ;

function_definitions
    : function_definition                      { $$ = [$1]; }
    | function_definitions function_definition { $1.push($2); $$ = $1; }
    ;
    
function_definition
    : type_specifier direct_declarator compound_statement { $$ = {type: "function definition", returnType: $1.vartype, funcName: $2.name, params: $2.params, statements: $3} /*{type: "FuncDefExpression", dest: {vartype: $1.vartype, name: $2.name, type: "Identifier"}, params: $2.params, body: $3};*/}
    ;

direct_declarator
	: IDENTIFIER                                           { $$ = {name: yytext, isArray: false}; }
	| direct_declarator '(' parameter_list ')'             { $$ = {name: $1.name, params: $3}; }
    | direct_declarator '(' ')'                            { $$ = {name: $1.name, params: []}; }
    | direct_declarator '[' ']'                            { $$ = {name: $1.name, isArray: true, arraySizeLogExpr: null}; } 
    | direct_declarator '[' logical_expression ']'         { $$ = {name: $1.name, isArray: true, arraySizeLogExpr: $3}; } 
	;

type_specifier
	: VOID             { $$ = {vartype: yytext};}
	| CHAR             { $$ = {vartype: yytext};}
	| SHORT            { $$ = {vartype: yytext};}
	| INT              { $$ = {vartype: yytext};}
	| LONG             { $$ = {vartype: yytext};}
	| FLOAT            { $$ = {vartype: yytext};}
	| DOUBLE           { $$ = {vartype: yytext};}
	| SIGNED           { $$ = {vartype: yytext};}
	| UNSIGNED         { $$ = {vartype: yytext};}
	| TYPE_NAME        { $$ = {vartype: yytext};}
	;


parameter_list
	: parameter_declaration                       { $$ = [$1]; }
	| parameter_list ',' parameter_declaration    { $1.push($3); $$ = $1; }
	;



parameter_declaration
	: declaration_specifiers declarator           { $$ = {type: "parameter declaration", declaredType: $1.vartype, name: $2.name, isArray: $2.isArray, isPointer: $2.isPointer}; }
	| declaration_specifiers                      { $$ = {type: "parameter declaration", declaredType: $1.vartype, name: null, isArray: false, isPointer: false}; }
	;


compound_statement
	: '{' '}'                                     { $$ = {type: "compound statement", declarations: [], statements: []}; }
    | '{' statement_list '}'                      { $$ = {type: "compound statement", declarations: [], statements: $2}; }
    | '{' declaration_list '}'                    { $$ = {type: "compound statement", declarations: $2, statements: []}; }
    | '{' declaration_list statement_list '}'     { $$ = {type: "compound statement", declarations: $2, statements: $3}; }
	;

declaration_list
	: declaration                                 { $$ = [$1]; }
	| declaration_list declaration                { $1.push($2); $$ = $1; }
	;

declaration
	: declaration_specifiers ';'                  { $$ = {type: "declaration", declaredType: $1.vartype, name: null, isArray: null, isPointer: null, assignExpr: null, arraySizeLogExpr: null};}
	| declaration_specifiers init_declarator ';'  { $$ = {type: "declaration", declaredType: $1.vartype, name: $2.name, isArray: $2.isArray, isPointer: $2.isPointer, assignExpr: $2.assignExpr, arraySizeLogExpr: $2.arraySizeLogExpr};}
	;

declaration_specifiers
	: type_specifier                              { $$ = $1; }
	;

init_declarator_list
	: init_declarator
	| init_declarator_list ',' init_declarator
	;

init_declarator
	: declarator                                  { $$ ={type: "init_declarator", name: $1.name, assignExpr: null, isPointer: $1.isArray, isArray: $1.isArray, arraySizeLogExpr: $1.arraySizeLogExpr}; }
	| declarator '=' initializer                  { $$ ={type: "init_declarator", name: $1.name, assignExpr: $3, isPointer: $1.isArray, isArray: $1.isArray, arraySizeLogExpr: $1.arraySizeLogExpr}; }
	;

initializer
	: assignment_expression                       { $$ = $1; }
	| '{' initializer_list '}'
	;

initializer_list
	: initializer                                 { $$ = [$1]; }
	| initializer_list ',' initializer            { $1.push($3); $$ =$1; }
	;

declarator
	: pointer direct_declarator                    { $$ = {type: "declarator", name: $2.name, isPointer: true, isArray: $2.isArray, arraySizeLogExpr: $2.arraySizeLogExpr}; }
	| direct_declarator                            { $$ = {type: "declarator", name: $1.name, isPointer: false, isArray: $1.isArray, arraySizeLogExpr: $1.arraySizeLogExpr}; }
	;

pointer
	: '*'
	| '*' pointer
	;

statement_list
	: statement                                    { $$ = [$1]; }
	| statement_list statement                     { $1.push($2); $$ = $1; }
	;

statement
	: compound_statement                           { $$ = {type: "statement", statementType: "compound", subStatement: $1}; }
	| expression_statement                         { $$ = {type: "statement", statementType: "expression", subStatement: $1}; }
	| selection_statement                          { $$ = {type: "statement", statementType: "selection", subStatement: $1}; }
	| iteration_statement                          { $$ = {type: "statement", statementType: "iteration", subStatement: $1}; }
	| jump_statement                               { $$ = {type: "statement", statementType: "jump", subStatement: $1}; }
	;

expression_statement //可能為空對象
	: ';'                                          { $$ = {type: "expression statement", expr: null};}
	| expression ';'                               { $$ = {type: "expression statement", expr: $1}; }
	;

expression
	: assignment_expression                        { $$ = {type: "expression", assignExprs: [$1]}; }
	| expression ',' assignment_expression         { $1.assignExprs.push($3); $$ = $1; }
	;

assignment_expression
	: logical_expression                                           { $$ = {type: "assignment expression", logicalExpr: $1, unaryExpr: null, assignOp: null, assignExpr: null}; }
	| unary_expression assignment_operator assignment_expression   { $$ = {type: "assignment expression", logicalExpr: null, unaryExpr: $1, assignOp: $2, assignExpr: $3}; }
	;

assignment_operator
	: '='               { $$ = "="; }
	| MUL_ASSIGN        { $$ = "*="; }
	| DIV_ASSIGN        { $$ = "/="; }
	| MOD_ASSIGN        { $$ = "%="; }
	| ADD_ASSIGN        { $$ = "+="; }
	| SUB_ASSIGN        { $$ = "="; }
	| LEFT_ASSIGN       { $$ = "<<="; }
	| RIGHT_ASSIGN      { $$ = ">>="; }
	| AND_ASSIGN        { $$ = "&="; }
	| XOR_ASSIGN        { $$ = "^="; }
	| OR_ASSIGN         { $$ = "|="; }
	;

logical_expression
	: bit_operation_expression                           { $$ = {type: "logical expression", bitOpExpr: $1, op: null, logicalExpr: null}; }
	| logical_expression AND_OP bit_operation_expression { $$ = {type: "logical expression", bitOpExpr: $3, op: "&&", logicalExpr: $1}; }
	| logical_expression OR_OP bit_operation_expression  { $$ = {type: "logical expression", bitOpExpr: $3, op: "||", logicalExpr: $1}; }
	;

bit_operation_expression
    : equality_expression                              { $$ = {type: "bit operation expression", bitOpExpr: null, op: null, equalityExpr: $1}; }
    | bit_operation_expression '|' equality_expression { $$ = {type: "bit operation expression", bitOpExpr: $1, op: "|", equalityExpr: $3}; }
    | bit_operation_expression '&' equality_expression { $$ = {type: "bit operation expression", bitOpExpr: $1, op: "&", equalityExpr: $3}; }
    | bit_operation_expression '^' equality_expression { $$ = {type: "bit operation expression", bitOpExpr: $1, op: "^", equalityExpr: $3}; }
    ;


equality_expression
    : relational_expression                            { $$ = {type: "equality expression", equalityExpr: null, op: null, relationalExpr: $1}; }
	| equality_expression EQ_OP relational_expression  { $$ = {type: "equality expression", equalityExpr: $1, op: "==", relationalExpr: $3}; }
	| equality_expression NE_OP relational_expression  { $$ = {type: "equality expression", equalityExpr: $1, op: "!=", relationalExpr: $3}; }
	;

relational_expression
	: shift_expression                                 { $$ = {type: "relational expression", relationalExpr: null, op: null, shiftExpr: $1}; }
	| relational_expression '<' shift_expression       { $$ = {type: "relational expression", relationalExpr: $1, op: "<", shiftExpr: $3}; }
	| relational_expression '>' shift_expression       { $$ = {type: "relational expression", relationalExpr: $1, op: ">", shiftExpr: $3}; }
	| relational_expression LE_OP shift_expression     { $$ = {type: "relational expression", relationalExpr: $1, op: "<=", shiftExpr: $3}; }
	| relational_expression GE_OP shift_expression     { $$ = {type: "relational expression", relationalExpr: $1, op: ">=", shiftExpr: $3}; }
	;

shift_expression
	: additive_expression                              { $$ = {type: "shift expression", shiftExpr: null, op: null, additiveExpr: $1}; }
	| shift_expression LEFT_OP additive_expression     { $$ = {type: "shift expression", shiftExpr: $1, op: "<<", additiveExpr: $3}; }
	| shift_expression RIGHT_OP additive_expression    { $$ = {type: "shift expression", shiftExpr: $1, op: ">>", additiveExpr: $3}; }
	;

additive_expression
	: multiplicative_expression                         { $$ = {type: "additive expression", additiveExpr: null, op: null, multiplicativeExpr: $1}; }
	| additive_expression '+' multiplicative_expression { $$ = {type: "additive expression", additiveExpr: $1, op: "+", multiplicativeExpr: $3}; }
	| additive_expression '-' multiplicative_expression { $$ = {type: "additive expression", additiveExpr: $1, op: "-", multiplicativeExpr: $3}; }
	;

multiplicative_expression
	: unary_expression                                  { $$ = {type: "multiplicative expression", multiplicativeExpr: null, op: null, unaryExpr: $1}; }
	| multiplicative_expression '*' unary_expression    { $$ = {type: "multiplicative expression", multiplicativeExpr: $1, op: "*", unaryExpr: $3}; }
	| multiplicative_expression '/' unary_expression    { $$ = {type: "multiplicative expression", multiplicativeExpr: $1, op: "/", unaryExpr: $3}; }
	| multiplicative_expression '%' unary_expression    { $$ = {type: "multiplicative expression", multiplicativeExpr: $1, op: "%", unaryExpr: $3}; }
	;

unary_expression
	: postfix_expression                                      { $$ = {type: "unary expression", postfixExpr: $1, op: "null",unaryExpr: null}; }
	| INC_OP unary_expression                                 { $$ = {type: "unary expression", postfixExpr: null, op: "++", unaryExpr: $2}; }
	| DEC_OP unary_expression                                 { $$ = {type: "unary expression", postfixExpr: null, op: "--", unaryExpr: $2}; }
	| '&' unary_expression                                    { $$ = {type: "unary expression", postfixExpr: null, op: "&", unaryExpr: $2}; }
	| '*' unary_expression                                    { $$ = {type: "unary expression", postfixExpr: null, op: "*", unaryExpr: $2}; }
	| '+' unary_expression                                    { $$ = {type: "unary expression", postfixExpr: null, op: "+", unaryExpr: $2}; }
	| '-' unary_expression                                    { $$ = {type: "unary expression", postfixExpr: null, op: "-", unaryExpr: $2}; }
	| '~' unary_expression                                    { $$ = {type: "unary expression", postfixExpr: null, op: "~", unaryExpr: $2}; }
	| '!' unary_expression                                    { $$ = {type: "unary expression", postfixExpr: null, op: "!", unaryExpr: $2}; }
	;

postfix_expression
	: primary_expression                                       { $$ = {type: "postfix expression", primaryExpr: $1, postfixExpr: null, expr: null, identifier: null, op: null, arguments: null}; }
	| postfix_expression '[' expression ']'                    { $$ = {type: "postfix expression", primaryExpr: null, postfixExpr: $1, expr: $3, identifier: null, op: null, arguments: null}; }
	| postfix_expression '(' ')'                               { $$ = {type: "postfix expression", primaryExpr: null, postfixExpr: $1, expr: null, identifier: null, op: null, arguments: null}; }
	| postfix_expression '(' argument_expression_list ')'      { $$ = {type: "postfix expression", primaryExpr: null, postfixExpr: $1, expr: null, identifier: null, op: null, arguments: $3}; }
	| postfix_expression '.' IDENTIFIER                        { $$ = {type: "postfix expression", primaryExpr: null, postfixExpr: $1, expr: null, identifier: $3, op: null, arguments: null}; }
	| postfix_expression PTR_OP IDENTIFIER                     { $$ = {type: "postfix expression", primaryExpr: null, postfixExpr: $1, expr: null, identifier: $3, op: null, arguments: null}; }
	| postfix_expression INC_OP                                { $$ = {type: "postfix expression", primaryExpr: null, postfixExpr: $1, expr: null, identifier: null, op: "++", arguments: null}; }
	| postfix_expression DEC_OP                                { $$ = {type: "postfix expression", primaryExpr: null, postfixExpr: $1, expr: null, identifier: null, op: "--", arguments: null}; }
	;

argument_expression_list
	: assignment_expression                                 { $$ = [$1]; }
	| argument_expression_list ',' assignment_expression    { $1.push($3); $$ = $1; }
	;

primary_expression
	: IDENTIFIER            { $$ = {expr: null, value: yytext}; }
	| CONSTANT              { $$ = {expr: null, value: yytext}; }
	| STRING_LITERAL        { $$ = {expr: null, value: yytext}; }
	| '(' expression ')'    { $$ = {expr: $2, value: null}; }
	;

selection_statement
	: IF '(' expression ')' statement %prec IF_WITHOUT_ELSE { $$ = {type: "selection statement", conditionExpr: $3, ifThenStatement: $5, elseStatement: null}; }
	| IF '(' expression ')' statement ELSE statement        { $$ = {type: "selection statement", conditionExpr: $3, ifThenStatement: $5, elseStatement: $7}; }
	;

iteration_statement
	: WHILE '(' expression ')' statement                                           { $$ = {type: "iteration statement", loopType: 'while', exprs: [$3], statement: $5}; }
	| DO statement WHILE '(' expression ')' ';'                                    { $$ = {type: "iteration statement", loopType: 'doWhile', exprs: [$5], statement: $2}; }
	| FOR '(' expression_statement expression_statement ')' statement              { $$ = {type: "iteration statement", loopType: 'for', exprs: [$3.expr, $4.expr], statement: $6}; }
	| FOR '(' expression_statement expression_statement expression ')' statement   { $$ = {type: "iteration statement", loopType: 'for', exprs: [$3.expr, $4.expr, $5], statement: $6}; }
	;

jump_statement
	: CONTINUE ';'                    { $$ = {type: "jump statement", jumpType: 'continue', expr: null}; }
	| BREAK ';'                       { $$ = {type: "jump statement", jumpType: 'break', expr: null}; }
	| RETURN ';'                      { $$ = {type: "jump statement", jumpType: 'return', expr: null}; }
	| RETURN expression ';'           { $$ = {type: "jump statement", jumpType: 'return', expr: $2}; }
	;


