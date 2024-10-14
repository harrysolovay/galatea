import type { ConversationResource } from "../common/mod.ts"

export * as Item from "./Item/mod.ts"

export type Created = {
  /** The conversation resource. */
  conversation: ConversationResource
}
