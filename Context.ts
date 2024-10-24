import type { ErrorDetails, SessionResource } from "./models/mod.ts"
import { Listeners } from "./util/Listeners.ts"

export class Context {
  declare sessionResource?: SessionResource
  declare previous_item_id?: string
  transcriptListeners
  audioListeners
  errorListeners
  constructor(readonly signal: AbortSignal) {
    this.transcriptListeners = new Listeners<string>(signal)
    this.audioListeners = new Listeners<Int16Array>(signal)
    this.errorListeners = new Listeners<ErrorDetails>(signal)
  }
}
