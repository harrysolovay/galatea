import type { ErrorDetails } from "../models.ts"
import type { EventGroup } from "./common.ts"

export type ConversationItemInputAudioTranscriptionGroup = EventGroup<
  "conversation.item.input_audio_transcription",
  {},
  {
    // https://platform.openai.com/docs/api-reference/realtime-server-events/conversation-item-input-audio-transcription-completed
    /** Returned when input audio transcription is enabled and a transcription succeeds. */
    completed: {
      /** The ID of the user message item. */
      item_id: string
      /** The index of the content part containing the audio. */
      content_index: number
      /** The transcribed text. */
      transcript: string
    }
    // https://platform.openai.com/docs/api-reference/realtime-server-events/conversation-item-input-audio-transcription-failed
    /** Returned when input audio transcription is configured, and a transcription request for a user message failed. */
    failed: {
      /** The ID of the user message item. */
      item_id: string
      /** The index of the content part containing the audio. */
      content_index: number
      /** Details of the transcription error. */
      error: ErrorDetails
    }
  },
  {}
>
