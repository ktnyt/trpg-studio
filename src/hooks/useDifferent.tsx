import { useEffect, useState } from 'react'

import deepEqual from 'deep-equal'

const useDifferent = <T extends unknown>(
  curr: T,
  cmp: (a: T, b: T) => boolean = deepEqual
) => {
  const [prev, update] = useState(curr)
  const different = !cmp(prev, curr)
  useEffect(() => {
    if (different) {
      update(curr)
    }
  }, [curr, different])
  return different
}

export default useDifferent
