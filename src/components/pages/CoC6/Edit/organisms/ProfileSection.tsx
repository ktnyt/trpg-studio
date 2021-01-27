import { CSSProperties, forwardRef, memo, MutableRefObject } from 'react'

import deepEqual from 'deep-equal'

import { Flex } from '@/components/atoms/Flex'
import { Grid } from '@/components/atoms/Grid'
import { Input } from '@/components/atoms/Input'
import { LabeledInput } from '@/components/atoms/LabeledInput'
import { TextArea } from '@/components/atoms/TextArea'
import { createThemeUseStyles } from '@/context/ThemeContext'
import { Profile } from '@/models/CoC6/Character'
import { Merger } from '@/utils/merge'

import { Context, contextEqual } from '../Context'

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
  context: Context
  onUpdate: (diff: Merger<Profile>) => void
}

const compare = (prev: ProfileSectionProps, next: ProfileSectionProps) =>
  prev.profile.name === next.profile.name &&
  deepEqual(prev.profile.items, next.profile.items) &&
  prev.profile.notes === next.profile.notes &&
  prev.width === next.width &&
  contextEqual(prev.context, next.context)

export const ProfileSection = Object.assign(
  memo(
    forwardRef<HTMLDivElement, ProfileSectionProps>(
      ({ profile, width, notesRef, context, onUpdate }, ref) => {
        const { theme, lang, translator, rule, locked } = context
        const { name, items, notes } = profile

        const styles = useStyles(theme)

        return (
          <Flex ref={ref} direction="column" style={{ width }}>
            <Input
              placeholder={translator.t('addname', lang)}
              defaultValue={name}
              autoComplete="off"
              className={styles.name}
              disabled={locked}
              debounce={1000}
              onChange={({ target: { value: name } }) => onUpdate({ name })}
            />

            <div className={styles.divider}>
              {translator.t('profile', lang)}
            </div>

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
              className={styles.notes}
              disabled={locked}
              debounce={1000}
              onChange={({ target: { value: notes } }) => onUpdate({ notes })}
            />
          </Flex>
        )
      }
    ),
    compare
  ),
  { displayName: 'ProfileSection' }
)
