import { realtimeSocket } from "../../mod.ts"
import "@std/dotenv/load"
import { proxySocket, requestsSocketUpgrade } from "../../util/mod.ts"

Deno.serve({ port: 4646 }, (req) => {
  if (requestsSocketUpgrade(req)) {
    const serverSocket = realtimeSocket(Deno.env.get("OPENAI_API_KEY")!)
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req)
    proxySocket(serverSocket, clientSocket)
    proxySocket(clientSocket, serverSocket)
    return response
  } else throw 0
})
