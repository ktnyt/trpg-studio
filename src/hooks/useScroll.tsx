import { useEffect, useState } from 'react'

export const useScroll = () => {
  const offset = () => ({ x: window.pageXOffset, y: window.pageYOffset })
  const [state, setState] = useState(offset())

  useEffect(() => {
    const handler = () => setState(offset())
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  })

  return state
}
