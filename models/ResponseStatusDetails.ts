// TODO: clean up
export type ResponseStatusDetails = ResponseStatusDetails.Incomplete | ResponseStatusDetails.Failed
export namespace ResponseStatusDetails {
  export type Incomplete = {
    type: "incomplete"
    reason: "interruption" | "max_output_tokens" | "content_filter"
  }

  export type Failed = {
    error: {
      type: string
      code: string
      message: string
    } | null
  }
}

// {
//   type: "insufficient_quota",
//   code: "insufficient_quota",
//   message: "You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.",
// }
