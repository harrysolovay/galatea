import type { Item, ItemResource } from "../../../models/mod.ts"

export * as InputAudioTranscription from "./InputAudioTranscription.ts"

export type Create = {
  /** The ID of the preceding item after which the new item will be inserted. */
  previous_item_id?: string
  /** The item to add to the conversation. */
  item: Item
}

export type Truncate = {
  /** The ID of the assistant message item to truncate. */
  item_id: string
  /** The index of the content part to truncate. */
  content_index: number
  /** Inclusive duration up to which audio is truncated, in milliseconds. */
  audio_end_ms: number
}

export type Delete = {
  /** The ID of the item to delete. */
  item_id: string
}

export type Created = {
  /** The ID of the preceding item. */
  previous_item_id: string | null
  /** The item that was created. */
  item: ItemResource
}

export type Truncated = {
  /** The ID of the assistant message item that was truncated. */
  item_id: string
  /** The index of the content part that was truncated. */
  content_index: number
  /** The duration up to which the audio was truncated, in milliseconds. */
  audio_end_ms: number
}

export type Deleted = {
  /** The ID of the item that was deleted. */
  item_id: string
}
