import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '@/js/firebase'
import { useStoreNotes } from '@/stores/storeNotes'

export const useStoreAuth = defineStore('storeAuth', {
  state: () => {
    return {
      user: {},
      errorMessage: null
    }
  },
  actions: {
    init() {
      const storeNotes = useStoreNotes()
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          // console.log('user logged in: ', user)
          this.user.id = user.uid
          this.user.email = user.email
          this.router.push('/')
          storeNotes.init()
        } else {
          // User is signed out
          // console.log('user logged out: ', user)
          this.user = {}
          this.router.replace('/auth')
          storeNotes.clearNotes()
        }
      })
    },
    registerUser(credentials) {
      // console.log('registerUser action', credentials)
      createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
        .then((userCredential) => {
          const user = userCredential.user
          // console.log('user: ', user)
        })
        .catch((error) => {
          console.error('error.message: ', error.message)
          this.errorMessage = error.message
        })
    },
    loginUser(credentials) {
      signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        .then((userCredential) => {
          const user = userCredential.user
          // console.log('user: ', user)
        })
        .catch((error) => {
          console.error('error.message', error.message)
          this.errorMessage = error.message
        })
    },
    logoutUser() {
      signOut(auth)
        .then(() => {
          // console.log('User signed out')
        })
        .catch((error) => {
          console.error(error.message)
        })
    }
  }
})
