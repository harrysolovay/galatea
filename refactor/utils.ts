export const IS_BROWSER = typeof document !== "undefined"

const atob = globalThis.atob
const btoa = globalThis.btoa

export class RealtimeUtils {
  static floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(float32Array.length * 2)
    const view = new DataView(buffer)
    let offset = 0
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]!))
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
    return buffer
  }

  static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  static arrayBufferToBase64(arrayBuffer: ArrayBuffer | Int16Array | Float32Array): string {
    if (arrayBuffer instanceof Float32Array) {
      arrayBuffer = this.floatTo16BitPCM(arrayBuffer)
    } else if (arrayBuffer instanceof Int16Array) {
      arrayBuffer = arrayBuffer.buffer
    }
    let binary = ""
    let bytes = new Uint8Array(arrayBuffer)
    const chunkSize = 0x8000 // 32KB chunk size
    for (let i = 0; i < bytes.length; i += chunkSize) {
      let chunk = bytes.subarray(i, i + chunkSize)
      binary += String.fromCharCode.apply(null, Array.from(chunk))
    }
    return btoa(binary)
  }

  static mergeInt16Arrays(left: ArrayBuffer | Int16Array, right: ArrayBuffer | Int16Array): Int16Array {
    if (left instanceof ArrayBuffer) {
      left = new Int16Array(left)
    }
    if (right instanceof ArrayBuffer) {
      right = new Int16Array(right)
    }
    if (!(left instanceof Int16Array) || !(right instanceof Int16Array)) {
      throw new Error(`Both items must be Int16Array`)
    }
    const newValues = new Int16Array(left.length + right.length)
    for (let i = 0; i < left.length; i++) {
      newValues[i] = left[i]!
    }
    for (let j = 0; j < right.length; j++) {
      newValues[left.length + j] = right[j]!
    }
    return newValues
  }

  static generateId(prefix: string, length = 21): string {
    // base58; non-repeating chars
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    const str = Array(length - prefix.length)
      .fill(0)
      .map((_) => chars[Math.floor(Math.random() * chars.length)])
      .join("")
    return `${prefix}${str}`
  }
}
