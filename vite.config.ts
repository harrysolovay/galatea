import deno from "@deno/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import "react"
import "react-dom/client"
import "react/jsx-runtime"

export default defineConfig({
  plugins: [deno(), react()],
})
