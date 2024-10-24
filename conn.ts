export function conn(apiKey: string): WebSocket {
  return new WebSocket(`${REALTIME_ENDPOINT}?model=${REALTIME_MODEL}`, [
    "realtime",
    ...Object.entries(realtimeHeaders(apiKey)).map(([k, v]) => `${k}.${v}`),
  ])
}

export function realtimeHeaders(apiKey: string) {
  return {
    "openai-beta": "realtime-v1",
    "openai-insecure-api-key": apiKey,
  }
}

const REALTIME_ENDPOINT = "wss://api.openai.com/v1/realtime"
const REALTIME_MODEL = "gpt-4o-realtime-preview-2024-10-01"
