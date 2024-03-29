import { CSSProperties, FocusEvent, memo } from 'react'

import deepEqual from 'deep-equal'

import { Grid } from '@/atoms/Grid'
import { Input } from '@/atoms/Input'
import { createThemeUseStyles, Theme } from '@/context/ThemeContext'
import { useTranslator } from '@/hooks/useTranslator'
import { Skill } from '@/models/CoC6/Character'
import { Merger } from '@/utils/merge'
import { Language } from '@/utils/translator'

import { NumberInput } from './NumberInput'

import { useRule } from '../../rule'

type SkillRowClassNames = 'cell' | 'toggle' | 'detail' | 'init' | 'total'
type SkillRowStyleProps = {
  visibility: string
  backgroundColor: string
  color: string
}

const useStyles = createThemeUseStyles<SkillRowClassNames, SkillRowStyleProps>(
  ({ palette, isDark }) => ({
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
  })
)

const asNumber = (s: string) => (/^-?\d+$/.test(s) ? parseInt(s, 10) : 0)

export type SkillRowProps = {
  category: string
  name: string
  skill: Skill
  init: number
  visible: boolean
  locked: boolean
  width: CSSProperties['width']
  theme: Theme
  lang: Language
  onUpdate: (category: string, key: string, diff: Merger<Skill>) => void
  onFocus: (event: FocusEvent<HTMLInputElement>) => void
  onBlur: (event: FocusEvent<HTMLInputElement>) => void
}

const skillsEqual = (prev: Skill, next: Skill) =>
  prev.job === next.job &&
  prev.hobby === next.hobby &&
  prev.growth === next.growth &&
  prev.other === next.other &&
  prev.fixed === next.fixed

const compare = (prev: SkillRowProps, next: SkillRowProps) =>
  prev.category === next.category &&
  prev.name === next.name &&
  skillsEqual(prev.skill, next.skill) &&
  prev.init === next.init &&
  prev.visible === next.visible &&
  prev.locked === next.locked &&
  prev.width === next.width &&
  deepEqual(prev.theme, next.theme) &&
  prev.lang === next.lang

export const SkillRow = Object.assign(
  memo(
    ({
      category,
      name,
      init,
      skill,
      visible,
      locked,
      width,
      theme,
      lang,
      onUpdate,
      onFocus,
      onBlur,
    }: SkillRowProps) => {
      const translator = useTranslator()
      const rule = useRule(translator)
      const { palette, isDark } = theme

      const { custom } = rule.skillset.get(category).get(name)

      const { job, hobby, growth, other, fixed, detail } = skill
      const total = init + job + hobby + growth + other
      const flag = total > init || fixed

      const backgroundColor = flag ? palette.background : palette.step50
      const color = !flag
        ? palette.step500
        : total <= 95
        ? palette.text
        : total <= 100
        ? palette.warning.tone(!isDark)
        : palette.danger.tone(!isDark)
      const visibility = visible ? 'visible' : 'hidden'

      const classes = useStyles({ visibility, backgroundColor, color })
      const toggleFixed = () =>
        onUpdate(category, name, ({ fixed }) => ({ fixed: !fixed }))

      return visible ? (
        <Grid
          templateColumns="[start check] 22px 1fr [key] 100px 1fr [init] 30px 1fr [job] 30px 1fr [hobby] 30px 1fr [growth] 30px 1fr [other] 30px 1fr [total] 30px 1fr [end]"
          templateRows={`[${name}] 22px`}
          alignItems="center"
          style={{ width, visibility }}
        >
          <Grid.Item column="check" row={name}>
            <input
              type="checkbox"
              disabled={locked}
              style={{ margin: '4px 5px 5px 4px' }}
            />
          </Grid.Item>
          <Grid.Item column="key" row={name} style={{ visibility }}>
            <span className={classes.toggle} onClick={toggleFixed}>
              {translator.t(name, lang)}
            </span>
            {custom && (
              <span>
                <Input
                  defaultValue={detail}
                  placeholder="詳細"
                  disabled={locked}
                  className={classes.detail}
                  onChange={({ target: { value: detail } }) =>
                    onUpdate(category, name, { detail })
                  }
                />
              </span>
            )}
          </Grid.Item>
          <Grid.Item column="init" row={name} className={classes.init}>
            {init}
          </Grid.Item>
          <Grid.Item column="job" row={name} className={classes.cell}>
            <NumberInput
              placeholder="職業"
              defaultValue={job !== 0 ? job : ''}
              disabled={locked}
              onChange={({ target: { value: job } }) =>
                onUpdate(category, name, { job: asNumber(job) })
              }
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Grid.Item>
          <Grid.Item column="hobby" row={name} className={classes.cell}>
            <NumberInput
              placeholder="趣味"
              defaultValue={hobby !== 0 ? hobby : ''}
              disabled={locked}
              onChange={({ target: { value: hobby } }) =>
                onUpdate(category, name, { hobby: asNumber(hobby) })
              }
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Grid.Item>
          <Grid.Item column="growth" row={name} className={classes.cell}>
            <NumberInput
              placeholder="成長"
              defaultValue={growth !== 0 ? growth : ''}
              disabled={locked}
              onChange={({ target: { value: growth } }) =>
                onUpdate(category, name, { growth: asNumber(growth) })
              }
            />
          </Grid.Item>
          <Grid.Item column="other" row={name} className={classes.cell}>
            <NumberInput
              placeholder="他"
              defaultValue={other !== 0 ? other : ''}
              disabled={locked}
              onChange={({ target: { value: other } }) =>
                onUpdate(category, name, { other: asNumber(other) })
              }
            />
          </Grid.Item>
          <Grid.Item column="total" row={name} className={classes.total}>
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
