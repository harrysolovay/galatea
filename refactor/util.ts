export type Event<K extends string> = {
  /** Optional client-generated ID used to identify this event. */
  event_id?: string
  type: K
}

export type ValueOf<T> = T[keyof T]

export type Flatten<T> = [{ [K in keyof T]: T[K] }][0]
