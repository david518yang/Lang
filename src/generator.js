import { voidType, standardLibrary } from './core.js'

export default function generate(program) {

    const output = []

    const standardFunctions = new Map([
        [standardLibrary.print, (x) => `console.log(${x})`],
    ])

    const targetName = ((mapping) => {
        return (entity) => {
            if (!mapping.has(entity)) {
                mapping.set(entity, mapping.size + 1)
            }
            return `${entity.name}_${mapping.get(entity)}`
        }
    })(new Map())

    const gen = (node) => generators?.[node?.kind]?.(node) ?? node

    const generators = {
        Program(p) {
            p.statements.forEach(gen)
        },
        VariableDeclaration(d) {
            output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`)
        },
        TypeDeclaration(d) {
            output.push(`class ${gen(d.type.name)} {`)
            output.push(`constructor(${d.type.fields.map(gen).join(',')}) {`)
            for (let field of d.type.fields) {
                output.push(
                    `this[${JSON.stringify(gen(field))}] = ${gen(field)};`
                )
            }
            output.push('}')
            output.push('}')
        },
        Field(f) {
            return targetName(f)
        },
        FunctionDeclaration(d) {
            output.push(
                `function ${gen(d.fun)}(${d.params.map(gen).join(', ')}) {`
            )
            d.body.forEach(gen)
            output.push('}')
        },
        Variable(v) {
            return targetName(v)
        },
        Function(f) {
            return targetName(f)
        },
        CallStatement(s) {
            output.push(`${gen(s.call)};`)
        },
        Assignment(s) {
            output.push(`${gen(s.target)} = ${gen(s.source)};`)
        },
        BreakStatement(s) {
            output.push('break;')
        },
        PrintStatement(s) {
            output.push(`console.log(${gen(s.expression)});`)
        },
        ReturnStatement(s) {
            output.push(`return ${gen(s.expression)};`)
        },
        ShortReturnStatement(s) {
            output.push('return;')
        },
        IfStatement(s) {
            output.push(`if (${gen(s.test)}) {`)
            s.consequent.forEach(gen)
            if (s.alternate?.kind?.endsWith?.('IfStatement')) {
                output.push('} else')
                gen(s.alternate)
            } else {
                output.push('} else {')
                s.alternate.forEach(gen)
                output.push('}')
            }
        },
        ShortIfStatement(s) {
            output.push(`if (${gen(s.test)}) {`)
            s.consequent.forEach(gen)
            output.push('}')
        },
        WhileStatement(s) {
            output.push(`while (${gen(s.test)}) {`)
            s.body.forEach(gen)
            output.push('}')
        },
        ForRangeStatement(s) {
            const i = targetName(s.iterator)
            output.push(
                `for (let ${i} = ${gen(s.start)}; ${i} <= ${gen(
                    s.end
                )}; ${i}++) {`
            )
            s.body.forEach(gen)
            output.push('}')
        },
        ForStatement(s) {
            output.push(
                `for (let ${gen(s.iterator)} of ${gen(s.collection)}) {`
            )
            s.body.forEach(gen)
            output.push('}')
        },
        Ternary(e) {
            return `(${gen(e.test)} ? ${gen(e.consequent)} : ${gen(e.alternate)})`;
        },
        
        
        BinaryExpression(e) {
            const op = { '==': '===', '!=': '!==' }[e.op] ?? e.op
            return `(${gen(e.left)} ${op} ${gen(e.right)})`
        },
        // NegationExpression(e) {
        //     const operand = gen(e.operand)
        //     // if (e.op === 'some') {
        //     //     return operand
        //     // } else if (e.op === '#') {
        //     //     return `${operand}.length`
        //     // } else if (e.op === 'random') {
        //     //     return `((a=>a[~~(Math.random()*a.length)])(${operand}))`
        //     // }
        //     return `${e.op}${operand}`
        // },
        SubscriptExpression(e) {
            return `${gen(e.array)}[${gen(e.index)}]`
        },
        ArrayExpression(e) {
            return `[${e.elements.map(gen).join(',')}]`
        },
        EmptyArray(e) {
            return '[]'
        },
        MemberExpression(e) {
            const object = gen(e.object)
            const field = JSON.stringify(gen(e.field))
            const chain = e.op === '.' ? '' : e.op
            return `(${object}${chain}[${field}])`
        },
        FunctionCall(c) {
            // if (standardFunctions.has(c.callee)) {
            //   return standardFunctions.get(c.callee)(c.args.map(gen))
            // }
            return `${gen(c.callee)}(${c.args.map(gen).join(', ')})`
        },
        ConstructorCall(c) {
            return `new ${gen(c.callee.name)}(${c.args.map(gen).join(', ')})`
        },
    }

    gen(program)
    return output.join('\n')
}

//IN CORE NOT IN GENERATOR
//classtype
//functype
//arraytype
//optionaltype
//negation(unary)
//emptyoptional