import type { AudioFormat } from "./AudioFormat.ts"
import type { AudioTranscription } from "./AudioTranscription.ts"
import type { MaxOutputTokens } from "./MaxOutputTokens.ts"
import type { Modality } from "./Modality.ts"
import type { Model } from "./Model.ts"
import type { ToolChoice } from "./ToolChoice.ts"
import type { ToolDefinition } from "./ToolDefinition.ts"
import type { TurnDetection } from "./TurnDetection.ts"
import type { Voice } from "./Voice.ts"

export type SessionResource = {
  /** The unique ID of the session. */
  id: string
  /** The object type. */
  object: "realtime.session"
  /** The default model used for this session. */
  model: Model
  /** The set of modalities the model can respond with. */
  modalities: Modality[]
  /** The default system instructions. */
  instructions: string
  /** The voice the model uses to respond. */
  voice: Voice
  /** The format of input audio. */
  input_audio_format: AudioFormat
  /** The format of output audio. */
  output_audio_format: AudioFormat
  /** Configuration for input audio transcription. */
  input_audio_transcription: AudioTranscription & {
    /** Whether input audio transcription is enabled. */
    enabled: boolean
  }
  /** Configuration for turn detection. */
  turn_detection: TurnDetection
  /** Tools (functions) available to the model. */
  tools: ToolDefinition[]
  /** How the model chooses tools. */
  tool_choice: ToolChoice
  /** Sampling temperature. */
  temperature: number
  /** Maximum number of output tokens. */
  max_response_output_tokens: MaxOutputTokens
}
