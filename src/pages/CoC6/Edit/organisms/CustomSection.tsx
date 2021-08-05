import { CSSProperties, FocusEvent, Fragment, useContext, useRef } from 'react'

import { Grid } from '@/atoms/Grid'
import { Input } from '@/atoms/Input'
import { AppContext } from '@/context/AppContext'
import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'
import { useTranslator } from '@/hooks/useTranslator'
import { Custom } from '@/models/CoC6/Character'
import { Merger } from '@/utils/merge'

import { CustomRow } from './CustomRow'

export const useStyles = createThemeUseStyles(({ palette, isDark }) => ({
  divider: {
    boxSizing: 'border-box',
    padding: '2px 10px',
    backgroundColor: palette.secondary.tone(isDark),
    color: palette.secondary.contrast,
    fontSize: '12px',
    fontWeight: 'bold',
  },
  create: {
    width: '100px',
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
}))

export type CustomSectionProps = {
  custom: Custom[]
  width: CSSProperties['width']
  locked: boolean
  onCreate: (name: string) => void
  onUpdate: (index: number, diff: Merger<Custom>) => void
  onDelete: (index: number) => void
  onFocus: (event: FocusEvent<HTMLInputElement>) => void
  onBlur: (evnet: FocusEvent<HTMLInputElement>) => void
}

export const CustomSection = Object.assign(
  ({
    custom,
    width,
    locked,
    onCreate,
    onUpdate,
    onDelete,
    onFocus,
    onBlur,
  }: CustomSectionProps) => {
    const { lang } = useContext(AppContext)
    const translator = useTranslator()

    const ref = useRef<HTMLInputElement>(null!)

    const theme = useTheme()
    const classes = useStyles({ theme })

    return (
      <Fragment>
        <div className={classes.divider} style={{ width }}>
          {translator.t('custom', lang)}
        </div>

        {custom.map((skill, index) => (
          <CustomRow
            key={skill.name}
            index={index}
            skill={skill}
            width={width}
            locked={locked}
            theme={theme}
            lang={lang}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        ))}

        <Grid
          templateColumns="22px 1fr [key] 100px 1fr 30px 1fr 30px 1fr 30px 1fr 30px 1fr 30px 1fr 30px 1fr"
          templateRows={`22px`}
          alignItems="center"
          style={{ width }}
        >
          <Grid.Item column="key">
            <Input
              ref={ref}
              placeholder="新規技能"
              className={classes.create}
              onKeyDown={({ key }) => {
                if (key === 'Enter') {
                  ref.current.blur()
                }
              }}
              onBlur={({ target: { value: name } }) => {
                if (name !== '') {
                  onCreate(name)
                  ref.current.value = ''
                }
              }}
            />
          </Grid.Item>
        </Grid>
      </Fragment>
    )
  },
  { displayName: 'CustomSection' }
)
