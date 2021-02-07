import { Link } from 'react-router-dom'

export type HomeProps = {
  systems: { path: string; name: string }[]
}

export const Home = ({ systems }: HomeProps) => (
  <div>
    <h1>TRPG Studio（β）へようこそ。</h1>
    <h3>
      ダイスロールからチャットパレット生成まで、TRPGのキャラクター作成を徹底支援。
    </h3>
    {systems.map(({ path, name }) => (
      <Link key={path} to={`/${path}`}>
        {name}
      </Link>
    ))}
  </div>
)
