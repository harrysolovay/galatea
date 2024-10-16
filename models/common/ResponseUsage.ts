import type { CompletionTokenDetails } from "./CompletionTokenDetails.ts"

export type ResponseUsage = {
  total_tokens: number
  input_tokens: number
  output_tokens: number
  input_token_details: CompletionTokenDetails
  output_token_details: CompletionTokenDetails
}
