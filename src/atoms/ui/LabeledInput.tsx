import { forwardRef, useRef, useState } from 'react'

import clsx from 'clsx'

import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'

import { Input, InputProps } from '../Input'

const useStyles = createThemeUseStyles(({ palette }) => ({
  container: ({ focus }: { focus: boolean }) => ({
    position: 'relative',
    '& label': {
      position: 'absolute',
      width: '100%',
      top: '0px',
      left: '0px',
      overflow: 'hidden',
      color: focus ? palette.step800 : palette.step400,
      fontSize: '14px',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      transform: focus
        ? 'translate(0px, 0px) scale(0.75)'
        : 'translate(0px, 14px) scale(1)',
      transformOrigin: 'top left',
      transition: 'color 200ms, transform 200ms',
      '&:hover': {
        cursor: 'text',
      },
    },
    '& input': {
      width: '174px',
      marginTop: '16px',
      padding: '0px',
      border: 'none',
      borderBottom: `1px solid ${palette.step400}`,
      borderRadius: '0px',
      backgroundColor: 'transparent',
      color: palette.step1000,
      fontSize: '14px',
      '&:hover': {
        borderBottom: `1px solid ${palette.step800}`,
      },
      '&:focus': {
        outline: 'none',
        borderBottom: `1px solid ${palette.secondary.base}`,
      },
    },
  }),
}))

export type LabeledInputProps = InputProps & {
  label?: string
  inputClassName?: string
}

export const LabeledInput = Object.assign(
  forwardRef<HTMLInputElement, LabeledInputProps>(
    (
      {
        id,
        label,
        placeholder,
        defaultValue,
        value,
        onFocus,
        onBlur,
        className,
        inputClassName,
        ...props
      },
      ref
    ) => {
      const [focus, setFocus] = useState(
        (defaultValue !== undefined && defaultValue !== '') ||
          (value !== undefined && value !== '')
      )
      const localRef = useRef<HTMLInputElement>(null!)
      const theme = useTheme()
      const classes = useStyles({ theme, focus })
      return (
        <div className={clsx(classes.container, className)}>
          <label htmlFor={id}>
            {!focus && placeholder ? placeholder : label}
          </label>
          <Input
            ref={(arg) => {
              if (ref !== null) {
                if (typeof ref === 'function') {
                  ref(arg)
                } else {
                  ref.current = arg
                }
              }
              if (arg !== null) {
                localRef.current = arg
              }
            }}
            defaultValue={defaultValue}
            value={value}
            id={id}
            className={inputClassName}
            onFocus={(event) => {
              if (onFocus !== undefined) onFocus(event)
              setFocus(true)
            }}
            onBlur={(event) => {
              if (onBlur !== undefined) onBlur(event)
              setFocus(localRef.current.value !== '')
            }}
            {...props}
          />
        </div>
      )
    }
  ),
  { displayName: 'LabeledInput' }
)
