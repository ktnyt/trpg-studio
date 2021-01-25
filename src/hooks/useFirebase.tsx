import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

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

firebase.initializeApp(window.firebaseConfig)

const firestore = firebase.firestore()
const functions = Object.assign(firebase.functions(), {
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

if (window.location.hostname === 'localhost' && window.firebaseEmulators) {
  const {
    firestore: firestoreConfig,
    functions: functionsConfig,
  } = window.firebaseEmulators
  firestore.useEmulator(firestoreConfig.host, firestoreConfig.port)
  functions.useEmulator(functionsConfig.host, functionsConfig.port)
}

const useFirebase = () => {
  return {
    firestore,
    functions,
  }
}

export default useFirebase
