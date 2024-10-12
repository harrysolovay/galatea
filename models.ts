import type { JsonSchema } from "./JsonSchema.ts"

export type SessionConfig = {
  /** The set of modalities the model can respond with. To disable audio, set this to ["text"]. */
  modalities?: Modality[]
  /** The default system instructions prepended to model calls. */
  instructions?: string
  /** The voice the model uses to respond. Cannot be changed once the model has responded with audio at least once. */
  voice?: Voice
  /** The format of input audio. Options are "pcm16", "g711_ulaw", or "g711_alaw". */
  input_audio_format?: AudioFormat
  /** The format of output audio. Options are "pcm16", "g711_ulaw", or "g711_alaw". */
  output_audio_format?: AudioFormat
  /** Configuration for input audio transcription. Can be set to null to turn off. */
  input_audio_transcription?: AudioTranscription
  /** Configuration for turn detection. Can be set to null to turn off. */
  turn_detection?: TurnDetection
  /** Tools (functions) available to the model. */
  tools?: ToolDefinition[]
  /** How the model chooses tools. Options are "auto", "none", "required", or specify a function. */
  tool_choice?: string
  /** Sampling temperature for the model. */
  temperature?: number
  /** Maximum number of output tokens for a single assistant response, inclusive of tool calls. Provide an integer between 1 and 4096 to limit output tokens, or "inf" for the maximum available tokens for a given model. Defaults to "inf". */
  max_response_output_tokens?: MaxOutputTokens
}
export const defaultSessionConfig: SessionConfig = {
  modalities: ["text", "audio"],
  voice: "alloy",
  input_audio_format: "pcm16",
  output_audio_format: "pcm16",
  tool_choice: "auto",
  temperature: 0.8,
  max_response_output_tokens: 4096,
}

export type Modality = "text" | "audio"

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
export const defaultTurnDetection: TurnDetection.ServerVAD = {
  type: "server_vad",
  threshold: 0.5,
  prefix_padding_ms: 300,
  silence_duration_ms: 200,
}

export type ToolDefinition = ToolDefinition.Function
export namespace ToolDefinition {
  export type Function = {
    /** The type of the tool. */
    type: "function"
    /** The name of the function. */
    name: string
    /** The description of the function. */
    description: string
    /** Parameters of the function in JSON Schema. */
    parameters: JsonSchema
  }
}

export type MaxOutputTokens = number | "inf"

// TODO: revisit
// Different kinds of output items such as response.output_item.done
export type Item = {
  /** The unique ID of the item. */
  id?: string
  /** The type of the item ("message", "function_call", "function_call_output"). */
  type?: ItemType
  /** The status of the item ("completed", "in_progress", "incomplete"). */
  status?: ItemStatus
  /** The role of the message sender ("user", "assistant", "system"). */
  role?: ItemRole
  /** The content of the message. */
  content?: ItemContent[]
  /** The ID of the function call (for "function_call" items). */
  call_id?: string
  /** The name of the function being called (for "function_call" items). */
  name?: string
  /** The arguments of the function call (for "function_call" items). */
  arguments?: string
  /** The output of the function call (for "function_call_output" items). */
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
  /** The set of modalities the model can respond with. To disable audio, set this to ["text"]. */
  modalities: string[]
  /** The default system instructions prepended to model calls. */
  instructions: string
  /** The voice the model uses to respond. Cannot be changed once the model has responded with audio at least once. */
  voice: string
  /** The format of output audio. Options are "pcm16", "g711_ulaw", or "g711_alaw". */
  output_audio_format: string
  /** Tools (functions) available to the model. */
  tools: ToolDefinition[]
  /** How the model chooses tools. Options are "auto", "none", "required", or specify a function. */
  tool_choice: string
  /** Sampling temperature for the model. */
  temperature: number
  /** Maximum number of output tokens for a single assistant response, inclusive of tool calls. Provide an integer between 1 and 4096 to limit output tokens, or "inf" for the maximum available tokens for a given model. Defaults to "inf". */
  max_output_tokens: MaxOutputTokens
}

export type ToolChoice = "auto" | "none" | "required" | { name: string }

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
  // TODO: is this deprecated?
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

// TODO: deal with name conflict. `ContentPart` is preferable name here.
export type ContentPartValue = ContentPartValue.Text | ContentPartValue.Audio
export namespace ContentPartValue {
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

export type ErrorDetails = {
  /** The type of error (e.g., "invalid_request_error", "server_error"). */
  type: string
  /** Error code, if any. */
  code?: string
  /** A human-readable error message. */
  message: string
  /** Parameter related to the error, if any. */
  param?: string
  /** The event_id of the client event that caused the error, if applicable. */
  event_id: string
}
