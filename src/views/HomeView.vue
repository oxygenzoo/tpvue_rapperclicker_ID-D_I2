<template>
  <div class="game-container">
    <!-- Gauche -->
    <div class="left-panel">
      <div class="micro-wrapper" @click="handleClick">
        <img 
          :src="microImg" 
          alt="Micro" 
          class="micro" 
          :class="{ clicked: microClicked }"
        />
        <span v-if="showPlusOne" class="plus-one">+1</span>
      </div>
      <h2><b>{{ store.fans }} fans</b></h2>
      <p>Production : {{ store.productionAuto }}/s</p>
      <p>Multiplicateur : x{{ store.multiplicateur }}</p>

      <!-- Notification -->
      <div v-if="notification" class="notif-box">
        <p><b>Message admin :</b></p>
        <p>{{ notification.text }}</p>
      </div>

      <!-- Défi -->
      <div v-if="objectifDefi" class="defi-box">
        <p><b>Défi en cours :</b></p>
        <p>Plus que {{ objectifDefi.restant }} fans pour dépasser {{ objectifDefi.cible }}</p>
      </div>
    </div>

    <!-- Centre -->
    <div class="center-panel">
      <h2>Succès débloqués</h2>
      <div class="succes-list">
        <div v-for="(s, i) in store.succes" :key="i" class="succes-card">
          {{ s }}
        </div>
        <p v-if="store.succes.length === 0" class="empty">Aucun succès pour l’instant</p>
      </div>

      <h2>Setup actuel</h2>
      <div class="setup-list">
        <div v-for="(e, i) in store.environnement" :key="i" class="setup-item">
          <img :src="e.img" :alt="e.nom" class="setup-img" />
          <p>{{ e.nom }} x{{ e.count }}</p>
        </div>
        <p v-if="store.environnement.length === 0" class="empty">Aucun équipement acheté</p>
      </div>
    </div>

    <!-- Droite -->
    <div class="right-panel">
      <h2>Boutique</h2>

      <div class="shop-section">
        <h3>Multiplicateurs</h3>
        <div class="shop-grid">
          <div
            v-for="m in multiplicateurs"
            :key="m.nom"
            class="shop-item"
            :class="{ disabled: store.fans < store.coutAvecDifficulte(m) }"
          >
            <div class="tooltip">
              <img :src="m.img" :alt="m.nom" class="shop-icon" @click="acheter(m)" />
              <div class="tooltip-content">
                <p><b>{{ m.nom }}</b></p>
                <p>x{{ m.mult }} sur tous les gains</p>
                <p>Coût : {{ store.coutAvecDifficulte(m) }} fans</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="shop-section">
        <h3>Machines de production</h3>
        <div class="shop-grid">
          <div
            v-for="p in machines"
            :key="p.nom"
            class="shop-item"
            :class="{ disabled: store.fans < store.coutAvecDifficulte(p) }"
          >
            <div class="tooltip">
              <img :src="p.img" :alt="p.nom" class="shop-icon" @click="acheter(p)" />
              <div class="tooltip-content">
                <p><b>{{ p.nom }}</b></p>
                <p v-if="p.prod">+{{ p.prod }}/s</p>
                <p v-if="p.mult">x{{ p.mult }}</p>
                <p>Coût : {{ store.coutAvecDifficulte(p) }} fans</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useGameStore } from "../store/gameStore"

const store = useGameStore()
store.charger()

// Micro
const microClicked = ref(false)
const showPlusOne = ref(false)
const microImg = new URL("../assets/images/micro.png", import.meta.url).href
function handleClick() {
  store.ajouterFans(1)
  microClicked.value = true
  setTimeout(() => (microClicked.value = false), 200)
  showPlusOne.value = true
  setTimeout(() => (showPlusOne.value = false), 600)
}

// Achat
function acheter(item) { store.acheterAmelioration(item) }

// Notifications
const notification = ref(null)
onMounted(() => {
  if (store.utilisateurActif) {
    const data = localStorage.getItem("notif_" + store.utilisateurActif.pseudo)
    if (data) {
      notification.value = JSON.parse(data)
      localStorage.removeItem("notif_" + store.utilisateurActif.pseudo)
    }
  }
})

// Défi
const objectifDefi = computed(() => {
  if (!store.utilisateurActif) return null
  const defi = store.defis.find(d => d.from === store.utilisateurActif.pseudo)
  if (!defi) return null
  const cible = store.joueurs.find(j => j.pseudo === defi.to)
  if (!cible) return null
  const restant = Math.max(cible.score - store.fans, 0)
  return { cible: defi.to, restant }
})

