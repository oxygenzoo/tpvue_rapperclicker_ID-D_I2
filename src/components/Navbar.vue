<template>
  <header>
    <!-- logo -->
    <div class="nav-left">
      <img src="../assets/logo.png" alt="Logo" height="100" class="logo" @click="goHome" />
    </div>

    <!-- liens desktop -->
    <nav class="nav-center desktop-nav">
      <ul>
        <li><router-link to="/">Accueil</router-link></li>
        <li><router-link to="/stats">Stats et Compte</router-link></li>
        <li><router-link to="/classement">Classement</router-link></li>
        <li v-if="store.isAdmin"><router-link to="/admin">Admin</router-link></li>
      </ul>
    </nav>

    <!-- user desktop -->
    <div class="nav-right desktop-nav">
      <div v-if="!store.utilisateurActif">
        <router-link to="/auth">Connexion</router-link>
      </div>
      <div v-else>
        <span class="welcome">Bonjour, {{ store.utilisateurActif.pseudo }}</span>
        <button class="logout" @click="logout">Déconnexion</button>
      </div>
    </div>

    <!-- burger mobile -->
    <div class="hamburger" v-if="!menuOpen" @click="toggleMenu">&#9776;</div>

    <!-- menu mobile -->
    <div v-if="menuOpen" class="menu-overlay">
      <div class="menu-header">
        <img src="../assets/logo.png" alt="Logo" height="100" class="logo" @click="goHome" />
        <div class="close" @click="toggleMenu">&times;</div>
      </div>

      <nav>
        <ul>
          <!-- bonjour -->
          <li v-if="store.utilisateurActif" class="welcome-mobile">
            Bonjour, {{ store.utilisateurActif.pseudo }}
          </li>

          <!-- liens -->
          <li><router-link to="/" @click="closeMenu">Accueil</router-link></li>
          <li><router-link to="/stats" @click="closeMenu">Stats</router-link></li>
          <li><router-link to="/classement" @click="closeMenu">Classement</router-link></li>
          <li v-if="store.isAdmin"><router-link to="/admin" @click="closeMenu">Admin</router-link></li>

          <!-- bouton co/deco -->
          <li v-if="store.utilisateurActif">
            <button class="logout" @click="logout">Déconnexion</button>
          </li>
          <li v-else>
            <router-link to="/auth" @click="closeMenu">Connexion</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useGameStore } from "../store/gameStore"

const store = useGameStore()
const router = useRouter()
const menuOpen = ref(false)

// toggle menu
function toggleMenu() { menuOpen.value = !menuOpen.value }
// fermer menu
function closeMenu() { menuOpen.value = false }
// logout
function logout() {
  store.logout()
  router.push("/auth")
  closeMenu()
}
// go home
function goHome() { router.push("/") }
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #111;
  color: white;
  position: relative;
  z-index: 1100;
}

.logo {
  cursor: pointer;
}

/* nav desktop */
.nav-left,
.nav-center,
.nav-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.nav-center {
  justify-content: center;
}

.nav-center ul {
  display: flex;
  gap: 20px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-center ul li a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.nav-center ul li a:hover {
  color: #ff66b2;
}

.nav-right {
  justify-content: flex-end;
  gap: 10px;
}

.welcome {
  margin-right: 10px;
  font-weight: bold;
}

.logout {
  background: #ff005c;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
}

/* burger */
.hamburger {
  font-size: 2rem;
  cursor: pointer;
  color: white;
  display: none;
}

.close {
  font-size: 2rem;
  cursor: pointer;
  color: white;
}

/* menu mobile */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #111;
  display: flex;
  flex-direction: column;
  z-index: 1200;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.menu-overlay nav {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.menu-overlay ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 0;
  margin: 0;
  align-items: center;
}

.menu-overlay ul li a {
  font-size: 1.4rem;
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.welcome-mobile {
  font-size: 1.2rem;
  color: #ff66b2;
  font-weight: bold;
  margin-bottom: 10px;
}

/* responsive */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .hamburger {
    display: block;
  }
}
</style>
