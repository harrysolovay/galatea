import { PortAudio, SampleFormat, StreamFlags } from "portaudio"
import { FRAMES_PER_BUFFER, SAMPLE_RATE } from "../constants.ts"

export function audioInput(): ReadableStream<Float32Array> {
  PortAudio.initialize()
  const inputDevice = PortAudio.getDefaultInputDevice()
  const inputStream = PortAudio.openStream(
    {
      device: inputDevice,
      channelCount: 1,
      sampleFormat: SampleFormat.float32,
      suggestedLatency: PortAudio.getDeviceInfo(inputDevice).defaultLowInputLatency,
    },
    null,
    SAMPLE_RATE,
    FRAMES_PER_BUFFER,
    StreamFlags.clipOff,
  )
  return new ReadableStream<Float32Array>({
    start() {
      PortAudio.startStream(inputStream)
    },
    pull(ctl) {
      while (true) {
        const available = PortAudio.getStreamReadAvailable(inputStream)
        if (available >= FRAMES_PER_BUFFER) {
          const chunk = new Float32Array(FRAMES_PER_BUFFER)
          PortAudio.readStream(inputStream, chunk, FRAMES_PER_BUFFER)
          ctl.enqueue(chunk)
          break
        }
      }
    },
    cancel() {
      PortAudio.closeStream(inputStream)
      PortAudio.terminate()
    },
  })
}
