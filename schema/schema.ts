import { Context, type Ty } from "./_base.ts"
import type { UnionTy } from "./union.ts"

export function schema<M extends Record<string, Ty>>(models: M, rootKey: ValidRootKey<M>): unknown {
  const root = models[rootKey]!
  const ctx = new Context(root, models)
  return Object.assign(root.schema(ctx), {
    $defs: Object.fromEntries(Object.entries(models).map(([k, v]) => [k, v.schema(ctx)])),
  })
}

type ValidRootKey<M extends Record<string, Ty>> = keyof {
  [K in keyof M as (M[K] extends UnionTy<any> ? never : K)]: never
}
