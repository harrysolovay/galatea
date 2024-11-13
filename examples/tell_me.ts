import { AudioContext } from "@mutefish/web-audio-api"
import { fromFileUrl } from "@std/path"

const ctx = new AudioContext()
const wavPath = fromFileUrl(import.meta.resolve("./tell_me.wav"))
const bytes = await Deno.readFile(wavPath)

let queueTime = 0

playWav(bytes)

async function playWav(bytes: Uint8Array) {
  const audioBuffer = await ctx.decodeAudioData(bytes.buffer)
  const source = ctx.createBufferSource()
  source.buffer = audioBuffer
  source.connect(ctx.destination)
  source.start(queueTime)
  queueTime += audioBuffer.duration
}
