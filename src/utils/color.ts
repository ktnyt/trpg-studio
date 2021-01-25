import math from './math'

const mixer = (p: number, a1: number, a2: number) => {
  const w = 2.0 * p - 1.0
  const d = a1 - a2
  const r = ((w * d === -1.0 ? w : (w + d) / (1.0 + w * d)) + 1.0) / 2.0
  const mix = (v1: number, v2: number) => Math.round(r * v1 + (1.0 - r) * v2)
  const a = p * a1 + (1.0 - p) * a2
  return { mix, a }
}

export class RGBA {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a = 1.0
  ) {}

  public static fromHex(s: string) {
    if (/^#[0-9A-Fa-f]{8}$/.test(s)) {
      const r = parseInt(s.substr(1, 2), 16)
      const g = parseInt(s.substr(3, 2), 16)
      const b = parseInt(s.substr(5, 2), 16)
      const a = parseInt(s.substr(7, 2), 16) / 255.0
      return new RGBA(r, g, b, a)
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(s)) {
      const r = parseInt(s.substr(1, 2), 16)
      const g = parseInt(s.substr(3, 2), 16)
      const b = parseInt(s.substr(5, 2), 16)
      return new RGBA(r, g, b, 1.0)
    }
    if (/^#[0-9A-Fa-f]{4}$/.test(s)) {
      const r = parseInt(s.substr(1, 2), 16) * 17.0
      const g = parseInt(s.substr(3, 2), 16) * 17.0
      const b = parseInt(s.substr(5, 2), 16) * 17.0
      const a = (parseInt(s.substr(7, 2), 16) * 17.0) / 255.0
      return new RGBA(r, g, b, a)
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(s)) {
      const r = parseInt(s.substr(1, 2), 16) * 17.0
      const g = parseInt(s.substr(3, 2), 16) * 17.0
      const b = parseInt(s.substr(5, 2), 16) * 17.0
      return new RGBA(r, g, b, 1.0)
    }
    throw new Error(`expected hex color string, got '${s}'`)
  }

  get hex() {
    const asHex = (n: number) => `0${n.toString(16)}`.slice(-2)
    const r = asHex(this.r)
    const g = asHex(this.g)
    const b = asHex(this.b)
    const a = this.a === 1.0 ? '' : asHex(this.a * 255.0)
    return `#${r}${g}${b}${a}`
  }

  get rgba() {
    const { r, g, b, a } = this
    return new RGBA(r, g, b, a)
  }

  get hsla() {
    const [r, g, b] = [this.r / 255.0, this.g / 255.0, this.b / 255.0]

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    const t = max + min

    const l = t / 2.0
    const s = delta < Number.EPSILON ? 0 : delta / (l < 0.5 ? t : 2.0 - t)
    const h =
      delta < Number.EPSILON
        ? 0
        : r === max
        ? (g - b) / delta + (g < b ? 6 : 0)
        : g === max
        ? (b - r) / delta + 2
        : b === max
        ? (r - g) / delta + 4
        : 0

    return new HSLA(h * 60, s * 100, l * 100, this.a)
  }

  mix(color: string | Color, weight = 50) {
    const that = typeof color === 'string' ? RGBA.fromHex(color) : color.rgba
    const p = math.clamp(weight / 100.0, 0.0, 1.0)
    const { mix, a } = mixer(p, this.a, that.a)
    const r = mix(this.r, that.r)
    const g = mix(this.g, that.g)
    const b = mix(this.b, that.b)
    return new RGBA(r, g, b, a)
  }
}

const absmod = (n: number, r: number) => {
  const m = n % r
  return m < 0 ? m + r : m
}

const hue2rgb = (m1: number, m2: number, h: number) =>
  h * 6.0 < 1.0
    ? m1 + (m2 - m1) * h * 6.0
    : h * 2.0 < 1.0
    ? m2
    : h * 3.0 < 2.0
    ? m1 + (m2 - m1) * (2.0 / 3.0 - h) * 6.0
    : m1

export class HSLA {
  constructor(
    public h: number,
    public s: number,
    public l: number,
    public a = 1.0
  ) {}

  public static fromHex(s: string) {
    return RGBA.fromHex(s).hsla
  }

  get hex() {
    return this.rgba.hex
  }

  get rgba() {
    const h = absmod(this.h / 360.0, 1.0)
    const s = math.clamp(this.s / 100.0, 0.0, 1.0)
    const l = math.clamp(this.l / 100.0, 0.0, 1.0)

    const m2 = l > 0.5 ? l + s - l * s : l * (s + 1.0)
    const m1 = l * 2.0 - m2

    const r = Math.round(hue2rgb(m1, m2, h + 1.0 / 3.0) * 255.0)
    const g = Math.round(hue2rgb(m1, m2, h) * 255.0)
    const b = Math.round(hue2rgb(m1, m2, h - 1.0 / 3.0) * 255.0)

    return new RGBA(r, g, b, this.a)
  }

  get hsla() {
    const { h, s, l, a } = this
    return new HSLA(h, s, l, a)
  }

  mix(color: string | Color, weight = 50) {
    const that = typeof color === 'string' ? HSLA.fromHex(color) : color.hsla
    const p = math.clamp(weight / 100.0, 0.0, 1.0)
    const { mix, a } = mixer(p, this.a, that.a)
    const h = mix(this.h, that.h)
    const s = mix(this.s, that.s)
    const l = mix(this.l, that.l)
    return new HSLA(h, s, l, a)
  }
}

export type Color = RGBA | HSLA

export const fromHex = (s: string) => RGBA.fromHex(s)
export const asColor = (arg: string | Color) =>
  typeof arg === 'string' ? fromHex(arg) : arg

export const mix = (lhs: string | Color, rhs: string | Color, weight = 50) =>
  typeof lhs !== 'string'
    ? lhs.mix(rhs, weight)
    : typeof rhs !== 'string'
    ? rhs.mix(lhs, 100 - weight)
    : asColor(lhs).mix(rhs, weight)
