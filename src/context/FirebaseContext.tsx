import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

const FirebaseContext = createContext(firebase)

export type FirebaseProviderProps = {
  children?: ReactNode
}

export type FirebaseConfig = {
  projectId: string
  appId: string
  storageBucket: string
  locationId: string
  apiKey: string
  authDomain: string
  messagingSenderId: string
  measurementId: string
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    fetch('/__/firebase/init.json')
      .then((response) => response.json())
      .then((data) => data as FirebaseConfig)
      .then(firebase.initializeApp)
      .then(() => setInitialized(true))
  }, [])

  if (!initialized) {
    return null
  }

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = () => useContext(FirebaseContext)
