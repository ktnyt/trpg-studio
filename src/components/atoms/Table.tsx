import {
  Children,
  createContext,
  CSSProperties,
  ReactNode,
  useContext,
} from 'react'

import Flex from '@/components/atoms/Flex'
import math from '@/utils/math'
import { sanitize } from '@/utils/sanitize'

const RowContext = createContext({
  cellStyle: {} as CSSProperties,
})

const TableContext = createContext({
  width: 0,
  widths: [] as number[],
  rowStyle: {} as CSSProperties,
  divStyle: {} as CSSProperties,
})

export type CellProps = {
  align?: CSSProperties['textAlign']
  style?: CSSProperties
  children?: ReactNode
}

export const Cell = ({
  align: textAlign = 'left',
  style = {},
  children,
}: CellProps) => {
  const { cellStyle } = useContext(RowContext)
  return (
    <div
      style={{
        textAlign,
        ...cellStyle,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export type RowProps = {
  height?: number
  style?: CSSProperties
  cellStyle?: CSSProperties
  children?: ReactNode
}

export const Row = ({
  height,
  cellStyle = {},
  style = {},
  children,
}: RowProps) => {
  const { width, widths, rowStyle } = useContext(TableContext)
  return (
    <Flex
      justifyContent="space-between"
      style={sanitize({
        width,
        height,
        ...rowStyle,
        ...style,
      })}
    >
      <RowContext.Provider value={{ cellStyle }}>
        {Children.map(children, (child, i) => (
          <Flex.Item key={i} style={{ width: widths[i] }}>
            {child}
          </Flex.Item>
        ))}
      </RowContext.Provider>
    </Flex>
  )
}

export type DividerProps = {
  style?: CSSProperties
  children?: ReactNode
}

export const Divider = ({ style, children }: DividerProps) => {
  const { width, divStyle } = useContext(TableContext)
  return (
    <Flex.Item style={{ width, ...divStyle, ...style }}>{children}</Flex.Item>
  )
}

export type TableProps = {
  widths: number[]
  width?: number
  style?: CSSProperties
  rowStyle?: CSSProperties
  divStyle?: CSSProperties
  children?: ReactNode
}

export const Table = ({
  widths = [],
  width: propWidth = 0,
  style = {},
  rowStyle = {},
  divStyle = {},
  children,
}: TableProps) => {
  const width = Math.max(propWidth, math.sum(widths))
  return (
    <Flex direction="column" style={{ width, ...style }}>
      <TableContext.Provider value={{ width, widths, rowStyle, divStyle }}>
        {children}
      </TableContext.Provider>
    </Flex>
  )
}
