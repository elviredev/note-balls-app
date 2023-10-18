import { createRouter, createWebHashHistory } from 'vue-router'
import { useStoreAuth } from '@/stores/storeAuth'
import ViewNotes from '@/views/ViewNotes.vue'
import ViewStats from '@/views/ViewStats.vue'
import ViewEditNote from '@/views/ViewEditNote.vue'
import ViewAuth from '@/views/ViewAuth.vue'

const routes = [
  {
    path: '/',
    name: 'notes',
    component: ViewNotes
  },
  {
    path: '/editNote/:id',
    name: 'edit-note',
    component: ViewEditNote
  },
  {
    path: '/stats',
    name: 'stats',
    component: ViewStats
  },
  {
    path: '/auth',
    name: 'auth',
    component: ViewAuth
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// navigation guards
router.beforeEach(async (to, from) => {
  const storeAuth = useStoreAuth()
  // console.log('to: ', to)
  // user logout & souhaite aller sur autre page que "auth" page
  if (!storeAuth.user.id && to.name !== 'auth') {
    return { name: 'auth' }
  }
  // user login & souhaite aller sur "auth" page
  if (storeAuth.user.id && to.name === 'auth') {
    return false
  }
})
export default router
