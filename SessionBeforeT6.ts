import { unimplemented } from "@std/assert/unimplemented"
import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import type { Voice } from "./models/Voice.ts"
import type { JsonSchema, JsonSchemaNative } from "./util/json_schema.ts"

export declare function Session(connect: () => WebSocket): Session

export interface Anchor {
  events(): ReadableStream<ServerEvent>
  eventsInput(): WritableStream<ClientEvent>
  audio(): ReadableStream<Int16Array>
  transcript(): ReadableStream<string>
  audioInput(): WritableStream<Int16Array>
  audioInputTranscript(): ReadableStream<string>
  textInput(): WritableStream<string>
  end(): void
}

export interface Session extends Anchor {
  errors(): ReadableStream<Error>
  // TODO: is it worth an assert this to prevent second voice set?
  update(sessionUpdateConfig: SessionUpdateConfig): void
  turn(f: (signal: AbortSignal) => void): Anchor
}

export type SessionUpdateConfig = {
  voice?: Voice
  audio?: boolean
  inputTranscript?: boolean
  turnDetection?: boolean
  tools?: Record<string, tool>
}

export type tool<T extends JsonSchema = JsonSchema> = {
  trigger: string
  f(args: JsonSchemaNative<T>): void
  schema: T
}
export function tool(trigger: string, f: () => void): tool<{ type: "null" }>
export function tool<T extends JsonSchema>(
  trigger: string,
  schema: T,
  f: (args: JsonSchemaNative<T>) => void,
): tool<T>
export function tool<T extends JsonSchema>(
  _trigger: string,
  _schema: T | (() => void),
  _f?: (args: JsonSchemaNative<T>) => void,
): tool<T> {
  unimplemented()
}
