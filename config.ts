import { REALTIME_ENDPOINT, REALTIME_MODEL, realtimeHeaders } from "./constants.ts"

export interface Config {
  /** A nullary function which returns a new realtime-API-compliant web socket. */
  socket: WebSocket
  /** Whether or not to log all incoming events. */
  debug?: boolean
}

export function realtimeSocket(apiKey: string): WebSocket {
  return new WebSocket(`${REALTIME_ENDPOINT}?model=${REALTIME_MODEL}`, [
    "realtime",
    ...Object.entries(realtimeHeaders(apiKey)).map(([k, v]) => `${k}.${v}`),
  ])
}
