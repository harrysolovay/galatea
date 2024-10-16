import type { Flatten, U2I } from "../util/mod.ts"

// TODO: get tsdocs to flow through.
export type Events<Tree, Prefix extends string = ""> = Flatten<
  U2I<
    {
      [K in Extract<keyof Tree, string>]: Tree[K] extends N<infer Inner> ? Events<Inner, `${Prefix}${K}.`>
        : { [_ in `${Prefix}${K}`]: Flatten<Tree[K] & EventBase<`${Prefix}${K}`>> }
    }[Extract<keyof Tree, string>]
  >
>

export type N<T extends Record<string, unknown>> = { [namespace_]: T }
declare const namespace_: unique symbol

export type EventBase<K extends string = string> = {
  type: K
  /** Optional client-generated ID used to identify this event. */
  event_id?: string
}
