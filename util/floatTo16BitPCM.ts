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

// function floatTo16BitPCM(float32Array: Float32Array): Int16Array {
//   const int16Array = new Int16Array(float32Array.length);
//   for (let i = 0; i < float32Array.length; i++) {
//     let s = Math.max(-1, Math.min(1, float32Array[i]));
//     int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
//   }
//   return int16Array;
// }
