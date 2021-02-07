import { Link } from 'react-router-dom'

import { createThemeUseStyles, useTheme } from '@/context/ThemeContext'

const useStyles = createThemeUseStyles(({ palette }) => ({
  container: {
    color: palette.text,
    '& p': {
      fontWeight: 'bold',
    },
  },
}))

export type HomeProps = {
  systems: { path: string; name: string }[]
}

export const Home = ({ systems }: HomeProps) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  return (
    <div className={classes.container}>
      <h1>TRPG Studio（β）</h1>
      <p>
        「ダイスロール」から「チャットパレット生成」まで、TRPGのキャラクター作成を今まで以上にお手軽に。
      </p>
      {systems.map(({ path, name }) => (
        <Link key={path} to={`/${path}`}>
          {name}
        </Link>
      ))}
    </div>
  )
}
