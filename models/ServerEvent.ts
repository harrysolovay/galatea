import type * as Conversation from "./Conversation/mod.ts"
import type { Error } from "./Error.ts"
import type { Events, N } from "./events_util.ts"
import type * as InputAudioBuffer from "./InputAudioBuffer.ts"
import type * as RateLimits from "./RateLimits.ts"
import type * as Response from "./Response/mod.ts"
import type * as Session from "./Session.ts"

export type ServerEvent<K extends keyof ServerEvents = keyof ServerEvents> = ServerEvents[K]
export type ServerEvents = Events<{
  /** Returned when an error occurs. */
  error: Error
  session: N<{
    /** Returned when a session is created. Emitted automatically when a new connection is established. */
    created: Session.Created
    /** Returned when a session is updated. */
    updated: Session.Updated
  }>
  conversation: N<{
    /** Returned when a conversation is created. Emitted right after session creation. */
    created: Conversation.Created
    item: N<{
      /** Returned when a conversation item is created. */
      created: Conversation.Item.Created
      input_audio_transcription: N<{
        /** Returned when input audio transcription is enabled and a transcription succeeds. */
        completed: Conversation.Item.InputAudioTranscription.Completed
        /** Returned when input audio transcription is configured, and a transcription request for a user message failed. */
        failed: Conversation.Item.InputAudioTranscription.Failed
      }>
      /** Returned when an earlier assistant audio message item is truncated by the client. */
      truncated: Conversation.Item.Truncated
      /** Returned when an item in the conversation is deleted. */
      deleted: Conversation.Item.Deleted
    }>
  }>
  input_audio_buffer: N<{
    /** Returned when an input audio buffer is committed, either by the client or automatically in server VAD mode. */
    committed: InputAudioBuffer.Committed
    /** Returned when the input audio buffer is cleared by the client. */
    cleared: {}
    /** input_audio_buffer.speech_started */
    speech_started: InputAudioBuffer.SpeechStarted
    /** Returned in server turn detection mode when speech stops. */
    speech_stopped: InputAudioBuffer.SpeechStopped
  }>
  response: N<{
    /** Returned when a new Response is created. The first event of response creation, where the response is in an initial state of "in_progress". */
    created: Response.Created
    /** Returned when a Response is done streaming. Always emitted, no matter the final state. */
    done: Response.Done
    output_item: N<{
      /** Returned when a new Item is created during response generation. */
      added: Response.OutputItem.Added
      /** Returned when an Item is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled. */
      done: Response.OutputItem.Done
    }>
    content_part: N<{
      /** Returned when a new content part is added to an assistant message item during response generation. */
      added: Response.ContentPart.Added
      /** Returned when a content part is done streaming in an assistant message item. Also emitted when a Response is interrupted, incomplete, or cancelled. */
      done: Response.ContentPart.Done
    }>
    text: N<{
      /** Returned when the text value of a "text" content part is updated. */
      delta: Response.Text.Delta
      /** Returned when the text value of a "text" content part is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled. */
      done: Response.Text.Done
    }>
    audio_transcript: N<{
      /** Returned when the model-generated transcription of audio output is updated. */
      delta: Response.AudioTranscript.Delta
      /** Returned when the model-generated transcription of audio output is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled. */
      done: Response.AudioTranscript.Done
    }>
    audio: N<{
      /** Returned when the model-generated audio is updated. */
      delta: Response.Audio.Delta
      /** Returned when the model-generated audio is done. Also emitted when a Response is interrupted, incomplete, or cancelled. */
      done: Response.Audio.Done
    }>
    function_call_arguments: N<{
      /** Returned when the model-generated function call arguments are updated. */
      delta: Response.FunctionCallArguments.Delta
      /** Returned when the model-generated function call arguments are done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled. */
      done: Response.FunctionCallArguments.Done
    }>
  }>
  rate_limits: N<{
    /** Emitted after every "response.done" event to indicate the updated rate limits. */
    updated: RateLimits.Updated
  }>
}>
