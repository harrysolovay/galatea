import { WavStreamPlayer } from "@/audio"
import { StrictMode, useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import "@/index.css"
import { Controls } from "@/components/Controls"
import { ItemsListItem } from "@/components/ConversationItem"
import { instructions } from "@/constants"
import { RealtimeClient } from "@openai/realtime-api-beta"
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "./components/ui/button"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"

createRoot(document.getElementById("root")!).render(<App />)

export function App() {
  const client = useRef(
    new RealtimeClient({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowAPIKeyInBrowser: true,
    }),
  ).current

  const eventsListRef = useRef<HTMLDivElement>(null)
  const player = useRef(new WavStreamPlayer({ sampleRate: 24_000 })).current

  const [items, setItems] = useState<ItemType[]>([])

  useEffect(() => {
    client.updateSession({
      instructions,
      input_audio_transcription: { model: "whisper-1" },
      turn_detection: null,
    })

    client.on("error", (event: any) => console.error(event))

    client.on("conversation.interrupted", async () => {
      const trackSampleOffset = await player.interrupt()
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset
        client.cancelResponse(trackId, offset)
      }
    })

    client.on("conversation.updated", async ({ item, delta }: any) => {
      const items = client.conversation.getItems()
      if (delta?.audio) player.add16BitPCM(delta.audio, item.id)
      if (item.status === "completed" && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(item.formatted.audio, 24000, 24000)
        item.formatted.file = wavFile
      }
      setItems(items)
    })

    setItems(client.conversation.getItems())
  }, [])

  return (
    <StrictMode>
      <div className="max-w-6xl w-full m-auto">
        <SidebarProvider>
          <div className="flex flex-col w-full h-screen font-roboto">
            <div className="flex-row flex justify-between border-b">
              <div>Galatea Console</div>
              <SidebarTrigger />
            </div>
            <div className="h-full max-h-full overflow-y-scroll">
              {items.map((item) => <ItemsListItem key={item.id} {...{ item }} />)}
            </div>
          </div>
          <div className="flex flex-row">
            <Button>Start Session</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                HELLO
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Controls {...{ client, setItems, player }} />
        </SidebarProvider>
      </div>
    </StrictMode>
  )
}
