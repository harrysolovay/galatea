// @ts-ignore .
import type { JSONSchema7, JSONSchema7Object } from "@types/json-schema"

export type { JSONSchema7 as JsonSchema }

// TODO: clean this up
export type JsonSchemaNative<T extends JSONSchema7> = T["type"] extends "string" ? string
  : T["type"] extends "number" ? number
  : T["type"] extends "boolean" ? boolean
  : T["type"] extends "object" ? JsonSchemaObjectNative<T>
  : T["type"] extends "array" ? JsonSchemaArrayNative<T>
  : T["type"] extends "null" ? null
  : never

export type JsonSchemaObjectNative<T extends JSONSchema7> = T extends {
  properties: JSONSchema7Object
  required: string[]
} ? { [K in Extract<keyof T["properties"], string>]: JsonSchemaNative<Exclude<T["properties"][K], boolean>> }
  : never

export type JsonSchemaArrayNative<T extends JSONSchema7> = Array<
  T["items"] extends JSONSchema7 ? JsonSchemaNative<T["items"]> : never
>
