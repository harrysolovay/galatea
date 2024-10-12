import deno from "@deno/vite-plugin"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

import "react"
import "react-dom/client"
import "react/jsx-dev-runtime"

export default defineConfig({
  plugins: [deno(), react()],
  build: {
    outDir: "target/www",
  },
})
