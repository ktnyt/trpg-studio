import { Children } from 'react'
import { createUseStyles } from 'react-jss'

import clsx from 'clsx'

import { Flex, FlexProps } from '../Flex'

type ButtonSetProps = {
  vertical?: boolean
} & FlexProps

type ButtonSetClassNames = 'container'

const useStyles = createUseStyles<ButtonSetClassNames, Partial<ButtonSetProps>>(
  {
    container: ({ vertical }) => ({
      '& div:nth-child(n+2)': {
        [vertical ? 'marginTop' : 'marginLeft']: '5px',
      },
    }),
  }
)

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
