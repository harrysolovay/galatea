import type { EventGroup } from "./common.ts"

export type ResponseFunctionCallArguments = EventGroup<"response.function_call_arguments", {}, {
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-function-call-arguments-delta
  /** Returned when the model-generated function call arguments are updated. */
  delta: {
    /** The ID of the response. */
    response_id: string
    /** The ID of the function call item. */
    item_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The ID of the function call. */
    call_id: string
    /** The arguments delta as a JSON string. */
    delta: string
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-function-call-arguments-done
  /** Returned when the model-generated function call arguments are done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled. */
  done: {
    /** The ID of the response. */
    response_id: string
    /** The ID of the function call item. */
    item_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The ID of the function call. */
    call_id: string
    /** The final arguments as a JSON string. */
    arguments: string
  }
}, {}>
