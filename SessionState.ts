import { unimplemented } from "@std/assert/unimplemented"
import type { Session } from "./SessionOld.ts"

export class SessionState {
  constructor(readonly session: Session) {}

  rehydrate(_session: Session): this {
    unimplemented()
  }

  serialize(): string {
    unimplemented()
  }
}
