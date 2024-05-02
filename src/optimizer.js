import * as core from "./core.js"

export default function optimize(node) {
  return optimizers?.[node.kind]?.(node) ?? node
}

const optimizers = {
  Program(p) {
    p.statements = p.statements.flatMap(optimize)
    return p
  },
  VariableDeclaration(d) {
    d.variable = optimize(d.variable)
    d.initializer = optimize(d.initializer)
    return d
  },
  TypeDeclaration(d) {
    d.type = optimize(d.type)
    return d
  },
  FunctionDeclaration(d) {
    d.fun = optimize(d.fun)
    if (d.body) d.body = d.body.flatMap(optimize)
    return d
  },
  Assignment(s) {
    s.source = optimize(s.source)
    s.target = optimize(s.target)
    if (s.source === s.target) {
      return []
    }
    return s
  },
  BreakStatement(s) {
    return s
  },
  ReturnStatement(s) {
    s.expression = optimize(s.expression)
    return s
  },
  ShortReturnStatement(s) {
    return s
  },
  IfStatement(s) {
    s.test = optimize(s.test)
    s.consequent = s.consequent.flatMap(optimize)
    if (s.alternate?.kind?.endsWith?.("IfStatement")) {
      s.alternate = optimize(s.alternate)
    } else {
      s.alternate = s.alternate.flatMap(optimize)
    }
    return s
  },
  ShortIfStatement(s) {
    s.test = optimize(s.test)
    s.consequent = s.consequent.flatMap(optimize)
    return s
  },
  WhileStatement(s) {
    s.test = optimize(s.test)
    if (s.test === false) {
      return []
    }
    s.body = s.body.flatMap(optimize)
    return s
  },
  ForRangeStatement(s) {
    s.iterator = optimize(s.iterator)
    s.start = optimize(s.start)
    s.op = optimize(s.op)
    s.end = optimize(s.end)
    s.body = s.body.flatMap(optimize)
    if (s.start > s.end) {
        return []
    }
    return s
  },
  ForStatement(s) {
    s.iterator = optimize(s.iterator)
    s.collection = optimize(s.collection)
    s.body = s.body.flatMap(optimize)
    if (s.collection?.kind === "EmptyArray") {
      return []
    }
    return s
  },
  Ternary(e) {
    e.test = optimize(e.test)
    e.consequent = optimize(e.consequent)
    e.alternate = optimize(e.alternate)
    if (e.test.constructor === Boolean) {
      return e.test ? e.consequent : e.alternate
    }
    return e
  },
  BinaryExpression(e) {
    e.op = optimize(e.op)
    e.left = optimize(e.left)
    e.right = optimize(e.right)
    if (e.op === "??") {
      // Coalesce Empty Optional Unwraps
      if (e.left?.kind === "EmptyOptional") {
        return e.right
      }
    } else if (e.op === "&&") {
      // Optimize boolean constants in && and ||
      if (e.left === true) return e.right
      else if (e.right === true) return e.left
    } else if (e.op === "||") {
      if (e.left === false) return e.right
      else if (e.right === false) return e.left
    } else if ([Number, BigInt].includes(e.left.constructor)) {
      // Numeric constant folding when left operand is constant
      if ([Number, BigInt].includes(e.right.constructor)) {
        if (e.op === "+") return e.left + e.right
        else if (e.op === "-") return e.left - e.right
        else if (e.op === "*") return e.left * e.right
        else if (e.op === "/") return e.left / e.right
        else if (e.op === "**") return e.left ** e.right
        else if (e.op === "<") return e.left < e.right
        else if (e.op === "<=") return e.left <= e.right
        else if (e.op === "==") return e.left === e.right
        else if (e.op === "!=") return e.left !== e.right
        else if (e.op === ">=") return e.left >= e.right
        else if (e.op === ">") return e.left > e.right
      } else if (e.left === 0 && e.op === "+") return e.right
      else if (e.left === 1 && e.op === "*") return e.right
      else if (e.left === 0 && e.op === "-") return core.negation("-", e.right)
      else if (e.left === 1 && e.op === "**") return 1
      else if (e.left === 0 && ["*", "/"].includes(e.op)) return 0
    } else if ([Number, BigInt].includes(e.right.constructor)) {
      if (["+", "-"].includes(e.op) && e.right === 0) return e.left
      else if (["*", "/"].includes(e.op) && e.right === 1) return e.left
      else if (e.op === "*" && e.right === 0) return 0
      else if (e.op === "**" && e.right === 0) return 1
    }
    return e
  },
  NegationExpression(e) {
    e.op = optimize(e.op)
    e.operand = optimize(e.operand)
    if (e.operand.constructor === Number) {
      if (e.op === "-") {
        return -e.operand
      }
    }
    return e
  },
  SubscriptExpression(e) {
    e.array = optimize(e.array)
    e.index = optimize(e.index)
    return e
  },
  ArrayExpression(e) {
    e.elements = e.elements.map(optimize)
    return e
  },
  MemberExpression(e) {
    e.object = optimize(e.object)
    return e
  },
  FunctionCall(c) {
    c.callee = optimize(c.callee)
    c.args = c.args.map(optimize)
    return c
  },
  ConstructorCall(c) {
    c.callee = optimize(c.callee)
    c.args = c.args.map(optimize)
    return c
  },
}