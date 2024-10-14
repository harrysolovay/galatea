// TODO: clean up
export type ResponseStatusDetails = ResponseStatusDetails.Incomplete | ResponseStatusDetails.Failed
export namespace ResponseStatusDetails {
  export type Incomplete = {
    type: "incomplete"
    reason: "interruption" | "max_output_tokens" | "content_filter"
  }

  export type Failed = {
    error: {
      code: string
      message: string
    } | null
  }
}
