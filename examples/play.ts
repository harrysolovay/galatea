import { conn, Session } from "galatea"
import "@std/dotenv/load"
import { mergeInt16Arrays } from "../util/misc.ts"
import { audioCtx, play } from "./_common/play.ts"

const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

function transform2(chunks: string[]) {
  // Convert base64 chunks into a single Float32Array
  const pcmData = chunks.flatMap((v) => {
    const int16Array = new Int16Array(base64Decode(v))
    // Convert Int16Array to Float32Array and normalize to [-1, 1]
    return Array.from(int16Array).map((i) => i / 32768)
  })

  // Create an AudioBuffer
  const audioBuffer = audioCtx.createBuffer(
    1, // Number of channels
    pcmData.length, // Length of buffer
    16000, // Sample rate
  )

  // Fill the buffer with PCM data
  audioBuffer.getChannelData(0).set(pcmData)

  return audioBuffer
}

session.audio()
  .pipeTo(
    new WritableStream<string[]>({
      write(chunk) {
        play(transform2(chunk))
      },
    }),
  )

const textInput = session.textInput().getWriter()
textInput.write("Tell me about Galatea from the story of Pygmalion")
textInput.releaseLock()
session.respond()

function base64Decode(base64: string) {
  const binaryString = atob(base64)
  const length = binaryString.length
  const bytes = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

function concatenateUint8Arrays(arrays: Uint8Array[]) {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}

function pcm16ToFloat32(arrayBuffer: ArrayBuffer) {
  const int16View = new Int16Array(arrayBuffer)
  const float32Array = new Float32Array(int16View.length)
  for (let i = 0; i < int16View.length; i++) {
    float32Array[i] = int16View[i]! / 32768 // Normalize to [-1, 1]
  }
  return float32Array
}
