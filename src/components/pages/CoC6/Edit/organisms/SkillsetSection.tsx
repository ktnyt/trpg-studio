import React, { CSSProperties, Fragment, memo } from 'react'

import deepEqual from 'deep-equal'

import { createThemeUseStyles } from '@/context/ThemeContext'
import { Skill, Skillset } from '@/models/Character'
import { Dict } from '@/utils/dict'
import { Merger } from '@/utils/merge'

import { CategoryTable } from './CategoryTable'

import { Context, contextEqual } from '../Context'

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
  width: CSSProperties['width']
  context: Context
  onUpdate: (category: string, key: string, diff: Merger<Skill>) => void
}

const compare = (prev: SkillsetSectionProps, next: SkillsetSectionProps) =>
  deepEqual(prev.skillset, next.skillset) &&
  deepEqual(prev.totals.entries(), next.totals.entries()) &&
  prev.showall === next.showall &&
  prev.width === next.width &&
  contextEqual(prev.context, next.context)

export const SkillsetSection = Object.assign(
  memo(
    ({
      skillset,
      totals,
      showall,
      width,
      context,
      onUpdate,
    }: SkillsetSectionProps) => {
      const { theme, lang, translator, rule } = context
      const styles = useStyles(theme)

      return (
        <Fragment>
          <div className={styles.divider} style={{ width }}>
            {translator.t('skills', lang)}
          </div>

          {rule.skillset.keys().map((category) => (
            <CategoryTable
              key={category}
              category={category}
              skills={skillset[category]}
              totals={totals}
              showall={showall}
              width={width}
              context={context}
              onUpdate={onUpdate}
            />
          ))}
        </Fragment>
      )
    },
    compare
  ),
  { displayName: 'SkillsetSection' }
)
