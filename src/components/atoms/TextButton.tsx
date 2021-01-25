import { ComponentPropsWithRef, forwardRef } from 'react'

import clsx from 'clsx'

import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'
import { sanitize } from '@/utils/sanitize'

const useStyles = createThemeUseStyles(({ palette, isDark }) => ({
  root: {
    border: 'none',
    borderRadius: '4px',
    backgroundColor: palette.background,
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'color 100ms, fontWeight 100ms',
    '&:active': {
      backgroundColor: palette.step150,
      outline: 'none',
    },
    '&:focus': {
      backgroundColor: palette.step150,
      outline: 'none',
    },
  },
  primary: {
    color: palette.primary.tone(!isDark),
    '&:disabled': {
      color: `${palette.primary.tone(!isDark)}44`,
      fontWeight: 'normal',
    },
  },
  secondary: {
    color: palette.secondary.tone(!isDark),
    '&:disabled': {
      color: `${palette.secondary.tone(!isDark)}44`,
      fontWeight: 'normal',
    },
  },
  tertiary: {
    color: palette.tertiary.tone(!isDark),
    '&:disabled': {
      color: `${palette.tertiary.tone(!isDark)}44`,
      fontWeight: 'normal',
    },
  },
  success: {
    color: palette.success.tone(!isDark),
    '&:disabled': {
      color: `${palette.success.tone(!isDark)}44`,
      fontWeight: 'normal',
    },
  },
  warning: {
    color: palette.warning.tone(!isDark),
    '&:disabled': {
      color: `${palette.warning.tone(!isDark)}44`,
      fontWeight: 'normal',
    },
  },
  danger: {
    color: palette.danger.tone(!isDark),
    '&:disabled': {
      color: `${palette.danger.tone(!isDark)}44`,
      fontWeight: 'normal',
    },
  },
  dark: {
    color: palette.dark.tone(!isDark),
    '&:disabled': {
      color: `${palette.dark.tone(!isDark)}44`,
      fontWeight: 'normal',
    },
  },
  medium: {
    color: palette.medium.tone(!isDark),
    '&:disabled': {
      color: `${palette.medium.tone(!isDark)}44`,
      fontWeight: 'normal',
    },
  },
  light: {
    color: palette.light.tone(!isDark),
    '&:disabled': {
      color: `${palette.light.tone(!isDark)}44`,
      fontWeight: 'normal',
    },
  },
}))

type TextButtonProps = ComponentPropsWithRef<'button'> & { color: string }

export const TextButton = Object.assign(
  forwardRef<HTMLButtonElement, TextButtonProps>(
    ({ color, style, className: classNameProp, ...props }, ref) => {
      const theme = useTheme()
      const { root, ...styles } = useStyles(theme)
      const className = clsx(
        root,
        styles.hasOwnProperty(color) && styles[color],
        classNameProp
      )
      return (
        <button
          ref={ref}
          style={sanitize({ ...style })}
          className={className}
          {...props}
        />
      )
    }
  ),
  { displayName: 'TextButton' }
)
