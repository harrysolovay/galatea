export type Append = {
  /** Base64-encoded audio bytes. */
  audio: string
}

export type Committed = {
  /** The ID of the preceding item after which the new item will be inserted. */
  previous_item_id: string
  /** The ID of the user message item that will be created. */
  item_id: string
}

export type SpeechStarted = {
  /** Milliseconds since the session started when speech was detected. */
  audio_start_ms: string
  /** The ID of the user message item that will be created when speech stops. */
  item_id: string
}

export type SpeechStopped = {
  /** Milliseconds since the session started when speech stopped. */
  audio_end_ms: number
  /** The ID of the user message item that will be created. */
  item_id: string
}
