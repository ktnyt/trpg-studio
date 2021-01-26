import { Fragment, useContext, useEffect, useReducer, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'

import clsx from 'clsx'

import {
  faAngleLeft,
  faAngleRight,
  faMoon,
  faSpinner,
  faSyncAlt,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'

import { ButtonSet } from '@/components/atoms/ButtonSet'
import { Die } from '@/components/atoms/Die'
import { Flex } from '@/components/atoms/Flex'
import { Grid } from '@/components/atoms/Grid'
import { IconButton } from '@/components/atoms/IconButton'
import { InputGroup } from '@/components/atoms/InputGroup'
import { AppContext } from '@/context/AppContext'
import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'
import { useFirebase } from '@/hooks/useFirebase'
import { useTranslator } from '@/hooks/useTranslator'
import { useWindowSize } from '@/hooks/useWindowSize'

import { createState } from './state'
import './styles.css'

import { system, useRule } from '../rule'

const shift = (s: string, separator: string): [string, string] => {
  const [head, ...tail] = s.split(separator)
  return [head, tail.join()]
}

const useStyles = createThemeUseStyles(({ palette, isDark }) => ({
  container: {
    boxShadow: `0px 0px 10px 0px ${palette.step1000}44`,
    backgroundColor: palette.background,
  },
  heading: {
    width: '100%',
    margin: '14px 0px',
    color: palette.text,
    fontSize: '21px',
    fontWeight: 'bold',
    lineHeight: '21px',
    textAlign: 'center',
  },
  gridRoot: {
    color: palette.text,
    fontSize: '14px',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: '14px',
  },
  headerRow: {
    backgroundColor: palette.primary.tone(isDark),
  },
  headerCell: {
    margin: '4px 10px',
    color: palette.primary.contrast,
    fontSize: '12px',
    fontWeight: 'bold',
  },
  parametersGrid: {
    '& :nth-child(8n+6)': { margin: '16px 10px' },
    '& :nth-child(8n+7)': { margin: '7px 0px' },
    '& :nth-child(8n+8), :nth-child(8n+9), :nth-child(8n+10)': {
      margin: '16px 0px',
    },
    '& :nth-child(8n+11)': {
      margin: '16px 0px',
      fontWeight: 'bold',
    },
    '& :nth-child(8n+12)': { margin: '5px' },
    '& :nth-child(8n+13)': { borderBottom: `1px solid ${palette.step50}` },
  },
  attributesGrid: {
    '& :nth-child(5n+4)': { margin: '16px 10px' },
    '& :nth-child(5n+5), :nth-child(5n+6)': { margin: '16px 0px' },
    '& :nth-child(5n+7)': { margin: '16px 0px', fontWeight: 'bold' },
    '& :nth-child(5n+8)': { borderBottom: `1px solid ${palette.step50}` },
  },
  toolbar: {
    margin: '5px',
  },
  fixToolbar: {
    position: 'fixed',
    right: '0px',
    bottom: '0px',
  },
}))

export const Create = () => {
  useEffect(() => {
    document.title = 'TRPG Studio | CoC 6'
  }, [])

  const { url } = useRouteMatch()
  const history = useHistory()

  const { lang } = useContext(AppContext)
  const translator = useTranslator()
  const rule = useRule(translator)
  const config = rule.parameters.map(({ dice }) => dice)

  const { reducer, initialState, actions } = createState(config, 5, 15)
  const [{ pages, index }, dispatch] = useReducer(reducer, initialState)

  const current = pages[index]
  const initialized = pages.length > 1
  const newest = index < 1
  const oldest = index > pages.length - 3

  const rolling = (arg?: string) =>
    current
      .map((dice) => dice.filter(({ flip }) => flip > 0).length > 0)
      .filter((flag, key) => (!arg || arg === key ? flag : false)).size > 0

  useEffect(() => {
    if (rolling()) {
      const timeout = setTimeout(() => dispatch(actions.animate()), 100)
      return () => clearTimeout(timeout)
    }
  })

  const parameterCount = rule.parameters.size
  const attributeCount = rule.attributes.size + rule.properties.size

  const { functions } = useFirebase()
  const [creating, setCreating] = useState(false)

  const handleCreate = () => {
    const parameterValues = rule.parameters.map(({ apply }, key) =>
      apply(current.get(key).map(({ face }) => face))
    )

    const parameters = parameterValues
      .map((value) => ({
        value,
        tmp: 0,
        other: 0,
      }))
      .asObject()

    const skillset = rule.skillset
      .map((skills) =>
        skills
          .map(({ fixed }) => ({
            job: 0,
            hobby: 0,
            growth: 0,
            other: 0,
            fixed,
          }))
          .asObject()
      )
      .asObject()

    const profile = {
      name: '',
      items: rule.profile
        .map(({ deps, convert }) =>
          convert(deps.map((dep) => parameterValues.get(dep)))
        )
        .asObject(),
      notes: '',
    }

    const character = {
      profile,
      parameters,
      skillset,
    }

    console.log(url)

    functions
      .invoke('addCharacter', { system, character })
      .then((id) => history.push(`${url}${id}`))

    setCreating(true)
  }

  const { width, height } = useWindowSize()
  const willFit =
    width >= 686 && height > Math.max(parameterCount, attributeCount) * 46 + 71
  const columnWidth = width < 640 ? width : !willFit ? width / 2 : 320

  const theme = useTheme()
  const { palette, toggle } = theme
  const {
    container,
    heading,
    gridRoot,
    headerCell,
    headerRow,
    parametersGrid,
    attributesGrid,
    toolbar,
    fixToolbar,
  } = useStyles(theme)

  const boxShadow = `0px 0px 5px 0px ${palette.step1000}44`

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      style={{ minWidth: width, minHeight: height }}
    >
      <Flex style={{ width: willFit ? 686 : width }}>
        <Flex wrap="wrap" className={container}>
          <div className={heading}>クトゥルフ神話TRPG：第6版</div>

          <Grid
            templateColumns="[key] 54px 1fr [dice] 100px 1fr [lhs] 60px [rhs] 20px [eq] 10px [value] 20px [eqend] 1fr [reroll] 46px [end]"
            templateRows={`[header] 22px repeat(${parameterCount}, [row] 46px)`}
            className={clsx(gridRoot, parametersGrid)}
            style={{ width: Math.ceil(columnWidth) }}
          >
            <Grid.Item area="header/key/header/end" className={headerRow} />

            <Grid.Item row="header" column="key" className={headerCell}>
              {translator.t('item', lang)}
            </Grid.Item>
            <Grid.Item row="header" column="dice" className={headerCell}>
              {translator.t('dice', lang)}
            </Grid.Item>
            <Grid.Item row="header" column="lhs/eqend" className={headerCell}>
              {translator.t('value', lang)}
            </Grid.Item>
            <Grid.Item row="header" column="reroll" className={headerCell} />

            {rule.parameters
              .map(({ apply }, key, index) => {
                const dice = current.get(key)
                const faces = dice.map(({ face }) => face)
                const texts = faces.map((face) =>
                  initialized ? `${face}` : '?'
                )

                const value = initialized ? apply(faces) : '?'
                const equation = apply(texts)

                const [lhs, rhs] = shift(equation, '\u{200B}')

                const row = `row ${index + 1}`

                return (
                  <Fragment key={key}>
                    <Grid.Item row={row} column="key">
                      {translator.t(key, lang)}
                    </Grid.Item>

                    <Grid.Item row={row} column="dice">
                      <Flex
                        justifyContent="space-between"
                        style={{ width: dice.length * 34 - 2, height: 32 }}
                      >
                        {dice.map(({ face, sides }, index) => (
                          <Die
                            key={index}
                            face={face}
                            sides={sides}
                            size={32}
                          />
                        ))}
                      </Flex>
                    </Grid.Item>

                    <Grid.Item row={row} column="lhs" justifySelf="right">
                      {lhs}
                    </Grid.Item>
                    <Grid.Item row={row} column="rhs" justifySelf="left">
                      {rhs}
                    </Grid.Item>
                    <Grid.Item row={row} column="eq" justifySelf="center">
                      =
                    </Grid.Item>
                    <Grid.Item row={row} column="value" justifySelf="right">
                      {value}
                    </Grid.Item>

                    <Grid.Item row={row} column="reroll">
                      <IconButton
                        icon={rolling(key) || creating ? faSpinner : faSyncAlt}
                        pulse={rolling(key) || creating}
                        disabled={rolling() || creating || !initialized}
                        onClick={() => dispatch(actions.reroll(key))}
                      />
                    </Grid.Item>

                    {index + 1 < parameterCount && (
                      <Grid.Item area={`${row}/key/${row}/end`} />
                    )}
                  </Fragment>
                )
              })
              .values()}
          </Grid>

          <Grid
            templateColumns="[key] 160px 1fr [lhs] 90px [eq] 10px [value] 40px 10px [end]"
            templateRows={`[header] 22px repeat(${attributeCount},[row] 46px)`}
            className={clsx(gridRoot, attributesGrid)}
            style={{ width: Math.floor(columnWidth) }}
          >
            <Grid.Item area="header/key/header/end" className={headerRow} />

            <Grid.Item row="header" column="key" className={headerCell}>
              {translator.t('item', lang)}
            </Grid.Item>
            <Grid.Item row="header" column="lhs/value" className={headerCell}>
              {translator.t('value', lang)}
            </Grid.Item>

            {rule.attributes
              .map(({ deps, apply }, key, index) => {
                const values = deps.map((dep) => {
                  const apply = rule.parameters.get(dep).apply
                  const faces = current.get(dep).map(({ face }) => face)
                  return apply(faces)
                })
                const texts = deps.map((dep) => translator.t(dep, lang))

                const value = initialized ? apply(values) : '?'
                const text = apply(texts)

                const row = `row ${index + 1}`

                return (
                  <Fragment key={key}>
                    <Grid.Item row={row} column="key">
                      {translator.t(key, lang)}
                    </Grid.Item>

                    <Grid.Item row={row} column="lhs" justifySelf="right">
                      {text}
                    </Grid.Item>
                    <Grid.Item row={row} column="eq" justifySelf="center">
                      =
                    </Grid.Item>
                    <Grid.Item row={row} column="value" justifySelf="right">
                      {value}
                    </Grid.Item>

                    {index < rule.attributes.size && (
                      <Grid.Item area={`${row}/key/${row}/end`} />
                    )}
                  </Fragment>
                )
              })
              .values()}

            {rule.properties
              .map(({ deps, convert }, key, index) => {
                const values = deps.map((dep) => {
                  const apply = rule.parameters.get(dep).apply
                  const faces = current.get(dep).map(({ face }) => face)
                  return apply(faces)
                })
                const texts = deps.map((dep) => translator.t(dep, lang))

                const text = texts.join(' | ')
                const value = initialized ? convert(values) : '?'

                const row = `row ${rule.attributes.size + index + 1}`

                return (
                  <Fragment key={key}>
                    <Grid.Item row={row} column="key">
                      {translator.t(key, lang)}
                    </Grid.Item>

                    <Grid.Item row={row} column="lhs" justifySelf="right">
                      {text}
                    </Grid.Item>
                    <Grid.Item row={row} column="eq" justifySelf="center">
                      =
                    </Grid.Item>
                    <Grid.Item row={row} column="value" justifySelf="right">
                      {value}
                    </Grid.Item>

                    {index < rule.properties.size && (
                      <Grid.Item area={`${row}/key/${row}/end`} />
                    )}
                  </Fragment>
                )
              })
              .values()}
          </Grid>

          {willFit || <div style={{ width, height: '46px' }}></div>}
        </Flex>
        <Flex.Item className={clsx(willFit || fixToolbar)}>
          <ButtonSet vertical={willFit} className={toolbar}>
            <IconButton icon={faMoon} onClick={toggle} style={{ boxShadow }} />

            <InputGroup style={{ boxShadow }} vertical={willFit}>
              <IconButton
                icon={faAngleLeft}
                disabled={rolling() || creating || oldest}
                onClick={() => dispatch(actions.older())}
              />
              <IconButton
                icon={faAngleRight}
                disabled={rolling() || creating || newest}
                onClick={() => dispatch(actions.newer())}
              />
            </InputGroup>

            <IconButton
              icon={faUserPlus}
              disabled={rolling() || creating}
              onClick={() => handleCreate()}
              style={{ boxShadow }}
            />
            <IconButton
              icon={rolling() ? faSpinner : faSyncAlt}
              pulse={rolling()}
              disabled={rolling() || creating}
              onClick={() => dispatch(actions.reroll())}
              style={{ boxShadow }}
            />
          </ButtonSet>
        </Flex.Item>
      </Flex>
    </Flex>
  )
}
