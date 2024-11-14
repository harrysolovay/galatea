import { PortAudio, SampleFormat, StreamFlags } from "portaudio"
import { audioInput } from "../audio/mod.ts"
import { FRAMES_PER_BUFFER, SAMPLE_RATE } from "../constants.ts"
import { cancellationTimeout } from "../util/setCancellationTimeout.ts"

// Collect 5 seconds of audio.
const buffers = await Array.fromAsync(cancellationTimeout(audioInput(), 5_000))

PortAudio.initialize()
const outputDevice = PortAudio.getDefaultOutputDevice()
const outputStream = PortAudio.openStream(
  null,
  {
    device: outputDevice,
    channelCount: 1,
    sampleFormat: SampleFormat.float32,
    suggestedLatency: PortAudio.getDeviceInfo(outputDevice).defaultLowOutputLatency,
  },
  SAMPLE_RATE,
  FRAMES_PER_BUFFER,
  StreamFlags.clipOff,
)
PortAudio.startStream(outputStream)
for (const buffer of buffers) {
  PortAudio.writeStream(outputStream, buffer, FRAMES_PER_BUFFER)
}
PortAudio.closeStream(outputStream)
