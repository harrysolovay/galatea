export class Listeners<T> extends Set<ReadableStreamDefaultController<T>> {
  constructor(private signal: AbortSignal) {
    super()
  }

  enqueue(getChunk: () => T): void {
    if (this.size) {
      const chunk = getChunk()
      this.forEach((ctl) => ctl.enqueue(chunk))
    }
  }

  stream(): ReadableStream<T> {
    const { signal } = this
    const detachCtl = new AbortController()
    signal.addEventListener("abort", () => detachCtl.abort())
    return new ReadableStream<T>({
      start: (ctl) => {
        this.add(ctl)
        detachCtl.signal.addEventListener("abort", () => this.delete(ctl), { once: true })
      },
      cancel: () => detachCtl.abort(),
    })
  }
}
