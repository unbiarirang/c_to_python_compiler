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
    : function_definitions { return {function_definitions: $1}}
    ;

function_definitions
    : function_definition { $$ = [$1]; }
    | function_definitions function_definition { $1.push($2); $$ = $1; }
    ;
    
function_definition
    : type_specifier direct_declarator compound_statement { $$ = {returnType: $1.vartype, funcName: $2.name, params: $2.params, statements: $3} /*{type: "FuncDefExpression", dest: {vartype: $1.vartype, name: $2.name, type: "Identifier"}, params: $2.params, body: $3};*/}
    ;

direct_declarator
	: IDENTIFIER { $$ = {name: yytext}; }
	| direct_declarator '(' parameter_list ')' { $$ = {name: $1.name, params: $3}}
    | direct_declarator '(' ')'
    | direct_declarator '[' ']'
    | direct_declarator '[' logical_expression ']'
	;

type_specifier

	: VOID { $$ = {vartype: yytext};}

	| CHAR { $$ = {vartype: yytext};}

	| SHORT { $$ = {vartype: yytext};}

	| INT { $$ = {vartype: yytext};}

	| LONG { $$ = {vartype: yytext};}

	| FLOAT { $$ = {vartype: yytext};}

	| DOUBLE { $$ = {vartype: yytext};}

	| SIGNED { $$ = {vartype: yytext};}

	| UNSIGNED { $$ = {vartype: yytext};}

	| TYPE_NAME { $$ = {vartype: yytext};}

	;


parameter_list

	: parameter_declaration { $$ = [$1]; }

	| parameter_list ',' parameter_declaration { $1.push($3); $$ = $1; }

	;



parameter_declaration
	: declaration_specifiers declarator { $$ = {}; }
	| declaration_specifiers { $$ = {}; }
	;


compound_statement
	: '{' '}' { $$ = []; }
    | '{' statement_list '}' { $$ = $2; }
    | '{' declaration_list '}' { $$ = $2; }
    | '{' declaration_list statement_list '}' { $2.push($3); $$ = $2; }
	;

declaration_list
	: declaration { $$ = []; }
	| declaration_list declaration { $$ = $1; }
	;

declaration
	: declaration_specifiers ';'
	| declaration_specifiers init_declarator_list ';'
	;

declaration_specifiers
	: type_specifier
	;

init_declarator_list
	: init_declarator
	| init_declarator_list ',' init_declarator
	;

init_declarator
	: declarator
	| declarator '=' initializer
	;

initializer
	: assignment_expression
	| '{' initializer_list '}'
	| '{' initializer_list ',' '}'
	;

initializer_list
	: initializer
	| initializer_list ',' initializer
	;

declarator
	: pointer direct_declarator
	| direct_declarator
	;

pointer
	: '*'
	| '*' pointer
	;

statement_list
	: statement
	| statement_list statement
	;

statement
	: compound_statement { $$ = {statType: 'compound', stats: $1}; }
	| expression_statement { $$ = {statType: 'expression', exprs: [$1]}; }
	| selection_statement { $$ = {statType: 'selection', stats: $1}; }
	| iteration_statement { $$ = {statType: $1.statType, stats: [$1.stat], exprs: $1.exprs}; }
	| jump_statement { $$ = {statType: $1.statType, exprs: $1.exprs}; }
	;

expression_statement //可能為空對象
	: ';' { $$ = {}; }
	| expression ';' { $$ = {expr: $1}; }
	;

expression
	: assignment_expression { $$ = {}; }
	| expression ',' assignment_expression{ $$ = {}; }
	;

assignment_expression
	: logical_expression
	| unary_expression assignment_operator assignment_expression //賦值語句
	;

assignment_operator
	: '='
	| MUL_ASSIGN
	| DIV_ASSIGN
	| MOD_ASSIGN
	| ADD_ASSIGN
	| SUB_ASSIGN
	| LEFT_ASSIGN
	| RIGHT_ASSIGN
	| AND_ASSIGN
	| XOR_ASSIGN
	| OR_ASSIGN
	;

logical_expression
	: bit_operation_expression
	| logical_expression AND_OP bit_operation_expression
	| logical_expression OR_OP bit_operation_expression
	;

bit_operation_expression
    : equality_expression
    | bit_operation_expression '|' equality_expression
    | bit_operation_expression '&' equality_expression
    | bit_operation_expression '^' equality_expression
    ;


equality_expression
    : relational_expression
	| equality_expression EQ_OP relational_expression
	| equality_expression NE_OP relational_expression
	;

relational_expression
	: shift_expression
	| relational_expression '<' shift_expression
	| relational_expression '>' shift_expression
	| relational_expression LE_OP shift_expression
	| relational_expression GE_OP shift_expression
	;

shift_expression
	: additive_expression
	| shift_expression LEFT_OP additive_expression
	| shift_expression RIGHT_OP additive_expression
	;

additive_expression
	: multiplicative_expression
	| additive_expression '+' multiplicative_expression
	| additive_expression '-' multiplicative_expression
	;

multiplicative_expression
	: unary_expression
	| multiplicative_expression '*' unary_expression
	| multiplicative_expression '/' unary_expression
	| multiplicative_expression '%' unary_expression
	;

unary_expression
	: postfix_expression
	| INC_OP unary_expression
	| DEC_OP unary_expression
	| '&' unary_expression
	| '*' unary_expression
	| '+' unary_expression
	| '-' unary_expression
	| '~' unary_expression
	| '!' unary_expression
	;

postfix_expression
	: primary_expression
	| postfix_expression '[' expression ']'
	| postfix_expression '(' ')'
	| postfix_expression '(' argument_expression_list ')'
	| postfix_expression '.' IDENTIFIER
	| postfix_expression PTR_OP IDENTIFIER
	| postfix_expression INC_OP
	| postfix_expression DEC_OP
	;

argument_expression_list
	: assignment_expression
	| argument_expression_list ',' assignment_expression
	;

primary_expression
	: IDENTIFIER
	| CONSTANT
	| STRING_LITERAL
	| '(' expression ')'
	;

selection_statement
	: IF '(' expression ')' statement %prec IF_WITHOUT_ELSE { $$ = [$3, $5];}
	| IF '(' expression ')' statement ELSE statement { $$ = [$3]; }
	;

iteration_statement
	: WHILE '(' expression ')' statement { $$ = {statType: 'while', exprs: [$3], stat: $5}; }
	| DO statement WHILE '(' expression ')' ';' { $$ = {statType: 'doWhile', exprs: [$5], stat: $2}; }
	| FOR '(' expression_statement expression_statement ')' statement { $$ = {statType: 'for', exprs: [$3.expr, $4.expr], stat: $6}; }
	| FOR '(' expression_statement expression_statement expression ')' statement { $$ = {statType: 'for', exprs: [$3.expr, $4.expr, $5], stat: $6}; }
	;

jump_statement
	: CONTINUE ';' { $$ = {statType: 'continue', exprs: []}; }
	| BREAK ';' { $$ = {statType: 'break', exprs: []}; }
	| RETURN ';' { $$ = {statType: 'return', exprs: []}; }
	| RETURN expression ';' { $$ = {statType: 'return', exprs: [$2]}; }
	;


