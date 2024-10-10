import type { ResponseConfig, ResponseResource } from "../models.ts"
import type { EventGroup } from "./common.ts"

export type Response = EventGroup<"response", {
  // https://platform.openai.com/docs/api-reference/realtime-client-events/response-create
  /** Send this event to trigger a response generation. */
  create: {
    /** Configuration for the response. */
    response: ResponseConfig
  }
  // https://platform.openai.com/docs/api-reference/realtime-client-events/response-cancel
  /** Send this event to cancel an in-progress response. */
  cancel: {}
}, {
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-created
  /** Returned when a new Response is created. The first event of response creation, where the response is in an initial state of "in_progress". */
  created: {
    /** The response resource. */
    response: ResponseResource
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-done
  /** Returned when a Response is done streaming. Always emitted, no matter the final state. */
  done: {
    /** The response resource. */
    response: ResponseResource
  }
}, {
  create: "created"
  cancel: null
}>
