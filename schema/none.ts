import { make, type Ty, type TyConfig } from "./_base.ts"

export const none = make<NoneTy>({}, function() {
  return {
    type: "null",
    description: this.config.description,
  }
})

export type NoneTy = Ty<null, TyConfig>
