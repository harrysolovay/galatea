import { encodeBase64 } from "@std/encoding"
import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import { Context, handlers } from "./handlers.ts"
import { listen } from "./listen.ts"
import type { Content, ErrorDetails } from "./models/mod.ts"
import { formatSessionConfigUpdate, type SessionConfig, type SessionUpdateConfig } from "./SessionConfig.ts"
import { generateId } from "./util/id.ts"

export interface Session {
  /** Get a writable stream with which to append text to the input buffer. */
  textInput(): WritableStream<string>
  /** Get a writable stream with which to append audio to the input buffer. */
  audioInput(): WritableStream<Int16Array>
  /** Get a readable stream of PCM-encoded audio chunks. */
  audio(): ReadableStream<Int16Array[]>
  /** Get a readable stream of audio input transcript tokens. */
  inputText(): ReadableStream<string>
  /** Get a readable stream of response text tokens. */
  text(): ReadableStream<string>
  /** Update the session configuration. */
  update(sessionUpdateConfig: SessionUpdateConfig): void
  /** Trigger response generation. */
  respond(): void
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
    (event) => {
      console.log(event.type)
      return handlers[event.type].call(context, event as never)
    },
    ctl.signal,
  )

  if (config) {
    send({
      type: "session.update",
      session: formatSessionConfigUpdate(config),
    })
  }

  return {
    textInput,
    audioInput,
    audio,
    inputText,
    text,
    respond,
    update,
    errors,
    end,
    turnDetection,
  }

  function textInput() {
    return new WritableStream<string>({
      write(text) {
        createItem({
          type: "input_text",
          text,
        })
      },
    })
  }

  function audioInput() {
    return new WritableStream<Int16Array>({
      write(chunk) {
        send({
          type: "input_audio_buffer.append",
          audio: encodeBase64(chunk),
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
  }

  function audio() {
    return context.audioListeners.stream()
  }

  function inputText() {
    return context.inputTextListeners.stream()
  }

  function text() {
    return context.textListeners.stream()
  }

  function respond() {
    send({ type: "response.create" })
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
