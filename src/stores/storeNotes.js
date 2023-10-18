import { defineStore } from 'pinia'
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '@/js/firebase'
import { useStoreAuth } from '@/stores/storeAuth'

let notesCollectionRef
let notesCollectionQuery

let getNotesSnapshot = null
export const useStoreNotes = defineStore('storeNotes', {
  state: () => {
    return {
      notes: [
        // {
        //   id: 'id1',
        //   content:
        //     'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aut cupiditate ea fugit inventore nobis, odit officiis, perferendis perspiciatis possimus sint tenetur, voluptas voluptate.'
        // },
        // {
        //   id: 'id2',
        //   content: 'This is a shorter note!'
        // }
      ],
      notesLoaded: false
    }
  },
  actions: {
    // initialize refs database & getNotes()
    init() {
      const storeAuth = useStoreAuth()
      // initialiser les refs de la BDD
      notesCollectionRef = collection(db, 'users', storeAuth.user.id, 'notes')
      notesCollectionQuery = query(notesCollectionRef, orderBy('date', 'desc'))
      // appeler getNotes() pour obtenir les notes
      this.getNotes()
    },
    // get notes from db firestore
    async getNotes() {
      this.notesLoaded = false

      getNotesSnapshot = onSnapshot(
        notesCollectionQuery,
        (querySnapshot) => {
          // console.log('querySnapshot', querySnapshot)
          let notes = []
          querySnapshot.forEach((doc) => {
            let note = {
              id: doc.id,
              content: doc.data().content,
              date: doc.data().date
            }
            notes.push(note)
          })
          this.notes = notes
          this.notesLoaded = true
        },
        (error) => {
          console.error('error.message: ', error.message)
        }
      )
    },
    // effacer notes de l'user deconnecté
    clearNotes() {
      this.notes = []
      // se désabonner pour tout listener actif quand user se deconnecte
      if (getNotesSnapshot) getNotesSnapshot()
    },
    // add note from db firestore
    async addNote(newNoteContent) {
      let currentDate = new Date().getTime()
      let date = currentDate.toString()

      await addDoc(notesCollectionRef, {
        content: newNoteContent,
        date
      })
    },
    // delete note from db firestore
    async deleteNote(idToDelete) {
      await deleteDoc(doc(notesCollectionRef, idToDelete))
    },
    // update note from db firestore
    async updateNote(id, content) {
      await updateDoc(doc(notesCollectionRef, id), {
        content: content
      })
    }
  },
  getters: {
    getNoteContent: (state) => {
      return (id) => {
        return state.notes.filter((note) => note.id === id)[0].content
      }
    },
    totalNotesCount: (state) => {
      return state.notes.length
    },
    totalCharactersCount: (state) => {
      let count = 0
      state.notes.forEach((note) => {
        count += note.content.length
      })
      return count
    }
  }
})
