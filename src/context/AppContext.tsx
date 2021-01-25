import { createContext } from 'react'

import { Language } from '@/utils/translator'

export const AppContext = createContext({ lang: 'ja' as Language })
