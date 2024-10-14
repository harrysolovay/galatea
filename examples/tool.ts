import type { models } from "../mod.ts"

const _y: models.ToolDefinition = {
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
