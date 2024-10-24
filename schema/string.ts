import { Ty } from "./_base.ts"

export const string = Ty.make<StringTy>(() => ({
  type: "string",
}))

export type StringTy = Ty<string>
