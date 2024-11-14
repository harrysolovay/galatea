import { CHUNK_SIZE } from "../constants.ts"
import { floatTo16BitPcm } from "./floatTo16BitPcm.ts"

export function base64EncodeAudio(a: Float32Array): string {
  const arrayBuffer = floatTo16BitPcm(a)
  let binary = ""
  const bytes = new Uint8Array(arrayBuffer)
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE)
    binary += String.fromCharCode.apply(null, [...chunk])
  }
  return btoa(binary)
}
