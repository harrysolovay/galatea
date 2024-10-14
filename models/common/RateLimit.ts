export type RateLimit = {
  /** The name of the rate limit. */
  name: "requests" | "tokens" | "input_tokens" | "output_tokens"
  /** The maximum allowed value for the rate limit. */
  limit: number
  /** The remaining value before the limit is reached. */
  remaining: number
  /** Seconds until the rate limit resets. */
  reset_seconds: number
}
