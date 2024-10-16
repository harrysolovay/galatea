import type { ContentResource, ItemResource, ResponseResource } from "./models/mod.ts"
import type { Segment } from "./Segment.ts"

export class Context {
  itemLookup: Record<string, ItemResource> = {}
  items: ItemResource[] = []
  responseLookup: Record<string, ResponseResource> = {}
  responses: ResponseResource[] = []
  queuedSpeechItems: Extract<ItemResource.Message, { content: ContentResource.Audio[] }>[] = []
  queuedTranscript: string = ""
  queuedTranscriptItems: Extract<ItemResource.Message, { content: ContentResource.Text[] }>[] = []
  queuedInputAudio = new Int16Array()
  constructor(readonly controller: ReadableStreamDefaultController<Segment>) {}
}
