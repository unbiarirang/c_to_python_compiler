# 编译大作业 c to python 翻译器实验报告

软件63 刘家维 2016013246
软件61 崔殷庇 2015080118
软件61 李相赫 2016080042

## 实验原理与方法

我们使用了两种方法，一种是自己写脚本执行词法语法分析，另一种方法是使用jison词语法分析工具。实现了回文函数与KMP算法函数的转译。

### jison approach

`jison`是javascript版本的flex + bison，支持lex格式与yacc格式的词法、语法规则。

透过`jison`，给入词法语法规则(还可以在描述语法的同时，添入js语言的语义规则)，我们可以生成自己的parser。

parser的`parse()`函数可以对输入串进行分析。假如传给`jison`的文件只含词法+语法规则，那么`parse`只会对输入串进行词法+语法分析，若分析没有问题，则parse回传值是`true`，有错误的话则会报错显示预期的token是哪些。
传给`jison`的语法规则中，每条产生式都可以添加语义规则(js语言描述)，则语法分析在该条产生式归约时，会运行对应语句，并可向上传递综合属性。一个简单的例子像是:

```javascript
// my_c_parser.bison

...

expression_statement
	: ';'                 { $$ = {type: "expression statement", expr: null};}
	| expression ';'      { $$ = {type: "expression statement", expr: $1}; }
	;
```

产生式右端`{}`中的就是语义规则，`$$`代表产生式左端的object，是要向上传递的。$1代表产生式右端的第一个符号的object，是从之前的归约传上来的。

透过js代码的语义规则，我们将信息自底向上传递，一层层地封装，最后得到AST。AST一个很重要的概念就是抽象化，这是它跟parse tree不同的地方，parse tree完全等于语法树，但是AST我们可以在适当的地方将树状结构简化、扁平化，像是:

```javascript
// my_c_parser.bison

...

parameter_list
	: parameter_declaration                       { $$ = [$1]; }
	| parameter_list ',' parameter_declaration    { $1.push($3); $$ = $1; }
	;
```

在这个例中，我们将多个`parameter_declaration`包装成一个数组。若是parse tree，有n个`parameter_declaration`就有n层节点，但在AST抽象化中我们将他扁平成一个数组，这也方便我们在输出代码时处理。



####C to AST    (`my_c_parser.bison`)

