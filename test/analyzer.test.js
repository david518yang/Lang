import assert from 'node:assert/strict'
import parse from '../src/parser.js'
import analyze from '../src/analyzer.js'
import {
    program,
    variableDeclaration,
    variable,
    binary,
    floatType,
    intType,
} from '../src/core.js'

// Programs that are semantically correct
const semanticChecks = [
    ['variable declarations', 'auto x = 5.8E20;'],
    [
        'function declarations',
        `func add(x: int, y: int): int { return x + y; }`,
    ],
    ['return in nested if', 'func f () {if true {return;}}'],
    ['while, break in nested if', 'while false {if true {break;}}'],
    ['if else', 'if true {print 1;} else {print 3;}'],
    ['else if', 'if true {print 1;} else if true {print 0;} else {print 3;}'],
    ['for in range', 'for i in 1..5 {print i;}'],
    [
        'func call',
        `func calculateSum(x: int, y: int): int { return x + y; } calculateSum(1, 2);`,
    ],
    ['short return', 'func shortReturnFunction(){return;}'],
    ['long return', 'func longReturnFunction(): bool{ return true;}'],
    ['if with yield', 'print if (true) yield 1 otherwise 2;'],
    ['initialize with empty array', 'auto a = int[]();'],
    ['class declaration', 'class Dog { name:string; age:int;};'],
    ['subscript exp', 'auto a=[1,2];print a[0];'],
    ['floatType', 'float x = 5.820;'],
    ['check float type', 'float x = 5.820; print x;'],
    ['return float keyword', 'func f(): float { return 5.820; }'],
    ['primary array expression', 'auto x = [1, 2, 3];'],
    ['comparison operators', 'if 1 < 2 { print 1; }'],
    ['forStatement iterable', 'for i in [1, 2, 3] { print i; }'],
    [
        'class member has a member',
        'class Dog { name:string; age:int; }; auto d = Dog("max", 2); print d.age;',
    ],
    ['term binary multiplication', 'auto product = 8; product = product * 4;'],
    [
        'type id',
        'class Square{ area: int; }; class Rectangle{ square: Square; }; auto r = Rectangle(Square(4));',
    ],
    [
        'type description for array type',
        'int[] arr = [1, 2, 3]; arr = [2, 3, 4];',
    ],
    ['unary negation', 'auto x = -5;']
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
    [
        'type mismatch',
        `auto x = "hello"; x = 5;`,
        /Cannot assign a int to a string/,
    ],
    ['undeclared ids', `print(x);`, /Identifier x not declared/],
    ['break outside of loop', `break;`, /Break can only appear in a loop/],
    [
        'func return type matching',
        `func wrongReturn(): int { return "not an int"; }`,
        /Cannot assign a string to a int/,
    ],
    [
        'func param type matching',
        `func wrongParam(theParam:string){ return; } wrongParam(90);`,
        /Cannot assign a int to a string/,
    ],
    [
        'duplicate ids',
        `auto x = 10; auto x = 20;`,
        /Identifier x already declared/,
    ],
    [
        'return outside function',
        'return;',
        /Return can only appear in a function/,
    ],
    [
        'return value from void function',
        'func f() {return 1;}',
        /Cannot return a value/,
    ],
    [
        'return nothing from non-void',
        'func f(): int {return;}',
        /should be returned/,
    ],

    [
        'non-boolean short if test',
        'if 1 {print "Hello";}',
        /Expected a boolean/,
    ],
    [
        'non-boolean if test',
        'if 1 {print "Hello";} else {print "Goodbye";}',
        /Expected a boolean/,
    ],
    [
        'non-boolean while test',
        'while 1 {print "Hello";}',
        /Expected a boolean/,
    ],
    [
        'non-integer low range',
        'for i in true..2 {print i;}',
        /Expected an integer/,
    ],
    [
        'non-integer high range',
        'auto no = "Hello"; for i in 1..no {print i;}',
        /Expected an integer/,
    ],
    [
        'no such member in class',
        'class Dog { name:string; age:int; }; auto d = Dog("max", 2); print d.breed;',
        /No such field/,
    ],
    ['call of uncallable', 'auto x = 1;\nprint x();', /Call of non-function/],
    [
        'Too many args',
        'func f(x:int) {print x;} f(1,2);',
        /1 argument\(s\) required but 2 passed/,
    ],
    [
        'Too few args',
        'func f(x:int) {print x;} f();',
        /1 argument\(s\) required but 0 passed/,
    ],
]

describe('The analyzer', () => {
    for (const [scenario, source] of semanticChecks) {
        it(`recognizes ${scenario}`, () => {
            assert.ok(analyze(parse(source)))
        })
    }
    for (const [scenario, source, errorMessagePattern] of semanticErrors) {
        it(`throws on ${scenario}`, () => {
            assert.throws(() => analyze(parse(source)), errorMessagePattern)
        })
    }
    it('produces the expected representation for a trivial program', () => {
        assert.deepEqual(
            analyze(parse('auto x = 5 + 2;')),
            program([
                variableDeclaration(
                    variable('x', intType),
                    binary('+', 5n, 2n, intType)
                ),
            ])
        )
    })
})
