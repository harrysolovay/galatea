import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js"

export function ItemsListItem({ item }: { item: ItemType }) {
  return (
    <div className="conversation-item" key={item.id}>
      <div className={`speaker ${item.role || ""}`}>
        <div>{(item.role || item.type).replaceAll("_", " ")}</div>
      </div>
      <div className={`speaker-content`}>
        {/* tool response */}
        {item.type === "function_call_output" && <div>{item.formatted.output}</div>}
        {/* tool call */}
        {!!item.formatted.tool && <div>{item.formatted.tool.name}({item.formatted.tool.arguments})</div>}
        {!item.formatted.tool
          && item.role === "user" && (
          <div>
            {item.formatted.transcript
              || (item.formatted.audio?.length ? "(awaiting transcript)" : item.formatted.text || "(item sent)")}
          </div>
        )}
        {!item.formatted.tool && item.role === "assistant" && (
          <div>{item.formatted.transcript || item.formatted.text || "(truncated)"}</div>
        )}
        {item.formatted.file && <audio src={item.formatted.file.url} controls />}
      </div>
    </div>
  )
}
