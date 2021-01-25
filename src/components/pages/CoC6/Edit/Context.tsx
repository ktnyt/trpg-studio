import deepEqual from 'deep-equal'

import { Theme } from '@/context/ThemeContext'
import { Translator, Language } from '@/utils/translator'

import { Rule } from '../rule'

export type Context = {
  theme: Theme
  lang: Language
  translator: Translator // MUST be constant.
  rule: Rule // MUST be constant.
  locked: boolean
}

export const contextEqual = (prev: Context, next: Context) =>
  deepEqual(prev.theme, next.theme) &&
  prev.lang === next.lang &&
  prev.locked === next.locked
