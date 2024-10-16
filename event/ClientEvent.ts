import type * as Conversation from "./Conversation/mod.ts"
import type { InputAudioBuffer, Session } from "./event_data.ts"
import type { Events, N } from "./event_util.ts"

export type ClientEvent<K extends keyof ClientEvents = keyof ClientEvents> = ClientEvents[K]
export type ClientEvents = Events<{
  session: N<{
    /** Send this event to update the session’s default configuration. */
    update: Session.Update
  }>
  input_audio_buffer: N<{
    /** Send this event to append audio bytes to the input audio buffer. */
    append: InputAudioBuffer.Append
    /** Send this event to commit audio bytes to a user message. */
    commit: {}
    /** Send this event to clear the audio bytes in the buffer. */
    clear: {}
  }>
  conversation: N<{
    item: N<{
      /** Send this event when adding an item to the conversation. */
      create: Conversation.Item.Create
      /** Send this event when you want to truncate a previous assistant message’s audio. */
      truncate: Conversation.Item.Truncate
      /** Send this event when you want to remove any item from the conversation history. */
      delete: Conversation.Item.Delete
    }>
  }>
  response: N<{
    /** Send this event to trigger a response generation. */
    create: {}
    /** Send this event to cancel an in-progress response. */
    cancel: {}
  }>
}>
