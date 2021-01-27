import { CSSProperties, Fragment, useContext } from 'react'

import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

import { Grid } from '@/components/atoms/Grid'
import { IconButton } from '@/components/atoms/IconButton'
import { InputGroup } from '@/components/atoms/InputGroup'
import { AppContext } from '@/context/AppContext'
import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'
import { useTranslator } from '@/hooks/useTranslator'
import { Variables } from '@/models/CoC6/Character'
import { Dict } from '@/utils/dict'
import { Merger } from '@/utils/merge'

import { useRule } from '../../rule'

export type VariableProps = {
  width: CSSProperties['width']
  variables: Variables
  modifiers?: { [k in keyof Variables]: number }
  totals: Dict<string, number>
  locked: boolean
  onUpdate: (diff: Merger<Variables>) => void
}

const useStyles = createThemeUseStyles(({ palette, isDark }) => ({
  divider: {
    padding: '2px 10px',
    backgroundColor: palette.primary.tone(isDark),
    color: palette.primary.contrast,
    fontWeight: 'bold',
    fontSize: '12px',
  },
  variables: {
    margin: '0px 10px',
    color: palette.text,
    fontVariantNumeric: 'tabular-nums',
  },
  cell: {
    margin: '4px 0px',
    fontSize: '14px',
    lineHeight: '14px',
  },
  value: {
    margin: '2px 5px',
  },
  number: {
    display: 'inline-block',
    boxSizing: 'border-box',
    margin: '0px 5px',
    width: '20px',
    textAlign: 'right',
  },
  slash: {
    display: 'inline-block',
    width: '5px',
    textAlign: 'center',
  },
}))

export const VariableSection = ({
  width,
  variables,
  modifiers = {},
  totals,
  locked,
  onUpdate,
}: VariableProps) => {
  const { lang } = useContext(AppContext)
  const translator = useTranslator()
  const rule = useRule(translator)

  const templateRows = rule.variables
    .keys()
    .map((key) => `[${key}] 22px`)
    .join(' ')

  const theme = useTheme()
  const styles = useStyles(theme)

  return (
    <Fragment>
      <div className={styles.divider}>ステータス</div>
      <Grid
        templateColumns="[key] 1fr [value] 111px [end]"
        templateRows={templateRows}
        className={styles.variables}
      >
        {rule.variables
          .map((capped, key) => {
            const { deps, apply } = rule.attributes.get(key)
            const modifier = key in modifiers ? modifiers[key] : 0
            const max =
              (capped === null
                ? apply(deps.map((dep) => totals.get(dep)))
                : capped) + modifier
            const value = variables[key]
            return (
              <Fragment key={key}>
                <Grid.Item column="key" row={key} className={styles.cell}>
                  {translator.t(key, lang)}
                </Grid.Item>
                <Grid.Item column="value" row={key} className={styles.value}>
                  <InputGroup size="sm">
                    <IconButton
                      icon={faMinus}
                      size="sm"
                      disabled={locked || value <= 0}
                      onClick={() =>
                        onUpdate(({ [key]: value }) => ({
                          [key]: value - 1,
                        }))
                      }
                    />
                    <span className={styles.number}>{value}</span>
                    <span className={styles.slash}>/</span>
                    <span className={styles.number}>{max}</span>
                    <IconButton
                      icon={faPlus}
                      size="sm"
                      disabled={locked || max <= value}
                      onClick={() =>
                        onUpdate(({ [key]: value }) => ({
                          [key]: value + 1,
                        }))
                      }
                    />
                  </InputGroup>
                </Grid.Item>
              </Fragment>
            )
          })
          .values()}
      </Grid>
    </Fragment>
  )
}
