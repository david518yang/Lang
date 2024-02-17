import * as ohm from 'ohm-js'
import fs from 'fs'

const grammar = ohm.grammar(fs.readFileSync('./MODE.ohm', 'utf-8'))
export function matches(name, s) {
    return grammar.match(s).succeeded()
}
