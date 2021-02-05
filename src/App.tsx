import { Fragment, lazy, ReactNode, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { AppContext } from '@/context/AppContext'
import { nord } from '@/palette/nord'

import { FirebaseProvider } from './context/FirebaseContext'
import { ThemeProvider } from './context/ThemeContext'
import { Home } from './pages/Home'
import { Blank } from './pages/generic/Blank'
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

const Routes = () => (
  <Fragment>
    <Router>
      <Switch>
        <Route exact path="/">
          <Home systems={systems} />
        </Route>
        <Suspense fallback={<Blank />}>
          {systems.map(({ path, component }) => (
            <Route key={path} path={`/${path}`} component={component} />
          ))}
        </Suspense>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
    <Blank />
  </Fragment>
)

export const App = () => (
  <Provider>
    <Routes />
  </Provider>
)
