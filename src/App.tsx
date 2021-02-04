import { Fragment, lazy, ReactNode, Suspense } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'

import { AppContext } from '@/context/AppContext'
import { nord } from '@/palette/nord'

import { FirebaseProvider } from './context/FirebaseContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { Loading } from './pages/generic/Loading'
import { NotFound } from './pages/generic/NotFound'

const Provider = ({ children }: { children?: ReactNode }) => (
  <AppContext.Provider value={{ lang: 'ja' }}>
    <FirebaseProvider>
      <ThemeProvider palette={nord}>{children}</ThemeProvider>
    </FirebaseProvider>
  </AppContext.Provider>
)

const systems = [
  {
    path: 'coc6',
    name: 'クトゥルフ神話TRPG 第6版',
    component: lazy(() => import('./pages/CoC6')),
  },
]

const Root = () => {
  const { palette } = useTheme()
  return (
    <Fragment>
      <Router>
        <Switch>
          <Route exact path="/">
            {systems.map(({ path, name }) => (
              <Link key={path} to={path}>
                {name}
              </Link>
            ))}
          </Route>
          <Suspense fallback={<Loading />}>
            {systems.map(({ path, component }) => (
              <Route key={path} path={`/${path}`} component={component} />
            ))}
          </Suspense>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
      <div
        style={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          zIndex: -1,
          minWidth: '100%',
          minHeight: '100%',
          backgroundColor: palette.step50,
        }}
      ></div>
    </Fragment>
  )
}

export const App = () => (
  <Provider>
    <Root />
  </Provider>
)
