import { CSSProperties, memo } from 'react'

import Grid from '@/components/atoms/Grid'
import Input from '@/components/atoms/Input'
import { createThemeUseStyles } from '@/context/ThemeContext'
import { Skill } from '@/models/Character'
import { Merger } from '@/utils/merge'

import NumberInput from './NumberInput'

import { Context, contextEqual } from '../Context'

const useStyles = createThemeUseStyles(({ palette, isDark }) => ({
  cell: ({ color }) => ({
    color,
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'right',
  }),
  toggle: ({ backgroundColor, color }) => ({
    padding: '1px 2px',
    borderRadius: '2px',
    backgroundColor,
    color,
    fontSize: '13px',
    lineHeight: '13px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  }),
  detail: {
    boxSizing: 'border-box',
    width: '40px',
    margin: '0px 5px',
    padding: '0px',
    border: 'none',
    borderBottom: `1px solid transparent`,
    backgroundColor: 'transparent',
    color: palette.text,
    fontSize: '12px',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: '12px',
    textAlign: 'left',
    transition: 'border 200ms',
    '&::placeholder': {
      color: palette.step300,
    },
    '&:hover': { borderBottom: `1px solid ${palette.step800}` },
    '&:focus': {
      borderBottom: `1px solid ${palette.secondary.tone(isDark)}`,
      outline: 'none',
    },
  },
  init: ({ color }) => ({
    margin: '0px 5px',
    color,
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'right',
  }),
  total: ({ color }) => ({
    marginRight: '10px',
    color,
    textAlign: 'right',
    fontWeight: 'bold',
    fontVariantNumeric: 'tabluar-nums',
  }),
}))

const asNumber = (s: string) => (/^\d+$/.test(s) ? parseInt(s, 10) : 0)

export type SkillRowProps = {
  category: string
  name: string
  skill: Skill
  init: number
  visible: boolean
  width: CSSProperties['width']
  context: Context
  onUpdate: (category: string, key: string, diff: Merger<Skill>) => void
}

const skillsEqual = (prev: Skill, next: Skill) => {
  return (
    prev.job === next.job &&
    prev.hobby === next.hobby &&
    prev.growth === next.growth &&
    prev.other === next.other &&
    prev.fixed === next.fixed
  )
}

const compare = (prev: SkillRowProps, next: SkillRowProps) =>
  prev.category === next.category &&
  prev.name === next.name &&
  skillsEqual(prev.skill, next.skill) &&
  prev.init === next.init &&
  prev.visible === next.visible &&
  prev.width === next.width &&
  contextEqual(prev.context, next.context)

const SkillRow = Object.assign(
  memo(
    ({
      category,
      name,
      init,
      skill,
      visible,
      width,
      context,
      onUpdate,
    }: SkillRowProps) => {
      const {
        theme: { palette },
        lang,
        translator,
        rule,
      } = context

      const { custom } = rule.skillset.get(category).get(name)

      const { job, hobby, growth, other, fixed, detail } = skill
      const total = init + job + hobby + growth + other
      const flag = total > init || fixed

      const backgroundColor = flag ? palette.background : palette.step50
      const color = flag ? palette.text : palette.step500
      const visibility = visible ? 'visible' : 'hidden'

      const styles = useStyles({ visibility, backgroundColor, color })
      const toggleFixed = () =>
        onUpdate(category, name, ({ fixed }) => ({ fixed: !fixed }))

      return visible ? (
        <Grid
          templateColumns="[start check] 22px 1fr [key] 100px 1fr [init] 30px 1fr [job] 30px 1fr [hobby] 30px 1fr [growth] 30px 1fr [other] 30px 1fr [total] 30px 1fr [end]"
          templateRows={`[${name}] 22px`}
          alignItems="center"
          style={{ width: width, visibility }}
        >
          <Grid.Item column="check" row={name}>
            <input type="checkbox" style={{ margin: '4px 5px 5px 4px' }} />
          </Grid.Item>
          <Grid.Item column="key" row={name} style={{ visibility }}>
            <span className={styles.toggle} onClick={toggleFixed}>
              {translator.t(name, lang)}
            </span>
            {custom && (
              <span>
                <Input
                  defaultValue={detail}
                  placeholder="詳細"
                  className={styles.detail}
                  onChange={({ target: { value: detail } }) =>
                    onUpdate(category, name, { detail })
                  }
                />
              </span>
            )}
          </Grid.Item>
          <Grid.Item column="init" row={name} className={styles.init}>
            {init}
          </Grid.Item>
          <Grid.Item column="job" row={name} className={styles.cell}>
            <NumberInput
              placeholder="職業"
              defaultValue={job > 0 ? job : ''}
              onChange={({ target: { value: job } }) =>
                onUpdate(category, name, { job: asNumber(job) })
              }
            />
          </Grid.Item>
          <Grid.Item column="hobby" row={name} className={styles.cell}>
            <NumberInput
              placeholder="趣味"
              defaultValue={hobby > 0 ? hobby : ''}
              onChange={({ target: { value: hobby } }) =>
                onUpdate(category, name, { hobby: asNumber(hobby) })
              }
            />
          </Grid.Item>
          <Grid.Item column="growth" row={name} className={styles.cell}>
            <NumberInput
              placeholder="成長"
              defaultValue={growth > 0 ? growth : ''}
              onChange={({ target: { value: growth } }) =>
                onUpdate(category, name, { growth: asNumber(growth) })
              }
            />
          </Grid.Item>
          <Grid.Item column="other" row={name} className={styles.cell}>
            <NumberInput
              placeholder="他"
              defaultValue={other > 0 ? other : ''}
              onChange={({ target: { value: other } }) =>
                onUpdate(category, name, { other: asNumber(other) })
              }
            />
          </Grid.Item>
          <Grid.Item column="total" row={name} className={styles.total}>
            {total}
          </Grid.Item>
        </Grid>
      ) : (
        <div></div>
      )
    },
    compare
  ),
  { displayName: 'SkillRow' }
)

export default SkillRow
