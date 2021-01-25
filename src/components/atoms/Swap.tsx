import { Children } from 'react'

import Grid from './Grid'

const Swap = ({
  visible = 0,
  children,
}: {
  visible?: number
  children: React.ReactNode
}) => (
  <Grid templateAreas="'swap'">
    {Children.map(children, (child, i) => (
      <Grid.Item
        key={i}
        area="swap"
        style={{ visibility: i === visible ? 'visible' : 'hidden' }}
      >
        {child}
      </Grid.Item>
    ))}
  </Grid>
)

export default Swap
