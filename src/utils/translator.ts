import { Dict } from '@/utils/dict'

const Languages = ['en', 'ja'] as const
export type Language = typeof Languages[number]
export type Term = Partial<{ [lang in Language]: string }>

export class Translator {
  terms: Dict<string, Dict<Language, string>>

  constructor() {
    this.terms = new Dict()
  }

  extend(key: string, term: Term) {
    if (!(key in this.terms)) {
      this.terms.set(key, new Dict(), true)
    }
    Languages.forEach((lang) => {
      const entry = term[lang]
      if (entry !== undefined) {
        this.terms.get(key).set(lang, entry, true)
      }
    })
    return this
  }

  t(key: string, lang: Language = 'en'): string {
    const term = this.terms.get(key)
    if (lang !== 'en' && !term.has(lang)) {
      return this.t(key, 'en')
    }
    const s = term.get(lang)
    const matches = Array.from(s.matchAll(/%(.+?)%/g))
    return matches.reduce((s, [placeholder, key]) => {
      return s.replace(placeholder, this.t(key, lang))
    }, s)
  }
}
