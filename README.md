<img src="./docs/mode_logo.png" alt="mode_logo" style="width:300px;">

# MODE

## Story/Introduction

## Features

- Type inference
- Classes
- String interpolation
- Lambda functions
- Optional variables
- Ternary operators

## Example Programs

|                        | JS                                                                                         | Swift                  | MODE                                                               |     |
| ---------------------- | ------------------------------------------------------------------------------------------ | ---------------------- | ------------------------------------------------------------------ | --- |
| Type Inference         | let x = 5                                                                                  |                        | auto x = 5                                                         |     |
| Classes                | class Rectangle { constructor(height, width) { this.height = height this.width = width } } |                        | mode Rectangle(height, width): my.height = height my.width = width |     |
| String Interpolation   | let name = "Joe" let greeting = `Hello ${name}`                                            |                        | auto name = "Joe" auto greeting = %"Hello (name)"                  |     |
| Arrow/Lambda Functions | const add = (a, b) => a + b                                                                |                        | auto add = a, b returns a + b                                      |     |
| Optional Variables     |                                                                                            | var number: Int? = nil | auto maybe number = Null                                           |     |
| Ternary Operators      | let result = a > b ? "a is greater" : "b is greater"                                       |                        | auto result = a > b then "a is greater" else "b is greater"        |     |
