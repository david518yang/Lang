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
    // ['class definitons', `class Pair { x: int; y: int; } auto p = new Pair{1, 2};`],
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

    //['complex array types', 'function f(x: [[[int]]]) {}'],
    //['complex array types', 'function f(x: [[[int]]]) {}'],
    //["increment and decrement", "let x = 10; x--; x++;"],
    ['initialize with empty array', 'auto a = int[]();'],
    //['type declaration', 'struct S {f: (int)->boolean? g: string}'],
    //["assign arrays", "let a = [int]();let b=[1];a=b;b=a;"],
    //["assign to array element", "const a = [1,2,3]; a[1]=100;"],
    //["initialize with empty optional", "let a = no int;"],
    //['assign optionals', 'let a = no int;let b=some 1;a=b;b=a;'],
    //['for over collection', 'for i in [2,3,5] {print(1);}'],
    //['repeat', 'repeat 3 {let a = 1; print(a);}'],
    //['conditionals with ints', 'print(true ? 8 : 5);'],
    //['conditionals with floats', 'print(1<2 ? 8.0 : -5.22);'],
    //['conditionals with strings', 'print(1<2 ? "x" : "y");'],
    //['??', 'print(some 5 ?? 0);'],
    //['nested ??', 'print(some 5 ?? 8 ?? 0);'],
    //['||', 'print(true||1<2||false||!true);'],
    //['&&', 'print(true&&1<2&&false&&!true);'],
    //['bit ops', 'print((1&2)|(9^3));'],
    //['relations', 'print(1<=2 && "x">"y" && 3.5<1.2);'],
    //['ok to == arrays', 'print([1]==[5,8]);'],
    // ['ok to != arrays', 'print([1]!=[5,8]);'],
    // ['shifts', 'print(1<<3<<5<<8>>2>>0);'],
    // ['arithmetic', 'let x=1;print(2*3+5**-3/2-5%8);'],
    // ['array length', 'print(#[1,2,3]);'],
    // ['optional types', 'let x = no int; x = some 100;'],
    // ['random with array literals, ints', 'print(random [1,2,3]);'],
    // ['random with array literals, strings', 'print(random ["a", "b"]);'],
    // ['random on array variables', 'let a=[true, false];print(random a);'],
    // ['variables', 'let x=[[[[1]]]]; print(x[0][0][0][0]+2);'],
    // ['pseudo recursive struct', 'struct S {z: S?} let x = S(no S);'],
    // [
    //     'nested structs',
    //     'struct T{y:int} struct S{z: T} let x=S(T(1)); print(x.z.y);',
    // ],
    ['class declaration', 'class Dog { name:string; age:int;};'],
    // ['member exp', 'struct S {x: int} let y = S(1);print(y.x);'],
    // ['optional member exp', 'struct S {x: int} let y = some S(1);print(y?.x);'],
    ['subscript exp', 'auto a=[1,2];print a[0];'],
    // ['array of struct', 'struct S{} let x=[S(), S()];'],
    // ['struct of arrays and opts', 'struct S{x: [int] y: string??}'],
    // ['assigned functions', 'function f() {}\nlet g = f;g = f;'],
    // ['call of assigned functions', 'function f(x: int) {}\nlet g=f;g(1);'],
    // [
    //     'type equivalence of nested arrays',
    //     'function f(x: [[int]]) {} print(f([[1],[2]]));',
    // ],
    // [
    //     'call of assigned function in expression',
    //     `function f(x: int, y: boolean): int {}
    // let g = f;
    // print(g(1, true));
    // f = g; // Type check here`,
    // ],
    // [
    //     'pass a function to a function',
    //     `function f(x: int, y: (boolean)->void): int { return 1; }
    //  function g(z: boolean) {}
    //  f(2, g);`,
    // ],
    // [
    //     'function return types',
    //     `function square(x: int): int { return x * x; }
    //  function compose(): (int)->int { return square; }`,
    // ],
    // [
    //     'function assign',
    //     'function f() {} let g = f; let h = [g, f]; print(h[0]());',
    // ],
    // ['struct parameters', 'struct S {} function f(x: S) {}'],
    // ['array parameters', 'function f(x: [int?]) {}'],
    // ['optional parameters', 'function f(x: [int], y: string?) {}'],
    // ['empty optional types', 'print(no [int]); print(no string);'],
    // ['types in function type', 'function f(g: (int?, float)->string) {}'],
    // ['voids in fn type', 'function f(g: (void)->void) {}'],
    // ['outer variable', 'let x=1; while(false) {print(x);}'],
    // ['built-in constants', 'print(25.0 * π);'],
    // ['built-in sin', 'print(sin(π));'],
    // ['built-in cos', 'print(cos(93.999));'],
    // ['built-in hypot', 'print(hypot(-4.0, 3.00001));'],
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

    // [
    //     'non-distinct fields',
    //     'struct S {x: boolean x: int}',
    //     /Fields must be distinct/,
    // ],
    // ['non-int increment', 'let x=false;x++;', /an integer/],
    // ['non-int decrement', 'let x=some[""];x++;', /an integer/],
    // [
    //     'recursive struct',
    //     'struct S { x: int y: S }',
    //     /must not be self-containing/,
    // ],
    // ['assign to const', 'const x = 1;x = 2;', /Cannot assign to constant/],
    // [
    //     'assign bad array type',
    //     'let x=1;x=[true];',
    //     /Cannot assign a \[boolean\] to a int/,
    // ],
    // [
    //     'assign bad optional type',
    //     'let x=1;x=some 2;',
    //     /Cannot assign a int\? to a int/,
    // ],
    // [
    //     'break inside function',
    //     'while true {function f() {break;}}',
    //     /Break can only appear in a loop/,
    // ],
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
    // ['non-integer repeat', 'repeat "1" {}', /Expected an integer/],
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
    //['non-array in for', 'for i in 100 {}', /Expected an array/],
    // ['non-boolean conditional test', 'print(1?2:3);', /Expected a boolean/],
    // [
    //     'diff types in conditional arms',
    //     'print(true?1:true);',
    //     /not have the same type/,
    // ],
    // ['unwrap non-optional', 'print(1??2);', /Expected an optional/],
    // ['bad types for ||', 'print(false||1);', /Expected a boolean/],
    // ['bad types for &&', 'print(false&&1);', /Expected a boolean/],
    // [
    //     'bad types for ==',
    //     'print(false==1);',
    //     /Operands do not have the same type/,
    // ],
    // [
    //     'bad types for !=',
    //     'print(false==1);',
    //     /Operands do not have the same type/,
    // ],
    // ['bad types for +', 'print false+1;', /Expected a number or string/],
    // ['bad types for -', 'print false-1;', /Expected a number/],
    // ['bad types for *', 'print false*1;', /Expected a number/],
    // ['bad types for /', 'print false/1;', /Expected a number/],
    // ['bad types for **', 'print false**1;', /Expected a number/],
    // ['bad types for <', 'print false<1;', /Expected a number or string/],
    // ['bad types for <=', 'print false<=1;', /Expected a number or string/],
    // ['bad types for >', 'print false>1;', /Expected a number or string/],
    // ['bad types for >=', 'print false>=1;', /Expected a number or string/],
    // ['bad types for ==', 'print 2==2.0;', /not have the same type/],
    // ['bad types for !=', 'print false!=1;', /not have the same type/],
    // ['bad types for negation', 'print -true;', /Expected a number/],
    //['bad types for length', 'print(#false);', /Expected an array/],
    // ['bad types for not', 'print !"hello";', /Expected a boolean/],
    //['bad types for random', 'print(random 3);', /Expected an array/],
    //['non-integer index', 'let a=[1];print(a[false]);', /Expected an integer/],
    //['no such field', 'struct S{} let x=S(); print(x.y);', /No such field/],
    // [
    [
        'no such member in class',
        'class Dog { name:string; age:int; }; auto d = Dog("max", 2); print d.breed;',
        /No such field/,
    ],
    //     'diff type array elements',
    //     'print([3,3.0]);',
    //     /Not all elements have the same type/,
    // ],
    // [
    //     'shadowing',
    //     'let x = 1;\nwhile true {let x = 1;}',
    //     /Identifier x already declared/,
    // ],
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
    // [
    //     'bad param type in fn assign',
    //     'function f(x: int) {} function g(y: float) {} f = g;',
    // ],
    // [
    //     'bad return type in fn assign',
    //     'function f(x: int): int {return 1;} function g(y: int): string {return "uh-oh";} f = g;',
    //     /Cannot assign a \(int\)->string to a \(int\)->int/,
    // ],
    // [
    //     'bad call to sin()',
    //     'print(sin(true));',
    //     /Cannot assign a boolean to a float/,
    // ],
    //  ['Non-type in param', 'auto x=1; func f(){return;}', /Type expected/],
    // [
    //     'Non-type in return type',
    //     'auto x=1;func f():x{return 1;}',
    //     /Type expected/,
    // ],
    // ['Non-type in field type', 'let x=1;struct S {y:x}', /Type expected/],
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
