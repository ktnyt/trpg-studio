import { useTheme } from '@/context/ThemeContext'

export const Blank = () => (
  <div
    style={{
      position: 'fixed',
      top: '0px',
      left: '0px',
      zIndex: -1,
      minWidth: '100%',
      minHeight: '100%',
      backgroundColor: useTheme().palette.step50,
    }}
  />
)
