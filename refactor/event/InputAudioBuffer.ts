import type { EventGroup } from "./common.ts"

export type InputAudioBuffer = EventGroup<"input_audio_buffer", {
  // https://platform.openai.com/docs/api-reference/realtime-client-events/input-audio-buffer-append
  /** Send this event to append audio bytes to the input audio buffer. */
  append: {
    /** Base64-encoded audio bytes. */
    audio: string
  }
  // https://platform.openai.com/docs/api-reference/realtime-client-events/input-audio-buffer-commit
  /** Send this event to commit audio bytes to a user message. */
  commit: {}
  // https://platform.openai.com/docs/api-reference/realtime-client-events/input-audio-buffer-clear
  /** Send this event to clear the audio bytes in the buffer. */
  clear: {}
}, {
  // https://platform.openai.com/docs/api-reference/realtime-server-events/input-audio-buffer-committed
  /** Returned when an input audio buffer is committed, either by the client or automatically in server VAD mode. */
  committed: {
    /** The ID of the preceding item after which the new item will be inserted. */
    previous_item_id: string
    /** The ID of the user message item that will be created. */
    item_id: string
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/input-audio-buffer-cleared
  /** Returned when the input audio buffer is cleared by the client. */
  cleared: {}
  // https://platform.openai.com/docs/api-reference/realtime-server-events/input-audio-buffer-speech-started
  /** Returned in server turn detection mode when speech is detected. */
  speech_started: {
    /** Milliseconds since the session started when speech was detected. */
    audio_start_ms: string
    /** The ID of the user message item that will be created when speech stops. */
    item_id: string
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/input-audio-buffer-speech-started
  /** Returned in server turn detection mode when speech is detected. */
  speech_stopped: {
    /** Milliseconds since the session started when speech stopped. */
    audio_end_ms: number
    /** The ID of the user message item that will be created. */
    item_id: string
  }
}, {
  commit: "committed"
  clear: "cleared"
  append: null
}>
