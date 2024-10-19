import type { ServerEvent } from "./events/mod.ts"
import type { SessionResource } from "./models/mod.ts"

export class Context {
  declare sessionResource?: SessionResource
  declare previous_item_id?: string
  declare sessionUpdate?: PromiseWithResolvers<SessionResource>

  eventCtls = new Set<ReadableStreamDefaultController<ServerEvent>>()
  textCtls = new Set<ReadableStreamDefaultController<string>>()
  audioCtls = new Set<ReadableStreamDefaultController<Int16Array>>()
}

// import type { ContentResource, ItemResource, ResponseResource, SessionConfig, ToolDefinition } from "./models/mod.ts"

// export class ConversationState {
//   sessionConfig: SessionConfig = {
//     modalities: ["audio", "text"],
//     instructions: "",
//     voice: "alloy",
//     input_audio_format: "pcm16",
//     output_audio_format: "pcm16",
//     tool_choice: "auto",
//     temperature: 0.8,
//     max_response_output_tokens: "inf",
//     tools: [],
//     turn_detection: {
//       type: "server_vad",
//       threshold: 0.5,
//       prefix_padding_ms: 300,
//       silence_duration_ms: 200,
//     },
//     input_audio_transcription: null,
//   }

//   // TODO: cleanup
//   tools = new WeakMap<ToolDefinition, Function>()

//   itemLookup: Record<string, ItemResource> = {}
//   items: ItemResource[] = []
//   responseLookup: Record<string, ResponseResource> = {}
//   responses: ResponseResource[] = []
//   queuedSpeechItems: Extract<ItemResource.Message, { content: ContentResource.Audio[] }>[] = []
//   queuedTranscript: string = ""
//   queuedTranscriptItems: Extract<ItemResource.Message, { content: ContentResource.Text[] }>[] = []
//   queuedInputAudio = new Int16Array()
// }
