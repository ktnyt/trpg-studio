import { createUseStyles } from 'react-jss'

import { IconSize } from './IconButton'

import { Flex } from '../Flex'

const useStyles = createUseStyles({
  container: ({ size, vertical }: { size: IconSize; vertical: boolean }) => {
    const borderRadius = size === 'sm' ? '3px' : '6px'
    const groupSize = size === 'sm' ? 18 : 36
    const width = vertical ? groupSize : 'auto'
    const height = vertical ? 'auto' : groupSize
    return {
      width,
      height,
      borderRadius,
      '& > *:first-child': {
        borderTopRightRadius: vertical ? borderRadius : '0px',
        borderBottomRightRadius: vertical ? '0px' : '0px',
        borderTopLeftRadius: vertical ? borderRadius : borderRadius,
        borderBottomLeftRadius: vertical ? '0px' : borderRadius,
      },
      '& > *:last-child': {
        borderTopRightRadius: vertical ? '0px' : borderRadius,
        borderBottomRightRadius: vertical ? borderRadius : borderRadius,
        borderTopLeftRadius: vertical ? '0px' : '0px',
        borderBottomLeftRadius: vertical ? borderRadius : '0px',
      },
    }
  },
})

export type InputGroupProps = {
  vertical?: boolean
  style?: React.CSSProperties
  size?: IconSize
  children?: React.ReactNode
}

export const InputGroup = ({
  vertical,
  style,
  size = 'md',
  children,
}: InputGroupProps) => {
  const classes = useStyles({ size, vertical })
  return (
    <Flex
      direction={vertical ? 'column' : 'row'}
      alignContent="center"
      className={classes.container}
      style={style}
    >
      {children}
    </Flex>
  )
}
