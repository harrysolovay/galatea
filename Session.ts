import type { Voice } from "./models/Voice.ts"
import type { RootTy } from "./schema/mod.ts"

export declare function Session(connect: () => WebSocket, config?: SessionConfig2): Session

export interface Session {
  /** Get a writable stream with which to append text to the input buffer. */
  appendText(text: string): void
  /** Get a writable stream with which to append audio to the input buffer. */
  audioInput(signal: AbortSignal): WritableStream<Int16Array>
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
  errors(): ReadableStream<Error>
  /** See whether turn detection enabled. */
  turnDetection(): boolean
  /** Set or see whether turn detection enabled. */
  toggleTurnDetection(): void
}

export interface SessionConfig2 extends SessionUpdateConfig {
  /** The name of the desired voice. */
  voice?: Voice
}

export interface SessionUpdateConfig {
  /** Whether to enable the audio modality. */
  audio?: boolean
  /** Whether to receive input transcript events. */
  inputTranscript?: boolean
  /** Whether to enable turn detection. */
  turnDetection?: boolean
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
