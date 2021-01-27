import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { Icon } from '@/components/atoms/Icon'
import { useTheme } from '@/context/ThemeContext'
import { useWindowSize } from '@/hooks/useWindowSize'

export const Loading = () => {
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
          icon={faSpinner}
          style={{
            color: palette.step500,
            fontSize: `${Math.min(320, height) / 4}px`,
          }}
          pulse
        />
      </div>
    </div>
  )
}
