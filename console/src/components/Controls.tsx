import { WavRecorder, WavStreamPlayer } from "@/audio"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar"
import { RealtimeClient } from "@openai/realtime-api-beta"
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client"
import { useRef, useState } from "react"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Textarea } from "./ui/textarea"

export function Controls({ client, player, setItems }: {
  client: RealtimeClient
  player: WavStreamPlayer
  setItems: (items: ItemType[]) => void
}) {
  const recorder = useRef(new WavRecorder({ sampleRate: 24000 })).current

  const [turnDetectionEnabled, setTurnDetectionEnabled] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const connectConversation = async () => {
    await recorder.begin()
    await player.connect()
    setIsConnected(true)
    setItems(client.conversation.getItems())
    await client.connect()
    if (turnDetectionEnabled) {
      await recorder.record((data) => client.appendInputAudio(data.mono))
    }
  }

  const disconnectConversation = async () => {
    setIsConnected(false)
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
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>System Instructions</SidebarGroupLabel>
          <Textarea placeholder="System prompt" />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Voice</SidebarGroupLabel>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Voice</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Turn Switching</SidebarGroupLabel>
          <Tabs defaultValue="vad" className="w-full">
            <TabsList className="w-full flex-row justify-start">
              <TabsTrigger value="vad">Automatic</TabsTrigger>
              <TabsTrigger value="manual-turn">Manual</TabsTrigger>
            </TabsList>
            <TabsContent value="vad">
              <SliderControl label="Threshold" initial={.5} max={1} step={.1} />
              <SliderControl label="Prefix Padding" initial={300} max={2000} step={10} unit="ms" />
              <SliderControl label="Silence Duration" initial={500} max={2000} step={10} unit="ms" />
            </TabsContent>
          </Tabs>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Model Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SliderControl label="Temperature" initial={.80} max={1.20} step={.1} />
            <SliderControl label="Max Tokens" initial={4096} max={4096} step={8} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function SliderControl({ label, initial, max, step, unit }: {
  label: string
  initial: number
  max: number
  step: number
  unit?: string
}) {
  const [value, setValue] = useState(initial)
  return (
    <div className="p-2">
      <div className="flex flex-row justify-between items-center">
        <span className="text-xs flex-1">{label}</span>
        <div className="flex items-center flex-shrink">
          {value !== initial && <Button>Reset</Button>}
          <Input className="text-xs" type="number" {...{ value }} />
          {unit && <span className="text-xs">{unit}</span>}
        </div>
      </div>
      <Slider
        defaultValue={[value]}
        onValueChange={(value) => setValue(value[0]!)}
        {...{ max, step }}
      />
    </div>
  )
}
