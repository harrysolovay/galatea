export function requestsSocketUpgrade(req: Request) {
  return req.headers.get("upgrade") === "websocket"
}

export function proxySocket(req: Request, proxied: WebSocket) {
  const { socket: client, response } = Deno.upgradeWebSocket(req)
  setup(client, proxied)
  setup(proxied, client)
  return response
}

function setup(a: WebSocket, b: WebSocket) {
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
