export type Delta = {
  response_id: string
  item_id: string
  output_index: number
  call_id: string
  delta: string
}

export type Done = {
  response_id: string
  item_id: string
  output_index: number
  call_id: string
  arguments: string
}
