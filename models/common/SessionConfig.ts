import type { AudioFormat } from "./AudioFormat.ts"
import type { AudioTranscription } from "./AudioTranscription.ts"
import type { MaxOutputTokens } from "./MaxOutputTokens.ts"
import type { Modality } from "./Modality.ts"
import type { ToolChoice } from "./ToolChoice.ts"
import type { ToolDefinition } from "./ToolDefinition.ts"
import type { TurnDetection } from "./TurnDetection.ts"
import type { Voice } from "./Voice.ts"

export type SessionConfig = {
  /** The set of modalities the model can respond with. To disable audio, set this to ["text"]. */
  modalities: Modality[]
  /** The default system instructions prepended to model calls. */
  instructions: string
  /** The voice the model uses to respond. Cannot be changed once the model has responded with audio at least once. */
  voice: Voice
  /** The format of input audio.  */
  input_audio_format: AudioFormat
  /** The format of output audio. */
  output_audio_format: AudioFormat
  /** Configuration for input audio transcription. */
  input_audio_transcription?: AudioTranscription
  /** Configuration for turn detection.  */
  turn_detection?: TurnDetection
  /** Tools (functions) available to the model. */
  tools: ToolDefinition[]
  /** How the model chooses tools. */
  tool_choice: ToolChoice
  /** Sampling temperature for the model. */
  temperature: number
  /** Maximum number of output tokens for a single assistant response, inclusive of tool calls. Provide an integer between 1 and 4096 to limit output tokens, or "inf" for the maximum available tokens for a given model. Defaults to "inf". */
  max_response_output_tokens?: MaxOutputTokens
}
