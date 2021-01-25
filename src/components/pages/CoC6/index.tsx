import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { Create } from './Create'
import { Edit } from './Edit'

export const CoC6 = Object.assign(
  () => {
    const { path } = useRouteMatch()
    return (
      <Switch>
        <Route exact path={path}>
          <Create />
        </Route>
        <Route path={`${path}/:id`}>
          <Edit />
        </Route>
      </Switch>
    )
  },
  { displayName: 'CoC6', path: 'coc6' }
)
