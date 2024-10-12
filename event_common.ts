import type { Flatten } from "./util.ts"

export type Event<Tree, Prefix extends string = ""> = Flatten<
  {
    [K in Extract<keyof Tree, string>]: Tree[K] extends N<infer Inner> ? Event<Inner, `${Prefix}${K}.`>
      : Tree[K] & EventBase<`${Prefix}${K}`>
  }[Extract<keyof Tree, string>]
>

export type N<T extends Record<string, unknown>> = { [namespace_]: T }
declare const namespace_: unique symbol

export type EventBase<K> = {
  event_id?: string
  type: K
}

export type MatchEventArms<E extends EventBase<string>, R> = { [K in E["type"]]: (args: Extract<E, { type: K }>) => R }
