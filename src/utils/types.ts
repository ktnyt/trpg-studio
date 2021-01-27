export type Primitive = boolean | number | string | symbol
export type POD = Primitive | POD[] | { [k in keyof any]: POD }
