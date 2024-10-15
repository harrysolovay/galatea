import { floatTo16BitPCM } from "./floatTo16BitPCM.ts"

export function base64EncodeAudio(float32Array: Float32Array) {
  const arrayBuffer = floatTo16BitPCM(float32Array)
  let binary = ""
  const bytes = new Uint8Array(arrayBuffer)
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode.apply(null, [...chunk])
  }
  return btoa(binary)
}
