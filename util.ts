export type Flatten<T> = [{ [K in keyof T]: T[K] }][0]

export function generateId(prefix: string, length = 21): string {
  // cspell:disable-next-line
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  const str = Array(length - prefix.length)
    .fill(0)
    .map((_) => chars[Math.floor(Math.random() * chars.length)])
    .join("")
  return `${prefix}${str}`
}

export const IS_BROWSER = typeof document !== "undefined"

export function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2)
  const view = new DataView(buffer)
  let offset = 0
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32Array[i]!))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return buffer
}

export function idFactory() {
  let id = 0
  return () => String(id++)
}
