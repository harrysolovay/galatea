import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import type { SessionConfig } from "./mod.ts"
import type { ToolDefinition } from "./models/mod.ts"
import type { JsonSchema, JsonSchemaNative } from "./util/json_schema.ts"

export declare function Session(connect: () => WebSocket, signal: AbortSignal): Session

export interface SessionChannel {
  events(): ReadableStream<ServerEvent>
  eventsInput(): WritableStream<ClientEvent>
  audio(): ReadableStream<Int16Array>
  audioInput(): WritableStream<Int16Array>
  audioInputTranscript(): ReadableStream<string>
  transcript(): ReadableStream<string>
  textInput(): WritableStream<string>
}

export interface Session extends SessionChannel {
  manual(config?: TurnModeSessionConfig): StartTurn
  auto(config?: TurnModeSessionConfig): void
  tools(build: (builder: ToolsUpdateBuilder) => ToolsUpdateBuilder): ToolDefinition[]
}

export type TurnModeSessionConfig = Partial<Omit<SessionConfig, "turn_detection">>

export type StartTurn = () => Turn

export interface Turn extends SessionChannel {
  end(): void
}

export type ToolsUpdateBuilder = {
  add: <T extends JsonSchema>(
    name: string,
    desc: string,
    f: (...args: JsonSchema extends T ? [] : [JsonSchemaNative<T>]) => void,
    schema: T | void,
  ) => ToolsUpdateBuilder
}
