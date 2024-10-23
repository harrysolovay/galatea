import { Ty } from "./_base.ts"

export const number = Ty.make<NumberTy>("number", () => ({
  type: "number",
}))

export type NumberTy = Ty<"number", number>
