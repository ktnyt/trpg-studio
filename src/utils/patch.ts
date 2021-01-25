export type Patchable<T> = T extends {
  [k in keyof T]: T[k] extends Function ? never : T[k]
}
  ? Partial<T>
  : T

export type Patcher<T> = Patchable<T> | ((arg: T) => Patchable<T>)

export const patcher = <T extends Object>(
  d: Patcher<T> | ((arg: T) => Patcher<T>)
) => (o: T): T => ({
  ...o,
  ...(d instanceof Function ? d(o) : d),
})
