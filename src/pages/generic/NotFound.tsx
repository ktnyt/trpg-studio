import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { faSadTear } from '@fortawesome/free-regular-svg-icons'

import { Icon } from '@/atoms/Icon'
import { useTheme } from '@/context/ThemeContext'
import { useWindowSize } from '@/hooks/useWindowSize'

export type NotFoundProps = {
  message?: string
  children?: ReactNode
}

export const NotFound = ({
  message = '404: Page Not Found',
  children,
}: NotFoundProps) => {
  const { palette } = useTheme()
  const { width, height } = useWindowSize()
  return (
    <div
      style={{
        width,
        height,
        color: palette.text,
        backgroundColor: palette.step50,
      }}
    >
      <div
        className="center"
        style={{
          width: 320,
          backgroundColor: palette.step50,
          textAlign: 'center',
        }}
      >
        <Icon
          icon={faSadTear}
          style={{ fontSize: `${Math.min(320, height) / 4}px` }}
        />
        <h3>{message}</h3>
        {children || (
          <Link to="/" style={{ color: palette.text }}>
            トップに戻る
          </Link>
        )}
      </div>
    </div>
  )
}
