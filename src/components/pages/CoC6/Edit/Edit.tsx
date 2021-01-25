import { useEffect, useState } from 'react'
import { Link, useParams, useRouteMatch } from 'react-router-dom'

import { faSadTear } from '@fortawesome/free-regular-svg-icons'

import { Icon } from '@/components/atoms/Icon'
import { useTheme } from '@/context/ThemeContext'
import { useFirebase } from '@/hooks/useFirebase'
import { useWindowSize } from '@/hooks/useWindowSize'
import { Character } from '@/models/Character'

import { Editor } from './organisms/Editor'
import './styles.css'

type Status = Character | 'loading' | 'notfound'

export const Edit = () => {
  const [status, setStatus] = useState<Status>('loading')
  const [secured, setSecured] = useState<boolean | null>(null)

  const { url } = useRouteMatch()
  const { id } = useParams<{ id: string }>()
  const { functions } = useFirebase()

  useEffect(() => {
    if (status === 'loading') {
      functions
        .invoke('hasPassword', { id })
        .then((secured) => setSecured(secured))
        .catch(() => setStatus('notfound'))

      functions
        .invoke('getCharacter', { id })
        .then(setStatus)
        .catch(() => setStatus('notfound'))
    }
  }, [status, functions, id])

  const { width, height } = useWindowSize()
  const { palette } = useTheme()

  return status === 'loading' || secured === null ? (
    <div style={{ width, height, backgroundColor: palette.background }}></div>
  ) : status === 'notfound' ? (
    <div
      style={{
        width,
        height,
        color: palette.text,
        backgroundColor: palette.step50,
      }}
    >
      <div
        className="center"
        style={{ width, backgroundColor: palette.step50, textAlign: 'center' }}
      >
        <Icon icon={faSadTear} style={{ fontSize: '128px' }} />
        <h3>キャラクターが見つかりませんでした</h3>
        <Link to={`${url}`}>新しく作る</Link>
      </div>
    </div>
  ) : (
    <Editor init={status} secured={secured} />
  )
}
