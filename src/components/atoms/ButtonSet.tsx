import { Children } from 'react'

import { Flex, FlexProps } from './Flex'

export const ButtonSet = ({
  vertical = false,
  children,
  ...props
}: {
  vertical?: boolean
} & FlexProps) => (
  <Flex direction={vertical ? 'column' : 'row'} alignItems="center" {...props}>
    {Children.map(children, (child, index) => (
      <div
        style={
          index > 0
            ? vertical
              ? { marginTop: '5px' }
              : { marginLeft: '5px' }
            : {}
        }
      >
        {child}
      </div>
    ))}
  </Flex>
)
