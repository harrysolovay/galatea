import { REALTIME_ENDPOINT, REALTIME_MODEL, realtimeHeaders } from "./constants.ts"

export function conn(apiKey: string): WebSocket {
  return new WebSocket(`${REALTIME_ENDPOINT}?model=${REALTIME_MODEL}`, [
    "realtime",
    ...Object.entries(realtimeHeaders(apiKey)).map(([k, v]) => `${k}.${v}`),
  ])
}

export function listen<I, O>(
  socket: WebSocket,
  handler: (event: O) => void,
  signal: AbortSignal,
): (event: I) => void {
  let queue: I[] | undefined = []

  const detachCtl = new AbortController()
  detachCtl.signal.addEventListener("abort", () => queue = undefined)
  signal.addEventListener("abort", () => detachCtl.abort())
  socket.addEventListener("message", ({ data }) => handler(JSON.parse(data)), {
    signal: detachCtl.signal,
  })
  const options = { once: true, signal: detachCtl.signal }
  socket.addEventListener("error", () => detachCtl.abort(), options)
  socket.addEventListener("close", () => detachCtl.abort(), options)

  const flushQueue = () => {
    if (queue) {
      let e = queue.shift()
      while (e) {
        socket.send(JSON.stringify(e))
        e = queue.shift()
      }
      queue = undefined
    }
  }

  if (socket.readyState === WebSocket.OPEN) {
    flushQueue()
  } else if (socket.readyState === WebSocket.CONNECTING) {
    socket.addEventListener("open", flushQueue, options)
  }

  return (e) => {
    if (queue) queue.push(e)
    else {
      assertOpen()
      socket.send(JSON.stringify(e))
    }
  }

  function assertOpen() {
    if (detachCtl.signal.aborted || socket.readyState !== WebSocket.OPEN) throw 0
  }
}
