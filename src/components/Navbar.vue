<template>
  <nav class="navbar">
    <router-link to="/" class="nav-link">Accueil</router-link>
    <router-link to="/stats" class="nav-link">Stats</router-link>
    <router-link to="/classement" class="nav-link">Classement</router-link>

    <!-- Si connecté -->
    <div v-if="store.utilisateurActif" class="user-section">
      <span class="welcome">Bonjour, {{ store.utilisateurActif.pseudo }}</span>
      <button class="logout" @click="logout">Logout</button>
    </div>

    <!-- Si pas connecté -->
    <div v-else class="user-section">
      <router-link to="/auth" class="nav-link">Login</router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useGameStore } from '../store/gameStore'

const store = useGameStore()
const router = useRouter()

function logout() {
  store.logout()
  router.push('/auth')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #111;
  border-bottom: 2px solid #ff005c;
  padding: 10px;
  margin-bottom: 20px;
}

.nav-link {
  color: #fff;
  margin: 0 15px;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s ease, transform 0.2s ease;
}

.nav-link:hover {
  color: #ff66b2;
  transform: scale(1.1);
}

.router-link-active {
  color: #ff005c;
  text-decoration: underline;
}

.user-section {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome {
  color: #fff;
  font-weight: bold;
}

.logout {
  padding: 5px 12px;
  border-radius: 8px;
  border: none;
  background: #ff005c;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
}
.logout:hover {
  background: #ff66b2;
}
</style>
