import type { Ty } from "./_base.ts"
import type { ValidRootKey } from "./common.ts"
import { schema } from "./schema.ts"

export function responseFormat<M extends Record<string, Ty>>(
  name: string,
  description: string,
  models: M,
  rootKey: ValidRootKey<M>,
) {
  return {
    type: "json_schema" as const,
    json_schema: {
      name,
      description,
      schema: schema(models, rootKey),
      strict: true,
    },
  }
}
