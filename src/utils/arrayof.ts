export const arrayof = <T extends unknown>(value: T, count: number) =>
  [...new Array(count)].map(() => value)
