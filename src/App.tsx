import { ReactNode } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'

import { AppContext } from '@/context/AppContext'
import { nord } from '@/palette/nord'

import { CoC6 } from './components/pages/CoC6'
import { NotFound } from './components/pages/generic/NotFound'
import { FirebaseProvider } from './context/FirebaseContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'

const Provider = ({ children }: { children?: ReactNode }) => (
  <AppContext.Provider value={{ lang: 'ja' }}>
    <FirebaseProvider>
      <ThemeProvider palette={nord}>{children}</ThemeProvider>
    </FirebaseProvider>
  </AppContext.Provider>
)

const Root = () => {
  const { palette } = useTheme()
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Link to={CoC6.path}>クトゥルフ神話TRPG 第6版</Link>
          </Route>
          <Route path={`/${CoC6.path}`}>
            <CoC6 />
          </Route>
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
    </>
  )
}

export const App = () => (
  <Provider>
    <Root />
  </Provider>
)
