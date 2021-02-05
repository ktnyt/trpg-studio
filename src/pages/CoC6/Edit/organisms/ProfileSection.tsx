import { CSSProperties, forwardRef, MutableRefObject, useContext } from 'react'

import { Flex } from '@/atoms/Flex'
import { Grid } from '@/atoms/Grid'
import { Input } from '@/atoms/Input'
import { TextArea } from '@/atoms/TextArea'
import { LabeledInput } from '@/atoms/ui/LabeledInput'
import { AppContext } from '@/context/AppContext'
import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'
import { useTranslator } from '@/hooks/useTranslator'
import { Profile } from '@/models/CoC6/Character'
import { Merger } from '@/utils/merge'

import { useRule } from '../../rule'

const useStyles = createThemeUseStyles(({ palette, isDark }) => ({
  divider: {
    padding: '2px 10px',
    backgroundColor: palette.primary.tone(isDark),
    color: palette.primary.contrast,
    fontWeight: 'bold',
    fontSize: '12px',
  },
  name: {
    margin: '15px 5px 10px 5px',
    border: 'none',
    borderBottom: `1px solid transparent`,
    backgroundColor: 'transparent',
    color: palette.step900,
    fontWeight: 'bolder',
    fontSize: '2em',
    transition: 'border 200ms',
    '&::placeholder': { color: palette.step300, transition: 'color 100ms' },
    '&:hover': { borderBottom: `1px solid ${palette.step800}` },
    '&:focus': {
      outline: 'none',
      borderBottom: `1px solid ${palette.secondary.tone(isDark)}`,
      '&::placeholder': { color: 'transparent' },
    },
  },
  notes: {
    boxSizing: 'border-box',
    marginTop: '10px',
    padding: '5px',
    border: 'none',
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

export type ProfileSectionProps = {
  profile: Profile
  width: CSSProperties['width']
  notesRef: MutableRefObject<HTMLTextAreaElement>
  locked: boolean
  onUpdate: (diff: Merger<Profile>) => void
}

export const ProfileSection = Object.assign(
  forwardRef<HTMLDivElement, ProfileSectionProps>(
    ({ profile, width, notesRef, locked, onUpdate }, ref) => {
      const { lang } = useContext(AppContext)
      const translator = useTranslator()
      const rule = useRule(translator)

      const { name, items, notes } = profile

      const theme = useTheme()
      const classes = useStyles(theme)

      return (
        <Flex ref={ref} direction="column" style={{ width }}>
          <Input
            placeholder={translator.t('addname', lang)}
            defaultValue={name}
            autoComplete="off"
            className={classes.name}
            disabled={locked}
            debounce={1000}
            onChange={({ target: { value: name } }) => onUpdate({ name })}
          />

          <div className={classes.divider}>{translator.t('profile', lang)}</div>

          <Grid templateColumns={'1fr 1fr 1fr'} justifyItems="center">
            {rule.profile.keys().map((key) => (
              <Grid.Item key={key}>
                <LabeledInput
                  id={key}
                  label={translator.t(key, lang)}
                  defaultValue={items[key]}
                  style={{ width: 90, marginBottom: 5 }}
                  disabled={locked}
                  debounce={1000}
                  onChange={({ target: { value } }) =>
                    onUpdate(({ items }) => ({
                      items: {
                        ...items,
                        [key]: value,
                      },
                    }))
                  }
                />
              </Grid.Item>
            ))}
          </Grid>

          <TextArea
            ref={notesRef}
            minRows={3}
            defaultValue={notes}
            placeholder={`${translator.t('notes', lang)}...`}
            style={{ width }}
            className={classes.notes}
            disabled={locked}
            debounce={1000}
            onChange={({ target: { value: notes } }) => onUpdate({ notes })}
          />
        </Flex>
      )
    }
  ),

  { displayName: 'ProfileSection' }
)
