import type { JsonSchema } from "../util/mod.ts"

export type ToolDefinition = ToolDefinition.Function
export namespace ToolDefinition {
  export type Function<T extends JsonSchema = JsonSchema> = {
    type: "function"
    /** The name of the function. */
    name: string
    /** The description of the function. */
    description: string
    /** Parameters of the function in JSON Schema. */
    parameters: T
  }
}
