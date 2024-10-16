export function requestsSocketUpgrade(req: Request) {
  return req.headers.get("upgrade") === "websocket"
}

export function proxySocket(a: WebSocket, b: WebSocket) {
  const ready = Promise.withResolvers<void>()
  b.addEventListener("open", () => ready.resolve())
  a.addEventListener("close", (e) => {
    try {
      b.close(e.code, e.reason)
    } catch {}
  })
  a.addEventListener("message", async (event) => {
    try {
      await ready.promise
      b.send(event.data)
    } catch {
      a.close()
      b.close()
    }
  })
}

export async function socketOpen(socket: WebSocket): Promise<void> {
  switch (socket.readyState) {
    case WebSocket.CLOSED:
    case WebSocket.CLOSING:
      throw new UnexpectedDisconnectError()
    case WebSocket.CONNECTING: {
      const pending = Promise.withResolvers<void>()
      const controller = new AbortController()
      socket.addEventListener("open", onEvent, controller)
      socket.addEventListener("close", onError, controller)
      socket.addEventListener("error", onError, controller)
      await pending.promise

      function onEvent() {
        controller.abort()
        pending.resolve()
      }
      function onError() {
        onEvent()
        throw new UnexpectedDisconnectError()
      }
    }
  }
}

export class UnexpectedDisconnectError extends Error {
  override readonly name = "UnexpectedDisconnectError"
  override message = "Underlying websocket disconnected unexpectedly."
}
