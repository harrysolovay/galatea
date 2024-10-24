import { make, type Ty, type TyConfig } from "./_base.ts"

export function array<E extends Ty>(element: E): ArrayTy<E> {
  return make({}, function(ctx) {
    return {
      type: "array",
      description: this.config.description,
      items: ctx.ref(element),
    }
  })
}

export type ArrayTy<E extends Ty = any> = Ty<Array<InstanceType<E>>, TyConfig>
