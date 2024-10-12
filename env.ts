import { assertExists } from "@std/assert"
import { load } from "@std/dotenv"

export const { OPENAI_API_KEY } = await ensureEnv(["OPENAI_API_KEY"])

async function ensureEnv<const Keys extends string[]>(keys: Keys) {
  type Key = Keys[number]
  const result: Record<Key, string> = {} as never
  const raw = await load()
  keys.forEach((key) => {
    const value = raw[key]
    assertExists(value)
    result[key as Key] = value
  })
  return result
}
