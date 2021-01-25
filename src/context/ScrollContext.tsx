import { createContext } from 'react'

export type ScrollDirection = 'down' | 'up' | null

export const ScrollContext = createContext({
  direction: null as ScrollDirection,
})
