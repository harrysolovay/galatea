import type { ConversationResource } from "../../models/mod.ts"

export * as Item from "./Item/mod.ts"

export type Created = {
  /** The conversation resource. */
  conversation: ConversationResource
}
