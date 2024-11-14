export function cancellationTimeout<T>(stream: ReadableStream<T>, ms: number): ReadableStream<T> {
  const reader = stream.getReader()
  const startTime = Date.now()
  return new ReadableStream<T>({
    async pull(ctl) {
      const { done, value } = await reader.read()
      if (done) {
        ctl.close()
        return
      }
      if (Date.now() - startTime < ms) {
        ctl.enqueue(value)
      } else {
        ctl.close()
        reader.cancel()
      }
    },
    cancel(reason) {
      reader.cancel(reason)
    },
  })
}
