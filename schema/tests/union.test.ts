import { assertSnapshot } from "@std/testing/snapshot"
import * as T from "../mod.ts"

Deno.test("No Variant Values", async (t) => {
  const Inner = T.union({ A: T.none, B: T.none })
  const Root = T.object({ inner: Inner })
  await assertSnapshot(t, T.schema({ Root, Inner }, "Root"))
})

Deno.test("Variant Values", async (t) => {
  const Inner = T.union({ A: T.string, B: T.number, C: T.none })
  const Root = T.object({ inner: Inner })
  await assertSnapshot(t, T.schema({ Root, Inner }, "Root"))
})
