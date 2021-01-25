import { useEffect, useState } from 'react'

export const useScroll = () => {
  const offset = () => ({ x: window.pageXOffset, y: window.pageYOffset })
  const [state, setState] = useState({ ...offset(), dx: 0, dy: 0 })

  useEffect(() => {
    const handler = () =>
      setState(({ x: px, y: py }) => {
        const { x, y } = offset()
        const [dx, dy] = [x - px, y - py]
        return { x: x, y: y, dx, dy }
      })
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  })

  return state
}
