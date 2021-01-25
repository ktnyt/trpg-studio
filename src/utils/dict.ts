export class Dict<K, V> {
  data: Map<K, V>

  constructor(entries?: [K, V][]) {
    this.data = new Map(entries)
  }

  public static equals<K, V>(d1: Dict<K, V>, d2: Dict<K, V>) {
    const n = Math.min(d1.size, d2.size)
    const [k1, k2] = [d1.keys(), d2.keys()]
    const [v1, v2] = [d1.values(), d2.values()]
    const keys = Array.from(Array(n), (_, i) => [k1[i], k2[i]])
    const values = Array.from(Array(n), (_, i) => [v1[i], v2[i]])
    return (
      d1.size === d2.size &&
      keys.reduce((flag, [k1, k2]) => flag && k1 === k2, true) &&
      values.reduce((flag, [v1, v2]) => flag && v1 === v2, true)
    )
  }

  public static fromObject<K extends string | number | symbol, V>(
    obj: { [k in K]: V }
  ) {
    return new Dict<K, V>(
      Object.entries(obj).map(([key, value]) => [key, value] as [K, V])
    )
  }

  asObject(): { [k: string]: V } {
    return Object.fromEntries(new Map<K, V>(this.entries()))
  }

  keys() {
    return Array.from(this.data.keys())
  }

  values() {
    return Array.from(this.data.values())
  }

  entries() {
    return Array.from(this.data.entries())
  }

  map<T>(callback: (value: V, key: K, index: number, dict: Dict<K, V>) => T) {
    return new Dict(
      this.entries().map(([key, value], index) => [
        key,
        callback(value, key, index, this),
      ])
    )
  }

  filter(callback: (value: V, key: K, dict: Dict<K, V>) => boolean) {
    return new Dict(
      this.entries().filter(([key, value]) => callback(value, key, this))
    )
  }

  has(key: K) {
    return this.data.has(key)
  }

  get(key: K) {
    const value = this.data.get(key)
    if (value === undefined) {
      throw new Error(`invalid key \`${key}\` in Dict access`)
    }
    return value
  }

  set(key: K, value: V, inplace = false) {
    if (inplace) {
      this.data.set(key, value)
      return this
    }
    if (!(key in this.keys())) {
      return new Dict([...this.entries(), [key, value]])
    }
    return this.map((v, k) => (k === key ? value : v))
  }

  delete(key: K, inplace = false) {
    return this.filter((_, k) => k !== key)
  }

  clear(inplace = false) {
    if (inplace) {
      this.data.clear()
      return this
    }
    return new Dict<K, V>()
  }

  get size() {
    return this.data.size
  }
}

export type KeyType<T> = T extends Dict<infer K, unknown> ? K : never
export type ValueType<T> = T extends Dict<unknown, infer V> ? V : never
