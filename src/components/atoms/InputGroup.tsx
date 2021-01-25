import { Children } from 'react'
import { createUseStyles } from 'react-jss'

import { Flex } from './Flex'

const useStyles = createUseStyles({
  horizontal: {
    borderRadius: '6px',
    '& > *:first-child > *': {
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '0px',
      borderTopLeftRadius: '6px',
      borderBottomLeftRadius: '6px',
    },
    '& > *:last-child > *': {
      borderTopRightRadius: '6px',
      borderBottomRightRadius: '6px',
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '0px',
    },
  },
  vertical: {
    borderRadius: '6px',
    '& > *:first-child > *': {
      borderTopRightRadius: '6px',
      borderBottomRightRadius: '0px',
      borderTopLeftRadius: '6px',
      borderBottomLeftRadius: '0px',
    },
    '& > *:last-child > *': {
      borderTopRightRadius: '0px',
      borderBottomRightRadius: '6px',
      borderTopLeftRadius: '0px',
      borderBottomLeftRadius: '6px',
    },
  },
})

export type InputGroupProps = {
  vertical?: boolean
  style?: React.CSSProperties
  children?: React.ReactNode
}

export const InputGroup = ({
  vertical,
  style: propStyle = {},
  children,
}: InputGroupProps) => {
  const styles = useStyles()
  const direction = vertical ? 'column' : 'row'
  const className = vertical ? styles.vertical : styles.horizontal
  const width = vertical ? 36 : Children.count(children) * 36
  const height = vertical ? Children.count(children) * 36 : 36
  const style = { width, height, ...propStyle }
  return (
    <Flex direction={direction} className={className} style={style}>
      {Children.map(children, (child) => (
        <Flex.Item>{child}</Flex.Item>
      ))}
    </Flex>
  )
}
