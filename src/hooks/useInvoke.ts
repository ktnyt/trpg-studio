import firebase from 'firebase/app'
import 'firebase/functions'

export const useInvoke = (functions: firebase.functions.Functions) => {
  if (window.location.hostname === 'localhost')
    functions.useEmulator('localhost', 5001)
  return async (
    name: string,
    data: any,
    options?: firebase.functions.HttpsCallableOptions
  ) => {
    const callable = functions.httpsCallable(name, options)
    const result = await callable(data)
    return result.data
  }
}
