import type { ErrorDetails } from "../../../models/mod.ts"

export type Completed = {
  /** The ID of the user message item. */
  item_id: string
  /** The index of the content part containing the audio. */
  content_index: number
  /** The transcribed text. */
  transcript: string
}

export type Failed = {
  /** The ID of the user message item. */
  item_id: string
  /** The index of the content part containing the audio. */
  content_index: number
  /** Details of the transcription error. */
  error: ErrorDetails
}
