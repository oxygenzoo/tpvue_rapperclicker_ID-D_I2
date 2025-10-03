<template>
  <div class="auth-container">
    <div class="form-card">
      <h1>Créer un compte</h1>

      <input v-model="pseudo" placeholder="Pseudo" />
      <input type="password" v-model="password" placeholder="Mot de passe" />

      <button @click="register">S'inscrire</button>

      <p class="switch">
        Déjà un compte ? 
        <router-link to="/login">Se connecter</router-link>
      </p>

      <p v-if="erreur" class="error">{{ erreur }}</p>
      <p v-if="message" class="success">{{ message }}</p>
    </div>
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
const message = ref("")

function register() {
  if (!pseudo.value.trim() || !password.value.trim()) {
    erreur.value = "Remplis tous les champs"
    return
  }

  try {
    store.register(pseudo.value.trim(), password.value.trim())
    message.value = "Inscription réussie !"
    erreur.value = ""
    setTimeout(() => {
      router.push("/login")
    }, 1200) // petit délai pour afficher le succès
  } catch (e) {
    erreur.value = e.message
    message.value = ""
  }
}
</script>

<style scoped>
.auth-container {
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
