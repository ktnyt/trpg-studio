import { mix, Color, asColor } from '@/utils/color'
import { Dict } from '@/utils/dict'

const computeShade = (color: Color) => mix('#000000', color, 12)
const computeTint = (color: Color) => mix('#ffffff', color, 10)
const computeVariations = (color: Color) => [
  computeShade(color),
  computeTint(color),
]

type ColorSelector<T extends { [k: string]: string | Color }> =
  | keyof T
  | [keyof T, keyof T, number]

function isTuple<T extends { [k: string]: string | Color }>(
  arg: ColorSelector<T>
): arg is [keyof T, keyof T, number] {
  const selector = arg as [keyof T, keyof T, number]
  return (
    selector.length !== undefined &&
    selector.length === 3 &&
    typeof selector[0] === 'string' &&
    typeof selector[1] === 'string' &&
    typeof selector[2] === 'number'
  )
}

const selectColor = <T extends { [k: string]: string | Color }>(
  colors: T,
  selector: ColorSelector<T>
) => {
  if (isTuple(selector)) {
    const [selector1, selector2, weight] = selector
    const color1 = colors[selector1]
    const color2 = colors[selector2]
    return mix(color1, color2, weight)
  }
  const color = colors[selector]
  return typeof color === 'string' ? asColor(color) : (color as Color)
}

const createColors = <T extends { [k: string]: string | Color }>(
  colors: T,
  [baseSelector, contrastSelector]: [ColorSelector<T>, ColorSelector<T>]
) => {
  const base = selectColor(colors, baseSelector)
  const contrast = selectColor(colors, contrastSelector)
  const [shade, tint] = computeVariations(base)
  return {
    base: base.hex,
    contrast: contrast.hex,
    shade: shade.hex,
    tint: tint.hex,
    tone: (isDark?: boolean) =>
      (isDark === undefined ? base : isDark ? shade : tint).hex,
  }
}

type PaletteKeys<T extends { [k: string]: string | Color }> = {
  primary: [ColorSelector<T>, ColorSelector<T>]
  secondary: [ColorSelector<T>, ColorSelector<T>]
  tertiary: [ColorSelector<T>, ColorSelector<T>]
  success: [ColorSelector<T>, ColorSelector<T>]
  warning: [ColorSelector<T>, ColorSelector<T>]
  danger: [ColorSelector<T>, ColorSelector<T>]
  dark: [ColorSelector<T>, ColorSelector<T>]
  medium: [ColorSelector<T>, ColorSelector<T>]
  light: [ColorSelector<T>, ColorSelector<T>]
  text: ColorSelector<T>
  background: ColorSelector<T>
}

export const darken = <T extends { [k: string]: string | Color }>({
  primary,
  secondary,
  tertiary,
  success,
  warning,
  danger,
  dark,
  medium,
  light,
  text,
  background,
}: PaletteKeys<T>) => ({
  primary,
  secondary,
  tertiary,
  success,
  warning,
  danger,
  dark,
  medium,
  light,
  text: background,
  background: text,
})

export const createPalette = <T extends { [k: string]: string | Color }>(
  colors: T,
  keys: PaletteKeys<T>,
  dark = darken(keys)
) => {
  const textColor = selectColor(colors, keys.text)
  const backgroundColor = selectColor(colors, keys.background)
  return {
    colors: Dict.fromObject<string, string | Color>(colors).map(
      (color) => asColor(color).hex
    ),
    primary: createColors(colors, keys.primary),
    secondary: createColors(colors, keys.secondary),
    tertiary: createColors(colors, keys.tertiary),
    success: createColors(colors, keys.success),
    warning: createColors(colors, keys.warning),
    danger: createColors(colors, keys.danger),
    dark: createColors(colors, keys.dark),
    medium: createColors(colors, keys.medium),
    light: createColors(colors, keys.light),
    text: textColor.hex,
    background: backgroundColor.hex,
    step0: backgroundColor.hex,
    step50: mix(textColor, backgroundColor, 5).hex,
    step100: mix(textColor, backgroundColor, 10).hex,
    step150: mix(textColor, backgroundColor, 15).hex,
    step200: mix(textColor, backgroundColor, 20).hex,
    step250: mix(textColor, backgroundColor, 25).hex,
    step300: mix(textColor, backgroundColor, 30).hex,
    step350: mix(textColor, backgroundColor, 35).hex,
    step400: mix(textColor, backgroundColor, 40).hex,
    step450: mix(textColor, backgroundColor, 45).hex,
    step500: mix(textColor, backgroundColor, 50).hex,
    step550: mix(textColor, backgroundColor, 55).hex,
    step600: mix(textColor, backgroundColor, 60).hex,
    step650: mix(textColor, backgroundColor, 65).hex,
    step700: mix(textColor, backgroundColor, 70).hex,
    step750: mix(textColor, backgroundColor, 75).hex,
    step800: mix(textColor, backgroundColor, 80).hex,
    step850: mix(textColor, backgroundColor, 85).hex,
    step900: mix(textColor, backgroundColor, 90).hex,
    step950: mix(textColor, backgroundColor, 95).hex,
    step1000: textColor.hex,
    flip: () => createPalette(colors, dark, keys),
  }
}

export type Palette = ReturnType<typeof createPalette>
