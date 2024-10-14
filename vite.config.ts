import deno from "@deno/vite-plugin"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

import "react"
import "react-dom/client"

export default defineConfig({
  plugins: [deno(), react()],
  root: "www",
  publicDir: "assets",
  cacheDir: "../target/.vite",
  build: {
    outDir: "../target/www",
  },
})
