import { CSSProperties, Fragment, useContext } from 'react'

import clsx from 'clsx'

import { Flex } from '@/atoms/Flex'
import { Grid } from '@/atoms/Grid'
import { AppContext } from '@/context/AppContext'
import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'
import { useTranslator } from '@/hooks/useTranslator'
import { Parameter, Parameters } from '@/models/CoC6/Character'
import * as math from '@/utils/math'
import { Merger } from '@/utils/merge'

import { NumberInput } from './NumberInput'

import { useRule } from '../../rule'

const useStyles = createThemeUseStyles(({ palette, isDark }) => ({
  divider: {
    padding: '2px 10px',
    backgroundColor: palette.primary.tone(isDark),
    color: palette.primary.contrast,
    fontWeight: 'bold',
    fontSize: '12px',
  },
  parameters: {
    margin: '0px 10px',
    color: palette.text,
    fontVariantNumeric: 'tabular-nums',
  },
  value: {
    margin: '0px 5px',
    textAlign: 'right',
  },
  cell: {
    textAlign: 'right',
  },
  total: {
    margin: '0px 5px',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  danger: {
    color: palette.danger.tone(!isDark),
  },
}))

export type ParametersSectionProps = {
  parameters: Parameters
  modifiers?: { [k in keyof Parameters]: number }
  width: CSSProperties['width']
  locked: boolean
  onUpdate: (key: string, parameter: Merger<Parameter>) => void
}

const asDefault = (n: number) => (n !== 0 ? `${n}` : '')
const asNumber = (s: string) => (/^-?\d+$/.test(s) ? parseInt(s, 10) : 0)

export const ParametersSection = Object.assign(
  ({
    parameters,
    modifiers = {},
    width,
    locked,
    onUpdate,
  }: ParametersSectionProps) => {
    const { lang } = useContext(AppContext)
    const translator = useTranslator()
    const rule = useRule(translator)

    const totals = rule.parameters.map((_, key) => {
      const { value, tmp, other } = parameters[key]
      return value + tmp + other
    })

    const attributeTemplateRows = [
      ...rule.attributes.keys(),
      ...rule.properties.keys(),
    ]
      .map((key) => `[${key}] 22px`)
      .join(' ')

    const theme = useTheme()
    const styles = useStyles(theme)

    return (
      <Flex direction="column" style={{ width }}>
        <div className={styles.divider}>{translator.t('parameters', lang)}</div>
        <Grid templateColumns="2fr 1fr" className={styles.parameters}>
          <Grid
            templateColumns="[key] 50px 1fr [value] 30px 1fr [tmp] 30px 1fr [other] 30px 1fr [total] 30px 1fr"
            templateRows={`repeat(${rule.parameters.size}, 22px)`}
            alignItems="center"
          >
            {rule.parameters.keys().map((key) => {
              const { value, tmp, other } = parameters[key]
              return (
                <Fragment key={key}>
                  <Grid.Item column="key">{translator.t(key, lang)}</Grid.Item>
                  <Grid.Item column="value" className={styles.value}>
                    <NumberInput
                      placeholder="初期"
                      defaultValue={asDefault(value)}
                      min={rule.parameters.get(key).dice.length}
                      max={math.sum(rule.parameters.get(key).dice)}
                      disabled={locked}
                      onChange={({ target: { value } }) =>
                        onUpdate(key, { value: asNumber(value) })
                      }
                    />
                  </Grid.Item>
                  <Grid.Item column="tmp" className={styles.cell}>
                    <NumberInput
                      placeholder="一時"
                      defaultValue={asDefault(tmp)}
                      disabled={locked}
                      onChange={({ target: { value } }) =>
                        onUpdate(key, { tmp: asNumber(value) })
                      }
                    />
                  </Grid.Item>
                  <Grid.Item column="other" className={styles.cell}>
                    <NumberInput
                      placeholder="増減"
                      defaultValue={asDefault(other)}
                      disabled={locked}
                      onChange={({ target: { value } }) =>
                        onUpdate(key, { other: asNumber(value) })
                      }
                    />
                  </Grid.Item>
                  <Grid.Item column="total" className={styles.total}>
                    {totals.get(key)}
                  </Grid.Item>
                </Fragment>
              )
            })}
          </Grid>

          <Grid
            templateColumns="[start] 1fr [key] 40px 1fr [value] 40px [end]"
            templateRows={attributeTemplateRows}
            alignItems="center"
          >
            {rule.attributes
              .map(({ deps, apply }, key) => {
                const value =
                  apply(deps.map((dep) => totals.get(dep))) +
                  (key in modifiers ? modifiers[key] : 0)
                const className = clsx(value < 0 && styles.danger)
                return (
                  <Fragment key={key}>
                    <Grid.Item column="key" row={key} className={className}>
                      <span>{translator.t(`${key}-abbrev`, lang)}</span>
                    </Grid.Item>
                    <Grid.Item
                      column="value"
                      row={key}
                      className={className}
                      style={{ fontWeight: 'bold', textAlign: 'right' }}
                    >
                      {value}
                    </Grid.Item>
                  </Fragment>
                )
              })
              .values()}
            {rule.properties
              .map(({ deps, convert }, key) => (
                <Fragment key={key}>
                  <Grid.Item column="key" row={key}>
                    {translator.t(`${key}-abbrev`, lang)}
                  </Grid.Item>
                  <Grid.Item
                    column="value"
                    row={key}
                    style={{ fontWeight: 'bold', textAlign: 'right' }}
                  >
                    {convert(deps.map((dep) => totals.get(dep)))}
                  </Grid.Item>
                </Fragment>
              ))
              .values()}
          </Grid>
        </Grid>
      </Flex>
    )
  },
  { displayName: 'ParametersSection' }
)
