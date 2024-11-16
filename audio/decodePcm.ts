export function decodePcm(audioCtx: AudioContext, chunk: Int16Array): AudioBuffer {
  const pcm = Array.from(chunk).map((i) => i / 32768)
  const buf = audioCtx.createBuffer(1, pcm.length, 24_000)
  buf.getChannelData(0).set(pcm)
  return buf
}

export function decodePcmTransformer(audioCtx: AudioContext) {
  return new TransformStream<Int16Array, AudioBuffer>({
    transform(chunk, ctl) {
      ctl.enqueue(decodePcm(audioCtx, chunk))
    },
  })
}
