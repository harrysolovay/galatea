export interface TyConfig {
  description?: string
}

export interface Ty<N = any, C extends TyConfig = any> {
  config: Partial<C>
  new(): N
  schema(ctx: Context): object
  with(config: Partial<C>): this
}

export abstract class TyBase {}

export function make<Ty_ extends Ty>(
  config: Partial<Ty["config"]>,
  schema: (this: Ty_, ctx: Context) => unknown,
) {
  return class Ty extends TyBase {
    static config = config
    static schema = schema
    static with(config: Partial<Ty_["config"]>): Ty_ {
      return make(Object.assign({}, this.config, config), schema)
    }
  } as Ty_
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
