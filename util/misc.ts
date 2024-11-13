export function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2)
  const view = new DataView(buffer)
  let offset = 0

  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32Array[i]!))
    view.setInt16(offset, s < 0 ? s * 0x80_00 : s * 0x7f_ff, true)
  }

  return buffer
}

/**
 * Converts a base64 string to an ArrayBuffer.
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    // eslint-disable-next-line unicorn/prefer-code-point
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes.buffer
}

/**
 * Converts an ArrayBuffer, Int16Array or Float32Array to a base64 string.
 */
export function arrayBufferToBase64(
  arrayBuffer: ArrayBuffer | Int16Array | Float32Array,
): string {
  if (arrayBuffer instanceof Float32Array) {
    arrayBuffer = floatTo16BitPCM(arrayBuffer)
  } else if (arrayBuffer instanceof Int16Array) {
    arrayBuffer = arrayBuffer.buffer
  }

  const bytes = new Uint8Array(arrayBuffer)
  const chunkSize = 0x80_00 // 32KB chunk size
  let binary = ""

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode.apply(null, chunk as any)
  }

  return btoa(binary)
}

/**
 * Merge two Int16Arrays from Int16Arrays or ArrayBuffers.
 */
export function mergeInt16Arrays(
  left: ArrayBuffer | Int16Array,
  right: ArrayBuffer | Int16Array,
): Int16Array {
  if (left instanceof ArrayBuffer) {
    left = new Int16Array(left)
  }

  if (right instanceof ArrayBuffer) {
    right = new Int16Array(right)
  }

  if (!(left instanceof Int16Array) || !(right instanceof Int16Array)) {
    throw new TypeError(`Both items must be Int16Array`)
  }

  const newValues = new Int16Array(left.length + right.length)
  for (const [i, element] of left.entries()) {
    newValues[i] = element
  }

  for (const [j, element] of right.entries()) {
    newValues[left.length + j] = element
  }

  return newValues
}
