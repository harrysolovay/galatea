import { parseArgs } from "@std/cli"
import * as T from "./schema/mod.ts"
import "@std/dotenv/load"
import { assert, assertExists, unimplemented, unreachable } from "@std/assert"
import * as path from "@std/path"
import Openai from "openai"

let { input, instructions, o1, transcript } = parseArgs(Deno.args, {
  string: ["instructions", "transcript"],
  collect: ["input"],
  alias: { input: "i" },
  boolean: ["o1"],
  default: {
    instructions: "Critique the following code. Ensure you adequately reference files and line numbers.",
    transcript: "galatea_transcript.txt",
  },
})

assert(input.length)
function assertInputT(_input: unknown[]): asserts _input is string[] {}
assertInputT(input)

assertExists(instructions)

const documents: [string, string][] = await Promise.all(
  input.flatMap(async function load(spec) {
    const p = path.resolve(spec)
    const stat = await Deno.stat(p)
    if (stat.isDirectory) {
      unimplemented()
    } else if (stat.isFile) {
      return Deno.readTextFile(p).then((contents) =>
        [path.relative(Deno.cwd(), p), contents] satisfies [string, string]
      )
    }
    unreachable()
  }),
)

while (documents.length) {
  const [filename, contents] = documents.shift()!
  instructions = instructions
    + `\n\n\`${filename}\`\n\n${contents.split("\n").map((v, i) => `${i + 1} | ${v}`).join("\n")}`
}

class Suggestion extends T.object({
  file: T.string,
  startLine: T.number,
  endLine: T.number,
  suggestion: T.string,
}) {}
class Root extends T.object({
  suggestions: T.array(Suggestion),
}) {}

const openai = new Openai({ apiKey: Deno.env.get("OPENAI_API_KEY") })
const { usage, choices } = await openai.chat.completions.create({
  model: o1 ? "o1-preview" : "gpt-4o",
  messages: [{
    role: "user",
    content: instructions,
  }],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "suggest_diffs",
      description: "",
      schema: T.schema({ Suggestion, Root }, "Root"),
      strict: true,
    },
  },
})

const transcriptPath = path.resolve(Deno.cwd(), transcript)
const { finish_reason, message } = choices[0]!
console.log(JSON.stringify(
  {
    usage,
    finish_reason,
  },
  null,
  2,
))
console.log("\n")
assertExists(message.content)
console.log(message.content)
const transcriptFile = await Deno.open(transcriptPath, {
  append: true,
  create: true,
})
transcriptFile.write(new TextEncoder().encode(message.content))
