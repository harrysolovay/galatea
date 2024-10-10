import type { Event, Flatten, ValueOf } from "../util.ts"

export type EventGroup<
  Prefix extends string,
  Client extends Record<string, Record<string, unknown>>,
  Server extends Record<string, Record<string, unknown>>,
  Expect extends Record<keyof Client, keyof Server | null>,
> = ValueOf<
  & { [K in Extract<keyof Client, string>]: Flatten<Event<`${Prefix}.${K}`> & Client[K] & { [expect_]?: Expect[K] }> }
  & { [K in Extract<keyof Server, string>]: Flatten<Event<`${Prefix}.${K}`> & Server[K]> }
>

declare const expect_: unique symbol
