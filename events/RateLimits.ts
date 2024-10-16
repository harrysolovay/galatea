import type { RateLimit } from "../models/mod.ts"

export type Updated = {
  /** List of rate limit information. */
  rate_limits: RateLimit[]
}
