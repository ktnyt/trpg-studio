import { ComponentPropsWithRef, forwardRef, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

export type TextAreaProps = ComponentPropsWithRef<typeof TextareaAutosize>

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ onKeyDown, ...props }, ref) => {
    const localRef = useRef<HTMLTextAreaElement>(null!)
    return (
      <TextareaAutosize
        ref={(current) => {
          if (ref instanceof Function) {
            ref(current)
          } else if (ref !== null) {
            ref.current = current
          }
          if (current !== null) {
            localRef.current = current
          }
        }}
        onKeyDown={(event) => {
          if (onKeyDown !== undefined) {
            onKeyDown(event)
          }
          if (event.key === 'Escape') {
            localRef.current.blur()
          }
        }}
        {...props}
      />
    )
  }
)

export default TextArea
