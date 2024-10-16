import type { ItemResource } from "../../common/mod.ts"

export type Added = Done

export type Done = {
  /** The ID of the response. */
  response_id: string
  /** The index of the output item in the response. */
  output_index: number
  /** The completed item. */
  item: ItemResource
}
