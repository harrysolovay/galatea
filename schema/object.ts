import { Ty } from "./_base.ts"

export function object<F extends ObjectTyFields>(fields: F): ObjectTy<F> {
  return Ty.make((ctx) => {
    return ({
      type: "object",
      properties: Object.fromEntries(
        Object.entries(fields).map(([k, v]) => [k, ctx.ref(v)]),
      ),
      additionalProperties: false,
      required: Object.keys(fields),
    })
  })
}

export type ObjectTyFields = Record<string, Ty>

export type ObjectTy<F extends ObjectTyFields = any> = Ty<{ [K in keyof F]: InstanceType<F[K]> }>
