import { ReactNode } from 'react'

import clsx from 'clsx'

import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'

const useStyles = createThemeUseStyles(({ palette }) => ({
  root: {
    display: 'inline-block',
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    visibility: 'visible',
    padding: '5px',
    borderRadius: '2px',
    opacity: 1,
    backgroundColor: palette.text,
    color: palette.background,
    transition: 'opacity 200ms, visibility 0ms',
  },
  hidden: {
    visibility: 'hidden',
    opacity: 0,
    transition: 'opacity 200ms, visibility 200ms',
  },
}))

export type SnackbarProps = {
  visible?: boolean
  children?: ReactNode
}

const Snackbar = ({ visible = false, children }: SnackbarProps) => {
  const theme = useTheme()
  const { root, hidden } = useStyles(theme)
  return <div className={clsx(root, !visible && hidden)}>{children}</div>
}

export default Snackbar
