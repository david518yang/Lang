import parse from './parser.js'
import analyze from './analyzer.js'
import optimize from './optimizer.js'
import generate from './generator.js'

export default function compile(source, outputType) {
    if (!['parsed', 'js'].includes(outputType)) {
        throw new Error('Unknown output type')
    }
    const match = parse(source)
    if (outputType === 'parsed') return 'Syntax is ok'
    return generate(optimized)
}
