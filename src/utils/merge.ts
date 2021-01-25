export type Merger<T> = Partial<T> | ((arg: T) => Partial<T>)

const apply = <T extends { [k in keyof T]: T[k] }>(t: T, m: Merger<T>) =>
  m instanceof Function ? m(t) : m

export const merge = <T extends { [k in keyof T]: T[k] }>(
  t: T,
  m: Merger<T>
): T => ({
  ...t,
  ...apply(t, m),
})

export const merger = <T extends { [k in keyof T]: T[k] }>(m: Merger<T>) => (
  t: T
) => merge(t, m)
