export function program(statements) {
    return { kind: 'Program', statements }
}

export function variableDeclaration(variable, initializer) {
    return { kind: 'VariableDeclaration', variable, initializer }
}

export function variable(name, type) {
    return { kind: 'Variable', name, type }
}

export function typeDeclaration(type) {
    return { kind: 'TypeDeclaration', type }
}

export function printStatement(expression) {
    return { kind: 'PrintStatement', expression }
}

export const boolType = { kind: 'BoolType' }
export const intType = { kind: 'IntType' }
export const floatType = { kind: 'FloatType' }
export const stringType = { kind: 'StringType' }
export const anyType = { kind: 'AnyType' }
export const voidType = { kind: "VoidType" }

export function classType(name, fields) {
    return { kind: 'ClassType', name, fields }
}

export function field(name, type) {
    return { kind: 'Field', name, type }
}

export function functionDeclaration(fun, params, body) {
    return { kind: 'FunctionDeclaration', fun, params, body }
}

export function fun(name, type) {
    return { kind: 'Function', name, type }
}

export function functionType(paramTypes, returnType) {
    return { kind: 'FunctionType', paramTypes, returnType }
}

export function arrayType(baseType) {
    return { kind: 'ArrayType', baseType }
}

export function emptyArray(type) {
    return { kind: 'EmptyArray', type }
}

export function arrayExpression(elements) {
    return {
        kind: 'ArrayExpression',
        elements,
        type: arrayType(elements[0].type),
    }
}

export function optionalType(baseType) {
    return { kind: 'OptionalType', baseType }
}

export function assignment(target, source) {
    return { kind: 'Assignment', target, source }
}

export const breakStatement = { kind: 'BreakStatement' }

export function forStatement(iterator, collection, body) {
    return { kind: 'ForStatement', iterator, collection, body }
}

export function forRangeStatement(variable, start, end, body) {
    return { kind: 'ForRangeStatement', variable, start, end, body }
}

export function returnStatement(expression) {
    return { kind: 'ReturnStatement', expression }
}

export function shortReturnStatement() {
    return { kind: 'shortReturnStatement' }
}

export function ifStatement(test, consequent, alternate) {
    return { kind: 'IfStatement', test, consequent, alternate }
}

export function shortIfStatement(test, consequent) {
    return { kind: 'ShortIfStatement', test, consequent }
}

export function whileStatement(test, body) {
    return { kind: 'WhileStatement', test, body }
}

export function conditional(test, consequent, alternate, type) {
    return { kind: 'Conditional', test, consequent, alternate, type }
}

export function binary(op, left, right, type) {
    return { kind: 'BinaryExpression', op, left, right, type }
}

export function negation(op, operand, type) {
    return { kind: 'NegationExpression', op, operand, type }
}

export function emptyOptional(baseType) {
    return { kind: 'EmptyOptional', baseType, type: optionalType(baseType) }
}

export function subscript(array, index) {
    return { kind: "SubscriptExpression", array, index, type: array.type.baseType }
  }

export function memberExpression(object, op, field) {
    return { kind: 'MemberExpression', object, op, field, type: field.type }
}

export function functionCall(callee, args) {
    return { kind: 'FunctionCall', callee, args, type: callee.type.returnType }
}

export function constructorCall(callee, args) {
    return { kind: 'ConstructorCall', callee, args, type: callee }
}

const floatToFloatType = functionType([floatType], floatType)
const floatFloatToFloatType = functionType([floatType, floatType], floatType)
const stringToIntsType = functionType([stringType], arrayType(intType))
const anyToVoidType = functionType([anyType], voidType)

export const standardLibrary = Object.freeze({
    int: intType,
    float: floatType,
    boolean: boolType,
    string: stringType,
    any: anyType,
    print: fun("print", anyToVoidType),
    π: variable('π', true, floatType),
    exp: fun('exp', floatToFloatType),
    ln: fun('ln', floatToFloatType),
    void: voidType
})

String.prototype.type = stringType
Number.prototype.type = floatType
Boolean.prototype.type = boolType
BigInt.prototype.type = intType
