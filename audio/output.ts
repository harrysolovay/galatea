import { Player } from "./Player.ts"

export function audioOutput(audioCtx: AudioContext) {
  const player = new Player(audioCtx)
  return new WritableStream<AudioBuffer>({
    write(chunk) {
      player.play(chunk)
    },
  })
}
