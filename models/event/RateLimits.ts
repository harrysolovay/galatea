import type { RateLimit } from "../common/mod.ts"

export type Updated = {
  /** List of rate limit information. */
  rate_limits: RateLimit[]
}
