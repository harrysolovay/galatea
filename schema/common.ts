import type { Ty } from "./_base.ts"
import type { UnionTy } from "./union.ts"

export type ValidRootKey<M extends Record<string, Ty>> = keyof {
  [K in keyof M as (M[K] extends UnionTy<any> ? never : K)]: never
}
