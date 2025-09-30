<template>
  <div class="login-container">
    <h1>🔑 Connexion / Inscription</h1>

    <div class="form-card">
      <h2 v-if="mode === 'login'">Connexion</h2>
      <h2 v-else>Inscription</h2>

      <input v-model="pseudo" placeholder="Pseudo" />
      <input v-model="password" type="password" placeholder="Mot de passe" />

      <button v-if="mode === 'login'" @click="login">Se connecter</button>
      <button v-else @click="register">S’inscrire</button>

      <p class="switch">
        <span v-if="mode === 'login'">
          Pas encore inscrit ?
          <a href="#" @click.prevent="mode = 'register'">Créer un compte</a>
        </span>
        <span v-else>
          Déjà inscrit ?
          <a href="#" @click.prevent="mode = 'login'">Se connecter</a>
        </span>
      </p>

      <p v-if="store.utilisateurActif">
        ✅ Connecté en tant que <b>{{ store.utilisateurActif.pseudo }}</b>
        (rôle : {{ store.utilisateurActif.role }})
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useGameStore } from "../store/gameStore"

const store = useGameStore()
const router = useRouter()

const pseudo = ref("")
const password = ref("")
const mode = ref("login")

function login() {
  try {
    store.login(pseudo.value, password.value)
    alert("Connexion réussie !")
    router.push("/") // redirige vers le jeu
  } catch (e) {
    alert(e.message)
  }
}

function register() {
  try {
    store.register(pseudo.value, password.value)
    alert("Inscription réussie, connecte-toi maintenant.")
    mode.value = "login"
  } catch (e) {
    alert(e.message)
  }
}
</script>

<style scoped>
.login-container {
  text-align: center;
  margin-top: 50px;
  color: #fff;
}

.form-card {
  background: #111;
  border: 2px solid #ff005c;
  border-radius: 12px;
  padding: 20px;
  width: 300px;
  margin: auto;
}

input {
  display: block;
  margin: 10px auto;
  padding: 8px;
  width: 90%;
  border-radius: 8px;
  border: none;
}

button {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  background: #ff005c;
  border: none;
  color: white;
  cursor: pointer;
}

.switch {
  margin-top: 15px;
  font-size: 14px;
}
.switch a {
  color: #ff005c;
  cursor: pointer;
}
</style>
