import { useEffect, useState } from 'react'

export const useWindowSize = () => {
  const getSize = () => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  })
  const [size, setSize] = useState(getSize())
  useEffect(() => {
    const onResize = () => setSize(getSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  })
  return size
}
