import type { Event, N } from "./event_common.ts"
import type * as T from "./models.ts"

export type ServerEvent = Event<{
  error: Error
  session: N<{
    created: Session.Created
    updated: Session.Updated
  }>
  conversation: N<{
    created: Conversation.Created
    item: N<{
      created: Conversation.Item.Created
      input_audio_transcription: N<{
        completed: Conversation.Item.InputAudioTranscription.Completed
        failed: Conversation.Item.InputAudioTranscription.Failed
      }>
      truncated: Conversation.Item.Truncated
      deleted: Conversation.Item.Deleted
    }>
  }>
  input_audio_buffer: N<{
    committed: InputAudioBuffer.Committed
    cleared: {}
    speech_started: InputAudioBuffer.SpeechStarted
    speech_stopped: InputAudioBuffer.SpeechStopped
  }>
  response: N<{
    created: Response.Created
    done: Response.Done
    output_item: N<{
      added: Response.OutputItem.Added
      done: Response.OutputItem.Done
    }>
    content_part: N<{
      added: Response.ContentPart.Added
      done: Response.ContentPart.Done
    }>
    text: N<{
      delta: Response.Text.Delta
      done: Response.Text.Done
    }>
    audio_transcript: N<{
      delta: Response.AudioTranscript.Delta
      done: Response.AudioTranscript.Done
    }>
    audio: N<{
      delta: Response.Audio.Delta
      done: Response.Audio.Done
    }>
    function_call_arguments: N<{
      delta: Response.FunctionCallArguments.Delta
      done: Response.FunctionCallArguments.Done
    }>
  }>
  rate_limits: N<{
    updated: RateLimits.Updated
  }>
}>

export type Error = {
  error: T.ErrorDetails
}

export namespace Session {
  export type Created = {
    session: T.SessionResource
  }

  export type Updated = {
    session: T.SessionResource
  }
}

export namespace Conversation {
  export type Created = {
    conversation: T.ConversationResource
  }

  export namespace Item {
    export type Created = {
      previous_item_id: string
      item: T.Item
    }

    export namespace InputAudioTranscription {
      export type Completed = {
        item_id: string
        content_index: number
        transcript: string
      }

      export type Failed = {
        item_id: string
        content_index: number
        error: T.ErrorDetails
      }
    }

    export type Truncated = {
      item_id: string
      content_index: number
      audio_end_ms: number
    }

    export type Deleted = {
      item_id: string
    }
  }
}

export namespace InputAudioBuffer {
  export type Committed = {
    previous_item_id: string
    item_id: string
  }

  export type SpeechStarted = {
    audio_start_ms: string
    item_id: string
  }

  export type SpeechStopped = {
    audio_end_ms: number
    item_id: string
  }
}

export namespace Response {
  export type Created = {
    response: T.ResponseResource
  }

  export type Done = {
    response: T.ResponseResource
  }

  export namespace OutputItem {
    export type Added = {
      response_id: string
      output_index: number
      item: T.Item
    }

    export type Done = {
      response_id: string
      output_index: number
      item: T.Item
    }
  }

  export namespace ContentPart {
    export type Added = {
      response_id: string
      item_id: string
      output_index: number
      content_index: number
      part: T.ContentPartValue
    }

    export type Done = {
      response_id: string
      item_id: string
      output_index: number
      content_index: number
      part: T.ContentPartValue
    }
  }

  export namespace Text {
    export type Delta = {
      response_id: string
      item_id: string
      output_index: number
      content_index: number
      delta: string
    }

    export type Done = {
      response_id: string
      item_id: string
      output_index: number
      content_index: number
      text: string
    }
  }

  export namespace AudioTranscript {
    export type Delta = {
      response_id: string
      item_id: string
      output_index: number
      content_index: number
      delta: string
    }

    export type Done = {
      response_id: string
      item_id: string
      output_index: number
      content_index: number
      transcript: string
    }
  }

  export namespace Audio {
    export type Delta = {
      response_id: string
      item_id: string
      output_index: number
      content_index: number
      delta: string
    }

    export type Done = {
      response_id: string
      item_id: string
      output_index: number
      content_index: number
    }
  }

  export namespace FunctionCallArguments {
    export type Delta = {
      response_id: string
      item_id: string
      output_index: number
      call_id: string
      delta: string
    }

    export type Done = {
      response_id: string
      item_id: string
      output_index: number
      call_id: string
      arguments: string
    }
  }
}

export namespace RateLimits {
  export type Updated = {
    rate_limits: T.RateLimit[]
  }
}
