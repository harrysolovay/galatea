import { Ty } from "./_base.ts"

export const none = Ty.make<NoneTy>("none", () => ({
  type: "null",
}))

export type NoneTy = Ty<"none", null>
