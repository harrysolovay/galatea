import { AudioContext } from "@mutefish/web-audio-api"

export const audioCtx = new AudioContext({ sampleRate: 24_000 })

let queueTime = 0

export function play(buf: AudioBuffer) {
  const source = audioCtx.createBufferSource()
  source.buffer = buf
  source.connect(audioCtx.destination)
  source.start(queueTime)
  queueTime += buf.duration
}
