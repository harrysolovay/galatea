import { OPENAI_API_KEY } from "../../env.ts"
import { realtimeSocket } from "../../mod.ts"
import { proxySocket, requestsSocketUpgrade } from "../../util/mod.ts"

Deno.serve({ port: 4646 }, (request) => {
  const socket = realtimeSocket(OPENAI_API_KEY)
  if (requestsSocketUpgrade(request)) return proxySocket(request, socket)
  else throw 0
})
