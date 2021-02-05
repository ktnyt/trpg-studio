import { CSSProperties, FocusEvent, Fragment, useContext } from 'react'

import { AppContext } from '@/context/AppContext'
import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'
import { useTranslator } from '@/hooks/useTranslator'
import { Skill, Skillset } from '@/models/CoC6/Character'
import { Dict } from '@/utils/dict'
import { Merger } from '@/utils/merge'

import { CategoryTable } from './CategoryTable'

import { useRule } from '../../rule'

export const useStyles = createThemeUseStyles(({ palette, isDark }) => ({
  divider: {
    boxSizing: 'border-box',
    height: '22px',
    padding: '2px 10px',
    backgroundColor: palette.primary.tone(isDark),
    color: palette.primary.contrast,
    fontSize: '12px',
    fontWeight: 'bold',
  },
  category: {
    padding: '2px 10px',
    backgroundColor: palette.secondary.tone(isDark),
    color: palette.secondary.contrast,
    fontSize: '12px',
    fontWeight: 'bold',
  },
}))

export type SkillsetSectionProps = {
  skillset: Skillset
  totals: Dict<string, number>
  showall: boolean
  locked: boolean
  width: CSSProperties['width']
  onUpdate: (category: string, key: string, diff: Merger<Skill>) => void
  onFocus: (event: FocusEvent<HTMLInputElement>) => void
  onBlur: (evnet: FocusEvent<HTMLInputElement>) => void
}

export const SkillsetSection = Object.assign(
  ({
    skillset,
    totals,
    showall,
    locked,
    width,
    onUpdate,
    onFocus,
    onBlur,
  }: SkillsetSectionProps) => {
    const { lang } = useContext(AppContext)
    const translator = useTranslator()
    const rule = useRule(translator)

    const theme = useTheme()
    const classes = useStyles(theme)

    return (
      <Fragment>
        <div className={classes.divider} style={{ width }}>
          {translator.t('skills', lang)}
        </div>

        {rule.skillset.keys().map((category) => (
          <CategoryTable
            key={category}
            category={category}
            skills={skillset[category]}
            totals={totals}
            showall={showall}
            locked={locked}
            width={width}
            onUpdate={onUpdate}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        ))}
      </Fragment>
    )
  },

  { displayName: 'SkillsetSection' }
)
