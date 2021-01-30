import { useContext, useEffect, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactModal from 'react-modal'
import { useParams } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import clsx from 'clsx'

import {
  faCopy,
  faEye,
  faEyeSlash,
  faKey,
  faLink,
  faLock,
  faLockOpen,
  faMoon,
  faPalette,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons'

import { ButtonSet } from '@/components/atoms/ButtonSet'
import { Flex } from '@/components/atoms/Flex'
import { Grid } from '@/components/atoms/Grid'
import { IconButton } from '@/components/atoms/IconButton'
import { InputGroup } from '@/components/atoms/InputGroup'
import { Prompt } from '@/components/atoms/Prompt'
import { Snackbar } from '@/components/atoms/Snackbar'
import { AppContext } from '@/context/AppContext'
import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'
import { useDebounce } from '@/hooks/useDebounce'
import { useDifferent } from '@/hooks/useDifferent'
import { useElementSize } from '@/hooks/useElementSize'
import { useFirebase } from '@/hooks/useFirebase'
import { useReferrer } from '@/hooks/useReferrer'
import { useTranslator } from '@/hooks/useTranslator'
import { useWindowSize } from '@/hooks/useWindowSize'
import {
  Character,
  Custom,
  Parameter,
  Profile,
  Skill,
  Variables,
} from '@/models/CoC6/Character'
import * as math from '@/utils/math'
import { merge, Merger, merger } from '@/utils/merge'
import { POD } from '@/utils/types'

import { CustomSection } from './CustomSection'
import { ParametersSection } from './ParametersSection'
import { ProfileSection } from './ProfileSection'
import { SkillsetSection } from './SkillsetSection'
import { VariableSection } from './VariableSection'

import '../styles.css'

import { system, useRule } from '../../rule'

ReactModal.setAppElement('#root')

const useStyles = createThemeUseStyles(({ palette }) => ({
  overlay: {
    position: 'fixed',
    top: '0px',
    left: '0px',
    bottom: '0px',
    right: '0px',
    backgroundColor: `${palette.background}bb`,
  },
  modal: { overflow: 'hidden auto', outline: 'none' },
  palette: {
    boxSizing: 'border-box',
    width: '100%',
    padding: '5px',
    border: `1px solid ${palette.step100}`,
    backgroundColor: palette.step50,
    color: palette.text,
    resize: 'none',
    '&::placeholder': { color: palette.step300, transition: 'color 100ms' },
    '&:focus': {
      outline: 'none',
      '&::placeholder': { color: 'transparent' },
    },
  },
}))

type Access = 'locked' | 'unlocked' | 'public'
type Modal = 'none' | 'password' | 'palette'
type Copied = 'none' | 'link' | 'palette'
type State = { access: Access; modal: Modal; copied: Copied; token: string }

const initialize = (secured: boolean): State => ({
  access: secured ? 'locked' : 'public',
  modal: 'none',
  copied: 'none',
  token: '',
})

export const Editor = ({
  init,
  secured,
}: {
  init: Character
  secured: boolean
}) => {
  const { lang } = useContext(AppContext)
  const translator = useTranslator()
  const rule = useRule(translator)

  const initialState = initialize(secured)
  const [{ access, modal, copied, token }, setState] = useState(initialState)
  const patchState = (diff: Merger<State>) => setState(merger(diff))

  useEffect(() => {
    if (copied !== 'none') {
      const timeout = setTimeout(() => patchState({ copied: 'none' }), 1200)
      return () => clearTimeout(timeout)
    }
  })

  const [showall, setShowall] = useState(true)
  const [focus, setFocus] = useState(false)

  const { functions } = useFirebase()
  const { id } = useParams<{ id: string }>()
  const referrer = useReferrer()

  const data = (patch: POD) => ({ system, id, referrer, token, patch })

  const [profile, setProfile] = useState(init.profile)
  const updateProfile = (diff: Merger<Profile>) => setProfile(merger(diff))
  const debouncedProfile = useDebounce(profile)
  const differentProfile = useDifferent(debouncedProfile)

  useEffect(() => {
    if (differentProfile) {
      const patch = { profile: debouncedProfile }
      functions.invoke('updateCharacter', data(patch))
    }
  })

  useEffect(() => {
    const name = profile.name === '' ? '名状し難い探索者' : profile.name
    document.title = `${name} | CoC 6 | TRPG Studio`
  }, [profile])

  const [parameters, setParameters] = useState(init.parameters)
  const updateParameter = (key: string, diff: Merger<Parameter>) =>
    setParameters(({ [key]: parameter, ...parameters }) => ({
      ...parameters,
      [key]: merge(parameter, diff),
    }))
  const debouncedParameters = useDebounce(parameters)
  const differentParameters = useDifferent(debouncedParameters)

  useEffect(() => {
    if (differentParameters) {
      const patch = { parameters: debouncedParameters }
      functions.invoke('updateCharacter', data(patch))
    }
  })

  const totals = rule.parameters.map((_, key) => {
    const { value, tmp, other } = parameters[key]
    return value + tmp + other
  })

  const [variables, setVariables] = useState(init.variables)
  const updateVariable = (diff: Merger<Variables>) => setVariables(merger(diff))
  const debouncedVariables = useDebounce(variables)
  const differentVariables = useDifferent(debouncedVariables)

  useEffect(() => {
    if (differentVariables) {
      const patch = { variables: debouncedVariables }
      functions.invoke('updateCharacter', data(patch))
    }
  })

  const [skillset, setSkillset] = useState(init.skillset)
  const updateSkill = (category: string, key: string, diff: Merger<Skill>) =>
    setSkillset(({ [category]: { [key]: skill, ...skills }, ...skillset }) => ({
      ...skillset,
      [category]: {
        ...skills,
        [key]: merge(skill, diff),
      },
    }))
  const debouncedSkillset = useDebounce(skillset)
  const differentSkillset = useDifferent(debouncedSkillset)

  useEffect(() => {
    if (differentSkillset) {
      const patch = { skillset: debouncedSkillset }
      functions.invoke('updateCharacter', data(patch))
    }
  })

  const [custom, setCustom] = useState(init.custom)
  const createCustom = (name: string) =>
    setCustom((custom) => [
      ...custom,
      { name, job: 0, hobby: 0, growth: 0, other: 0 },
    ])
  const updateCustom = (index: number, diff: Merger<Custom>) =>
    setCustom((custom) => [
      ...custom.slice(0, index),
      merge(custom[index], diff),
      ...custom.slice(index + 1),
    ])
  const deleteCustom = (index: number) =>
    setCustom((custom) => [
      ...custom.slice(0, index),
      ...custom.slice(index + 1),
    ])
  const debouncedCustom = useDebounce(custom)
  const differentCustom = useDifferent(debouncedCustom)

  useEffect(() => {
    if (differentCustom) {
      const patch = { custom: debouncedCustom }
      functions.invoke('updateCharacter', data(patch))
    }
  })

  const jobpts = (({ deps, apply }) =>
    apply(deps.map((dep) => totals.get(dep))))(rule.attributes.get('jobpts'))

  const hbypts = (({ deps, apply }) =>
    apply(deps.map((dep) => totals.get(dep))))(rule.attributes.get('hbypts'))

  const jobSpent =
    math.sum(
      Object.values(skillset)
        .map((category) => Object.values(category))
        .flat()
        .map(({ job }) => job)
    ) + math.sum(custom.map(({ job }) => job))

  const hbySpent =
    math.sum(
      Object.values(skillset)
        .map((category) => Object.values(category))
        .flat()
        .map(({ hobby }) => hobby)
    ) + math.sum(custom.map(({ hobby }) => hobby))

  const jobRemain = jobpts - jobSpent
  const hbyRemain = hbypts - hbySpent

  const parameterModifiers = {
    jobpts: -jobSpent,
    hbypts: -hbySpent,
  }

  const cthulhu = math.sum(
    Object.values(skillset['knowledge']['cthulhu']).map((value) =>
      typeof value === 'number' ? value : 0
    )
  )
  const variableModifiers = { san: -cthulhu }

  const unlock = async (password: string) =>
    functions
      .invoke('verifyPassword', { system, id, referrer, password })
      .then((token) => patchState({ access: 'unlocked', modal: 'none', token }))
      .catch(() => window.alert('パスワードが間違っています。'))

  const secure = (password: string) =>
    functions
      .invoke('setPassword', { system, id, referrer, token, password })
      .then((token) =>
        patchState(({ access }) => ({
          access: access === 'public' ? 'unlocked' : 'locked',
          modal: 'none',
          token,
        }))
      )
      .catch(() => window.alert('パスワードの設定に失敗しました。'))

  const locked = access === 'locked'
  const unlocked = access === 'unlocked'

  const nodeRef = useRef<HTMLDivElement>(null!)
  const linkRef = useRef<HTMLButtonElement>(null!)
  const paletteRef = useRef<HTMLButtonElement>(null!)
  const profileRef = useRef<HTMLDivElement>(null!)
  const notesRef = useRef<HTMLTextAreaElement>(null!)

  const skillVisibility = rule.skillset.map((skills, category) =>
    skills.map((_, key) => {
      const { job, hobby, growth, other, fixed } = skillset[category][key]
      return showall || fixed || job + hobby + growth + other > 0
    })
  )

  const categoryVisibility = skillVisibility.map(
    (visibilities) => visibilities.filter((visible) => visible).size > 0
  )

  const parameterPalette = rule.parameters
    .entries()
    .filter(([_, { palette }]) => palette)
    .map(
      ([key]) => `CCB<=(${totals.get(key)}*5) 【${translator.t(key, lang)}】*5`
    )
    .join('\n')

  const attributePalette = `【${translator.t(
    'value',
    lang
  )}】\n${rule.attributes
    .entries()
    .filter(([_, { palette }]) => palette !== false)
    .map(([key, { deps, apply, palette }]) => {
      const value =
        typeof palette === 'string'
          ? `{${palette}}`
          : apply(deps.map((dep) => totals.get(dep)))
      return `CCB<=${value} 【${translator.t(`${key}-abbrev`, lang)}】`
    })
    .join('\n')}`

  const propertyPalette = rule.properties
    .entries()
    .filter(([_, { palette }]) => palette)
    .map(([key, { deps, convert }]) => {
      const value = convert(deps.map((dep) => totals.get(dep)))
      return `${value}【${translator.t(`${key}-abbrev`)}】`
    })
    .join('\n')

  const skillPalette = rule.skillset
    .entries()
    .filter(([category]) => categoryVisibility.get(category))
    .map(([category, skills]) => {
      const categoryPalette = skills
        .entries()
        .filter(([key]) => skillVisibility.get(category).get(key))
        .map(([key, { deps, apply }]) => {
          const { job, hobby, growth, other } = skillset[category][key]
          const init = apply(deps.map((dep) => totals.get(dep)))
          const total = init + job + hobby + growth + other
          return `CCB<=${total} 【${translator.t(key, lang)}】`
        })
        .join('\n')
      return `【${translator.t(category, lang)}】\n${categoryPalette}`
    })
    .join('\n\n')

  const chatPalette = [
    parameterPalette,
    attributePalette,
    propertyPalette,
    skillPalette,
  ].join('\n\n')

  const { width, height } = useWindowSize()

  const theme = useTheme()
  const { palette, toggle } = theme
  const styles = useStyles({ theme })

  const boxShadow = `0px 0px 5px 0px ${palette.step1000}44`

  const { height: profileHeight } = useElementSize(profileRef)
  const notesPadding = 22 - (profileHeight % 22)
  const profileRows = Math.ceil(profileHeight / 22)
  const attributeRows = rule.attributes.size + rule.properties.size
  const parameterRows = Math.max(rule.parameters.size, attributeRows) + 1
  const variableRows = rule.variables.size + 1
  const categoryRows = categoryVisibility.filter((v) => v).size + 1
  const skillsetRows = math.sum(
    skillVisibility.values().map((d) => d.filter((v) => v).size)
  )
  const customRows = custom.length + 2
  const totalRowCount = math.sum(
    profileRows,
    parameterRows,
    variableRows,
    categoryRows,
    skillsetRows,
    customRows
  )

  const minPanelRowCount = profileRows + parameterRows + variableRows

  const computeDims = () => {
    if (width < 640) {
      const panelHeight = totalRowCount * 22 + 46
      const panelWidth = width
      const columnWidth = width
      const fixToolbar = true
      return { columnWidth, panelWidth, panelHeight, fixToolbar }
    }
    if (width < 960) {
      const avgPanelRowCount = totalRowCount / 2
      const rowCount = Math.max(minPanelRowCount, avgPanelRowCount)
      const emptyRowCount = rowCount - (totalRowCount % rowCount)
      const paddingHeight = emptyRowCount < 3 ? 46 : 0
      const panelHeight = rowCount * 22 + paddingHeight
      const panelWidth = width
      const columnWidth = width / 2
      const fixToolbar = true
      return { columnWidth, panelWidth, panelHeight, fixToolbar }
    }
    if (width < 1006) {
      const columnCount = (totalRowCount + 3) / 2 < minPanelRowCount ? 2 : 3
      const avgPanelRowCount = totalRowCount / columnCount
      const rowCount = Math.max(minPanelRowCount, avgPanelRowCount)
      const emptyRowCount = rowCount - (totalRowCount % rowCount)
      const paddingHeight = emptyRowCount < 3 ? 46 : 0
      const panelHeight = rowCount * 22 + paddingHeight
      const panelWidth = width / columnCount
      const columnWidth = width
      const fixToolbar = true
      return { columnWidth, panelWidth, panelHeight, fixToolbar }
    }
    const singleColumn = totalRowCount * 22 <= height
    const doubleColumn = totalRowCount / 2 < minPanelRowCount
    const columnCount = singleColumn ? 1 : doubleColumn ? 2 : 3
    const avgPanelRowCount = totalRowCount / columnCount
    const rowCount = Math.max(minPanelRowCount, avgPanelRowCount)
    const panelHeight = rowCount * 22
    const panelWidth = 320 * columnCount
    const columnWidth = 320
    const fixToolbar = false
    return { columnWidth, panelWidth, panelHeight, fixToolbar }
  }

  const { columnWidth, panelWidth, panelHeight, fixToolbar } = computeDims()

  const showPoints = fixToolbar && focus

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      style={{
        minWidth: width,
        minHeight: height,
      }}
    >
      <CSSTransition
        nodeRef={nodeRef}
        in={true}
        timeout={200}
        classNames="body"
        unmountOnExit
        appear
      >
        <Flex direction="row" ref={nodeRef}>
          <Flex
            direction="column"
            wrap="wrap"
            style={{
              width: panelWidth,
              height: panelHeight,
              backgroundColor: palette.background,
              color: palette.text,
              boxShadow: `0px 0px 10px 0px ${palette.step1000}44`,
            }}
          >
            <ProfileSection
              ref={profileRef}
              profile={profile}
              width={columnWidth}
              notesRef={notesRef}
              locked={locked}
              onUpdate={updateProfile}
            />

            <div
              style={{
                width: columnWidth,
                height: notesPadding,
                backgroundColor: palette.step50,
                cursor: 'text',
              }}
              onClick={() => notesRef.current.focus()}
            />

            <ParametersSection
              parameters={parameters}
              modifiers={parameterModifiers}
              width={columnWidth}
              locked={locked}
              onUpdate={updateParameter}
            />

            <VariableSection
              variables={variables}
              modifiers={variableModifiers}
              totals={totals}
              locked={locked}
              onUpdate={updateVariable}
            />

            <SkillsetSection
              skillset={skillset}
              totals={totals}
              showall={showall}
              width={columnWidth}
              locked={locked}
              onUpdate={updateSkill}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />

            <CustomSection
              custom={custom}
              width={columnWidth}
              locked={locked}
              onCreate={createCustom}
              onUpdate={updateCustom}
              onDelete={deleteCustom}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </Flex>

          <Snackbar visible={copied !== 'none'}>
            {translator.t('copied', lang)}
          </Snackbar>

          <div
            style={fixToolbar ? { position: 'fixed', bottom: 0, right: 0 } : {}}
          >
            {showPoints ? (
              <Grid
                templateColumns="1fr [jobkey] 40px 1fr [jobremain] 30px [jobslash] 5px [jobtotal] 30px 1fr [hbykey] 40px 1fr [hbyremain] 30px [hbyslash] 5px [hbytotal] 30px 1fr"
                style={{
                  boxSizing: 'border-box',
                  width: columnWidth,
                  padding: '10px 0px',
                  backgroundColor: palette.step50,
                  color: palette.text,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <Grid.Item column="jobkey">
                  {translator.t('jobpts-abbrev', lang)}
                </Grid.Item>
                <Grid.Item column="jobremain" style={{ textAlign: 'right' }}>
                  {jobRemain}
                </Grid.Item>
                <Grid.Item column="jobslash" style={{ textAlign: 'center' }}>
                  /
                </Grid.Item>
                <Grid.Item column="jobtotal" style={{ textAlign: 'right' }}>
                  {jobpts}
                </Grid.Item>

                <Grid.Item column="hbykey">
                  {translator.t('hbypts-abbrev', lang)}
                </Grid.Item>
                <Grid.Item column="hbyremain" style={{ textAlign: 'right' }}>
                  {hbyRemain}
                </Grid.Item>
                <Grid.Item column="hbyslash" style={{ textAlign: 'center' }}>
                  /
                </Grid.Item>
                <Grid.Item column="hbytotal" style={{ textAlign: 'right' }}>
                  {hbypts}
                </Grid.Item>
              </Grid>
            ) : (
              <ButtonSet vertical={!fixToolbar} style={{ margin: '5px' }}>
                <IconButton
                  icon={faMoon}
                  onClick={toggle}
                  style={{ boxShadow }}
                />
                <InputGroup vertical={!fixToolbar} style={{ boxShadow }}>
                  <CopyToClipboard
                    text={window.location.href}
                    onCopy={() => patchState({ copied: 'link' })}
                  >
                    <IconButton ref={linkRef} icon={faLink} />
                  </CopyToClipboard>
                  <IconButton
                    ref={paletteRef}
                    icon={faPalette}
                    onClick={() => patchState({ modal: 'palette' })}
                  />
                </InputGroup>
                <IconButton
                  icon={locked ? faLock : unlocked ? faLockOpen : faKey}
                  style={{ boxShadow }}
                  onClick={() => patchState({ modal: 'password' })}
                />
                <IconButton
                  icon={showall ? faEyeSlash : faEye}
                  style={{ boxShadow }}
                  onClick={() => setShowall((flag) => !flag)}
                />
              </ButtonSet>
            )}
          </div>

          <ReactModal
            isOpen={modal !== 'none'}
            onRequestClose={() => patchState({ modal: 'none' })}
            className={clsx(styles.modal, 'center')}
            overlayClassName={styles.overlay}
          >
            {modal === 'password' && (
              <Prompt
                label={translator.t('password', lang)}
                message={
                  locked
                    ? 'このキャラクターはパスワードによって保護されています。'
                    : unlocked
                    ? 'パスワードを変更'
                    : 'パスワードを設定することで第三者による編集から保護することができます。'
                }
                id="password"
                type="password"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                autoFocus
                confirm={translator.t(locked ? 'unlock' : 'confirm', lang)}
                cancel={translator.t('cancel', lang)}
                disableConfirm={(value) => `${value}`.length === 0}
                onConfirm={(value) =>
                  locked ? unlock(`${value}`) : secure(`${value}`)
                }
                onCancel={() => patchState({ modal: 'none' })}
              />
            )}
            {modal === 'palette' && (
              <div
                style={{
                  overflow: 'hidden',
                  width: Math.min(320, width - 20),
                  height: '300px',
                  boxSizing: 'border-box',
                  border: `1px solid ${palette.step100}`,
                  borderRadius: '8px',
                  backgroundColor: palette.background,
                }}
              >
                <textarea
                  value={chatPalette}
                  onFocus={(event) =>
                    event.target.setSelectionRange(0, event.target.value.length)
                  }
                  readOnly
                  className={styles.palette}
                  style={{ height: '244px' }}
                />
                <Flex
                  justifyContent="space-between"
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    boxSizing: 'border-box',
                    width: '100%',
                    padding: '10px',
                  }}
                >
                  <IconButton
                    icon={faWindowClose}
                    style={{ boxShadow }}
                    onClick={() => patchState({ modal: 'none' })}
                  />
                  <ButtonSet>
                    <CopyToClipboard
                      text={chatPalette}
                      onCopy={() =>
                        patchState({ modal: 'none', copied: 'palette' })
                      }
                    >
                      <IconButton icon={faCopy} style={{ boxShadow }} />
                    </CopyToClipboard>
                    <IconButton
                      icon={showall ? faEyeSlash : faEye}
                      style={{ boxShadow }}
                      onClick={() => setShowall((flag) => !flag)}
                    />
                  </ButtonSet>
                </Flex>
              </div>
            )}
          </ReactModal>
        </Flex>
      </CSSTransition>
    </Flex>
  )
}
