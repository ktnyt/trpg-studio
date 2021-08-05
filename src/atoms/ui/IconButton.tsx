import { ComponentPropsWithRef, forwardRef } from 'react'

import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'

import { Icon, IconProps } from './Icon'

export type IconSize = 'sm' | 'md'

export type IconButtonProps = {
  icon: IconProps['icon']
  spin?: IconProps['spin']
  pulse?: IconProps['pulse']
  size?: 'sm' | 'md'
} & ComponentPropsWithRef<'button'>

type IconButtonClassNames = 'button'

const useStyles = createThemeUseStyles<
  IconButtonClassNames,
  Partial<IconButtonProps>
>(({ palette }) => ({
  button: ({ size }) => ({
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

    padding: size === 'md' ? '10px 8px' : '5px 4px',
    borderRadius: size === 'md' ? '6px' : '3px',
    width: size === 'md' ? '36px' : '18px',
    height: size === 'md' ? '36px' : '18px',
    fontSize: size === 'md' ? '16px' : '8px',
    lineHeight: size === 'md' ? '16px' : '8px',
  }),
}))

export const IconButton = Object.assign(
  forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, spin, pulse, size = 'md', ...props }, ref) => {
      const theme = useTheme()
      const classes = useStyles({ theme, size })
      return (
        <button ref={ref} className={classes.button} {...props}>
          <Icon icon={icon} spin={spin} pulse={pulse} fixedWidth />
        </button>
      )
    }
  ),
  { displayName: 'IconButton' }
)
