export type Transformer = {
  (arg: number): number
  (arg: string): string
  then: (next: Transformer) => Transformer
}

const makeTransformer = (
  call: (arg: number) => number,
  repr: (arg: string) => string
) => {
  function transform(arg: number): number
  function transform(arg: string): string
  function transform(arg: number | string): number | string {
    return typeof arg === 'number' ? call(arg) : repr(arg)
  }
  return Object.assign(transform, {
    then: (transform: Transformer) =>
      makeTransformer(
        (arg: number) => transform(call(arg)),
        (arg: string) => transform(`(${repr(arg)})`)
      ),
  })
}

export const partition = makeTransformer(
  (arg) => arg,
  (arg) => `${arg}\u{200B}`
)

export const add = (c: number) =>
  makeTransformer(
    (arg) => arg + c,
    (arg) => `${arg}+${c}`
  )

export const mul = (c: number) =>
  makeTransformer(
    (arg) => arg * c,
    (arg) => `${arg}×${c}`
  )

export const div = (c: number) =>
  makeTransformer(
    (arg) => arg / c,
    (arg) => `${arg}÷${c}`
  )

export const floor = makeTransformer(
  (arg) => Math.floor(arg),
  (arg) => arg
)
