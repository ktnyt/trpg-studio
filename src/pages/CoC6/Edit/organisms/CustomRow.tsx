import { CSSProperties, FocusEvent, memo, useRef, useState } from 'react'

import deepEqual from 'deep-equal'

import { Grid } from '@/atoms/Grid'
import { Input } from '@/atoms/Input'
import { createThemeUseStyles, Theme } from '@/context/ThemeContext'
import { useTranslator } from '@/hooks/useTranslator'
import { Custom } from '@/models/CoC6/Character'
import { Merger } from '@/utils/merge'
import { Language } from '@/utils/translator'

import { NumberInput } from './NumberInput'

import { useRule } from '../../rule'

type CustomRowClassNames = 'cell' | 'name' | 'init' | 'total'
type CustomRowStyleProps = { color: string }

const useStyles = createThemeUseStyles<
  CustomRowClassNames,
  CustomRowStyleProps
>(({ palette, isDark }) => ({
  cell: ({ color }) => ({
    color,
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'right',
  }),
  name: {
    width: '100%',
    marginBottom: '1px',
    padding: '0px',
    border: 'none',
    borderBottom: `1px solid transparent`,
    borderRadius: '0px',
    backgroundColor: 'transparent',
    color: palette.text,
    fontSize: '13px',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: '13px',
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

const asNumber = (s: string) => (/^-?\d+$/.test(s) ? parseInt(s, 10) : 0)

export type CustomRowProps = {
  index: number
  skill: Custom
  width: CSSProperties['width']
  locked: boolean
  theme: Theme
  lang: Language
  onUpdate: (index: number, diff: Merger<Custom>) => void
  onDelete: (index: number) => void
  onFocus: (event: FocusEvent<HTMLInputElement>) => void
  onBlur: (evnet: FocusEvent<HTMLInputElement>) => void
}

const customsEqual = (prev: Custom, next: Custom) =>
  prev.name === next.name &&
  prev.job === next.job &&
  prev.hobby === next.hobby &&
  prev.growth === next.growth &&
  prev.other === next.other

const compare = (prev: CustomRowProps, next: CustomRowProps) =>
  prev.index === next.index &&
  customsEqual(prev.skill, next.skill) &&
  prev.width === next.width &&
  prev.locked === next.locked &&
  deepEqual(prev.theme, next.theme) &&
  prev.lang === next.lang

export const CustomRow = Object.assign(
  memo(
    ({
      index,
      skill,
      width,
      locked,
      theme,
      onUpdate,
      onDelete,
      onFocus,
      onBlur,
    }: CustomRowProps) => {
      const translator = useTranslator()
      useRule(translator)
      const { palette, isDark } = theme

      const { name, job, hobby, growth, other } = skill
      const total = 1 + job + hobby + growth + other

      const [value, setValue] = useState(name)
      const ref = useRef<HTMLInputElement>(null!)

      const color =
        total <= 95
          ? palette.text
          : total <= 100
          ? palette.warning.tone(!isDark)
          : palette.danger.tone(!isDark)

      const classes = useStyles({ color })

      return (
        <Grid
          templateColumns="[start check] 22px 1fr [key] 100px 1fr [init] 30px 1fr [job] 30px 1fr [hobby] 30px 1fr [growth] 30px 1fr [other] 30px 1fr [total] 30px 1fr [end]"
          templateRows={`[${name}] 22px`}
          alignItems="center"
          style={{ width }}
        >
          <Grid.Item column="check" row={name}>
            <input
              type="checkbox"
              disabled={locked}
              style={{ margin: '4px 5px 5px 4px' }}
            />
          </Grid.Item>
          <Grid.Item column="key" row={name}>
            <Input
              ref={ref}
              defaultValue={name}
              placeholder="技能を削除"
              disabled={locked}
              className={classes.name}
              onKeyDown={({ key }) => {
                if (key === 'Enter' && value === '') {
                  ref.current.blur()
                }
              }}
              onBlur={({ target: { value: name } }) => {
                if (name === '') {
                  onDelete(index)
                } else {
                  onUpdate(index, { name })
                  setValue(name)
                }
              }}
            />
          </Grid.Item>
          <Grid.Item column="init" row={name} className={classes.init}>
            1
          </Grid.Item>
          <Grid.Item column="job" row={name} className={classes.cell}>
            <NumberInput
              placeholder="職業"
              defaultValue={job !== 0 ? job : ''}
              disabled={locked}
              onChange={({ target: { value: job } }) =>
                onUpdate(index, { job: asNumber(job) })
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
                onUpdate(index, { hobby: asNumber(hobby) })
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
                onUpdate(index, { growth: asNumber(growth) })
              }
            />
          </Grid.Item>
          <Grid.Item column="other" row={name} className={classes.cell}>
            <NumberInput
              placeholder="他"
              defaultValue={other !== 0 ? other : ''}
              disabled={locked}
              onChange={({ target: { value: other } }) =>
                onUpdate(index, { other: asNumber(other) })
              }
            />
          </Grid.Item>
          <Grid.Item column="total" row={name} className={classes.total}>
            {total}
          </Grid.Item>
        </Grid>
      )
    },
    compare
  ),
  { displayName: 'CustomRow' }
)
