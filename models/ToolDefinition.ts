export type ToolDefinition = ToolDefinition.Function
export namespace ToolDefinition {
  export type Function = {
    type: "function"
    /** The name of the function. */
    name: string
    /** The description of the function. */
    description: string
    /** Parameters of the function in JSON Schema. */
    parameters: unknown // TODO
  }
}
