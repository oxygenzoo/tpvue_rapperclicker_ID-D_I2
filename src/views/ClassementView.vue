<template>
  <div class="classement-container">
    <h1>🏆 Classement des joueurs</h1>

    <ol class="leaderboard">
      <li v-for="j in store.classement" :key="j.pseudo">
        <span class="pseudo">{{ j.pseudo }}</span>
        <span class="score">{{ j.score }} fans</span>

        <!-- Défi (visible si pas soi-même et connecté) -->
        <button
          v-if="store.utilisateurActif && j.pseudo !== store.utilisateurActif.pseudo"
          class="defi"
          @click="defier(j.pseudo)"
        >
          Défi
        </button>

        <!-- Outils admin -->
        <div v-if="store.isAdmin" class="admin-tools">
          <button @click="reset(j.pseudo)">Reset</button>
          <input
            type="number"
            v-model.number="nouveauScore[j.pseudo]"
            placeholder="Nouveau score"
          />
          <button @click="setScore(j.pseudo)">Set Score</button>
        </div>
      </li>
    </ol>

    <h2 v-if="store.defis.length > 0">⚔️ Défis lancés</h2>
    <ul v-if="store.defis.length > 0" class="defis-list">
      <li v-for="(d, i) in store.defis" :key="i">
        {{ d.from }} a défié {{ d.to }} ({{ formatDate(d.date) }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { useGameStore } from "../store/gameStore"

const store = useGameStore()
const nouveauScore = reactive({})

function defier(pseudo) {
  try {
    store.defierJoueur(pseudo)
    alert("Défi envoyé à " + pseudo + " !")
  } catch (e) {
    alert(e.message)
  }
}

function reset(pseudo) {
  try {
    store.adminReset(pseudo)
    alert("Score de " + pseudo + " réinitialisé.")
  } catch (e) {
    alert(e.message)
  }
}

function setScore(pseudo) {
  try {
    const score = nouveauScore[pseudo]
    if (!score || score < 0) return alert("Score invalide")
    store.adminSetScore(pseudo, score)
    alert("Score mis à jour pour " + pseudo)
  } catch (e) {
    alert(e.message)
  }
}

function formatDate(ts) {
  return new Date(ts).toLocaleString()
}
</script>

<style scoped>
.classement-container {
  text-align: center;
  padding: 20px;
  color: #fff;
}

.leaderboard {
  list-style: none;
  padding: 0;
  margin: 20px auto;
  max-width: 600px;
}

.leaderboard li {
  background: #111;
  border: 2px solid #ff005c;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pseudo {
  font-weight: bold;
  color: #ff66b2;
}

.score {
  margin-left: auto;
  margin-right: 15px;
}

.defi {
  background: #ff005c;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.admin-tools {
  margin-left: 20px;
  display: flex;
  gap: 5px;
  align-items: center;
}

.admin-tools input {
  width: 100px;
  padding: 3px;
  border-radius: 6px;
  border: 1px solid #ff005c;
  background: #222;
  color: white;
}
</style>
