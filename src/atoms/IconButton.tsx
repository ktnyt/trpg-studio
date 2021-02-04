import { ComponentPropsWithRef, forwardRef } from 'react'

import clsx from 'clsx'

import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'

import { Icon, IconProps } from './Icon'

const useStyles = createThemeUseStyles(({ palette }) => ({
  button: {
    border: 'none',
    backgroundColor: palette.step50,
    color: palette.step800,
    userSelect: 'none',
    transition: 'background-color 200ms, color 200ms',

    '&:hover': {
      backgroundColor: palette.step100,
      cursor: 'pointer',
    },

    '&:active': {
      backgroundColor: palette.step150,
      outline: 'none',
    },

    '&:focus': {
      outline: 'none',
    },

    '&:disabled': {
      backgroundColor: palette.step50,
      color: palette.step200,
    },
  },
  md: {
    padding: '10px 8px',
    borderRadius: '6px',
    width: '36px',
    height: '36px',
    fontSize: '16px',
    lineHeight: '16px',
  },
  sm: {
    padding: '5px 4px',
    borderRadius: '3px',
    width: '18px',
    height: '18px',
    fontSize: '8px',
    lineHeight: '8px',
  },
}))

export type IconButtonProps = {
  icon: IconProps['icon']
  spin?: IconProps['spin']
  pulse?: IconProps['pulse']
  size?: 'sm' | 'md'
} & ComponentPropsWithRef<'button'>

export const IconButton = Object.assign(
  forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, spin, pulse, size = 'md', ...props }, ref) => {
      const theme = useTheme()
      const { button, sm, md } = useStyles(theme)

      const className = clsx(button, size === 'sm' && sm, size === 'md' && md)

      return (
        <button ref={ref} className={className} {...props}>
          <Icon icon={icon} spin={spin} pulse={pulse} fixedWidth />
        </button>
      )
    }
  ),
  { displayName: 'IconButton' }
)
