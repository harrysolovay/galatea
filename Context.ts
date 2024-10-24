import type { ResponseResource, SessionResource } from "./models/mod.ts"

export class Context {
  pending = new Set<PromiseWithResolvers<unknown>>() // TODO

  transcriptStream
  audioStreams
  constructor(readonly signal: AbortSignal) {
    this.transcriptStream = new Streams<string>(signal)
    this.audioStreams = new Streams<Int16Array>(signal)
  }

  declare sessionResource?: SessionResource
  declare previous_item_id?: string

  declare sessionUpdate?: PromiseWithResolvers<SessionResource>
  declare responsePending?: PromiseWithResolvers<ResponseResource>
}

export class Streams<T> extends Set<ReadableStreamDefaultController<T>> {
  constructor(private signal: AbortSignal) {
    super()
  }

  enqueue(getChunk: () => T) {
    if (this.size) {
      const chunk = getChunk()
      this.forEach((ctl) => ctl.enqueue(chunk))
    }
  }

  stream = (): ReadableStream<T> => {
    const { signal } = this
    const detachCtl = new AbortController()
    signal.addEventListener("abort", () => detachCtl.abort())
    return new ReadableStream({
      start: (ctl) => {
        this.add(ctl)
        detachCtl.signal.addEventListener("abort", () => this.delete(ctl), { once: true })
      },
      cancel: () => detachCtl.abort(),
    })
  }
}
