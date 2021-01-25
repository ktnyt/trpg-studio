import { Route, Switch, useRouteMatch } from 'react-router-dom'

import Create from './Create'
import Edit from './Edit'

const CoC6 = () => {
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
}

export default Object.assign(CoC6, { path: 'coc6' })