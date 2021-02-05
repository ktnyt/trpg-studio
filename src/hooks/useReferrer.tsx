import { useEffect } from 'react'

import { nanoid } from 'nanoid'

export const useReferrer = () => {
  const saved = window.localStorage.getItem('referrer')
  const referrer = saved === null ? nanoid() : saved
  useEffect(() => {
    if (saved === null) {
      window.localStorage.setItem('referrer', referrer)
    }
  })
  return referrer
}
