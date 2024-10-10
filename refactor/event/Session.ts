import type { SessionConfig, SessionResource } from "../models.ts"
import type { EventGroup } from "./common.ts"

export type Session = EventGroup<"session", {
  // https://platform.openai.com/docs/api-reference/realtime-client-events/session-update
  /** Send this event to update the session’s default configuration. */
  update: {
    /** Session configuration to update. */
    session: SessionConfig
  }
}, {
  // https://platform.openai.com/docs/api-reference/realtime-server-events/session-created
  /** Returned when a session is created. Emitted automatically when a new connection is established. */
  created: {
    /** The session resource. */
    session: SessionResource
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/session-updated
  /** Returned when a session is updated. */
  updated: {
    /** The updated session resource. */
    session: SessionResource
  }
}, {
  update: "updated"
}>
