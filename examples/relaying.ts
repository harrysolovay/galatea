import { conn, Session } from "../mod.ts"
import "@std/dotenv/load"
import { parseArgs } from "@std/cli"

const { port } = parseArgs(Deno.args, { string: ["port"] })

if (port) {
  const session = Session(() => new WebSocket(`ws://localhost:${port}`))
  const text = session.text()
  ;(async () => {
    for await (const line of text) console.log(line)
  })()

  await session.ensureTurnDetection(false)
  await session.appendText("Tell me about Galatea from the story of Pygmalion.")
  await session.commit()
}

const server = Deno.serve((req) => {
  if (req.headers.get("upgrade") === "websocket") {
    const serverSocket = conn(Deno.env.get("OPENAI_API_KEY")!)
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req)
    proxySocket(serverSocket, clientSocket)
    proxySocket(clientSocket, serverSocket)
    return response
  } else throw 0
})

await new Deno.Command("deno", {
  args: ["run", "-A", import.meta.url, "--port", server.addr.port.toString()],
  stdout: "inherit",
  stderr: "inherit",
}).output()

function proxySocket(a: WebSocket, b: WebSocket) {
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
