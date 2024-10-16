import type { Context } from "../Context.ts"
import type { ServerEvents } from "../event/mod.ts"

export type Handler<K extends keyof ServerEvents> = (context: Context, args: ServerEvents[K]) => void | Promise<void>
