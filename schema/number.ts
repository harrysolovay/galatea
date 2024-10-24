import { make, type Ty, type TyConfig } from "./_base.ts"

export const number = make<NumberTy>({}, function() {
  return {
    type: "number",
    description: this.config.description,
  }
})

export type NumberTy = Ty<number, TyConfig>
