import { conn, Session } from "galatea"
import "@std/dotenv/load"
import { audioCtx, audioOutput } from "./_common/play.ts"

const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

function transformer(chunks: Int16Array[]) {
  const pcmData = chunks.flatMap((v) => Array.from(v).map((i) => i / 32768))
  const audioBuffer = audioCtx.createBuffer(1, pcmData.length, 24_000)
  audioBuffer.getChannelData(0).set(pcmData)
  return audioBuffer
}

session
  .audio()
  .pipeThrough(
    new TransformStream<Int16Array[], AudioBuffer>({
      transform(chunk, ctl) {
        ctl.enqueue(transformer(chunk))
      },
    }),
  )
  .pipeTo(audioOutput())

const textInput = session.textInput().getWriter()
textInput.write("Tell me about Galatea from the story of Pygmalion")
textInput.releaseLock()
session.respond()
