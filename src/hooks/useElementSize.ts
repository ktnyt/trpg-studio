import { RefObject, useCallback, useEffect, useState } from 'react'

import ResizeObserver from 'resize-observer-polyfill'

const getSize = <Element extends HTMLElement>(element: Element | null) => ({
  width: element === null ? 0 : element.offsetWidth,
  height: element === null ? 0 : element.offsetHeight,
})

export const useElementSize = <E extends HTMLElement>(ref: RefObject<E>) => {
  const init = getSize(ref.current)
  const [size, setSize] = useState(init)

  const handleObserve = useCallback(() => {
    setSize(getSize(ref.current))
  }, [ref])

  useEffect(() => {
    const observer = new ResizeObserver(handleObserve)
    if (ref.current !== null) {
      observer.observe(ref.current)
      return () => observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return size
}
