import * as T from "structured-outputs"
import type { Modality, SessionConfig as SessionConfig_, TurnDetection, Voice } from "./models/mod.ts"

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
  turnDetection?: boolean | Omit<TurnDetection, "type">
  /** Tools to make accessible to the model. */
  tools?: Record<string, Tool>
  /** Instructions for the system agent. */
  instructions?: string
}

export function Tool(
  description: string,
  f: () => unknown,
): Tool
export function Tool<T extends T.ObjectTy>(
  description: string,
  type: T,
  f: (instance: InstanceType<T>) => unknown,
): Tool
export function Tool<T extends T.ObjectTy>(
  description: string,
  type: T | (() => unknown),
  f?: (instance: InstanceType<T>) => unknown,
): Tool {
  return {
    description,
    type: typeof type === "function" ? undefined : type,
    f: (typeof type === "function" ? type : f) as never,
  }
}

export interface Tool {
  /** What is the tool? */
  description: string
  /** Runtime representation of the structured output. */
  type?: T.ObjectTy
  /** The fn that receives the parameters and returns information related to the call. */
  f: (arg?: unknown) => unknown
}

export function formatSessionConfigUpdate(config: SessionConfig): SessionConfig_ {
  return {
    modalities: ["text", ...config.mute ? [] : ["audio"] satisfies Modality[]],
    input_audio_transcription: config.inputTranscript ? { model: "whisper-1" } : null,
    ...typeof config.turnDetection === "undefined" ? {} : config.turnDetection
      ? {
        turn_detection: {
          type: "server_vad",
          ...typeof config.turnDetection === "boolean" ? {} : config.turnDetection,
        },
      }
      : { turn_detection: null },
    ...config.tools
      ? {
        tools: Object.entries(config.tools).map(([name, { description, type }]) =>
          type ? T.F(name, description, { type }, "type") : T.F(name, description)
        ),
      }
      : {},
    ...config.voice ? { voice: config.voice } : {},
    ...config.instructions ? { instructions: config.instructions } : {},
  }
}
