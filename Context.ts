import type { ServerEvent } from "./events/mod.ts"
import type { ResponseResource, SessionResource } from "./models/mod.ts"

export class Context {
  declare sessionResource?: SessionResource
  declare previous_item_id?: string
  declare sessionUpdate?: PromiseWithResolvers<SessionResource>
  declare responsePending?: PromiseWithResolvers<ResponseResource>

  eventCtls = new Set<ReadableStreamDefaultController<ServerEvent>>()
  textCtls = new Set<ReadableStreamDefaultController<string>>()
  audioCtls = new Set<ReadableStreamDefaultController<Int16Array>>()
}
