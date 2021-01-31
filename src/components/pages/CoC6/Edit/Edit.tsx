import { useEffect, useState } from 'react'
import { Link, useParams, useRouteMatch } from 'react-router-dom'

import { Loading } from '@/components/pages/generic/Loading'
import { NotFound } from '@/components/pages/generic/NotFound'
import { useFirebase } from '@/context/FirebaseContext'
import { useTheme } from '@/context/ThemeContext'
import { useInvoke } from '@/hooks/useInvoke'
import { Character } from '@/models/CoC6/Character'

import { Editor } from './organisms/Editor'
import './styles.css'

import { system } from '../rule'

type Status = Character | 'loading' | 'notfound'

export const Edit = () => {
  const [status, setStatus] = useState<Status>('loading')
  const [secured, setSecured] = useState<boolean | null>(null)

  const { url } = useRouteMatch()
  const { id } = useParams<{ id: string }>()
  const firebase = useFirebase()
  const invoke = useInvoke(firebase.app().functions('asia-northeast2'))

  useEffect(() => {
    if (status === 'loading') {
      invoke('hasPassword', { system, id })
        .then((secured) => setSecured(secured))
        .catch(() => setStatus('notfound'))

      invoke('getCharacter', { system, id })
        .then(setStatus)
        .catch(() => setStatus('notfound'))
    }
  }, [status, invoke, id])

  const { palette } = useTheme()

  return status === 'loading' || secured === null ? (
    <Loading />
  ) : status === 'notfound' ? (
    <NotFound message="キャラクターが見つかりませんでした">
      <Link to={url.replace(`/${id}`, '')} style={{ color: palette.text }}>
        新しく作る
      </Link>
    </NotFound>
  ) : (
    <Editor init={status} secured={secured} />
  )
}
