import { ReactNode } from 'react'

import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'

const useStyles = createThemeUseStyles(({ palette }) => ({
  container: ({ visible }) => ({
    display: 'inline-block',
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    visibility: visible ? 'visible' : 'hidden',
    padding: '5px',
    borderRadius: '2px',
    opacity: visible ? 1 : 0,
    backgroundColor: palette.text,
    color: palette.background,
    transition: visible
      ? 'opacity 200ms, visibility 0ms'
      : 'opacity 200ms, visibility 200ms',
  }),
}))

export type SnackbarProps = {
  visible?: boolean
  children?: ReactNode
}

export const Snackbar = ({ visible = false, children }: SnackbarProps) => {
  const theme = useTheme()
  const classes = useStyles({ theme, visible })
  return <div className={classes.container}>{children}</div>
}
