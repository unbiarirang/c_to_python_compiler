const parser = require("./my_c_parser.js").parser;
const fs = require("fs");

let source = require('fs').readFileSync(require('path').normalize("code.c"), "utf8");
root = parser.parse(source)
result = (JSON.stringify(parser.parse(source), null, 2));

require('fs').writeFileSync(require('path').normalize("AST"), result, "utf8");

outputStream = "";

indent = 0;

write = (str) => {
    outputStream += str;
}

writeIndent = () => {
    for (let i = 0; i < indent; i++) {
        write(" ");
    }
}

printProgram = (program) => {
    for (let funcDef of program.funcDefs) {
        printFuncDef(funcDef);
    }
    write('main()\n');
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
        //writeIndent();
        //write('expression statement\n');
        printExpressionStat(stat.subStatement);
    } else if (stat.statementType === 'jump') {
        //writeIndent();
        //write('jump statement\n');
        printJumpStat(stat.subStatement);
    } else if (stat.statementType === 'iteration') {
        //writeIndent();
        //write('iteration statement\n');
        printIterationStat(stat.subStatement);
    } else if (stat.statementType === 'selection') {
        //writeIndent();
        //write('selection statement\n');
        printSelectionStat(stat.subStatement);
    }
}

printCompoundStat = (stat) => {
    for (let declaration of stat.declarations) {
        printDeclaration(declaration); 
    }
    for (let subStat of stat.statements) {
        printStatement(subStat); 
    }
}

printSelectionStat = (stat) => {
    writeIndent()
    write("if ");
    printExpression(stat.conditionExpr)
    //write("expr")
    write(":\n")
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
    writeIndent()
    if (stat.loopType === 'while') {
        write('while ');
        printExpression(stat.exprs[0]);
        write(" :\n");
        indent += 4;
        printStatement(stat.statement);
        indent -= 4;
    }
}
printJumpStat = (stat) => {
    writeIndent();
    if (stat.jumpType === 'return') {

        write('return ');
        if (stat.expr != null) {
            printExpression(stat.expr)
        }
        write('\n')
    }
}
printExpressionStat = (stat) => {
    writeIndent();
    printExpression(stat.expr);
    write('\n');
}

printExpression = (expr) => {
    let i = 0;
    let l = expr.assignExprs.length;
    for (i = 0; i < l-1; i++) {
        printAssignExpr(expr.assignExprs[i]);
        write(", ");
    }
    if (i < l) {
        printAssignExpr(expr.assignExprs[i]);
    }
}

printAssignExpr = (asExpr) => {
    if (asExpr.logicalExpr != null) {
        printLogicalExpr(asExpr.logicalExpr);
    } else {
        printUnaryExpr(asExpr.unaryExpr);
        write(" " + asExpr.assignOp + " ");
        printAssignExpr(asExpr.assignExpr);
    }
}

printLogicalExpr = (loExpr) => {
    if (loExpr.logicalExpr == null) {
        printBitOpExpr(loExpr.bitOpExpr);
    } else {
        printLogicalExpr(loExpr.logicalExpr);
        write(" " + loExpr.op + " ");
        printBitOpExpr(loExpr.bitOpExpr);
    }
}

printBitOpExpr = (bitOpExpr) => {
    if (bitOpExpr.bitOpExpr == null) {
        printEqualityExpr(bitOpExpr.equalityExpr);
    } else {
        printBitOpExpr(bitOpExpr.bitOpExpr);
        write(" " + bitOpExpr.op + " ");
        printEqualityExpr(bitOpExpr.equalityExpr);
    }
}

printEqualityExpr = (equalityExpr) => {
    if (equalityExpr.equalityExpr == null) {
        printRelationalExpr(equalityExpr.relationalExpr);
    } else {
        printEqualityExpr(equalityExpr.equalityExpr);
        write(" " + equalityExpr.op + " ");
        printRelationalExpr(equalityExpr.relationalExpr);
    }
}

printRelationalExpr = (relationalExpr) => {
    if (relationalExpr.relationalExpr == null) {
        printShiftExpr(relationalExpr.shiftExpr);
    } else {
        printRelationalExpr(relationalExpr.relationalExpr);
        write(" " + relationalExpr.op + " ");
        printShiftExpr(relationalExpr.shiftExpr);
    }
}

printShiftExpr = (shiftExpr) => {
    if (shiftExpr.shiftExpr == null) {
        printAdditiveExpr(shiftExpr.additiveExpr);
    } else {
        printShiftExpr(shiftExpr.shiftExpr);
        write(" " + shiftExpr.op + " ");
        printAdditiveExpr(shiftExpr.additiveExpr);
    }
}

printAdditiveExpr = (additiveExpr) => {
    if (additiveExpr.additiveExpr == null) {
        printMultiplicativeExpr(additiveExpr.multiplicativeExpr);
    } else {
        printAdditiveExpr(additiveExpr.additiveExpr);
        write(" " + additiveExpr.op + " ");
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

    if (postfixExpr.postfixExpr != null && postfixExpr.postfixExpr.primaryExpr.value === 'scanf') {
        printAssignExpr(postfixExpr.arguments[postfixExpr.arguments.length-1]);
        write(" = input()");
        return;
    }

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
        if (postfixExpr.op === "++") {
            write(" += 1")
        } else {
            write(" -= 1")
        }
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
        write(")");
    }
}

printPrimaryExpr = (primaryExpr) => {
    if (primaryExpr.expr != null) {
        write("(");
        printExpression(primaryExpr.expr);
        write(")");
    } else {
        if (primaryExpr.value == 'printf') {
            write('print');
        } else if (primaryExpr.value == 'scanf') {
            write('input');
        } else if (primaryExpr.value == 'strlen') {
            write('len');
        } else {
            write(primaryExpr.value);
        }
    }
}

printDeclaration = (declaration) => {
    writeIndent();
    if (declaration.declaredType === 'char' && (declaration.isArray || declaration.isPointer)) {
        if (declaration.assignExpr == null) {
            write(declaration.name + ' = \"\"')
        } else {
            write(declaration.name + ' = ');
            printAssignExpr(declaration.assignExpr);
        }
    } else {
        if (declaration.assignExpr != null) {
            write(declaration.name + ' = ');
            printAssignExpr(declaration.assignExpr);
        }
    }
    write('\n');
}

printProgram(root);
fs.writeFileSync(require('path').normalize("code.py"), outputStream, "utf8");