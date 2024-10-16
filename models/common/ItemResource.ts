import type { ContentResource } from "./ContentResource.ts"
import type { Role } from "./Role.ts"

export type ItemResource = ItemResource.Message | ItemResource.FunctionCall | ItemResource.FunctionCallOutput
export namespace ItemResource {
  export type Message = Message.System | Message.User | Message.Assistant
  // TODO: ensure second type args / content types are correct.
  export namespace Message {
    export type System = MessageItemResourceBase<"system", ContentResource>

    export type User = MessageItemResourceBase<"user", ContentResource>

    export type Assistant = MessageItemResourceBase<"assistant", ContentResource>
  }

  export type FunctionCall = ItemResourceBase<"function_call"> & {
    /** The ID of the function call. */
    call_id: string
    /** The name of the function being called. */
    name: string
    /** The arguments of the function call. */
    arguments: string
  }

  export type FunctionCallOutput = ItemResourceBase<"function_call_output"> & {
    /** The ID of the function call. */
    call_id: string
    /** The output of the function call. */
    output: string
  }
}

type MessageItemResourceBase<R extends Role, C extends ContentResource> = ItemResourceBase<"message"> & {
  /** The role associated with the item. */
  role: R
  /** The content of the item. */
  content: C[]
}

type ItemResourceBase<K extends string> = {
  type: K
  /** The unique ID of the item. */
  id: string
  /** The object type. */
  object: "realtime.item"
  /** The status of the item. */
  status: "in_progress" | "completed" | "incomplete"
}
