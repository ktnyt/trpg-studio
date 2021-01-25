export const sanitize = <T extends unknown>(o: { [k: string]: T }) =>
  Object.fromEntries(Object.entries(o).filter(([_, v]) => v !== undefined))
