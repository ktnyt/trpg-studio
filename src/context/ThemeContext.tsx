import { createContext, useEffect, useState } from 'react'
import { createTheming, createUseStyles, Styles } from 'react-jss'

import { Palette } from '@/palette/palette'

export type Theme = { palette: Palette; isDark: boolean; toggle: () => void }

const ThemeContext = createContext<Theme>(null!)
const theming = createTheming(ThemeContext)

export const { ThemeProvider: Provider, useTheme } = theming

export const createThemeUseStyles = (
  styles: Styles | ((theme: Theme) => Styles)
) => createUseStyles<Theme>(styles, { theming })

export const ThemeProvider = ({
  palette: initPallete,
  children,
}: {
  palette: Palette
  children?: React.ReactNode
}) => {
  const preference = window.localStorage.getItem('palette.scheme')
  const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')
  const init =
    preference !== undefined ? preference === 'dark' : matchMedia.matches
  const [isDark, setDark] = useState(init)

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setDark(e.matches)
    if (matchMedia.addEventListener === undefined) {
      matchMedia.addListener(handler)
      return () => matchMedia.removeListener(handler)
    }
    matchMedia.addEventListener('change', handler)
    return () => matchMedia.removeEventListener('change', handler)
  })

  window.localStorage.setItem('palette.scheme', isDark ? 'dark' : 'light')
  const palette = isDark ? initPallete.flip() : initPallete
  const toggle = () => setDark((dark) => !dark)
  return <Provider theme={{ palette, isDark, toggle }}>{children}</Provider>
}
