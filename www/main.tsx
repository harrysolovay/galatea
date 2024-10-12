import * as React from "react"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

function App() {
  return <div>Hello</div>
}
