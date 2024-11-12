import { config } from "@dotenvx/dotenvx"
import react from "@vitejs/plugin-react-swc"
import * as path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

config({ path: fileURLToPath(import.meta.resolve("../.env")) })

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "target/www",
  },
  define: {
    OPENAI_API_KEY: `"${process.env.OPENAI_API_KEY}"`,
  },
})
