import { Ty } from "./_base.ts"

export const none = Ty.make<NoneTy>(() => ({
  type: "null",
}))

export type NoneTy = Ty<null>
