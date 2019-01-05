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



%start function_definition

%%


function_definition

    : type_specifier direct_declarator compound_statement { return {type: "FuncDefExpression", dest: {vartype: $1.vartype, name: $2.name, type: "Identifier"}, params: $2.params, body: $3};}

    ;

direct_declarator

	: IDENTIFIER { $$ = {name: yytext}; }

	| direct_declarator '(' parameter_list ')' {$$ = {name: $1.name, params: $3}}

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

	: type_specifier direct_declarator { $$ = {vartype: $1.vartype, name: $2.name}; }

	;


compound_statement

	: '{' '}'

	;