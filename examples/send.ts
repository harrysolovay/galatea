import { decoders } from "audio-decode"
import { OPENAI_API_KEY } from "../env.ts"
import { Send } from "../Session.ts"
import { base64EncodeAudio } from "../util/mod.ts"

const controller = new AbortController()
const { signal } = controller
// const channel = Channel({
//   apiKey: OPENAI_API_KEY,
//   signal,
//   debug: true,
// }, {} )

const audioFile = await Deno.readFile(import.meta.resolve("./sample.wav"))
const audioBuffer = await decoders.wav(audioFile)
const channelData = audioBuffer.getChannelData(0)
const base64Chunk = base64EncodeAudio(channelData)

// ws.send(JSON.stringify({
//   type: "input_audio_buffer.append",
//   audio: base64Chunk,
// }))
