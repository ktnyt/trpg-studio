import { MutableRefObject, ReactNode, useEffect, useState } from 'react'

import clsx from 'clsx'

import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'

const useStyles = createThemeUseStyles(({ palette }) => ({
  root: {
    display: 'inline-block',
    position: 'fixed',
    visibility: 'visible',
    padding: '5px',
    borderRadius: '4px',
    opacity: 1,
    backgroundColor: palette.text,
    color: palette.background,
    transition: 'opacity 200ms, visibility 0ms',
    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '0px',
      height: '0px',
      bottom: '-5px',
      left: '50%',
      marginLeft: '-5px',
      marginRight: '-5px',
      border: `5px solid transparent`,
      borderTopColor: palette.text,
      borderBottom: '0',
    },
  },
  hidden: {
    visibility: 'hidden',
    opacity: 0,
    transition: 'opacity 200ms, visibility 200ms',
  },
}))

export type TooltipProps<T> = {
  nodeRef?: MutableRefObject<T>
  open?: boolean
  children?: ReactNode
}

const Tooltip = <T extends HTMLElement>({
  nodeRef,
  open = false,
  children,
}: TooltipProps<T>) => {
  const theme = useTheme()
  const { root, hidden } = useStyles(theme)
  const [{ top, left, width }, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })
  useEffect(() => {
    if (nodeRef !== undefined && top === 0 && left === 0 && width === 0) {
      const { top, left, width } = nodeRef.current.getBoundingClientRect()
      setPosition({ top, left, width })
    }
  }, [nodeRef, top, left, width])
  return (
    <div
      className={clsx(root, !open && hidden)}
      style={{
        top: top - 5,
        left: left + width / 2,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {children}
    </div>
  )
}

export default Tooltip
