import type { ConversationResource } from "../models.ts"
import type { EventGroup } from "./common.ts"

// https://platform.openai.com/docs/api-reference/realtime-server-events/conversation-created
/** Returned when a conversation is created. Emitted right after session creation. */
export type Conversation = EventGroup<"conversation", {}, {
  created: {
    /** The conversation resource. */
    conversation: ConversationResource
  }
}, {}>
