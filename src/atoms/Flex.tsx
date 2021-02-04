import {
  CSSProperties,
  ComponentPropsWithRef,
  Ref,
  forwardRef,
  ReactNode,
} from 'react'

import { sanitize } from '@/utils/sanitize'

export type FlexItemProps = {
  flex?: CSSProperties['flex']
  grow?: CSSProperties['flexGrow']
  shrink?: CSSProperties['flexShrink']
  basis?: CSSProperties['flexBasis']
  alignSelf?: CSSProperties['alignSelf']
  order?: CSSProperties['order']
} & ComponentPropsWithRef<'div'>

export const FlexItem = forwardRef(
  Object.assign(
    (
      {
        flex,
        grow: flexGrow,
        shrink: flexShrink,
        basis: flexBasis,
        alignSelf,
        order,
        style,
        ...rest
      }: FlexItemProps,
      ref: Ref<HTMLDivElement>
    ) => (
      <div
        ref={ref}
        style={sanitize({
          flex,
          flexGrow,
          flexShrink,
          flexBasis,
          alignSelf,
          order,
          ...style,
        })}
        {...rest}
      />
    ),
    { displayName: 'FlexItem' }
  )
)

export type FlexProps = {
  inline?: boolean
  flow?: CSSProperties['flexFlow']
  direction?: CSSProperties['flexDirection']
  wrap?: CSSProperties['flexWrap']
  alignContent?: CSSProperties['alignContent']
  alignItems?: CSSProperties['alignItems']
  justifyContent?: CSSProperties['justifyContent']
  placeContent?: CSSProperties['placeContent']
  placeItems?: CSSProperties['placeItems']
  gap?: CSSProperties['gap']
  rowGap?: CSSProperties['rowGap']
  columnGap?: CSSProperties['columnGap']
  style?: CSSProperties
  children?: ReactNode
} & ComponentPropsWithRef<'div'>

export const Flex = Object.assign(
  forwardRef<HTMLDivElement, FlexProps>(
    (
      {
        inline,
        flow: flexFlow,
        direction: flexDirection,
        wrap: flexWrap,
        alignContent,
        alignItems,
        justifyContent,
        placeContent,
        placeItems,
        gap,
        rowGap,
        columnGap,
        style,
        ...rest
      },
      ref
    ) => (
      <div
        ref={ref}
        style={sanitize({
          display: inline ? 'inline-flex' : 'flex',
          flexFlow,
          flexDirection,
          flexWrap,
          alignContent,
          alignItems,
          justifyContent,
          placeContent,
          placeItems,
          gap,
          rowGap,
          columnGap,
          ...style,
        })}
        {...rest}
      />
    )
  ),
  { displayName: 'Flex', Item: FlexItem }
)
