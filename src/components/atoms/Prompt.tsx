import { forwardRef, useState } from 'react'

import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'

import { Grid } from './Grid'
import { LabeledInput, LabeledInputProps } from './LabeledInput'
import { TextButton } from './TextButton'

const useStyles = createThemeUseStyles(({ palette }) => ({
  root: {
    boxSizing: 'border-box',
    width: '216px',
    border: `1px solid ${palette.step100}`,
    borderRadius: '8px',
    backgroundColor: palette.background,
  },
  message: {
    margin: '20px 20px 0px 20px',
    color: palette.text,
    fontSize: '12px',
    lineHeight: '14px',
    textAlign: 'justify',
  },
  input: {
    margin: '10px 20px',
  },
  grid: {
    margin: '10px',
  },
  button: {},
}))

type PromptProps = {
  message?: React.ReactNode
  confirm: string
  cancel: string
  disableConfirm?:
    | boolean
    | ((value: string | number | readonly string[]) => boolean)
  onConfirm?: (value: string | number | readonly string[]) => void
  onCancel?: () => void
} & LabeledInputProps

export const Prompt = forwardRef<HTMLInputElement, PromptProps>(
  (
    {
      message,
      confirm,
      cancel,
      disableConfirm = false,
      onConfirm,
      onCancel,
      defaultValue,
      value: valueProp,
      onChange,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const styles = useStyles(theme)

    const initValue =
      defaultValue !== undefined
        ? defaultValue
        : valueProp !== undefined
        ? valueProp
        : ''

    const initDisabled =
      typeof disableConfirm === 'boolean'
        ? disableConfirm
        : disableConfirm(initValue)

    const [{ value, disabled }, setState] = useState({
      value: initValue,
      disabled: initDisabled,
    })

    return (
      <div className={styles.root}>
        {message && <p className={styles.message}>{message}</p>}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!disabled) {
              onConfirm !== undefined && onConfirm(value)
              setState(({ value }) => ({ value, disabled: true }))
            }
          }}
        >
          <LabeledInput
            ref={ref}
            defaultValue={defaultValue}
            value={valueProp}
            onChange={(event) => {
              if (onChange !== undefined) onChange(event)
              const value = event.target.value
              const disabled =
                typeof disableConfirm === 'boolean'
                  ? disableConfirm
                  : disableConfirm(value)
              setState({ value, disabled })
            }}
            className={styles.input}
            {...props}
          />
          <Grid templateColumns="1fr 1fr" className={styles.grid}>
            <TextButton
              color="danger"
              type="button"
              className={styles.button}
              onClick={() => onCancel !== undefined && onCancel()}
            >
              {cancel}
            </TextButton>
            <TextButton
              color="primary"
              type="submit"
              className={styles.button}
              disabled={disabled}
            >
              {confirm}
            </TextButton>
          </Grid>
        </form>
      </div>
    )
  }
)
