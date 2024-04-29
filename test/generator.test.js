import assert from "node:assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "small",
    source: `
      auto x = 3 * 7;
      x = x + 1;
      x = x - 1;
      auto y = true;
    `,
    expected: dedent`
      let x_1 = 21;
      x_1 = x_1 + 1;
      x_1 = x_1 - 1;
      let y_2 = true;
    `,
  },
  {
    name: "if",
    source: `
      auto x = 0;
      if x == 0 { print "1"; }
      if x == 0 { print 1; } else { print 2; }
      if x == 0 { print 1; } else if x == 2 { print 3; }
      if x == 0 { print 1; } else if x == 2 { print 3; } else { print 4; }
    `,
    expected: dedent`
      let x_1 = 0;
      if ((x_1 === 0)) {
        console.log("1");
      }
      if ((x_1 === 0)) {
        console.log(1);
      } else {
        console.log(2);
      }
      if ((x_1 === 0)) {
        console.log(1);
      } else
        if ((x_1 === 2)) {
          console.log(3);
        }
      if ((x_1 === 0)) {
        console.log(1);
      } else
        if ((x_1 === 2)) {
          console.log(3);
        } else {
          console.log(4);
        }
    `,
  },
  {
    name: "while",
    source: `
      auto x = 0;
      while x < 5 {
        auto y = 0;
        while y < 5 {
          print x * y;
          y = y + 1;
          break;
        }
        x = x + 1;
      }
    `,
    expected: dedent`
      let x_1 = 0;
      while ((x_1 < 5)) {
        let y_2 = 0;
        while ((y_2 < 5)) {
          console.log((x_1 * y_2));
          y_2 = (y_2 + 1);
          break;
        }
        x_1 = (x_1 + 1);
      }
    `,
  },
  {
    name: "functions",
    source: `
    auto z = 0.5;
    func f(x: float, y: bool) {
      print x;
      return;
    }
    func g(): bool {
      return false;
    }
    `,
    expected: dedent`
      let z_1 = 0.5;
      function f_2(x_3, y_4) {
        console.log(x_3);
        return;
      }
      function g_5() {
        return false;
      }
    `,
  },
  // Not synactically correct yet - array member not implemented
  {
    name: "arrays",
    source: `
      auto a = [true, false, true];
      auto b = [10, 20, 30];
      auto c = int[]();
      print a[1];
      print b[1];
    `,
    expected: dedent`
      let a_1 = [true,false,true];
      let b_2 = [10,20,30];
      let c_3 = [];
      console.log(a_1[1]);
      console.log(b_2[1]);
    `,
  },
  // Not synactically correct yet - member operator not implemented
  {
    name: "classes",
    source: `
      class S { x: int; };
      auto x = S(3);
      print(x.x);
    `,
    expected: dedent`
      class S_1 {
      constructor(x_2) {
      this["x_2"] = x_2;
      }
      }
      let x_3 = new S_1(3);
      console.log((x_3["x_2"]));
    `,
  },
  // Not synactically correct yet - loop over array not implemented
  {
    name: "for loops",
    source: `
      for i in 1..50 {
        print i;
      }
      for j in [10, 20, 30] {
        print j;
      }
    `,
    expected: dedent`
      for (let i_1 = 1; i_1 < 50; i_1++) {
        console.log(i_1);
      }
      for (let j_2 of [10,20,30]) {
        console.log(j_2);
      }
    `,
  },
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(parse(fixture.source))))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})