import * as ohm from "ohm-js";

const grammar = ohm.grammar(String.raw`MODE {
    Program     = Stmt+
    Stmt        = Assignment 
                | Print
                | IfStmt
                | WhileStmt
                | BreakStmt
    Assignment  = id "=" Exp ";"                 --typeinferenceassignment
                | id "?"                         --optionalvar
    Print       = print Exp ";"
    IfStmt      = if Exp Block ElsePart?
    ElsePart    = else IfStmt
                | else Block
    WhileStmt   = while Exp Block
    Block       = "{" Stmt+ "}"
    BreakStmt   = break ";"
    Ternary     = "if" "(" Exp ")" "yield" Exp "otherwise" Exp --ternary
    Exp         = Exp1 relop Exp1                  --comparison
                | Exp1
    Exp1        = Exp1 ("+" | "-") Term            --binary
                | Term
    Lambda      = ["(" (id ",")* id ")" "->" Exp]  --lambda
    ClassDef    = "class" id Block                 --classdef
    Term        = Term ("*" | "/" | "%") Factor    --binary
                | Factor
    Factor      = Primary "**" Factor              --binary
                | "-" Primary                      --negation
                | Primary
    Primary     = id "(" ListOf<Exp, ","> ")"      --call
                | numeral                          --num
                | id                               --id
                | "(" Exp ")"                      --parens
    
    relop       = "<=" | "<" | "==" | ">=" | ">"
    numeral     = digit+ ("." digit+)? (("E" | "e") ("+" | "-")? digit+)?
    print       = "print" ~idchar
    break       = "break" ~idchar
    if          = "if" ~idchar
    else        = "else" ~idchar
    while       = "while" ~idchar
    idchar      = letter | digit | "_"
    id          = ~print letter idchar*
    string		= "\"" char* "\""
    char		= ~"\\" ~"\"" any							--normalchars
    			| "\\" ("'" | "\"" | "n" | "\\") 			--escape
    			| "\\u{" hex? hex? hex? hex? hex? hex? "}"	--hex
                | "%{"id"}"                                 --stringinterpolation
    hex			= hexDigit
    space       += "//" (~"\n" any)*               --comment
}`);

console.log(grammar)