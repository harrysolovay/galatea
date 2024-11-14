import { REALTIME_ENDPOINT, REALTIME_MODEL } from "./constants.ts"

export function conn(apiKey: string): WebSocket {
  return new WebSocket(`${REALTIME_ENDPOINT}?model=${REALTIME_MODEL}`, [
    "realtime",
    ...Object.entries(realtimeHeaders(apiKey)).map(([k, v]) => `${k}.${v}`),
  ])
}

export function realtimeHeaders(apiKey: string): Record<string, string> {
  return {
    "openai-beta": "realtime-v1",
    "openai-insecure-api-key": apiKey,
  }
}
