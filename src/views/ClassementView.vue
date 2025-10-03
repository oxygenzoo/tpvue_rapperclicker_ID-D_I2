<template>
  <div class="classement-container">
    <h1>Classement des joueurs</h1>

    <!-- Bouton pour enregistrer son score -->
    <div class="save-score">
      <button class="btn-save" @click="enregistrerMonScore">Enregistrer mon score</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Position</th>
          <th>Pseudo</th>
          <th>Score</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(j, index) in store.classement" :key="j.pseudo">
          <td>{{ index + 1 }}</td>
          <td>{{ j.pseudo }}</td>
          <td>{{ j.score }}</td>
          <td>
            <div v-if="store.utilisateurActif && j.pseudo !== store.utilisateurActif.pseudo">
              <!-- Si déjà un défi en cours -->
              <button
                v-if="aDejaDefie(j.pseudo)"
                class="btn-cancel"
                @click="annulerDefi(j.pseudo)"
              >
                Annuler défi
              </button>

              <!-- Sinon on peut défier -->
              <button
                v-else
                class="btn-defi"
                @click="defier(j.pseudo)"
              >
                Défier
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useGameStore } from '../store/gameStore'
const store = useGameStore()

// Enregistrer le score du joueur actif
function enregistrerMonScore() {
  if (store.utilisateurActif) {
    store.enregistrerJoueur(store.utilisateurActif.pseudo)
    alert("Ton score a été enregistré")
  } else {
    alert("Connecte-toi pour enregistrer ton score")
  }
}

// Vérifier si on a déjà lancé un défi à ce joueur
function aDejaDefie(pseudoCible) {
  if (!store.utilisateurActif) return false
  return store.defis.some(
    d => d.from === store.utilisateurActif.pseudo && d.to === pseudoCible
  )
}

// Lancer un défi
function defier(pseudoCible) {
  try {
    store.defierJoueur(pseudoCible)
    alert(`Défi lancé contre ${pseudoCible} !`)
  } catch (e) {
    alert(e.message)
  }
}

// Annuler un défi
function annulerDefi(pseudoCible) {
  if (!store.utilisateurActif) return
  store.defis = store.defis.filter(
    d => !(d.from === store.utilisateurActif.pseudo && d.to === pseudoCible)
  )
  store.sauvegarder()
  alert(`Défi contre ${pseudoCible} annulé`)
}
</script>

<style scoped>
.classement-container {
  text-align: center;
  padding: 20px;
  color: #fff;
}

.save-score {
  margin-bottom: 20px;
}

button {
  padding: 8px 15px;
  border-radius: 8px;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
}
button:hover { opacity: 0.85; }

.btn-save {
  background: #ff005c;
}
.btn-defi {
  background: #0077ff;
}
.btn-cancel {
  background: #b30000;
}

table {
  margin: 0 auto;
  border-collapse: collapse;
  width: 80%;
  max-width: 900px;
}

th, td {
  border: 1px solid #ff005c;
  padding: 10px;
}

th {
  background: #111;
}

/* Responsive */
@media (max-width: 768px) {
  table {
    font-size: 0.9rem;
    width: 100%;
  }
  th, td {
    padding: 6px;
  }
}
</style>
