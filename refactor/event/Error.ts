// https://platform.openai.com/docs/api-reference/realtime-server-events/error

import type { ErrorDetails } from "../models.ts"
import type { Event } from "../util.ts"

/** Returned when an error occurs. */
export type ServerError = Event<"error"> & {
  /** Details of the error. */
  error: ErrorDetails
}
