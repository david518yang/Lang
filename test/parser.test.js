import assert from 'assert'
import parse from '../src/parser.js'

const syntaxChecks = [
    ['a single print statement', 'print 1;'],
    ['numbers', `a = 2; b = 3; c = 4;`],
    ['true and false', `a = true; b = false;`],
    ['Modulo', `a = 2 % 3;`],
    ['exponents', `a = 2 ** 3;`],
    ['factorial', `a = 5; b = 1; while a > 0 { b = b * a; a = a - 1; }`],
    ['if statement', `if 1 { print 1; }`],
    ['if else statement', `if 1 { print 1; } else { print 2; }`],
    ['while statement', `while 1 { print 1; }`],
    [
        'while if else statement',
        `while 1 { if 1 { print 1; } else { print 2; } }`,
    ],
    ['nested while', `while x == 1 { while 1 { print 1; } }`],
    ['nested if', `if 1 { if 1 { print 1; } }`],
    ['break statement', `while 1 { break; }`],
    [
        'conditional inside while',
        `while x == 1 { if 1 { print 1; } else { print 2; } }`,
    ],
]

const syntaxErrors = [
    ['invalid identifier name', 'ab)c = 2;', /Line 1, col 3/],
    ['malformed number', 'x= 2.;', /Line 1, col 6/],
    ['missing semicolon in assignment', 'x = 3 y = 1', /Line 1, col 7/],
    ['missing semicolon in print statement', 'print name', /Line 1, col 11/],
    ['missing right operand', 'print(5 -', /Line 1, col 10/],
    ['non-operator', 'print 7 * (2 _ 3)', /Line 1, col 14/],
    ['expression starting with )', 'x = );', /Line 1, col 5/],
    ['statement starting with expression', 'x * 5;', /Line 1, col 3/],
    ['illegal statement line 2', 'print 5;\nx * 5;', /Line 2, col 3/],
    ['statement starting with )', 'print(5);\n) * 5', /Line 2, col 1/],
    ['expression starting with *', 'x = * 71;', /Line 1, col 5/],
    [
        'else with no if statement',
        'print 5;\nelse { print 3; }',
        /Line 2, col 1/,
    ],
    ["need '{' after conditional", 'if 3 6 + 4', /Line 1, col 6/],
    ['invalid relational operator', 'if 3>>4', /Line 1, col 6/],
    ['invalid relational operator', 'if 3<<4', /Line 1, col 6/],
    ['invalid relational operator', 'if 3><4', /Line 1, col 6/],
    ['invalid relational operator', 'if 3<>4', /Line 1, col 6/],
]

describe('The parser', () => {
    for (const [scenario, source] of syntaxChecks) {
        it(`properly specifies ${scenario}`, () => {
            assert(parse(source).succeeded())
        })
    }
    for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
        it(`rejects ${scenario}`, () => {
            assert.throws(() => parse(source), errorMessagePattern)
        })
    }
})