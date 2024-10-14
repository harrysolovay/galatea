import * as React from "react"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

function App() {
  const [count, setCount] = React.useState(0)
  return (
    <div>
      <span>count: {count}</span>
      <button onClick={() => setCount((value) => value++)}>Increment</button>
      <button onClick={() => setCount((value) => value--)}>Decrement</button>
    </div>
  )
}
