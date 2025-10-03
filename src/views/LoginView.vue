<template>
  <div class="login-container">
    <div class="form-card">
      <h1>{{ mode === 'login' ? 'Connexion' : 'Inscription' }}</h1>

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

      <p v-if="erreur" class="error">{{ erreur }}</p>
      <p v-if="message" class="success">{{ message }}</p>
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
const erreur = ref("")
const message = ref("")

function login() {
  try {
    store.login(pseudo.value, password.value)
    message.value = "Connexion réussie"
    erreur.value = ""
    router.push("/")
  } catch (e) {
    erreur.value = e.message
    message.value = ""
  }
}

function register() {
  try {
    store.register(pseudo.value, password.value)
    message.value = "Inscription réussie, tu peux maintenant te connecter"
    erreur.value = ""
    mode.value = "login"
  } catch (e) {
    erreur.value = e.message
    message.value = ""
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #000;
  color: #fff;
}

.form-card {
  background: #111;
  border: 1px solid #ff005c;
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 350px;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
}

input {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 90%;
  border-radius: 8px;
  border: 1px solid #333;
  background: #222;
  color: #fff;
}

button {
  margin-top: 15px;
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  background: #ff005c;
  border: none;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
}
button:hover {
  background: #e60050;
}

.switch {
  margin-top: 15px;
  font-size: 14px;
}
.switch a {
  color: #ff66b2;
  cursor: pointer;
}

.error {
  margin-top: 10px;
  color: red;
}
.success {
  margin-top: 10px;
  color: #4caf50;
}
</style>
