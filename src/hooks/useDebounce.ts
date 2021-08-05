import { useEffect, useState } from 'react'

export const useDebounce = <T extends unknown>(next: T, delay = 1000) => {
  const [value, setValue] = useState(next)
  useEffect(() => {
    const timeout = setTimeout(() => setValue(next), delay)
    return () => clearTimeout(timeout)
  })
  return value
}
