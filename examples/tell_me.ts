import { conn, Session } from "galatea"
import "@std/dotenv/load"
import { fromFileUrl } from "@std/path"
import { decoders } from "audio-decode"
import { floatTo16BitPCM } from "../util/floatTo16BitPCM.ts"

// const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

const bytes = await Deno.readFile(fromFileUrl(import.meta.resolve("./tell_me.wav")))
const decoded = await decoders.wav(bytes)
console.log(decoded.sampleRate)
// const channel0 = decoded.getChannelData(0)
// const stream = new ReadableStream<Int16Array>({
//   start(ctl) {
//     ctl.enqueue(chunk)
//     ctl.close()
//   },
// })
// stream.pipeTo(session.audioInput())
// setTimeout(() => {
//   session.commit()
// }, 3000)

// function base64EncodeAudio(float32Array: Float32Array) {
//   const arrayBuffer = floatTo16BitPCM(float32Array)
//   let binary = ""
//   const bytes = new Uint8Array(arrayBuffer)
//   const chunkSize = 0x8000 // 32KB chunk size
//   for (let i = 0; i < bytes.length; i += chunkSize) {
//     const chunk = bytes.subarray(i, i + chunkSize)
//     binary += String.fromCharCode.apply(null, [...chunk])
//   }
//   return btoa(binary)
// }
