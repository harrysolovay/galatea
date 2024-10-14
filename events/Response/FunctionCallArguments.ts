export type Delta = {
  /** The ID of the response. */
  response_id: string
  /** The index of the output item in the response. */
  output_index: number
  /** The ID of the item. */
  item_id: string
  /** The ID of the function call. */
  call_id: string
  /** The arguments delta as a JSON string. */
  delta: string
}

export type Done = {
  /** The ID of the response. */
  response_id: string
  /** The index of the output item in the response. */
  output_index: number
  /** The ID of the item. */
  item_id: string
  /** The ID of the function call. */
  call_id: string
  /** The final arguments as a JSON string. */
  arguments: string
}
