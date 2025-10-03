<template>
  <div class="stats-container">
    <!-- Bloc 1 : Gestion du compte -->
    <section class="section-card account-section">
      <h2>Gestion du compte</h2>

      <div class="form-grid">
        <label>Nouveau pseudo :</label>
        <input v-model="newPseudo" placeholder="Nouveau pseudo" />
        <button class="btn-pink" @click="updatePseudo">Modifier</button>

        <label>Nouveau mot de passe :</label>
        <input type="password" v-model="newPassword" placeholder="Nouveau mot de passe" />
        <button class="btn-pink" @click="updatePassword">Modifier</button>
      </div>

      <div class="options-row">
        <label>
          <input type="checkbox" v-model="publier" @change="togglePublish" />
          Publier mes résultats en temps réel
        </label>
      </div>

      <div class="actions">
        <button class="btn-red" @click="resetGame">Réinitialiser ma partie</button>
      </div>
    </section>

    <!-- Bloc 2 : Prochain succès -->
    <section class="section-card success-section">
      <h2>Prochain succès</h2>
      <p v-if="prochainSucces">
        Objectif : <b>{{ prochainSucces.nom }}</b> ({{ prochainSucces.seuil }} fans)
      </p>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :class="{ complete: progression >= 100 }"
          :style="{ width: progression + '%' }"
        ></div>
      </div>
      <p>{{ progression.toFixed(1) }}% atteint</p>
      <p v-if="progression >= 100" class="success-msg">✅ Succès atteint !</p>
    </section>

    <!-- Bloc 2b : Objectif de défi -->
    <section
      class="section-card defi-section"
      v-if="objectifDefi"
    >
      <h2>Défi en cours</h2>
      <p>Objectif : <b>Dépasser {{ objectifDefi.cible }}</b></p>
      <div class="progress-bar">
        <div
          class="progress-fill defi-progress"
          :style="{ width: defiProgression + '%' }"
        ></div>
      </div>
      <p>{{ defiProgression.toFixed(1) }}% atteint</p>
      <div class="actions">
        <button class="btn-red" @click="annulerDefi">Annuler mon défi</button>
      </div>
    </section>

    <!-- Bloc 3 : Notifications admin -->
    <section class="section-card notif-section" v-if="notification">
      <h2>Message admin</h2>
      <p>{{ notification.text }}</p>
      <div class="actions">
        <button class="btn-pink" @click="fermerNotif">Fermer</button>
      </div>
    </section>

    <!-- Bloc 4 : Statistiques détaillées -->
    <section class="section-card stats-section">
      <h2>Statistiques du jeu</h2>
      <div class="stats-grid">
        <div class="stat-box">
          <h3>Fans actuels</h3>
          <p>{{ store.fans }}</p>
        </div>
        <div class="stat-box">
          <h3>Production</h3>
          <p>{{ store.productionAuto }}/s ({{ store.productionAuto * 60 }}/min)</p>
        </div>
        <div class="stat-box">
          <h3>Total fans cumulés</h3>
          <p>{{ store.stats.totalFans }}</p>
        </div>
        <div class="stat-box">
          <h3>Détails</h3>
          <p>Clics : {{ store.stats.clics }}</p>
          <p>Auto : {{ store.stats.auto }}</p>
        </div>
        <div class="stat-box">
          <h3>Ratio</h3>
          <p v-if="store.stats.totalFans > 0">
            {{ Math.round((store.stats.clics / store.stats.totalFans) * 100) }}% clics /
            {{ Math.round((store.stats.auto / store.stats.totalFans) * 100) }}% auto
          </p>
          <p v-else>Pas encore de stats</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useGameStore } from "../store/gameStore"

const store = useGameStore()
const newPseudo = ref("")
const newPassword = ref("")
const publier = ref(false)

