import { CSSProperties, Fragment } from 'react'

import Flex from '@/components/atoms/Flex'
import { createThemeUseStyles } from '@/context/ThemeContext'
import { Category, Skill } from '@/models/Character'
import Dict from '@/utils/dict'
import { Merger } from '@/utils/merge'

import SkillRow from './SkillRow'

import { Context } from '../Context'

const useStyles = createThemeUseStyles(({ palette, isDark }) => ({
  divider: {
    boxSizing: 'border-box',
    padding: '2px 10px',
    backgroundColor: palette.secondary.tone(isDark),
    color: palette.secondary.contrast,
    fontSize: '12px',
    fontWeight: 'bold',
  },
}))

export type CategoryTableProps = {
  category: string
  skills: Category
  totals: Dict<string, number>
  showall: boolean
  width: CSSProperties['width']
  context: Context
  onUpdate: (category: string, key: string, diff: Merger<Skill>) => void
}

const CategoryTable = ({
  category,
  skills,
  totals,
  showall,
  width,
  context,
  onUpdate,
}: CategoryTableProps) => {
  const { theme, lang, translator, rule } = context
  const styles = useStyles(theme)

  const skillVisibility = rule.skillset.get(category).map((_, key) => {
    const { job, hobby, growth, other, fixed } = skills[key]
    return showall || fixed || job + hobby + growth + other > 0
  })

  const visible = skillVisibility.filter((visible) => visible).size > 0

  const skillInits = rule.skillset
    .get(category)
    .map(({ deps, apply }) => apply(deps.map((dep) => totals.get(dep))))

  const visibility = visible ? 'visible' : 'hidden'

  return visible ? (
    <Fragment>
      <Flex.Item className={styles.divider} style={{ width, visibility }}>
        {translator.t(category, lang)}
      </Flex.Item>

      {rule.skillset
        .get(category)
        .keys()
        .map((key) => {
          const skill = skills[key]
          const init = skillInits.get(key)
          const visible = skillVisibility.get(key)
          return (
            <SkillRow
              key={key}
              category={category}
              name={key}
              skill={skill}
              init={init}
              visible={visible}
              width={width}
              context={context}
              onUpdate={onUpdate}
            />
          )
        })}
    </Fragment>
  ) : null
}

export default CategoryTable
