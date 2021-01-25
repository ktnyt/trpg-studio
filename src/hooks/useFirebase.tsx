import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

import { firebaseConfig } from '@/config/firebaseConfig'

declare global {
  interface Window {
    firebaseConfig: {
      projectId: string
      appId: string
      storageBucket: string
      locationId: string
      apiKey: string
      authDomain: string
      messagingSenderId: string
      measurementId: string
    }
    firebaseEmulators?: {
      [key: string]: {
        host: string
        port: number
      }
    }
  }
}

firebase.initializeApp(firebaseConfig)

const firestore = firebase.firestore()
const functions = Object.assign(firebase.app().functions('asia-northeast2'), {
  invoke: async (
    name: string,
    data: any,
    options?: firebase.functions.HttpsCallableOptions
  ) => {
    const callable = functions.httpsCallable(name, options)
    const result = await callable(data)
    return result.data
  },
})

if (window.location.hostname === 'localhost') {
  firestore.useEmulator('localhost', 8080)
  functions.useEmulator('localhost', 5001)
}

export const useFirebase = () => {
  return {
    firestore,
    functions,
  }
}
