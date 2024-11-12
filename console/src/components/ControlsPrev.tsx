import { WavRecorder, WavStreamPlayer } from "@/audio"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { RealtimeClient } from "@openai/realtime-api-beta"
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client"
import { useRef, useState } from "react"

export function Controls({ client, player, setItems, clearEvents }: {
  client: RealtimeClient
  player: WavStreamPlayer
  setItems: (items: ItemType[]) => void
  clearEvents: () => void
}) {
  const recorder = useRef(new WavRecorder({ sampleRate: 24000 })).current

  const [turnDetectionEnabled, setTurnDetectionEnabled] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const connectConversation = async () => {
    await recorder.begin()
    await player.connect()
    setIsConnected(true)
    clearEvents()
    setItems(client.conversation.getItems())
    await client.connect()
    if (turnDetectionEnabled) {
      await recorder.record((data) => client.appendInputAudio(data.mono))
    }
  }

  const disconnectConversation = async () => {
    setIsConnected(false)
    clearEvents()
    setItems([])
    client.disconnect()
    await recorder.end()
    await player.interrupt()
  }

  const startRecording = async () => {
    setIsRecording(true)
    const trackSampleOffset = await player.interrupt()
    if (trackSampleOffset?.trackId) {
      const { trackId, offset } = trackSampleOffset
      await client.cancelResponse(trackId, offset)
    }
    await recorder.record((data) => client.appendInputAudio(data.mono))
  }

  const stopRecording = async () => {
    setIsRecording(false)
    await recorder.pause()
    client.createResponse()
  }

  const setTurnDetection = async (enabled: boolean) => {
    if (!enabled && recorder.getStatus() === "recording") {
      await recorder.pause()
    }
    client.updateSession({ turn_detection: enabled ? { type: "server_vad" } : null })
    if (enabled && client.isConnected()) {
      await recorder.record((data) => client.appendInputAudio(data.mono))
    }
    setTurnDetectionEnabled(enabled)
  }

  return (
    <div className="flex flex-row justify-between p-2 border-t">
      <div>
        {isConnected && (
          <>
            <Toggle pressed={turnDetectionEnabled} onPressedChange={setTurnDetection}>
              {turnDetectionEnabled ? "Disable" : "Enable"} Turn Detection
            </Toggle>
            {!turnDetectionEnabled && (
              <Button onMouseDown={startRecording} onMouseUp={stopRecording} className="ml-2">
                {isRecording ? "release to send" : "push to talk"}
              </Button>
            )}
          </>
        )}
      </div>
      <Button variant="outline" onClick={isConnected ? disconnectConversation : connectConversation}>
        {isConnected ? "disconnect" : "connect"}
      </Button>
    </div>
  )
}
