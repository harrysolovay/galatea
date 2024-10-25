import Openai from "openai"
import "@std/dotenv/load"
import { extractCompletion } from "../util/extractCompletion.ts"

const openai = new Openai({ apiKey: Deno.env.get("OPENAI_API_KEY") })
const completion = await openai.chat.completions.create({
  seed: 1000,
  temperature: 0,
  top_p: 1,
  model: "gpt-4o-mini",
  messages: [{
    role: "user",
    content: "Tell me about Galatea from the story of Pygmalion.",
  }],
})
console.log(extractCompletion(completion))
