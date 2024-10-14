export const REALTIME_ENDPOINT = "wss://api.openai.com/v1/realtime"
export const REALTIME_MODEL = "gpt-4o-realtime-preview-2024-10-01"

export function realtimeHeaders(apiKey: string) {
  return {
    "openai-insecure-api-key": apiKey,
    "openai-beta": "realtime-v1",
  }
}
