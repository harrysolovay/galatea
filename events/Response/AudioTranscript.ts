export type Delta = {
  response_id: string
  item_id: string
  output_index: number
  content_index: number
  delta: string
}

export type Done = {
  response_id: string
  item_id: string
  output_index: number
  content_index: number
  transcript: string
}
