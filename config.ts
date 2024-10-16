import { REALTIME_ENDPOINT, REALTIME_MODEL, realtimeHeaders } from "./constants.ts"

export function realtimeSocket(apiKey: string): WebSocket {
  return new WebSocket(`${REALTIME_ENDPOINT}?model=${REALTIME_MODEL}`, [
    "realtime",
    ...Object.entries(realtimeHeaders(apiKey)).map(([k, v]) => `${k}.${v}`),
  ])
}
