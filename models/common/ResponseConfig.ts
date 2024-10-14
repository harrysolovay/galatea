import type { MaxOutputTokens } from "./MaxOutputTokens.ts"
import type { ToolChoice } from "./ToolChoice.ts"
import type { ToolDefinition } from "./ToolDefinition.ts"
import type { Voice } from "./Voice.ts"

export type ResponseConfig = {
  /** The modalities for the response. */
  modalities: string[]
  /** Instructions for the model. */
  instructions: string
  /** The voice the model uses to respond. */
  voice: Voice
  /** The format of output audio. */
  output_audio_format: string
  /** Tools (functions) available to the model. */
  tools: ToolDefinition[]
  /** How the model chooses tools. */
  tool_choice: ToolChoice
  /** Sampling temperature. */
  temperature: number
  /** Maximum number of output tokens for a single assistant response, inclusive of tool calls. Provide an integer between 1 and 4096 to limit output tokens, or "inf" for the maximum available tokens for a given model. Defaults to "inf". */
  max_response_output_tokens?: MaxOutputTokens
}
