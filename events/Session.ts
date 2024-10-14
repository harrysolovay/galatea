import type { Session, SessionResource } from "./common/mod.ts"

export type Update = {
  /** Session configuration to update. */
  session: Session
}

export type Created = {
  /** The session resource. */
  session: SessionResource
}

export type Updated = {
  /** Returned when a session is updated. */
  session: SessionResource
}
