import type { RateLimit } from "../models.ts"
import type { EventGroup } from "./common.ts"

// https://platform.openai.com/docs/api-reference/realtime-server-events/rate-limits-updated
export type RateLimitsUpdated = EventGroup<"rate_limits", {}, {
  /** Emitted after every "response.done" event to indicate the updated rate limits. */
  updated: {
    /** List of rate limit information. */
    rate_limits: RateLimit[]
  }
}, {}>
