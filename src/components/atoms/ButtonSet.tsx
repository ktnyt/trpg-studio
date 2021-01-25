import { Children } from 'react'

import Flex, { FlexContainerProps } from './Flex'

const ButtonSet = ({
  vertical = false,
  children,
  ...props
}: {
  vertical?: boolean
} & FlexContainerProps) => (
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

export default ButtonSet
