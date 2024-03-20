export function program(stmts) {
    return { kind: 'Program', stmts }
}

export function variableDeclaration(variable, initializer) {
    return { kind: 'VariableDeclaration', variable, initializer }
}

export function variable(name, readOnly, type) {
    return { kind: 'Variable', name, readOnly, type }
}

export const boolType = { kind: 'BoolType' }
export const intType = { kind: 'IntType' }
export const floatType = { kind: 'FloatType' }
export const stringType = { kind: 'StringType' }
export const voidType = { kind: 'VoidType' }
export const anyType = { kind: 'AnyType' }

export function field(name, type) {
    return { kind: 'Field', name, type }
}

export function functionDeclaration(fun, params, body) {
    return { kind: 'FunctionDeclaration', fun, params, body }
}

export function fun(name, type) {
    return { kind: 'Function', name, type }
}

export function arrayType(baseType) {
    return { kind: 'ArrayType', baseType }
}

export function functionType(paramTypes, returnType) {
    return { kind: 'FunctionType', paramTypes, returnType }
}

export function optionalType(baseType) {
    return { kind: 'OptionalType', baseType }
}

export function assignment(target, source) {
    return { kind: 'Assignment', target, source }
}

export const breakStatement = { kind: 'BreakStatement' }

export function returnStatement(expression) {
    return { kind: 'ReturnStatement', expression }
}

export function ifStatement(test, consequent, alternate) {
    return { kind: 'IfStatement', test, consequent, alternate }
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

export function unary(op, operand, type) {
    return { kind: 'UnaryExpression', op, operand, type }
}

export function emptyOptional(baseType) {
    return { kind: 'EmptyOptional', baseType, type: optionalType(baseType) }
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
    void: voidType,
    any: anyType,
    π: variable('π', true, floatType),
    print: fun('print', anyToVoidType),
    exp: fun('exp', floatToFloatType),
    ln: fun('ln', floatToFloatType),
})

String.prototype.type = stringType
Number.prototype.type = floatType
Boolean.prototype.type = boolType
