<template>
  <div class="auth-container">
    <h1 class="title">Rapper Clicker</h1> 
    <p class="subtitle">
      Deviens une star du rap en collectant des fans, en achetant des améliorations et en montant dans le classement !
    </p>

    <!-- Toggle -->
    <div class="toggle-buttons">
      <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Connexion</button>
      <button :class="{ active: mode === 'register' }" @click="mode = 'register'">Inscription</button>
    </div>

    <!-- Formulaire -->
    <div class="form">
      <input v-model="pseudo" placeholder="Pseudo" />
      <input type="password" v-model="password" placeholder="Mot de passe" />
      <button @click="soumettre">
        {{ mode === 'login' ? 'Se connecter' : 'S\'inscrire' }}
      </button>
    </div>

    <p v-if="erreur" class="error">{{ erreur }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '../store/gameStore'
import { useRouter } from 'vue-router'

const store = useGameStore()
const router = useRouter()

const mode = ref("login")
const pseudo = ref("")
const password = ref("")
const erreur = ref("")

function soumettre() {
  try {
    if (mode.value === "login") {
      store.login(pseudo.value, password.value)
    } else {
      store.register(pseudo.value, password.value)
      store.login(pseudo.value, password.value)
    }
    router.push("/")
  } catch (e) {
    erreur.value = e.message
  }
}
</script>

<style scoped>
.auth-container {
  text-align: center;
  padding: 40px;
  color: #fff;
}

.title {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 10px;
}

.subtitle {
  margin-bottom: 30px;
  color: #bbb;
  font-style: italic;
}

.toggle-buttons {
  margin-bottom: 20px;
}

.toggle-buttons button {
  background: #222;
  border: 2px solid #ff005c;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-buttons button.active {
  background: #ff005c;
}

.form {
  margin: 20px auto;
  width: 250px;
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ff005c;
  margin-bottom: 15px;
  background: #111;
  color: #fff;
}

button {
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #ff005c;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
}
button:hover {
  background: #ff66b2;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
