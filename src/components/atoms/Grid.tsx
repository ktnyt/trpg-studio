import { CSSProperties, ComponentPropsWithRef, Ref, forwardRef } from 'react'

import { sanitize } from '@/utils/sanitize'

export type GridItemProps = {
  columnStart?: CSSProperties['gridColumnStart']
  columnEnd?: CSSProperties['gridColumnEnd']
  rowStart?: CSSProperties['gridRowStart']
  rowEnd?: CSSProperties['gridRowEnd']
  column?: CSSProperties['gridColumn']
  row?: CSSProperties['gridRow']
  area?: CSSProperties['gridArea']
  justifySelf?: CSSProperties['justifySelf']
  alignSelf?: CSSProperties['alignSelf']
  placeSelf?: CSSProperties['placeSelf']
} & ComponentPropsWithRef<'div'>

export const GridItem = forwardRef(
  Object.assign(
    (
      {
        columnStart: gridColumnStart,
        columnEnd: gridColumnEnd,
        rowStart: gridRowStart,
        rowEnd: gridRowEnd,
        column: gridColumn,
        row: gridRow,
        area: gridArea,
        justifySelf,
        alignSelf,
        placeSelf,
        style,
        ...props
      }: GridItemProps,
      ref: Ref<HTMLDivElement>
    ) => (
      <div
        ref={ref}
        style={sanitize({
          gridColumnStart,
          gridColumnEnd,
          gridRowStart,
          gridRowEnd,
          gridColumn,
          gridRow,
          gridArea,
          justifySelf,
          alignSelf,
          placeSelf,
          ...style,
        })}
        {...props}
      />
    ),
    { displayName: 'GridItem' }
  )
)

export type GridContainerProps = {
  inline?: boolean
  templateColumns?: CSSProperties['gridTemplateColumns']
  templateRows?: CSSProperties['gridTemplateRows']
  templateAreas?: CSSProperties['gridTemplateAreas']
  template?: CSSProperties['gridTemplate']
  columnGap?: CSSProperties['columnGap']
  rowGap?: CSSProperties['rowGap']
  gap?: CSSProperties['gap']
  justifyItems?: CSSProperties['justifyItems']
  alignItems?: CSSProperties['alignItems']
  placeItems?: CSSProperties['placeItems']
  justifyContent?: CSSProperties['justifyContent']
  alignContent?: CSSProperties['alignContent']
  placeContent?: CSSProperties['placeContent']
  autoColumns?: CSSProperties['gridAutoColumns']
  autoRows?: CSSProperties['gridAutoRows']
  autoFlow?: CSSProperties['gridAutoFlow']
  grid?: CSSProperties['grid']
} & ComponentPropsWithRef<'div'>

export const GridContainer = forwardRef(
  Object.assign(
    (
      {
        inline = false,
        templateColumns: gridTemplateColumns,
        templateRows: gridTemplateRows,
        templateAreas: gridTemplateAreas,
        template: gridTemplate,
        columnGap,
        rowGap,
        gap,
        justifyItems,
        alignItems,
        placeItems,
        justifyContent,
        alignContent,
        placeContent,
        autoColumns: gridAutoColumns,
        autoRows: gridAutoRows,
        autoFlow: gridAutoFlow,
        grid,
        style,
        ...props
      }: GridContainerProps,
      ref: Ref<HTMLDivElement>
    ) => (
      <div
        ref={ref}
        style={sanitize({
          display: inline ? 'grid-inline' : 'grid',
          gridTemplateColumns,
          gridTemplateRows,
          gridTemplateAreas,
          gridTemplate,
          columnGap,
          rowGap,
          gap,
          justifyItems,
          alignItems,
          placeItems,
          justifyContent,
          alignContent,
          placeContent,
          gridAutoColumns,
          gridAutoRows,
          gridAutoFlow,
          grid,
          ...style,
        })}
        {...props}
      />
    ),
    { displayName: 'GridContainer' }
  )
)

const Grid = Object.assign(GridContainer, { Item: GridItem })

export default Grid
