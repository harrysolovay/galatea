import type { SessionConfig, TurnDetection } from "./models/mod.ts"

export const turnDetection: TurnDetection.ServerVAD = {
  type: "server_vad",
  threshold: 0.5,
  prefix_padding_ms: 300,
  silence_duration_ms: 200,
}

export const sessionConfig: SessionConfig = {
  modalities: ["text", "audio"],
  voice: "alloy",
  input_audio_format: "pcm16",
  output_audio_format: "pcm16",
  tool_choice: "auto",
  temperature: 0.8,
  max_response_output_tokens: 4096,
}
