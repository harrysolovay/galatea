import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import type { SessionConfig } from "./mod.ts"
import type { ToolDefinition } from "./models/mod.ts"
import type { JsonSchema, JsonSchemaNative } from "./util/json_schema.ts"

export declare function Session(connect: () => WebSocket): Session

export interface Channel {
  events(): ReadableStream<ServerEvent>
  eventsInput(): WritableStream<ClientEvent>
  audio(): ReadableStream<Int16Array>
  audioInput(): WritableStream<Int16Array>
  audioInputTranscript(): ReadableStream<string>
  transcript(): ReadableStream<string>
  textInput(): WritableStream<string>
  end(): void
}

export interface Session extends Channel {
  manual(config?: Partial<Omit<SessionConfig, "turn_detection">>): (start: (signal: AbortSignal) => void) => Channel
  vad(config?: Partial<Omit<SessionConfig, "turn_detection">>): void
  tools(build?: (builder: ToolsUpdateBuilder) => ToolsUpdateBuilder): ToolDefinition[]
}

export type ToolsUpdateBuilder = {
  add: <T extends JsonSchema>(
    name: string,
    desc: string,
    f: (...args: JsonSchema extends T ? [] : [JsonSchemaNative<T>]) => void,
    schema: T | void,
  ) => ToolsUpdateBuilder
}
