import { createUseStyles } from 'react-jss'

import { Flex } from './Flex'

const useStyles = createUseStyles({
  horizontal: ({ borderRadius }) => ({
    borderRadius,
    '& > *:first-child': {
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
    },
    '& > *:last-child': {
      borderTopRightRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '0px',
    },
  }),
  vertical: ({ borderRadius }) => ({
    borderRadius,
    '& > *:first-child': {
      borderTopRightRadius: borderRadius,
      borderBottomRightRadius: '0px',
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: '0px',
    },
    '& > *:last-child': {
      borderTopRightRadius: '0px',
      borderBottomRightRadius: borderRadius,
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: borderRadius,
    },
  }),
})

export type InputGroupProps = {
  vertical?: boolean
  style?: React.CSSProperties
  size?: 'sm' | 'md'
  children?: React.ReactNode
}

export const InputGroup = ({
  vertical,
  style: propStyle = {},
  size = 'md',
  children,
}: InputGroupProps) => {
  const groupSize = size === 'sm' ? 18 : 36
  const borderRadius = size === 'sm' ? '3px' : '6px'
  const styles = useStyles({ borderRadius })
  const direction = vertical ? 'column' : 'row'
  const className = vertical ? styles.vertical : styles.horizontal
  const width = vertical ? groupSize : 'auto'
  const height = vertical ? 'auto' : groupSize
  const style = { width, height, ...propStyle }
  return (
    <Flex
      direction={direction}
      alignContent="center"
      className={className}
      style={style}
    >
      {children}
    </Flex>
  )
}
