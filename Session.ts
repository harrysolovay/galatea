import { Context } from "./Context.ts"
import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import { handlers } from "./handlers.ts"
import type { Content, SessionConfig as SessionConfig_, TurnDetection } from "./models/mod.ts"
import type { Modality } from "./models/Modality.ts"
import type { Voice } from "./models/Voice.ts"
import { type RootTy, schema } from "./schema/mod.ts"
import { listen } from "./socket.ts"
import { base64Encode } from "./util/arrayBufferToBase64.ts"
import { generateId } from "./util/id.ts"

export function Session(connect: () => WebSocket, options?: SessionConfig): Session {
  const ctl = new AbortController()
  const context = new Context(ctl.signal)

  const send = listen<ClientEvent, ServerEvent>(
    connect,
    (event) => handlers[event.type].call(context, event as never),
    ctl.signal,
  )

  if (options) {
    send({
      type: "session.update",
      session: {
        ...sessionUpdate(options),
        ...options.voice ? { voice: options.voice } : {},
      },
    })
  }

  return {
    appendText,
    audioInput,
    audio,
    transcript,
    commit,
    update,
    end,
    turnDetection,
  }

  function appendText(text: string) {
    createItem({
      type: "input_text",
      text,
    })
  }

  function audioInput() {
    return new WritableStream<Int16Array>({
      write(chunk) {
        createItem({
          type: "input_audio",
          audio: base64Encode(chunk),
        })
      },
    })
  }

  function createItem(item: Content) {
    const id = generateId("item")
    const { previous_item_id } = context
    send({
      type: "conversation.item.create",
      previous_item_id,
      item: {
        type: "message",
        id,
        status: "incomplete",
        role: "user",
        content: [item],
      },
    })
    context.previous_item_id = id
  }

  function audio() {
    return context.audioStreams.stream()
  }

  function transcript(includeInput?: boolean) {
    if (includeInput && (!(context.sessionResource && context.sessionResource.input_audio_transcription))) {
      send({
        type: "session.update",
        session: {
          input_audio_transcription: {
            model: "whisper-1",
          },
        },
      })
    }
    return context.transcriptStream.stream()
  }

  function commit() {
    send({ type: "input_audio_buffer.commit" })
  }

  function update(config: SessionUpdateConfig) {
    send({
      type: "session.update",
      session: sessionUpdate(config),
    })
  }

  function end() {
    ctl.abort()
  }

  function turnDetection() {
    return !context.sessionResource || !!context.sessionResource.turn_detection
  }
}

export interface Session {
  /** Get a writable stream with which to append text to the input buffer. */
  appendText(text: string): void
  /** Get a writable stream with which to append audio to the input buffer. */
  audioInput(): WritableStream<Int16Array>
  /** Get a readable stream of PCM-encoded audio chunks. */
  audio(): ReadableStream<Int16Array>
  /** Get a readable stream of audio transcript tokens. */
  transcript(includeInput?: boolean): ReadableStream<string>
  /** Commit the current buffer and trigger a response (if turn detection enabled). */
  commit(): void
  /** Update the session configuration. */
  update(sessionUpdateConfig: SessionUpdateConfig): void
  /** End the session. */
  end(): void
  /** Get a readable stream with which to observe errors. */
  // errors(): ReadableStream<Error>
  /** See whether turn detection enabled. */
  turnDetection(): boolean
}

export interface SessionConfig extends SessionUpdateConfig {
  /** The name of the desired voice. */
  voice?: Voice
}

export interface SessionUpdateConfig {
  /** Whether to enable the audio modality. */
  mute?: boolean
  /** Whether to receive input transcript events. */
  inputTranscript?: boolean
  /** Whether to enable turn detection. */
  turnDetection?: false | Omit<TurnDetection, "type">
  /** Tools to make accessible to the model. */
  tools?: Record<string, Tool>
}

export function Tool<T extends RootTy>(
  description: string,
  type: T,
  f: (instance: InstanceType<T>) => unknown,
): Tool<T> {
  return { description, type, f }
}

export interface Tool<T extends RootTy = any> {
  /** What is the tool? */
  description: string
  /** Runtime representation of the structured output. */
  type: T
  /** The fn that receives the parameters and returns information related to the call. */
  f: (args: InstanceType<T>) => unknown
}

function sessionUpdate(config: SessionUpdateConfig): SessionConfig_ {
  return {
    modalities: ["text", ...config.mute ? [] : ["audio"] satisfies Modality[]],
    input_audio_transcription: config.inputTranscript ? { model: "whisper-1" } : null,
    ...typeof config.turnDetection === "undefined" ? {} : config.turnDetection
      ? { turn_detection: { type: "server_vad", ...config.turnDetection } }
      : { turn_detection: null },
    ...config.tools
      ? {
        tools: Object.entries(config.tools).map(([name, { description, type }]) => ({
          type: "function",
          name,
          description,
          parameters: schema({ type }, "type"),
        })),
      }
      : {},
  }
}