// Compte
function updatePseudo() {
  if (newPseudo.value.trim()) {
    store.utilisateurActif.pseudo = newPseudo.value
    store.sauvegarder()
    newPseudo.value = ""
  }
}
function updatePassword() {
  if (newPassword.value.trim()) {
    store.utilisateurActif.password = newPassword.value
    store.sauvegarder()
    newPassword.value = ""
  }
}
function togglePublish() {
  if (publier.value && store.utilisateurActif) {
    store.enregistrerJoueur(store.utilisateurActif.pseudo)
  }
}
function resetGame() {
  if (store.utilisateurActif) {
    store.adminReset(store.utilisateurActif.pseudo)
    window.location.reload()
  }
}

// Succès
const succesList = [
  { seuil: 100, nom: "Star locale" },
  { seuil: 1000, nom: "Artiste reconnu" },
  { seuil: 10000, nom: "Superstar" },
  { seuil: 100000, nom: "Légende mondiale" },
]
const prochainSucces = computed(() => succesList.find(s => s.seuil > store.fans))
const progression = computed(() => {
  if (!prochainSucces.value) return 100
  const lastSeuil = succesList.filter(s => s.seuil <= store.fans).map(s => s.seuil).pop() || 0
  return ((store.fans - lastSeuil) / (prochainSucces.value.seuil - lastSeuil)) * 100
})

// Objectif de défi
const objectifDefi = computed(() => {
  if (!store.utilisateurActif) return null
  const defi = store.defis.find(d => d.from === store.utilisateurActif.pseudo)
  if (!defi) return null
  const cible = store.joueurs.find(j => j.pseudo === defi.to)
  if (!cible) return null
  return { cible: defi.to, score: cible.score }
})
const defiProgression = computed(() => {
  if (!objectifDefi.value) return 0
  const cibleScore = objectifDefi.value.score
  return Math.min((store.fans / cibleScore) * 100, 100)
})
function annulerDefi() {
  if (!store.utilisateurActif) return
  store.defis = store.defis.filter(d => d.from !== store.utilisateurActif.pseudo)
  store.sauvegarder()
  alert("Ton défi a été annulé")
}

// Notifications admin
const notification = ref(null)
onMounted(() => {
  if (store.utilisateurActif) {
    const data = localStorage.getItem("notif_" + store.utilisateurActif.pseudo)
    if (data) {
      notification.value = JSON.parse(data)
      // pas de remove auto → reste tant que non fermée
    }
  }
})
function fermerNotif() {
  notification.value = null
  if (store.utilisateurActif) {
    localStorage.removeItem("notif_" + store.utilisateurActif.pseudo)
  }
}
</script>

<style scoped>
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}
.section-card {
  background: #111;
  border: 2px solid #ff005c;
  border-radius: 12px;
  padding: 30px;
  color: white;
  width: 100%;
  box-sizing: border-box;
}
.section-card h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
}
.form-grid {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 15px;
  align-items: center;
}
.form-grid label { font-weight: bold; text-align: right; }
.options-row { margin-top: 15px; }
.actions { margin-top: 20px; text-align: center; }

/* Boutons */
.btn-pink {
  background: #ff005c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-pink:hover { background: #e60050; }
.btn-red {
  background: #b30000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-red:hover { background: #800000; }

/* Progress bar */
.progress-bar {
  background: #333;
  border-radius: 10px;
  height: 20px;
  overflow: hidden;
  margin: 15px 0;
}
.progress-fill {
  background: linear-gradient(90deg, #ff005c, #ff7ab8);
  height: 100%;
  transition: width 0.3s ease;
}
.progress-fill.complete {
  background: green;
}
.defi-progress {
  background: linear-gradient(90deg, #0077ff, #66b3ff);
}
.success-msg {
  color: lightgreen;
  font-weight: bold;
  text-align: center;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.stat-box {
  background: #222;
  border-radius: 8px;
  padding: 15px;
  box-shadow: inset 0 0 8px #ff005c55;
  text-align: center;
}
.stat-box h3 { margin-bottom: 10px; }

/* Responsive */
@media (max-width: 900px) {
  .form-grid { grid-template-columns: 1fr; gap: 10px; }
  .form-grid label { text-align: left; }
  .form-grid input { width: 100%; }
  .btn-pink { width: 100%; }
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
