export interface Ty<K extends string = string, N = any> {
  type: K
  schema(ctx: Context): object
  new(): N
}

export abstract class TyBase {}

export namespace Ty {
  export function make<Ty_ extends Ty>(type: Ty_["type"], schema: (ctx: Context) => unknown) {
    return class Ty extends TyBase {
      static readonly type = type
      static schema = schema
    } as Ty_
  }
}

export class Context {
  defs
  constructor(
    readonly root: Ty,
    readonly models?: Record<string, Ty>,
  ) {
    this.defs = new Map<Ty, string>(models ? Object.entries(models).map(([k, v]) => [v, k]) : [])
  }

  ref(value: Ty) {
    const key = this.defs.get(value)
    return key ? { $ref: `#/$defs/${key}` } : value.schema(this)
  }
}
