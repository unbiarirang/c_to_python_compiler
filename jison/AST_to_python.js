const parser = require("./my_c_parser.js").parser;
const fs = require("fs");
var source = require('fs').readFileSync(require('path').normalize("code.c"), "utf8");
root = parser.parse(source)
result = (JSON.stringify(parser.parse(source), null, 2));

require('fs').writeFileSync(require('path').normalize("AST"), result, "utf8");

outputStream = "";

indent = 0;



write = (str) => {
    outputStream += str;
    console.log('aaa')
}

writeIndent = () => {
    for (let i = 0; i < indent; i++) {
        write(" ");
    }
}

printProgram = (program) => {
    console.log(program)
    for (let funcDef of program.funcDefs) {
        console.log(funcDef)
        printFuncDef(funcDef);
    }
    write("\n");
}

printFuncDef = (funcDef) => {
    write("def " + funcDef.funcName + "(");
    let l = funcDef.params.length;
    let i = 0;
    for (i = 0; i < l-1; i++) {
        printParam(funcDef.params[i]);
        write(", ");
    }
    if (i < l) {
        printParam(funcDef.params[i]);
    }
    write("): ");
    
    write("\n");
    indent += 4;
    printCompoundStat(funcDef.statements);
    indent -= 4;
    write('\n');
}

printParam = (param) => {
    
    write(param.name)
}


printStatement = (stat) => {
//    write("stat\n");
    if (stat.statementType === 'compound') {
        printCompoundStat(stat.subStatement);
    } else if (stat.statementType === 'expression') {
        writeIndent();
        write('expression statement\n');
        printExpressionStat(stat.subStatement);
    } else if (stat.statementType === 'jump') {
        writeIndent();
        write('jump statement\n');
    } else if (stat.statementType === 'iteration') {
        writeIndent();
        write('iteration statement\n');
    } else if (stat.statementType === 'selection') {
        writeIndent();
        write('selection statement\n');
        printSelectionStat(stat.subStatement);
    }
}

printCompoundStat = (stat) => {
    for (let subStat of stat.statements) {
        console.log('ddd');
        printStatement(subStat); 
    }
}

printSelectionStat = (stat) => {
    writeIndent()
    write("if ");
    // printExpression(stat.expr)
    write("expr")
    write(" :\n")
    indent += 4;
    printStatement(stat.ifThenStatement);
    indent -= 4;

    if (stat.elseStatement != null) {
        writeIndent();
        write("else:\n")
        indent += 4;
        printStatement(stat.elseStatement);
        indent -= 4;
    }
}
printIterationStat = (stat) => {

}
printJumpStat = (stat) => {

}
printExpressionStat = (stat) => {
    writeIndent();
    printExpression(stat.expr);
    write('\n');
}

printExpression = (expr) => {
    writeIndent();
    let i = 0;
    let l = expr.assignExprs.length;
    for (i = 0; i < l-1; i++) {
        printAssignExpr(expr.assignExprs[i]);
        write(", ");
    }
    if (i < l) {
        printAssignExpr(expr.assignExprs[i]);
    }
    write("\n");
}

printAssignExpr = (asExpr) => {
    if (asExpr.logicalExpr != null) {
        printLogicalExpr(asExpr.logicalExpr);
    } else {
        printUnaryExpr(asExpr.unaryExpr);
        write(" " + asExpr.assignOp);
        console.log("bbbbbbbbbbbbbbbbbbbbbbbbbb" + JSON.stringify(asExpr,null,2));
        printAssignExpr(asExpr.assignExpr);
    }
}

printLogicalExpr = (loExpr) => {
    if (loExpr.logicalExpr == null) {
        printBitOpExpr(loExpr.bitOpExpr);
    } else {
        printLogicalExpr(loExpr.logicalExpr);
        write(" " + loExpr.op);
        printBitOpExpr(loExpr.bitOpExpr);
    }
}

