// TODO: check if the runtime SessionResource `none` case contains a tagged object or simply an empty field.
// If empty field, then update `SessionResource.turn_detection` and `Session.turn_detection` accordingly.
export type TurnDetection = TurnDetection.ServerVAD
export namespace TurnDetection {
  export type ServerVAD = {
    type: "server_vad"
    /** Activation threshold for VAD. */
    threshold: number
    /** Audio included before speech starts (in milliseconds). */
    prefix_padding_ms: number
    /** Duration of silence to detect speech stop (in milliseconds). */
    silence_duration_ms: number
  }

  export const default_: TurnDetection = {
    type: "server_vad",
    threshold: 0.5,
    prefix_padding_ms: 300,
    silence_duration_ms: 200,
  }
}