我们采用了网络上找到的C99的[c99.l](https://github.com/GerHobbelt/jison/blob/master/examples/c99.l)与[c99.y](https://github.com/GerHobbelt/jison/blob/master/examples/c99.y)文件，合并并添加了自己定义的语义规则，成了我们的`my_c_parser.bison`。

词法规则部份，将`c99.l`部份将多种常数都归类成为单一种常数，并且忽略所有`#include`语句。

语法规则部份，为了方便添加语义规则，删去了`c99.y`中很多细节或少见的语法，并且默认一个c代码由多个函数定义所构成，像是`palindrome.c`就由`test()`与`main()`构成。

对`jison`传入`my_c_parser.bison`，可以生成得到我们的parser对象。对parser给入C代码输入串，它能为我们生成AST。



#### AST to Python   (c_to_python.js)

编写`c_to_python.js`脚本，使用`my_c_parser.bison`生成出的parser来对输入串(code.c)分析，生成AST object，然后再将AST输出成python代码(code.py)。

AST中有多层节点，每层节点就是一个js Object，可能有不同键、键值类型也不一样。因为js本身没有class，对于object的成员类型也无法定义，所以为了方便处理，我们必须在用语义规则生成AST时，就要约定好有哪几种类型的节点。

我们约定让所有结点都带有键"`type`"，其值是字符串，标明此节点的类型，意义等于别的语言中的不同class。而相同`type`的节点就要有约定好的键与键值类型。对于各种节点的键值描述，写于`./doc/jison_approach_AST_struct_description.md`中。例如:

```javascript
// jison_approach_AST_struct_description.md

...

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

```

说明我们约定好`assignment expression`类型的节点要有`logicalExpr`键，其值为一个`logical expression`的节点，若其值为`null`，则它还应有`unaryExpr`、`assignOp`、`assignExpr`这三个键。

有了对于个节点的结构的明确描述，我们就在编写语义规则时，就要去封装出这些结构的节点。而在编写输出脚本时，就可以编写递归函数，为不同类型的节点写不同的print函数，像是:

```js
// c_to_python.js

...

printAssignExpr = (asExpr) => {
    if (asExpr.logicalExpr != null) {
        printLogicalExpr(asExpr.logicalExpr);
    } else {
        printUnaryExpr(asExpr.unaryExpr);
        write(" " + asExpr.assignOp + " ");
        printAssignExpr(asExpr.assignExpr);
    }
}
```

从上可以看到要输出`assignment expression`节点时，会相应地调用其键值类型的print函数，像是`printLogicalExpr()`，于是我们就能递归地将整个AST输出。递归函数的入口是`printProgram(root)`，`root`是`my_c_parser`回传的AST对象。



### Hard-coding approach

整个c到python的转换由`compiler.js`单个脚本完成。

`compiler.js`由 **tokenizer(lexer)**、**parser** 和 **codeGenerator**三大部分组成，把它们连接起来得到`compiler`。

1. Tokenizer: Take our string of code and break it down in to an array of tokens.
2. Parser: Take array of tokens and turn it into an AST.
3. CodeGenerator: Recursively call itself to print each node in the tree into one giant string (output).

```c
function compiler(input) {
  let tokens = tokenizer(input);
  let ast = parser(tokens);
  let output = codeGenerator(ast);

  // python code
  return output;
}
```



## 使用、运行方法

### Hard-coding approach

```
cd ./hard-coding-approach
node c_to_python.js parlindrome.c
```

变换成功会生成`parlindrome.py`

### jison approach

1. 首先`npm install`来安装依赖项`jison`。

2. `cd ./jison/`
3. `node c_to_python.js code.c` 可以生成`code.c`对应的`code_AST.json`与`code.py`。

目前功能可以将``palindrom.c`和`kmp.c`转换成正常运行的`palindrom.py`与`kmp.py`。

* Note that `c_to_python.js` uses `my_c_parser.bison` as an input "hard-codingly"!



## 难点与创新点

不论使用哪种approach, 难点之一都是要先理解C语言的语法结构，才能顺利语法分析。理解的过程中，也要知道哪些语法是太少用到且在这个项目中用不上的，适当的简化语法，才能在此次作业中更有效率，语义规则也才能编写的更容易。

另外一些难点在于C语言跟python有些根本的语法差异。各种语言的表达式文法都差不多，所以表达式的问题还不太大，但是在变量声明跟类型上就有很多差异了。像是python声明变量不需要类型，也没有指针，所以在C中遇到`char[]`或`char*`时就要用`s=""`来替代。而C中有`++`与`--`，若只是单纯的`i++;`，尚可以用`i += 1`来替代，但若是一长串表达式中有++，就很难处理了。此外，还有一些基本函数的名称不一样，像是printf要与print对应，`scanf`要与`input`对应，`strlen`对应`len`，且python中还有一些保留关键字是C没有的。这些差异都需要在输出时列出特例来检查并替换。尤其像`scanf` -> `input`，使用的语法结构有根本的差异，所以不能在语法树的最末端才将`scanf`换成`input`, 这样会写出`input("%s", &s)`这样的句型，所以必须要在较上层的节点(postfix expression)中就往下搜索，提前得知函数名与相关参数，才能打印出正确的`input`语句。

我们组创新的地方在于两种approach方法都实现了，对词法分析和语法分析的理解更加深刻。同时在使用分析工具上，我们采用了jison，而非flex+bison，采用jison，可以更好地直接透过js模块来制作parser，同时语义规则也是使用js语言编写，不仅方便也使得整个项目更加统一。
