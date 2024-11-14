import { PortAudio, SampleFormat, StreamFlags } from "portaudio"
import { FRAMES_PER_BUFFER, SAMPLE_RATE } from "../constants.ts"

export function audioInput() {
  PortAudio.initialize()
  const device = PortAudio.getDefaultInputDevice()
  const pointer = PortAudio.openStream(
    {
      device,
      channelCount: 1,
      sampleFormat: SampleFormat.int32,
      suggestedLatency: PortAudio.getDeviceInfo(device).defaultLowInputLatency,
    },
    null,
    SAMPLE_RATE,
    FRAMES_PER_BUFFER,
    StreamFlags.clipOff,
  )
  return new ReadableStream<Float32Array>({
    start(ctl) {
      PortAudio.startStream(pointer)
      let available = PortAudio.getStreamReadAvailable(pointer)
      while (available) {
        const buf = new Float32Array(FRAMES_PER_BUFFER)
        PortAudio.readStream(pointer, buf, FRAMES_PER_BUFFER)
        ctl.enqueue(buf)
        available = PortAudio.getStreamReadAvailable(pointer)
      }
    },
    cancel() {
      PortAudio.closeStream(pointer)
      PortAudio.terminate()
    },
  })
}
