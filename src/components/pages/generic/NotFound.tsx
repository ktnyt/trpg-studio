import { Link } from 'react-router-dom'

import { faSadTear } from '@fortawesome/free-solid-svg-icons'

import Icon from '@/components/atoms/Icon'
import { useTheme } from '@/context/ThemeContext'
import { useWindowSize } from '@/hooks/useWindowSize'

const NotFound = () => {
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
        <h3>404: ページが見つかりませんでした。</h3>
        <Link to="/">トップに戻る</Link>
      </div>
    </div>
  )
}

export default NotFound
