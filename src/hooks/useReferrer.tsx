import { useRef } from 'react'

import { nanoid } from 'nanoid'

export const useReferrer = () => useRef(nanoid()).current
