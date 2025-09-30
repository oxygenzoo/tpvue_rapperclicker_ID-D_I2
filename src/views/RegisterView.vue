<template>
  <div class="auth-container">
    <h1>Créer un compte</h1>

    <div class="form">
      <input v-model="pseudo" placeholder="Pseudo" />
      <input type="password" v-model="password" placeholder="Mot de passe" />
      <button @click="register">S'inscrire</button>
    </div>

    <p>Déjà un compte ? <router-link to="/login">Se connecter</router-link></p>

    <p v-if="erreur" class="error">{{ erreur }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '../store/gameStore'
import { useRouter } from 'vue-router'

const store = useGameStore()
const router = useRouter()

const pseudo = ref("")
const password = ref("")
const erreur = ref("")

function register() {
  try {
    store.register(pseudo.value, password.value)
    router.push("/login") // redirige vers login
  } catch (e) {
    erreur.value = e.message
  }
}
</script>

<style scoped>
.auth-container {
  text-align: center;
  padding: 20px;
  color: #fff;
}
.form {
  margin: 20px auto;
}
input {
  display: block;
  margin: 10px auto;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ff005c;
}
button {
  padding: 8px 15px;
  border-radius: 8px;
  border: none;
  background: #ff005c;
  color: #fff;
  cursor: pointer;
}
.error {
  color: red;
}
</style>
