import { CSSProperties, ReactNode } from 'react'

import { useTheme } from '@/context/ThemeContext'

import { Grid } from './Grid'
import { Swap } from './Swap'

export const randomFace = (sides = 6, exclude = 0): number =>
  ((face) => (face === exclude ? randomFace(sides, exclude) : face))(
    Math.floor(Math.random() * sides) + 1
  )

const DieBase = ({ size, children }: { size: number; children: ReactNode }) => {
  const { palette } = useTheme()
  const borderWidth = Math.ceil(size / 32)
  return (
    <Grid templateAreas="base" style={{ width: size, height: size }}>
      <Grid.Item
        area="base"
        style={{
          boxSizing: 'border-box',
          width: size,
          height: size,
          border: `${borderWidth}px solid ${palette.step250}`,
          borderRadius: `${Math.floor(size / 8)}px`,
          backgroundColor: palette.step50,
        }}
      ></Grid.Item>
      <Grid.Item area="base" style={{ width: size, height: size }}>
        {children}
      </Grid.Item>
    </Grid>
  )
}

const GenericDie = ({ face, size }: { face: number; size: number }) => {
  const { palette } = useTheme()
  const paddingSize = Math.floor(size / 5)
  const innerSize = size - paddingSize * 2
  return (
    <DieBase size={size}>
      <div
        style={{
          width: `${size}px`,
          height: `${innerSize}px`,
          padding: `${paddingSize}px 0px`,
          color: palette.step800,
          fontWeight: 'bold',
          fontSize: `${innerSize}px`,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: `${innerSize}px`,
          textAlign: 'center',
        }}
      >
        {face === 0 ? '?' : face}
      </div>
    </DieBase>
  )
}

const CubeDie = ({ face, size }: { face: number; size: number }) => {
  const { palette } = useTheme()
  const colors = ['red', 'teal', 'magenta', 'green', 'orange', 'blue']
  const createStyle = (arg: number): CSSProperties => ({
    visibility: face === arg ? 'visible' : 'hidden',
    fill: palette.colors.get(colors[arg - 1]),
  })
  return (
    <DieBase size={size}>
      <div style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="-32 -32 64 64">
          <g style={createStyle(1)}>
            <circle cx={0} cy={0} r={12} />
          </g>

          <g style={createStyle(2)}>
            <circle cx={-16} cy={-16} r={7} />
            <circle cx={16} cy={16} r={7} />
          </g>

          <g style={createStyle(3)}>
            <circle cx={-16} cy={-16} r={7} />
            <circle cx={0} cy={0} r={7} />
            <circle cx={16} cy={16} r={7} />
          </g>

          <g style={createStyle(4)}>
            <circle cx={-16} cy={-16} r={7} />
            <circle cx={16} cy={-16} r={7} />
            <circle cx={-16} cy={16} r={7} />
            <circle cx={16} cy={16} r={7} />
          </g>

          <g style={createStyle(5)}>
            <circle cx={-16} cy={-16} r={7} />
            <circle cx={16} cy={-16} r={7} />
            <circle cx={0} cy={0} r={7} />
            <circle cx={-16} cy={16} r={7} />
            <circle cx={16} cy={16} r={7} />
          </g>

          <g style={createStyle(6)}>
            <circle cx={-16} cy={-16} r={7} />
            <circle cx={16} cy={-16} r={7} />
            <circle cx={-16} cy={0} r={7} />
            <circle cx={16} cy={0} r={7} />
            <circle cx={-16} cy={16} r={7} />
            <circle cx={16} cy={16} r={7} />
          </g>
        </svg>
      </div>
    </DieBase>
  )
}

export const Die = ({
  face,
  sides,
  size = 32,
}: {
  face: number
  sides: number
  size: number
}) => (
  <Swap visible={face !== 0 ? [6].indexOf(sides) + 1 : 0}>
    <GenericDie face={face} size={size} />
    <CubeDie face={face} size={size} />
  </Swap>
)
