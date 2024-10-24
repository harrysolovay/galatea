import type { ToolDefinition } from "../models/mod.ts"
import type { Ty } from "./_base.ts"
import type { ValidRootKey } from "./common.ts"
import { schema } from "./schema.ts"

export function f<M extends Record<string, Ty>>(
  name: string,
  description: string,
  models: M,
  rootKey: ValidRootKey<M>,
): ToolDefinition.Function {
  return {
    type: "function",
    name,
    description,
    parameters: schema(models, rootKey),
  }
}
