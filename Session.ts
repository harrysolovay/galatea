import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import type { JsonSchema, JsonSchemaNative } from "./util/json_schema.ts"

export declare function Session(connect: () => WebSocket): Session

export interface Segment {
  events: () => ReadableStream<ServerEvent>
  eventsInput: () => WritableStream<ClientEvent>
  audio: () => ReadableStream<Int16Array>
  audioInput: () => WritableStream<Int16Array>
  audioInputTranscript: () => ReadableStream<string>
  transcript: () => ReadableStream<string>
  textInput: () => WritableStream<string>
  end: () => void
}

export interface Session extends Segment {
  update(sessionUpdateConfig: SessionUpdateConfig): void
  turn(f: (signal: AbortSignal) => void): Segment
}

export type SessionUpdateConfig = {
  turnDetection?: boolean
  tools?: Record<string, Tool>
}

export type Tool<T extends JsonSchema = JsonSchema> = {
  desc: string
  f: (args: JsonSchemaNative<T>) => void
  schema: T
}
export function Tool<T extends JsonSchema>(
  desc: string,
  schema: T,
  f: (args: JsonSchemaNative<T>) => void,
): Tool<T> {
  return { desc, schema, f }
}
