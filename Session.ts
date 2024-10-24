import { Context } from "./Context.ts"
import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import { handlers } from "./handlers.ts"
import { listen } from "./listen.ts"
import type { Content, ErrorDetails } from "./models/mod.ts"
import { formatSessionConfigUpdate, type SessionConfig, type SessionUpdateConfig } from "./SessionConfig.ts"
import { base64Encode } from "./util/arrayBufferToBase64.ts"
import { generateId } from "./util/id.ts"

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
  /** Trigger a response (if turn detection enabled). */
  respond(): void
  /** Cancel a previously-triggered response generation. */
  cancelResponse(): void
  /** Update the session configuration. */
  update(sessionUpdateConfig: SessionUpdateConfig): void
  /** Get a readable stream with which to observe errors. */
  errors(): ReadableStream<ErrorDetails>
  /** End the session. */
  end(): void
  /** See whether turn detection enabled. */
  turnDetection(): boolean
}

export function Session(connect: () => WebSocket, config?: SessionConfig): Session {
  const ctl = new AbortController()
  const context = new Context(ctl.signal)

  const send = listen<ClientEvent, ServerEvent>(
    connect,
    (event) => handlers[event.type].call(context, event as never),
    ctl.signal,
  )

  if (config) {
    send({
      type: "session.update",
      session: formatSessionConfigUpdate(config),
    })
  }

  return {
    appendText,
    audioInput,
    audio,
    transcript,
    commit,
    respond,
    cancelResponse,
    update,
    errors,
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
    return context.audioListeners.stream()
  }

  // TODO: automatically send disable transcript when no longer in use
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
    return context.transcriptListeners.stream()
  }

  function commit() {
    send({ type: "input_audio_buffer.commit" })
    respond()
  }

  function respond() {
    send({ type: "response.create" })
  }

  function cancelResponse() {
    send({ type: "response.cancel" })
  }

  function update(config: SessionUpdateConfig) {
    send({
      type: "session.update",
      session: formatSessionConfigUpdate(config),
    })
  }

  function errors() {
    return context.errorListeners.stream()
  }

  function end() {
    ctl.abort()
  }

  function turnDetection() {
    return !context.sessionResource || !!context.sessionResource.turn_detection
  }
}
