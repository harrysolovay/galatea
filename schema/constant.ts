import { Ty } from "./_base.ts"

export function constant<K extends ConstantValue>(value: K): ConstantTy<K> {
  return Ty.make("constant", () => {
    return ({ const: value })
  })
}

export type ConstantValue = string | number

export type ConstantTy<E extends ConstantValue = ConstantValue> = Ty<"constant", Array<E>>
