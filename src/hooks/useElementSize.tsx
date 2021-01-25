import { RefObject, useLayoutEffect, useState } from 'react'

import deepEqual from 'deep-equal'
import ResizeObserver from 'resize-observer-polyfill'

const getSize = <Element extends HTMLElement>(element: Element | null) => ({
  width: element === null ? 0 : element.offsetWidth,
  height: element === null ? 0 : element.offsetHeight,
})

export const useElementSize = <E extends HTMLElement>(ref: RefObject<E>) => {
  const init = getSize(ref.current)
  const [size, setSize] = useState(init)
  useLayoutEffect(() => {
    const target = ref.current
    const observer = new ResizeObserver(() => {
      const next = getSize(target)
      if (!deepEqual(size, next)) {
        setSize(next)
      }
    })
    if (target !== null) {
      observer.observe(target)
      return () => observer.disconnect()
    }
  })
  return size
}
