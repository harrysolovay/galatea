import type { ToolDefinition } from "../mod.ts"

const y: ToolDefinition = {
  type: "function",
  name: "",
  description: "",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
      },
    },
    required: ["location"],
  },
}
