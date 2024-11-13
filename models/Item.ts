import type { Content } from "./Content.ts"
import type { Role } from "./Role.ts"

export type Item = Item.Message | Item.FunctionCall | Item.FunctionCallOutput
export namespace Item {
  export type Message = Message.System | Message.User | Message.Assistant
  // TODO: ensure second type args / content types are correct.
  export namespace Message {
    export type System = MessageItemBase<"system", Content>

    export type User = MessageItemBase<"user", Content>

    export type Assistant = MessageItemBase<"assistant", Content>
  }

  export type FunctionCall = ItemBase<"function_call"> & {
    /** The ID of the function call. */
    call_id: string
    /** The name of the function being called. */
    name: string
    /** The arguments of the function call. */
    arguments: string
  }

  export type FunctionCallOutput = ItemBase<"function_call_output"> & {
    /** The ID of the function call. */
    call_id: string
    /** The output of the function call. */
    output: string
  }
}

type MessageItemBase<R extends Role, C extends Content> = ItemBase<"message"> & {
  /** The role of the message sender. */
  role: R
  /** The content of the message. */
  content: C[]
}

type ItemBase<K extends string> = {
  type: K
  /** The unique ID of the item. */
  id?: string
  /** The status of the item */
  status: "completed" | "incomplete"
}
