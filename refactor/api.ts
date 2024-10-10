import { RealtimeEventHandler } from "./event_handler.ts"
import type { Evt } from "./event_handler.ts"
import { RealtimeUtils } from "./utils.ts"

export interface RealtimeAPIArgs {
  url?: string
  apiKey?: string
  dangerouslyAllowAPIKeyInBrowser?: boolean
  debug?: boolean
}

export interface ConnectArgs {
  model?: string
}

export class RealtimeAPI extends RealtimeEventHandler {
  defaultUrl
  url
  apiKey
  debug
  ws: WebSocket | null

  /**
   * Create a new RealtimeAPI instance
   * @param {{url?: string, apiKey?: string, dangerouslyAllowAPIKeyInBrowser?: boolean, debug?: boolean}} [settings]
   * @returns {RealtimeAPI}
   */
  constructor({ url, apiKey, dangerouslyAllowAPIKeyInBrowser, debug }: RealtimeAPIArgs = {}) {
    super()
    this.defaultUrl = "wss://api.openai.com/v1/realtime"
    this.url = url || this.defaultUrl
    this.apiKey = apiKey || null
    this.debug = !!debug
    this.ws = null
    if (globalThis.document && this.apiKey) {
      if (!dangerouslyAllowAPIKeyInBrowser) {
        throw new Error(
          `Can not provide API key in the browser without "dangerouslyAllowAPIKeyInBrowser" set to true`,
        )
      }
    }
  }

  isConnected() {
    return !!this.ws
  }

  log(...args: any[]) {
    const date = new Date().toISOString()
    const logs = [`[Websocket/${date}]`].concat(args).map((arg) => {
      if (typeof arg === "object" && arg !== null) {
        return JSON.stringify(arg, null, 2)
      } else {
        return arg
      }
    })
    if (this.debug) {
      console.log(...logs)
    }
    return true
  }

  connect({ model }: ConnectArgs = { model: "gpt-4o-realtime-preview-2024-10-01" }): Promise<true> {
    if (!this.apiKey && this.url === this.defaultUrl) {
      console.warn(`No apiKey provided for connection to "${this.url}"`)
    }
    if (this.isConnected()) {
      throw new Error(`Already connected`)
    }
    if (this.apiKey) {
      console.warn(
        "Warning: Connecting using API key in the browser, this is not recommended",
      )
    }
    const ws = new WebSocket(`${this.url}${model ? `?model=${model}` : ""}`, [
      "realtime",
      `openai-insecure-api-key.${this.apiKey}`,
      "openai-beta.realtime-v1",
    ])
    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data)
      this.receive(message.type, message)
    })
    return new Promise((resolve, reject) => {
      const connectionErrorHandler = () => {
        this.disconnect(ws)
        reject(new Error(`Could not connect to "${this.url}"`))
      }
      ws.addEventListener("error", connectionErrorHandler)
      ws.addEventListener("open", () => {
        this.log(`Connected to "${this.url}"`)
        ws.removeEventListener("error", connectionErrorHandler)
        ws.addEventListener("error", () => {
          this.disconnect(ws)
          this.log(`Error, disconnected from "${this.url}"`)
          this.dispatch("close", { error: true })
        })
        ws.addEventListener("close", () => {
          this.disconnect(ws)
          this.log(`Disconnected from "${this.url}"`)
          this.dispatch("close", { error: false })
        })
        this.ws = ws
        resolve(true)
      })
    })
  }

  disconnect(ws?: WebSocket): boolean {
    if (!ws || this.ws === ws) {
      this.ws && this.ws.close()
      this.ws = null
      return true
    }
    return false
  }

  receive(eventName: string, event: Evt) {
    this.log(`received:`, eventName, event)
    this.dispatch(`server.${eventName}`, event)
    this.dispatch("server.*", event)
    return true
  }

  send(eventName: string, data?: Evt): true {
    if (!this.isConnected()) {
      throw new Error(`RealtimeAPI is not connected`)
    }
    data = data || {}
    if (typeof data !== "object") {
      throw new Error(`data must be an object`)
    }
    const event = {
      event_id: RealtimeUtils.generateId("evt_"),
      type: eventName,
      ...data,
    }
    this.dispatch(`client.${eventName}`, event)
    this.dispatch("client.*", event)
    this.log(`sent:`, eventName, event)
    this.ws!.send(JSON.stringify(event))
    return true
  }
}
