import type { JsonSchema } from "./JsonSchema.ts"
import type { Event } from "./util.ts"

export type SessionConfig = {
  modalities?: Modality[]
  instructions?: string
  voice?: Voice
  input_audio_format?: AudioFormat
  output_audio_format?: AudioFormat
  input_audio_transcription?: AudioTranscription
  turn_detection?: TurnDetection
  tools?: ToolDefinition[]
  tool_choice?: string
  temperature?: number
  max_output_tokens?: MaxOutputTokens
}

export type Modality = "text" | "voice"

export type Voice = "alloy" | "shimmer" | "echo"

export type AudioFormat = "pcm16" | "g711_ulaw" | "g711_alaw"

export type AudioTranscription = {
  enabled: boolean
  model: "whisper-1"
}

export type TurnDetection = TurnDetection.ServerVAD | null
export namespace TurnDetection {
  export type ServerVAD = {
    type: "server_vad"
    /** Activation threshold for VAD. */
    threshold: number
    /** Audio included before speech starts (in milliseconds). */
    prefix_padding_ms: number
    /** Duration of silence to detect speech stop (in milliseconds). */
    silence_duration_ms: number
  }
}

export type ToolDefinition = ToolDefinition.Function
export namespace ToolDefinition {
  export type Function = {
    type: "function"
    name: string
    description: string
    parameters: JsonSchema
  }
}

export type MaxOutputTokens = number | "inf"

export type Item = {
  id?: string
  type?: ItemType
  status?: ItemStatus
  role?: ItemRole
  content?: ItemContent[]
  call_id?: string
  name?: string
  arguments?: string
  output?: string
}

export type ItemType = "message" | "function_call" | "function_call_output"

export type ItemStatus = "completed" | "in_progress" | "incomplete"

export type ItemRole = "user" | "assistant" | "system"

export type ItemContent = {
  type: ItemContentType
  text?: string
  audio?: string
  transcript?: string
}

export type ItemContentType = "input_text" | "input_audio" | "text_audio"

export type ResponseConfig = {
  modalities: string[]
  instructions: string
  voice: string
  output_audio_format: string
  tools: ToolDefinition[]
  tool_choice: string
  temperature: number
  max_output_tokens: MaxOutputTokens
}

export type ToolChoice = "auto" | "none" | "required" | { name: string }

export type ErrorDetails = Event<string> & {
  code?: string
  message: string
  param: string | null
}

export type SessionResource = {
  /** The unique ID of the session. */
  id: string
  /** The object type, must be "realtime.session". */
  object: "realtime.session"
  /** The default model used for this session. */
  model: string
  /** The set of modalities the model can respond with. */
  modalities: Modality[]
  /** The default system instructions. */
  instructions: string
  /** The voice the model uses to respond. */
  voice: Voice
  /** The format of input audio. */
  input_audio_format: string
  /** The format of output audio. */
  output_audio_format: string
  /** Configuration for input audio transcription. */
  input_audio_transcription: AudioTranscription
  /** Configuration for turn detection. */
  turn_detection: TurnDetection
  /** Tools (functions) available to the model. */
  tools: ToolDefinition[]
  /** How the model chooses tools. */
  tool_choice: ToolChoice
  /** Sampling temperature. */
  temperature: number
  /** Maximum number of output tokens. */
  max_output_tokens: MaxOutputTokens
}

export type ConversationResource = {
  /** The unique ID of the conversation. */
  id: string
  /** The object type, must be "realtime.conversation". */
  object: "realtime.conversation"
}

export type ResponseResource = {
  /** The unique ID of the response. */
  id: string
  /** The object type, must be "realtime.response". */
  object: "realtime.response"
  /** The status of the response ("in_progress"). */
  status: ResponseStatus
  /** Additional details about the status. */
  status_details: ResponseStatusDetails
  /** The list of output items generated by the response. */
  output: Item[]
  /** Usage statistics for the response. */
  usage: ResponseUsage
}

export type ResponseStatus = "in_progress" | "completed" | "cancelled" | "failed" | "incomplete"

export type ResponseStatusDetails = ResponseStatusDetails.Incomplete | ResponseStatusDetails.Failed
export namespace ResponseStatusDetails {
  export type Incomplete = {
    type: "incomplete"
    reason: "interruption" | "max_output_tokens" | "content_filter"
  }
  export type Failed = {
    error?: {
      code: string
      message: string
    }
  }
}

export type ResponseUsage = {
  total_tokens: number
  input_tokens: number
  output_tokens: number
}

export type ContentPart = ContentPart.Text | ContentPart.Audio
export namespace ContentPart {
  export type Text = {
    type: "text"
    /** The text content (if type is "text"). */
    text: string
  }
  export type Audio = {
    type: "audio"
    /** Base64-encoded audio data (if type is "audio"). */
    audio: string
    /** The transcript of the audio (if type is "audio"). */
    transcript: string
  }
}

export type RateLimit = {
  /** The name of the rate limit ("requests", "tokens", "input_tokens", "output_tokens"). */
  name: RateLimitName
  /** The maximum allowed value for the rate limit. */
  limit: number
  /** The remaining value before the limit is reached. */
  remaining: number
  /** Seconds until the rate limit resets. */
  reset_seconds: number
}

export type RateLimitName = "request" | "tokens" | "input_tokens" | "output_tokens"
