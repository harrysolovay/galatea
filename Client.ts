import { unimplemented } from "@std/assert"
import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import { handlers } from "./handler.ts"
import type { Role } from "./models/mod.ts"
import type { JsonSchema, JsonSchemaNative } from "./util/mod.ts"

export class Client {
  events = new ReadableStream()
  transcript = new ReadableStream<string>()
  audio = new ReadableStream<Uint16Array>()

  constructor(private socket: WebSocket) {
    const controller = new AbortController()
    let queue: Promise<void> = Promise.resolve()
    const handler = ({ data }: MessageEvent<string>) => {
      const event: ServerEvent = JSON.parse(data)
      queue = queue.then(() => {
        console.log(event)
        return handlers[event.type].call(this, event as never)
      })
    }
    socket.addEventListener("message", handler, controller)
    const terminalOptions: AddEventListenerOptions = { once: true, signal: controller.signal }
    socket.addEventListener("error", (e) => controller.abort(e), terminalOptions)
    socket.addEventListener("close", () => controller.abort(), terminalOptions)
  }

  send = (event: ClientEvent) => {
    this.socket.send(JSON.stringify(event))
  }

  appendText = (_role: Role, _text: string): Promise<void> => {
    unimplemented()
  }

  appendAudio = (_role: Role, _audio: Uint16Array, _transcript?: string): Promise<void> => {
    unimplemented()
  }

  commit = (): Promise<void> => {
    unimplemented()
  }

  restore = (): Promise<void> => {
    unimplemented()
  }

  respond = (): Promise<void> => {
    unimplemented()
  }

  ensureTurnDetection = (_enabled: boolean): Promise<void> => {
    unimplemented()
  }

  tool = <T extends JsonSchema>(_options: ToolOptions<T>): Promise<void> => {
    unimplemented()
  }
}

export interface ToolOptions<T extends JsonSchema> {
  name: string
  description: string
  parameters: T
  f: (args: JsonSchemaNative<T>) => void
  signal?: AbortSignal
}
