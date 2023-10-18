<script setup>
/*
  imports
*/
import { ref } from 'vue'
import Note from '@/components/Notes/Note.vue'
import AddEditNote from '@/components/Notes/AddEditNote.vue'
import { useStoreNotes } from '@/stores/storeNotes'
import { useWatchCharacters } from '@/use/useWatchCharacters'

/*
  store
*/
const storeNotes = useStoreNotes()

/*
  notes
*/
const newNote = ref('')
const addEditNoteRef = ref(null)

// add note
const addNote = () => {
  storeNotes.addNote(newNote.value)
  newNote.value = ''
  addEditNoteRef.value.focusTextarea()
}

/*
  watch characters
*/
useWatchCharacters(newNote)
</script>

<template>
  <div class="notes">
    <!-- Add Note Form -->
    <AddEditNote v-model="newNote" ref="addEditNoteRef" placeholder="Add a new note">
      <template #buttons>
        <button @click="addNote" :disabled="!newNote" class="button is-link has-background-success">
          Add New Note
        </button>
      </template>
    </AddEditNote>

    <!-- Show Progress Bar si les notes ne sont pas chargée -->
    <progress v-if="!storeNotes.notesLoaded" class="progress is-large is-success" max="100" />
    <template v-else>
      <!-- Liste Notes -->
      <Note v-for="note in storeNotes.notes" :key="note.id" :note="note" />
      <!-- Si aucune notes -->
      <div
        v-if="!storeNotes.notes.length"
        class="is-size-4 has-text-centered has-text-grey-light is-family-monospace py-6"
      >
        No notes here yet...
      </div>
    </template>
  </div>
</template>

<style scoped></style>
