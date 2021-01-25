import { useState } from 'react'

import { Grid } from '@/components/atoms/Grid'
import { Input, InputProps } from '@/components/atoms/Input'
import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'

const useInputStyles = createThemeUseStyles(({ palette, isDark }) => ({
  root: {
    overflow: 'visible',
    width: '30px',
    fontVariantNumeric: 'tabular-nums',
    '& .placeholder': {
      fontSize: '12px',
      textAlign: 'center',
    },
    '& input': {
      width: '20px',
      margin: '0px 5px',
      padding: '0px',
      border: 'none',
      borderBottom: `1px solid transparent`,
      backgroundColor: 'transparent',
      color: palette.text,
      fontSize: '14px',
      fontVariantNumeric: 'tabular-nums',
      lineHeight: '14px',
      textAlign: 'right',
      transition: 'border 200ms',
      '&:hover': { borderBottom: `1px solid ${palette.step800}` },
      '&:focus': {
        borderBottom: `1px solid ${palette.secondary.tone(isDark)}`,
        outline: 'none',
      },
    },
  },
  focused: {
    color: 'transparent',
    transition: 'color 200ms',
  },
  blurred: {
    color: palette.step300,
    transition: 'color 200ms',
  },
}))

export type NumberInputProps = InputProps

const withValue = (
  ...values: (string | number | readonly string[] | undefined)[]
): string | number | readonly string[] => {
  for (let value of values) {
    if (value !== undefined) {
      return value
    }
  }
  return ''
}

export const NumberInput = ({
  placeholder,
  value: propValue,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  ...props
}: NumberInputProps) => {
  const theme = useTheme()
  const { root, input, focused, blurred } = useInputStyles(theme)
  const [value, setValue] = useState(withValue(propValue, defaultValue))
  const [focus, setFocus] = useState(false)
  return (
    <Grid templateAreas="root" className={root}>
      <Grid.Item
        area="root"
        className={`placeholder ${focus ? focused : blurred}`}
      >
        {placeholder !== undefined && value === '' && !focus ? placeholder : ''}
      </Grid.Item>
      <Grid.Item area="root" className={input}>
        <Input
          type="number"
          pattern="[0-9]*"
          inputMode="numeric"
          value={propValue}
          defaultValue={defaultValue}
          onChange={(event) => {
            if (onChange !== undefined) {
              onChange(event)
            }
            if (
              event.target.value === '' ||
              !/^-?\d+$/.test(event.target.value)
            ) {
              setValue('')
              return
            }
            const n = parseInt(event.target.value, 10)
            setValue(n)
          }}
          onFocus={(event) => {
            if (onFocus !== undefined) {
              onFocus(event)
            }
            setFocus(true)
          }}
          onBlur={(event) => {
            if (onBlur !== undefined) {
              onBlur(event)
            }
            setFocus(false)
          }}
          {...props}
        />
      </Grid.Item>
    </Grid>
  )
}
