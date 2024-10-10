import type { Item } from "../models.ts"
import type { EventGroup } from "./common.ts"

export type ConversationItemGroup = EventGroup<"conversation.item", {
  // https://platform.openai.com/docs/api-reference/realtime-client-events/conversation-item-create
  /** Send this event when adding an item to the conversation. */
  create: {
    /** The ID of the preceding item after which the new item will be inserted. */
    previous_item_id: string
    /** The item to add to the conversation. */
    item: Item
  }
  // https://platform.openai.com/docs/api-reference/realtime-client-events/conversation-item-truncate
  /** Send this event when you want to truncate a previous assistant message’s audio. */
  truncate: {
    /** The ID of the assistant message item to truncate. */
    item_id: string
    /** The index of the content part to truncate. */
    content_index: number
    /** Inclusive duration up to which audio is truncated, in milliseconds. */
    audio_end_ms: number
  }
  // https://platform.openai.com/docs/api-reference/realtime-client-events/conversation-item-delete
  /** Send this event when you want to remove any item from the conversation history. */
  delete: {
    /** The ID of the item to delete. */
    item_id: string
  }
}, {
  // https://platform.openai.com/docs/api-reference/realtime-server-events/conversation-item-created
  /** Returned when a conversation item is created. */
  created: {
    /** The ID of the preceding item. */
    previous_item_id: string
    /** The item that was created. */
    item: Item
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/conversation-item-truncated
  /** Returned when an earlier assistant audio message item is truncated by the client. */
  truncated: {
    /** The ID of the assistant message item that was truncated. */
    item_id: string
    /** The index of the content part that was truncated. */
    content_index: number
    /** The duration up to which the audio was truncated, in milliseconds. */
    audio_end_ms: number
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/conversation-item-deleted
  /** Returned when an item in the conversation is deleted. */
  deleted: {
    /** The ID of the item that was deleted. */
    item_id: string
  }
}, {
  create: "created"
  truncate: "truncated"
  delete: "deleted"
}>
