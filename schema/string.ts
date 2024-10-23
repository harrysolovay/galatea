import { Ty } from "./_base.ts"

export const string = Ty.make<StringTy>("string", () => ({
  type: "string",
}))

export type StringTy = Ty<"string", string>
