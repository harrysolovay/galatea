import type { ResponseConfig, ResponseResource } from "../../common/mod.ts"

export * as Audio from "./Audio.ts"
export * as AudioTranscript from "./AudioTranscript.ts"
export * as ContentPart from "./ContentPart.ts"
export * as FunctionCallArguments from "./FunctionCallArguments.ts"
export * as OutputItem from "./OutputItem.ts"
export * as Text from "./Text.ts"

export type Create = {
  /** Configuration for the response. */
  response: ResponseConfig
}

export type Created = {
  /** The response resource. */
  response: ResponseResource
}

export type Done = {
  /** The response resource. */
  response: ResponseResource
}