// Boutique
const multiplicateurs = [
  { nom: "Micro de bronze", cout: 500, mult: 2, img: new URL("../assets/images/micro.png", import.meta.url).href, unique: true },
  { nom: "Micro d'argent", cout: 2000, mult: 3, img: new URL("../assets/images/micro.png", import.meta.url).href, unique: true },
  { nom: "Micro d'or", cout: 10000, mult: 4, img: new URL("../assets/images/micro.png", import.meta.url).href, unique: true },
  { nom: "Micro de platine", cout: 50000, mult: 5, img: new URL("../assets/images/micro.png", import.meta.url).href, unique: true }
]
const machines = [
  { nom: "Studio maison", cout: 50, prod: 1, img: new URL("../assets/images/studio.png", import.meta.url).href },
  { nom: "Producteur local", cout: 200, prod: 5, img: new URL("../assets/images/producteur.png", import.meta.url).href },
  { nom: "Manager", cout: 1000, prod: 20, img: new URL("../assets/images/manager.png", import.meta.url).href },
  { nom: "Label indépendant", cout: 5000, prod: 100, img: new URL("../assets/images/label.png", import.meta.url).href },
  { nom: "Label international", cout: 20000, prod: 500, img: new URL("../assets/images/immeuble.png", import.meta.url).href },
  { nom: "Tournée nationale", cout: 50000, prod: 2000, img: new URL("../assets/images/bus.png", import.meta.url).href },
  { nom: "Tournée mondiale", cout: 200000, prod: 10000, img: new URL("../assets/images/tournee.png", import.meta.url).href },
  { nom: "Buzz TikTok", cout: 10000, mult: 2, img: new URL("../assets/images/buzz.png", import.meta.url).href },
  { nom: "Featuring rappeur", cout: 50000, mult: 3, img: new URL("../assets/images/featuring.png", import.meta.url).href },
  { nom: "Grammy Awards", cout: 100000, mult: 5, img: new URL("../assets/images/grammy.png", import.meta.url).href },
  { nom: "Chaîne en or", cout: 75000, mult: 2, img: new URL("../assets/images/chaine.png", import.meta.url).href },
  { nom: "Voiture de luxe", cout: 200000, prod: 5000, img: new URL("../assets/images/voiture.png", import.meta.url).href },
  { nom: "Villa de star", cout: 500000, prod: 10000, img: new URL("../assets/images/villa.png", import.meta.url).href },
  { nom: "Empire multimédia", cout: 1000000, prod: 50000, img: new URL("../assets/images/satellite.png", import.meta.url).href }
]
</script>

<style scoped>
.game-container {
  display: flex;
  justify-content: space-between;
  height: 100vh;
}
.left-panel, .center-panel, .right-panel {
  flex: 1;
  padding: 20px;
}
.left-panel { text-align: center; border-right: 2px solid #333; }
.center-panel { text-align: center; border-right: 2px solid #333; }
.right-panel { text-align: center; }

/* Boxes */
.notif-box, .defi-box, .succes-card {
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
}
.notif-box { background: #222; border: 1px solid #ff005c; }
.defi-box { background: #1a1a1a; border: 1px solid #0077ff; }
.succes-card { background: #111; border: 1px solid #ff005c; color: #ff005c; font-weight: bold; }
.empty { color: #888; }

/* Setup */
.setup-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 15px;
}
.setup-item { text-align: center; }
.setup-img { width: 50px; height: 50px; }

/* Boutique */
.shop-section { margin: 20px 0; }
.shop-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.shop-item.disabled .shop-icon { filter: grayscale(100%); opacity: 0.5; cursor: not-allowed; }
.shop-icon { width: 70px; height: 70px; cursor: pointer; transition: transform 0.2s ease; }
.shop-icon:hover { transform: scale(1.1); }

/* Tooltip */
.tooltip { position: relative; display: inline-block; }
.tooltip-content {
  visibility: hidden;
  opacity: 0;
  width: 180px;
  background: #111;
  color: #fff;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ff005c;
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  transition: opacity 0.2s;
}
.tooltip:hover .tooltip-content { visibility: visible; opacity: 1; }

/* Micro */
.micro {
  max-width: 180px;
  width: 100%;
  height: auto;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: block;
  margin: 0 auto;
}
.micro.clicked { transform: scale(1.1); }

/* Responsive */
@media (max-width: 768px) {
  .game-container { flex-direction: column; height: auto; }
  .left-panel, .center-panel, .right-panel {
    border: none;
    margin-bottom: 20px;
  }
  .micro { max-width: 120px; }
}
</style>
