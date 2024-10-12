import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <span>count: {count}</span>
      <button onClick={() => setCount((value) => value++)}>Increment</button>
      <button onClick={() => setCount((value) => value--)}>Decrement</button>
    </div>
  )
}
