import { Children } from 'react'
import { createUseStyles } from 'react-jss'

import clsx from 'clsx'

import { Flex, FlexProps } from '../Flex'

const useStyles = createUseStyles({
  container: ({ vertical }) => ({
    '& div:nth-child(n+2)': {
      [vertical ? 'marginTop' : 'marginLeft']: '5px',
    },
  }),
})

type ButtonSetProps = {
  vertical?: boolean
} & FlexProps

export const ButtonSet = ({
  vertical = false,
  children,
  className,
  ...props
}: ButtonSetProps) => {
  const classes = useStyles({ vertical })
  return (
    <Flex
      direction={vertical ? 'column' : 'row'}
      alignItems="center"
      className={clsx(className, classes.container)}
      {...props}
    >
      {Children.map(children, (child) => (
        <Flex.Item>{child}</Flex.Item>
      ))}
    </Flex>
  )
}
