export const REALTIME_ENDPOINT = "wss://api.openai.com/v1/realtime"
export const REALTIME_MODEL = "gpt-4o-realtime-preview-2024-10-01"
export const DEFAULT_FREQUENCY = 24_000

export function realtimeHeaders(apiKey: string) {
  return {
    "openai-beta": "realtime-v1",
    "openai-insecure-api-key": apiKey,
  }
}
