<script setup>
/*
  imports
*/
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useStoreAuth } from '@/stores/storeAuth'

/*
  store (pour bouton "Log out")
*/
const storeAuth = useStoreAuth()

/*
  mobile nav
*/
const showMobileNav = ref(false)

/*
  click outside to close menu (VueUse composable)
*/
const navbarMenuRef = ref(null)
const navbarBurgerRef = ref(null)

onClickOutside(
  navbarMenuRef,
  () => {
    showMobileNav.value = false
  },
  {
    ignore: [navbarBurgerRef]
  }
)

/*
  logout
*/
const logout = () => {
  // masquer menu mobile quand click sur "Log out"
  showMobileNav.value = false
  // déconnecter le user
  storeAuth.logoutUser()
}
</script>

<template>
  <nav class="navbar is-success" role="navigation" aria-label="main navigation">
    <div class="container is-max-desktop px-2">
      <div class="navbar-brand">
        <div class="navbar-item is-size-4 is-family-monospace">Note-Balls</div>

        <a
          @click.prevent="showMobileNav = !showMobileNav"
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': showMobileNav }"
          ref="navbarBurgerRef"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        class="navbar-menu"
        :class="{ 'is-active': showMobileNav }"
        ref="navbarMenuRef"
      >
        <!-- Log Out -->
        <div class="navbar-start">
          <button
            v-if="storeAuth.user.id"
            @click="logout"
            class="button is-small is-info mt-3 ml-3"
          >
            Log out >> {{ storeAuth.user.email }}
          </button>
        </div>
        <!-- Notes & Stats -->
        <div class="navbar-end">
          <RouterLink
            @click="showMobileNav = false"
            to="/"
            class="navbar-item"
            active-class="is-active"
          >
            Notes
          </RouterLink>
          <RouterLink
            @click="showMobileNav = false"
            to="/stats"
            class="navbar-item"
            active-class="is-active"
          >
            Stats
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
@media (max-width: 1023px) {
  .navbar-menu {
    position: absolute;
    left: 0;
    width: 100%;
  }
}
</style>
