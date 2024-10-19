export type TurnDetection = TurnDetection.ServerVAD | null
export namespace TurnDetection {
  export type ServerVAD = {
    type: "server_vad"
    /** Activation threshold for VAD. */
    threshold?: number
    /** Audio included before speech starts (in milliseconds). */
    prefix_padding_ms?: number
    /** Duration of silence to detect speech stop (in milliseconds). */
    silence_duration_ms?: number
  }
}