printBitOpExpr = (bitOpExpr) => {
    if (bitOpExpr.bitOpExpr == null) {
        printEqualityExpr(bitOpExpr.equalityExpr);
    } else {
        printBitOpExpr(bitOpExpr.bitOpExpr);
        write(" " + bitOpExpr.op);
        printEqualityExpr(bitOpExpr.equalityExpr);
    }
}

printEqualityExpr = (equalityExpr) => {
    if (equalityExpr.equalityExpr == null) {
        printRelationalExpr(equalityExpr.relationalExpr);
    } else {
        printEqualityExpr(equalityExpr.equalityExpr);
        write(" " + equalityExpr.op);
        printRelationalExpr(equalityExpr.relationalExpr);
    }
}

printRelationalExpr = (rationalExpr) => {
    if (rationalExpr.rationalExpr == null) {
        printShiftExpr(rationalExpr.shiftExpr);
    } else {
        printRelationalExpr(rationalExpr.rationalExpr);
        write(" " + rationalExpr.op);
        printShiftExpr(rationalExpr.shiftExpr);
    }
}

printShiftExpr = (shiftExpr) => {
    if (shiftExpr.shiftExpr == null) {
        printAdditiveExpr(shiftExpr.additiveExpr);
    } else {
        printShiftExpr(shiftExpr.shiftExpr);
        write(" " + shiftExpr.op);
        printAdditiveExpr(shiftExpr.additiveExpr);
    }
}

printAdditiveExpr = (additiveExpr) => {
    if (additiveExpr.additiveExpr == null) {
        printMultiplicativeExpr(additiveExpr.multiplicativeExpr);
    } else {
        printAdditiveExpr(additiveExpr.additiveExpr);
        write(" " + additiveExpr.op);
        printMultiplicativeExpr(additiveExpr.multiplicativeExpr);
    }
}

printMultiplicativeExpr = (multiplicativeExpr) => {
    if (multiplicativeExpr.multiplicativeExpr == null) {
        printUnaryExpr(multiplicativeExpr.unaryExpr);
    } else {
        printMultiplicativeExpr(multiplicativeExpr.multiplicativeExpr);
        write(" " + multiplicativeExpr.op + " ");
        printUnaryExpr(multiplicativeExpr.unaryExpr);
    }
}

printUnaryExpr = (unaryExpr) => {
    if (unaryExpr.postfixExpr != null) {
        printPostfixExpr(unaryExpr.postfixExpr);
    } else {
        write(unaryExpr.op);
        printUnaryExpr(unaryExpr.unaryExpr);
    }
}

printPostfixExpr = (postfixExpr) => {
    if (postfixExpr.primaryExpr != null) {
        printPrimaryExpr(postfixExpr.primaryExpr);
    } else if (postfixExpr.expr != null) {
        printPostfixExpr(postfixExpr.postfixExpr);
        write("[");
        printExpression(postfixExpr.expr);
        write("]");
    } else if (postfixExpr.identifier != null) {
        printPostfixExpr(postfixExpr.postfixExpr);
        write("." + postfixExpr.identifier);
    } else if (postfixExpr.op != null) {
        printPostfixExpr(postfixExpr.postfixExpr);
        write(postfixExpr.op)
    } else if (postfixExpr.arguments != null) {
        printPostfixExpr(postfixExpr.postfixExpr);
        write("(");
        let i = 0;
        let l = postfixExpr.arguments.length;
        for (i = 0; i < l-1; i++) {
            printAssignExpr(postfixExpr.arguments[i]);
            write(", ");
        }
        if (i < l) {
            printAssignExpr(postfixExpr.arguments[i]);
        }
        write(")\n");
    }
}

printPrimaryExpr = (primaryExpr) => {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + primaryExpr.value);
    if (primaryExpr.expr != null) {
        write("(");
        printExpression(primaryExpr.expr);
        write(")");
    } else {
        if (primaryExpr.value == 'printf') {
            write('print');
        } else if (primaryExpr.value == 'scanf') {
            write('input');
        } else {
            write(primaryExpr.value);
        }
    }
}

printProgram(root);
fs.writeFileSync(require('path').normalize("code.py"), outputStream, "utf8");