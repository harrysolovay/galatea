import { AudioContext } from "@mutefish/web-audio-api"

export function decodePcm(chunk: Int16Array): AudioBuffer {
  const pcm = Array.from(chunk).map((i) => i / 32768)
  const buf = AudioContext.prototype.createBuffer(1, pcm.length, 24_000)
  buf.getChannelData(0).set(pcm)
  return buf
}

// AudioContext.prototype.createBuffer

export class PcmDecoderStream extends TransformStream<Int16Array, AudioBuffer> {
  constructor() {
    super({
      transform(chunk, ctl) {
        ctl.enqueue(decodePcm(chunk))
      },
    })
  }
}
