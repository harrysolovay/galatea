import { make, type Ty, type TyConfig } from "./_base.ts"

export const string = make<StringTy>({}, function() {
  return {
    type: "string",
    description: this.config.description,
  }
})

export type StringTy = Ty<string, TyConfig>
