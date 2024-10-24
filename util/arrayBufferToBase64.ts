export function base64Encode({ buffer: arrayBuffer }: Int16Array) {
  let binary = ""
  const bytes = new Uint8Array(arrayBuffer)
  const chunkSize = 0x8000 // 32KB chunk size
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode.apply(null, [...chunk])
  }
  return btoa(binary)
}
