import { useContext, useEffect, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactModal from 'react-modal'
import { useParams } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import clsx from 'clsx'

import { faCopy } from '@fortawesome/free-regular-svg-icons'
import {
  faEye,
  faEyeSlash,
  faGlobe,
  faLink,
  faLock,
  faLockOpen,
  faMoon,
  faPalette,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons'

import { ButtonSet } from '@/components/atoms/ButtonSet'
import { Flex } from '@/components/atoms/Flex'
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
import { Character, Parameter, Profile, Skill } from '@/models/CoC6/Character'
import * as math from '@/utils/math'
import { merge, Merger, merger } from '@/utils/merge'

import { ParametersSection } from './ParametersSection'
import { ProfileSection } from './ProfileSection'
import { SkillsetSection } from './SkillsetSection'

import '../styles.css'

import { useRule } from '../../rule'

ReactModal.setAppElement('#root')

const useStyles = createThemeUseStyles(({ palette, isDark }) => ({
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

  const { functions } = useFirebase()
  const { id } = useParams<{ id: string }>()
  const referrer = useReferrer()

  const [profile, setProfile] = useState(init.profile)
  const updateProfile = (diff: Merger<Profile>) => setProfile(merger(diff))
  const debouncedProfile = useDebounce(profile)
  const differentProfile = useDifferent(debouncedProfile)

  useEffect(() => {
    if (differentProfile) {
      const patch = { profile: debouncedProfile }
      functions.invoke('updateCharacter', { id, referrer, token, patch })
    }
  })

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
      functions.invoke('updateCharacter', { id, referrer, token, patch })
    }
  })

  const totals = rule.parameters.map((_, key) => {
    const { value, tmp, other } = parameters[key]
    return value + tmp + other
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
      functions.invoke('updateCharacter', { id, referrer, token, patch })
    }
  })

  const [showall, setShowall] = useState(true)

  const unlock = async (password: string) =>
    functions
      .invoke('verifyPassword', { id, referrer, password })
      .then((token) => patchState({ access: 'unlocked', modal: 'none', token }))
      .catch(() => window.alert('パスワードが間違っています。'))

  const secure = (password: string) =>
    functions
      .invoke('setPassword', { id, referrer, token, password })
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
  const paddingHeight = 22 - (profileHeight % 22)
  const profileRows = Math.ceil(profileHeight / 22)
  const parameterRows = rule.parameters.size + 1
  const categoryRows = categoryVisibility.filter((v) => v).size + 1
  const skillsetRows = math.sum(
    skillVisibility.values().map((d) => d.filter((v) => v).size)
  )
  const rowCount = profileRows + parameterRows + categoryRows + skillsetRows
  const fitsVertically = rowCount * 22 <= height

  const minPanelRowCount = profileRows + parameterRows

  const tmpColumnCount = fitsVertically || width < 640 ? 1 : width < 960 ? 2 : 3
  const tmpColumnWidth =
    fitsVertically || tmpColumnCount === 3 ? 320 : width / tmpColumnCount

  const tmpPanelRowCount = Math.ceil(rowCount / tmpColumnCount)
  const maxRowCount = minPanelRowCount <= tmpPanelRowCount ? 3 : 2
  const columnCount = Math.min(tmpColumnCount, maxRowCount)
  const columnWidth =
    fitsVertically || columnCount === maxRowCount ? 320 : width / columnCount
  const panelRowCount = Math.max(minPanelRowCount, tmpPanelRowCount)

  const panelWidth = fitsVertically ? 320 : columnWidth * columnCount
  const panelHeight = panelRowCount * 22

  const fixBottom = width < 1006 && !fitsVertically
  const addToolbarPadding = panelRowCount - (rowCount % panelRowCount) < 3

  const context = { theme, lang, translator, rule, locked }

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
              height: panelHeight + (addToolbarPadding ? 46 : 0),
              backgroundColor: palette.background,
              color: palette.text,
              boxShadow: `0px 0px 10px 0px ${palette.step1000}44`,
            }}
          >
            <ProfileSection
              ref={profileRef}
              profile={profile}
              width={tmpColumnWidth}
              context={context}
              onUpdate={updateProfile}
            />

            <div style={{ width: tmpColumnWidth, height: paddingHeight }} />

            <ParametersSection
              parameters={parameters}
              width={tmpColumnWidth}
              context={context}
              onUpdate={updateParameter}
            />

            <SkillsetSection
              skillset={skillset}
              totals={totals}
              showall={showall}
              width={tmpColumnWidth}
              context={context}
              onUpdate={updateSkill}
            />

            {addToolbarPadding && (
              <div style={{ width: panelWidth, height: '46px' }}></div>
            )}
          </Flex>

          <Snackbar visible={copied !== 'none'}>
            {translator.t('copied', lang)}
          </Snackbar>

          <div
            style={fixBottom ? { position: 'fixed', bottom: 0, right: 0 } : {}}
          >
            <ButtonSet vertical={!fixBottom} style={{ margin: '5px' }}>
              <IconButton
                icon={faMoon}
                onClick={toggle}
                style={{ boxShadow }}
              />
              <InputGroup vertical={!fixBottom} style={{ boxShadow }}>
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
                icon={locked ? faLock : unlocked ? faLockOpen : faGlobe}
                style={{ boxShadow }}
                onClick={() => patchState({ modal: 'password' })}
              />
              <IconButton
                icon={showall ? faEyeSlash : faEye}
                style={{ boxShadow }}
                onClick={() => setShowall((flag) => !flag)}
              />
            </ButtonSet>
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
