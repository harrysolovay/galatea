import { PortAudio, SampleFormat, StreamFlags } from "portaudio"

const SAMPLE_RATE = 44_100
const FRAMES_PER_BUFFER = 1024

PortAudio.initialize()

function audioInput() {
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
    },
  })
}

const buffers = await Array.fromAsync(setCancellationTimeout(audioInput(), 5000))

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
PortAudio.terminate()

function setCancellationTimeout<T>(stream: ReadableStream<T>, ms: number): ReadableStream<T> {
  const reader = stream.getReader()
  const startTime = Date.now()
  return new ReadableStream<T>({
    async pull(ctl) {
      const { done, value } = await reader.read()
      if (done) {
        ctl.close()
        return
      }
      if (Date.now() - startTime < ms) {
        ctl.enqueue(value)
      } else {
        ctl.close()
        reader.cancel()
      }
    },
    cancel(reason) {
      reader.cancel(reason)
    },
  })
}
