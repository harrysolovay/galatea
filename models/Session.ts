import type { SessionConfig, SessionResource } from "./common/mod.ts"

export type Update = {
  /** Session configuration to update. */
  session: SessionConfig
}

export type Created = {
  /** The session resource. */
  session: SessionResource
}

export type Updated = {
  /** Returned when a session is updated. */
  session: SessionResource
}
