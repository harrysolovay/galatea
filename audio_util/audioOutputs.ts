import { Player } from "./Player.ts"

export function audioOutput(audioCtx: AudioContext) {
  const player = new Player(audioCtx)
  return new WritableStream<Int16Array>({
    write(chunk) {
      player.play(chunk)
    },
  })
}
