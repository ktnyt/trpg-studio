export type Extend<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U
