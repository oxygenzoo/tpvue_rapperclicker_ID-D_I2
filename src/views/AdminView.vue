<template>
  <div class="admin-container">
    <h1>Panneau Admin</h1>

    <!-- si pas admin -->
    <div v-if="!store.isAdmin" class="error">
      Accès interdit. Tu dois être connecté en admin.
    </div>

    <!-- si admin -->
    <div v-else>
      <!-- gestion utilisateurs -->
      <section class="card">
        <h2>Utilisateurs</h2>

        <div v-for="u in store.utilisateurs" :key="u.pseudo" class="user-card">
          <div class="user-header">
            <span class="pseudo">{{ u.pseudo }}</span>
            <span class="role">({{ u.role }})</span>
          </div>

          <!-- compte -->
          <div class="user-section">
            <h3>Compte</h3>
            <div class="actions">
              <button v-if="u.role !== 'admin'" @click="reset(u.pseudo)">Reset</button>
              <button v-if="u.role !== 'admin'" @click="supprimer(u.pseudo)">Supprimer</button>
              <button v-if="u.role !== 'admin'" @click="changerRole(u.pseudo, 'admin')">Promouvoir admin</button>
              <button v-if="u.role === 'admin' && u.pseudo !== 'admin'" @click="changerRole(u.pseudo, 'joueur')">Rétrograder joueur</button>
            </div>
          </div>

          <!-- score -->
          <div class="user-section">
            <h3>Score</h3>
            <div class="actions">
              <input type="number" v-model.number="nouveauScore[u.pseudo]" placeholder="Score" />
              <button @click="setScore(u.pseudo)">Définir</button>
            </div>
          </div>

          <!-- succès -->
          <div class="user-section">
            <h3>Succès</h3>
            <div class="actions">
              <select v-model="succesForcer[u.pseudo]">
                <option disabled value="">Choisir succès...</option>
                <option v-for="s in succesList" :key="s.nom" :value="s.nom">{{ s.nom }}</option>
              </select>
              <button @click="forcerSucces(u.pseudo)">Appliquer</button>
            </div>
          </div>

          <!-- messages -->
          <div class="user-section">
            <h3>Notification</h3>
            <div class="actions">
              <input type="text" v-model="message[u.pseudo]" placeholder="Message admin" />
              <button @click="envoyerMessage(u.pseudo)">Envoyer</button>
            </div>
          </div>
        </div>
      </section>

      <!-- purge -->
      <section class="card">
        <h2>Purge globale</h2>
        <button class="btn-red" @click="purgeGlobale">Réinitialiser TOUT</button>
      </section>

      <!-- classement -->
      <section class="card">
        <h2>Classement</h2>
        <ol>
          <li v-for="j in store.classement" :key="j.pseudo">
            {{ j.pseudo }} → {{ j.score }} fans
          </li>
        </ol>
      </section>

      <!-- défis -->
      <section class="card">
        <h2>Défis</h2>
        <ul>
          <li v-for="(d, i) in store.defis" :key="i">
            {{ d.from }} a défié {{ d.to }} ({{ formatDate(d.date) }})
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue"
import { useGameStore } from "../store/gameStore"

const store = useGameStore()
const nouveauScore = reactive({})
const succesForcer = reactive({})
const message = reactive({})

// liste des succès dispo
const succesList = [
  { seuil: 100, nom: "Star locale" },
  { seuil: 1000, nom: "Artiste reconnu" },
  { seuil: 10000, nom: "Superstar" },
  { seuil: 100000, nom: "Légende mondiale" }
]

// charger à l'ouverture
onMounted(() => {
  store.charger()
})

// reset joueur
function reset(pseudo) {
  store.adminReset(pseudo)
  alert("Sauvegarde de " + pseudo + " réinitialisée.")
}

// supprimer joueur
function supprimer(pseudo) {
  store.utilisateurs = store.utilisateurs.filter(u => u.pseudo !== pseudo)
  store.joueurs = store.joueurs.filter(j => j.pseudo !== pseudo)
  localStorage.removeItem("save_" + pseudo)
  store.sauvegarder()
  alert("Utilisateur " + pseudo + " supprimé.")
}

// set score
function setScore(pseudo) {
  const score = nouveauScore[pseudo]
  if (score === undefined || score < 0) return alert("Score invalide")
  store.adminSetScore(pseudo, score)
  alert("Score mis à jour pour " + pseudo)
}

// changer role
function changerRole(pseudo, role) {
  const user = store.utilisateurs.find(u => u.pseudo === pseudo)
  if (user) {
    user.role = role
    store.sauvegarder()
    alert(pseudo + " est maintenant " + role)
  }
}

// forcer succès
function forcerSucces(pseudo) {
  const s = succesForcer[pseudo]
  if (!s) return
  const save = JSON.parse(localStorage.getItem("save_" + pseudo) || "{}")
  if (!save.succes) save.succes = []
  if (!save.succes.includes(s)) save.succes.push(s)
  localStorage.setItem("save_" + pseudo, JSON.stringify(save))
  alert("Succès ajouté à " + pseudo + ": " + s)
}

// envoyer message
function envoyerMessage(pseudo) {
  if (!message[pseudo]) return
  const notif = { to: pseudo, text: message[pseudo], date: Date.now() }
  localStorage.setItem("notif_" + pseudo, JSON.stringify(notif))
  alert("Message envoyé à " + pseudo)
  message[pseudo] = ""
}

// purge tout
function purgeGlobale() {
  if (!confirm("Es-tu sûr de vouloir tout réinitialiser ?")) return
  store.joueurs = []
  store.defis = []
  store.utilisateurs = [{ pseudo: "admin", password: "admin123", role: "admin" }]
  localStorage.clear()
  store.sauvegarder()
  alert("Tout a été purgé.")
}

// format date
function formatDate(ts) {
  return new Date(ts).toLocaleString()
}
</script>

<style scoped>
.admin-container {
  padding: 20px;
  color: #fff;
}

h1,
h2,
h3 {
  color: #fff;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
  background: #220000;
  border: 2px solid red;
  padding: 10px;
  border-radius: 8px;
}

.card {
  background: #111;
  border: 2px solid #ff005c;
  border-radius: 12px;
  padding: 20px;
  margin: 20px auto;
  max-width: 900px;
}

.user-card {
  border: 1px solid #333;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  background: #1a1a1a;
}

.user-header {
  display: flex;
  justify-content: space-between;
  font-size: 1.2em;
  margin-bottom: 10px;
}

.pseudo {
  font-weight: bold;
  color: #ff66b2;
}

.role {
  font-size: 14px;
  color: #bbb;
}

.user-section {
  margin-bottom: 15px;
}

.user-section h3 {
  font-size: 1em;
  margin-bottom: 5px;
  color: #ccc;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.actions input,
.actions select {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ff005c;
  background: #222;
  color: white;
}

.actions button {
  background: #ff005c;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.actions button:hover {
  background: #ff66b2;
}

.btn-red {
  background: #b30000;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  color: white;
  cursor: pointer;
}

.btn-red:hover {
  background: #800000;
}

/* responsive */
@media (max-width: 768px) {
  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions input,
  .actions select,
  .actions button {
    width: 100%;
  }
}
</style>
