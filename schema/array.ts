import { Ty } from "./_base.ts"

export function array<E extends Ty>(element: E): ArrayTy<E> {
  return Ty.make((ctx) => {
    return ({
      type: "array",
      items: ctx.ref(element),
    })
  })
}

export type ArrayTy<E extends Ty = any> = Ty<Array<InstanceType<E>>>
