import { Transformer } from './transformer'

function areNumbers(array: number[] | string[]): array is number[] {
  return array.length === 0 || typeof array[0] === 'number'
}

export type Accumulator = {
  (arg: number[]): number
  (arg: string[]): string
  then: (next: Transformer, group: boolean) => Accumulator
}

const parenthesize = (arg: string) => (Boolean(arg) ? `(${arg})` : '')
const applyIf = <T extends unknown>(f: (arg: T) => T, t: T, flag: boolean) =>
  flag ? f(t) : t

const makeAccumulator = (
  call: (arg: number[]) => number,
  repr: (arg: string[]) => string
) => {
  function accumulator(arg: number[]): number
  function accumulator(arg: string[]): string
  function accumulator(arg: number[] | string[]): number | string {
    return areNumbers(arg) ? call(arg) : repr(arg)
  }
  return Object.assign(accumulator, {
    then: (transform: Transformer, group = false) =>
      makeAccumulator(
        (arg: number[]) => transform(call(arg)),
        (arg: string[]) =>
          transform(applyIf(parenthesize, repr(arg), group && arg.length > 1))
      ),
  })
}

export const constant = (n: number) =>
  makeAccumulator(
    () => n,
    () => `${n}`
  )

export const sum = makeAccumulator(
  (args) => args.reduce((a, b) => a + b),
  (args) => args.join('+')
)
