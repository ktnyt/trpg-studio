import { CSSProperties, Fragment, memo } from 'react'

import deepEqual from 'deep-equal'

import Flex from '@/components/atoms/Flex'
import Grid from '@/components/atoms/Grid'
import { createThemeUseStyles } from '@/context/ThemeContext'
import { Parameter, Parameters } from '@/models/Character'
import math from '@/utils/math'
import { Merger } from '@/utils/merge'

import NumberInput from './NumberInput'

import { Context, contextEqual } from '../Context'

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
}))

export type ParametersSectionProps = {
  parameters: Parameters
  width: CSSProperties['width']
  context: Context
  onUpdate: (key: string, parameter: Merger<Parameter>) => void
}

const compare = (prev: ParametersSectionProps, next: ParametersSectionProps) =>
  deepEqual(prev.parameters, next.parameters) &&
  prev.width === next.width &&
  contextEqual(prev.context, next.context)

const asDefault = (n: number) => (n > 0 ? `${n}` : '')
const asNumber = (s: string) => (/^\d+$/.test(s) ? parseInt(s, 10) : 0)

const ParametersSection = Object.assign(
  memo(({ parameters, width, context, onUpdate }: ParametersSectionProps) => {
    const { theme, lang, translator, rule, locked } = context

    const totals = rule.parameters.map((_, key) => {
      const { value, tmp, other } = parameters[key]
      return value + tmp + other
    })

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
            templateColumns="1fr [key] 40px 1fr [value] 40px"
            templateRows={`repeat(${
              rule.attributes.size + rule.properties.size
            }, 22px)`}
            alignItems="center"
          >
            {rule.attributes
              .map(({ deps, apply }, key) => (
                <Fragment key={key}>
                  <Grid.Item column="key">
                    <span>{translator.t(`${key}-abbrev`, lang)}</span>
                  </Grid.Item>
                  <Grid.Item
                    column="value"
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                  >
                    {apply(deps.map((dep) => totals.get(dep)))}
                  </Grid.Item>
                </Fragment>
              ))
              .values()}
            {rule.properties
              .map(({ deps, convert }, key) => (
                <Fragment key={key}>
                  <Grid.Item column="key">
                    {translator.t(`${key}-abbrev`, lang)}
                  </Grid.Item>
                  <Grid.Item
                    column="value"
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
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
  }, compare),
  { displayName: 'ParametersSection' }
)

export default ParametersSection
