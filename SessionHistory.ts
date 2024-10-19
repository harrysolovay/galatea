import { unimplemented } from "@std/assert/unimplemented"
import type { Session } from "./Session.ts"

export class SessionHistory {
  constructor(readonly session: Session) {}

  rehydrate(_session: Session): this {
    unimplemented()
  }

  serialize(): string {
    unimplemented()
  }
}
