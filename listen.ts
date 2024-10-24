export function listen<I, O>(
  connect: () => WebSocket,
  handler: (event: O) => void,
  signal: AbortSignal,
): (event: I) => void {
  const detachCtl = new AbortController()
  signal.addEventListener("abort", () => detachCtl.abort())

  let queue: I[] | undefined = []
  const socket = connect()

  socket.addEventListener("message", ({ data }) => handler(JSON.parse(data)), {
    signal: detachCtl.signal,
  })
  const options = { once: true, signal: detachCtl.signal }
  socket.addEventListener("error", () => detachCtl.abort(), options)
  socket.addEventListener("close", () => detachCtl.abort(), options)

  detachCtl.signal.addEventListener("abort", () => {
    socket.close()
    queue = undefined
  })

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
