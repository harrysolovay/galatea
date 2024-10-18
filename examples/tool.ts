import { conn, Session } from "../mod.ts"
import "@std/dotenv/load"

// const client = new Client(realtimeSocket(Deno.env.get("OPENAI_API_KEY")!))
// ;(async () => {
//   for await (const chunk of client.text) console.log(chunk)
// })()

// await client.ensureTurnDetection(false)
// await client.tool({
//   name: "add",
//   description: "Add `a` and `b` together.",
//   parameters: {
//     type: "object",
//     properties: {
//       a: { type: "number" },
//       b: { type: "number" },
//     },
//     required: ["a", "b"],
//   },
//   f: ({ a, b }) => console.log("Addition result:", a + b),
// })
// await client.appendText("Add 1 plus 2")
