import type { Flatten } from "../util/utility_types.ts"
import { Ty } from "./_base.ts"
import { constant } from "./constant.ts"
import { none, type NoneTy } from "./none.ts"

export function union<M extends UnionMembers>(members: M): UnionTy<M> {
  return Ty.make((ctx) => {
    return ({
      oneOf: Object.entries(members).map(([k, v]) => ({
        properties: {
          type: constant(k).schema(ctx),
          ...v === none ? {} : { value: ctx.ref(v) },
        },
        required: ["type", ...v === none ? [] : ["value"]],
        additionalProperties: false,
      })),
    })
  })
}

export type UnionTy<M extends UnionMembers = any> = Ty<
  {
    [K in keyof M]: Flatten<
      { type: K } & (M[K] extends NoneTy ? {} : { value: InstanceType<M[K]> })
    >
  }[keyof M]
>

export type UnionMembers = Record<string, Ty>
