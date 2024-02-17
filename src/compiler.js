import parse from "./parser.js"

export default function compile(source, outputType) {
  if (!["parsed", "js"].includes(outputType)) {
    throw new Error("Unknown output type")
  }
  const match = parse(source)
  if (outputType === "parsed") return "Syntax is ok"
  return generate(optimized)
}
