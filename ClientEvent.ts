import type { Event, N } from "./event_common.ts"
import type * as T from "./models.ts"

export type ClientEvent = Event<{
  session: N<{
    update: Session.Update
  }>
  input_audio_buffer: N<{
    append: InputAudioBuffer.Append
    commit: {}
    clear: {}
  }>
  conversation: N<{
    item: N<{
      create: Conversation.Item.Create
      truncate: Conversation.Item.Truncate
      delete: Conversation.Item.Delete
    }>
  }>
  response: N<{
    create: {}
    cancel: {}
  }>
}>

export namespace Session {
  export type Update = {
    session: T.SessionConfig
  }
}

export namespace InputAudioBuffer {
  export type Append = {
    audio: string
  }
}

export namespace Conversation {
  export namespace Item {
    export type Create = {
      previous_item_id?: string
      item: T.Item
    }
    export type Truncate = {
      item_id: string
      content_index: number
      audio_end_ms: number
    }
    export type Delete = {
      item_id: string
    }
  }
}

export namespace Response {
  export type Create = {
    response: T.ResponseConfig
  }
}
