import { ComponentPropsWithRef, forwardRef } from 'react'

import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'

import { Icon, IconProps } from './Icon'

const useStyles = createThemeUseStyles(({ palette }) => ({
  button: {
    padding: '11px 9px',
    border: 'none',
    borderRadius: '6px',
    width: '36px',
    height: '36px',
    backgroundColor: palette.step50,
    color: palette.step800,
    fontSize: '14px',
    lineHeight: '14px',
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
}))

export type IconButtonProps = {
  icon: IconProps['icon']
  spin?: IconProps['spin']
  pulse?: IconProps['pulse']
} & ComponentPropsWithRef<'button'>

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, spin, pulse, ...props }, ref) => {
    const theme = useTheme()
    const { button } = useStyles({ theme })
    return (
      <button ref={ref} className={button} {...props}>
        <Icon icon={icon} spin={spin} pulse={pulse} fixedWidth />
      </button>
    )
  }
)
