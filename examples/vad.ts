import { AudioContext, audioOutput, decodeWav, PcmDecoderStream } from "audio"
import { conn, Session } from "galatea"
import "@std/dotenv/load"
import { fromFileUrl } from "@std/path"

const session = new Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

session.assistant
  .audio()
  .pipeThrough(new PcmDecoderStream())
  .pipeTo(audioOutput(new AudioContext()))

await audioInput().pipeTo(session.user.writeable())

session.user.commit()

function audioInput() {
  const bytes = Deno.readFileSync(fromFileUrl(import.meta.resolve("./tell_me.wav")))
  return ReadableStream.from([decodeWav(bytes as never).channelData[0]!])
}
