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
  input_audio_transcription: AudioTranscription | null
  /** Configuration for turn detection.  */
  turn_detection: TurnDetection | null
  /** Tools (functions) available to the model. */
  tools: ToolDefinition[]
  /** How the model chooses tools. */
  tool_choice: ToolChoice
  /** Sampling temperature for the model. */
  temperature: number
  /** Maximum number of output tokens for a single assistant response, inclusive of tool calls. Provide an integer between 1 and 4096 to limit output tokens, or "inf" for the maximum available tokens for a given model. Defaults to "inf". */
  max_response_output_tokens?: MaxOutputTokens
}

export function SessionConfig(partial: Partial<SessionConfig>): SessionConfig {
  return {
    modalities: ["audio", "text"],
    instructions: "",
    voice: "alloy",
    input_audio_format: "pcm16",
    output_audio_format: "pcm16",
    tool_choice: "auto",
    temperature: 0.8,
    max_response_output_tokens: "inf",
    tools: [],
    turn_detection: {
      type: "server_vad",
      threshold: 0.5,
      prefix_padding_ms: 300,
      silence_duration_ms: 200,
    },
    input_audio_transcription: null,
    ...partial,
  }
}
