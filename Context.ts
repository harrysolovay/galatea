import type { ContentResource, ItemResource, ResponseResource, SessionConfig } from "./models/mod.ts"
import type { Segment } from "./Segment.ts"

export class Context {
  sessionConfig: SessionConfig = {
    modalities: ["audio", "text"],
    instructions: "",
    voice: "alloy",
    input_audio_format: "pcm16",
    output_audio_format: "pcm16",
    tool_choice: "auto",
    temperature: 0.8,
    max_response_output_tokens: "inf",
    tools: [],
    turn_detection: {
      type: "server_vad",
      threshold: 0.5,
      prefix_padding_ms: 300,
      silence_duration_ms: 200,
    },
    input_audio_transcription: null,
  }

  itemLookup: Record<string, ItemResource> = {}
  items: ItemResource[] = []
  responseLookup: Record<string, ResponseResource> = {}
  responses: ResponseResource[] = []
  queuedSpeechItems: Extract<ItemResource.Message, { content: ContentResource.Audio[] }>[] = []
  queuedTranscript: string = ""
  queuedTranscriptItems: Extract<ItemResource.Message, { content: ContentResource.Text[] }>[] = []
  queuedInputAudio = new Int16Array()
  declare controller: ReadableStreamDefaultController<Segment>
}
