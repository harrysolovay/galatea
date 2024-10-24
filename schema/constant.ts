import { make, type Ty, type TyConfig } from "./_base.ts"

export function constant<K extends ConstantValue>(value: K): ConstantTy<K> {
  return make({}, function() {
    return {
      const: value,
      description: this.config.description,
    }
  })
}

export type ConstantValue = string | number

export type ConstantTy<E extends ConstantValue = ConstantValue> = Ty<Array<E>, TyConfig>
