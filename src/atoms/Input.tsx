import {
  ChangeEvent,
  ComponentPropsWithRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useDebounce } from '@/hooks/useDebounce'
import { useDifferent } from '@/hooks/useDifferent'

export type InputProps = ComponentPropsWithRef<'input'> & {
  debounce?: number
}

type EventState = ChangeEvent<HTMLInputElement> | null

export const Input = Object.assign(
  forwardRef<HTMLInputElement, InputProps>(
    ({ onKeyDown, onChange, debounce = 0, ...props }, ref) => {
      const localRef = useRef<HTMLInputElement>(null!)

      const [composing, setComposing] = useState(false)
      const [event, setEvent] = useState<EventState>(null)

      const debounced = useDebounce(event, debounce)
      const different = useDifferent(debounced)

      useEffect(() => {
        if (
          !composing &&
          onChange !== undefined &&
          debounced !== null &&
          different
        ) {
          onChange(debounced)
        }
      }, [composing, onChange, debounced, different])

      return (
        <input
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
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onChange={setEvent}
          {...props}
        />
      )
    }
  ),
  { displayName: 'Input' }
)
