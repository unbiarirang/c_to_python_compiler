# 编译大作业 c to python 翻译器实验报告

## 实验原理与方法

我们使用了两种方法，一种是自己写脚本执行词法语法分析，另一种方法是使用jison词语法分析工具

### Hard-coding approach





### jison approach

`jison`是javascript版本的flex + bison，支持lex格式与yacc格式的词法、语法规则。

透过`jison`，给定词法语法规则(还可以在描述语法的同时，添入js语言的语义规则)，我们可以生成自己的parser，是一个js文件、模块，这自动生成的模块本身也支持命令行使用。

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

对`jison`传入`my_c_parser.bison`，得到我们的parser，`my_c_parser.js`模块。给入输入串，它能为我们生成AST。



#### AST to Python   (c_to_python.js)

编写`c_to_python.js`脚本，引用`my_c_parser.js`模块来对输入串(code.c)分析，生成AST object，然后再将AST输出成python代码(code.py)。

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

对于

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



## 使用、运行方法

### Hard-coding approach



### jison approach

首先`cd ./jison/`

#### 生成parser

项目中已存在生成好的parser，如果对于`my_c_parser.bison`中的词语法、语义规则有所改动，才需要重新生成。

1. `npm install jison -g`来安装并使用 `jison`。
2. `jison my_c_parser.bison`生成`my_c_parser.js`





#### c 转 python

`node c_to_python.js code.c` 可以生成`code.c`对应的`code_AST.json`与`code.py`。

目前功能可以将``palindrom.c`和`kmp.c`转换成正常运行的`palindrom.py`与`kmp.py`。

* Note that `c_to_python.js` uses `my_c_parser.js` as a module "hard-codingly"!



