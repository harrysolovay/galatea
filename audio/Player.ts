export class Player {
  currentTime
  constructor(readonly audioCtx: AudioContext) {
    this.currentTime = audioCtx.currentTime
  }

  play(buf: AudioBuffer) {
    const source = this.audioCtx.createBufferSource()
    source.buffer = buf
    source.start(this.currentTime)
    this.currentTime += buf.duration
    source.connect(this.audioCtx.destination)
  }
}
