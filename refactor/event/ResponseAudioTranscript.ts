import type { EventGroup } from "./common.ts"

export type ResponseAudioTranscript = EventGroup<"response.audio_transcript", {}, {
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-audio-transcript-delta
  /** Returned when the model-generated transcription of audio output is updated. */
  delta: {
    /** The ID of the response. */
    response_id: string
    /** The ID of the item. */
    item_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The index of the content part in the item's content array. */
    content_index: number
    /** The transcript delta. */
    delta: string
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-audio-transcript-done
  /** Returned when the model-generated transcription of audio output is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled. */
  done: {
    /** The ID of the response. */
    response_id: string
    /** The ID of the item. */
    item_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The index of the content part in the item's content array. */
    content_index: number
    /** The final transcript of the audio. */
    transcript: string
  }
}, {}>
