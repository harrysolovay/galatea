import { build } from "@deno/dnt"
import { parseArgs } from "@std/cli"
import * as fs from "@std/fs"
import * as path from "@std/path"

const outDir = "target/npm"
await fs.emptyDir(outDir)

const { version } = parseArgs(Deno.args, {
  string: ["version"],
  default: {
    version: "0.0.0-local.0",
  },
})

await build({
  entryPoints: ["./mod.ts"],
  outDir,
  shims: {
    deno: true,
    webSocket: true,
  },
  package: {
    name: "galatea",
    version,
    description: "A framework for integrating with OpenAI's realtime service",
    license: "Apache-2.0",
    repository: "github:harrysolovay/galatea.git",
  },
  typeCheck: false,
  scriptModule: false,
})

await Promise.all(["README.md"].map((assetPath) => Deno.copyFile(assetPath, path.join(outDir, assetPath))))
