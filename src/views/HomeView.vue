<template>
  <div class="game-container">
    <!-- Gauche : Micro cliquable -->
    <div class="left-panel">
      <div class="micro-wrapper" @click="handleClick">
        <img
          :src="microImg"
          alt="Micro"
          class="micro"
          :class="{ clicked: microClicked }"
        />
        <span v-if="showPlusOne" class="plus-one">+{{ plusOneValue }}</span>
      </div>
      <h2>{{ store.fans }} fans</h2>
      <p>Production : {{ store.productionParSeconde }}/sec ({{ store.productionParMinute }}/min)</p>
      <p>Multiplicateur : x{{ store.multiplicateur }}</p>
    </div>

    <!-- Centre : Environnement + Succès -->
    <div class="center-panel">
      <h1>🎤 Rapper Clicker</h1>

      <!-- Zone environnement -->
      <div class="environnement">
        <div
          v-for="(e, index) in store.environnement"
          :key="index"
          class="env-item"
        >
          <img :src="e.img" :alt="e.nom" class="env-img" />
          <p>{{ e.nom }} x{{ e.count }}</p>
        </div>
      </div>

      <h3>Succès débloqués :</h3>
      <ul>
        <li v-for="(s, i) in store.succes" :key="i">{{ s }}</li>
      </ul>
    </div>

    <!-- Droite : Boutique -->
    <div class="right-panel">
      <h2>🎶 Boutique</h2>
      <div v-for="a in upgrades" :key="a.nom" class="upgrade-card">
        <img :src="a.img" :alt="a.nom" class="upgrade-img" />
        <div>
          <p><b>{{ a.nom }}</b></p>
          <p v-if="a.prod">+{{ a.prod }}/sec</p>
          <p v-if="a.mult">x{{ a.mult }} clics</p>

          <p>Coût : {{ cout(a) }} fans</p>
          <p v-if="countOwned(a.nom) > 0">Possédés : x{{ countOwned(a.nom) }}</p>

          <button
            :disabled="cout(a) > store.fans"
            @click="acheter(a)"
          >
            Acheter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../store/gameStore'

const store = useGameStore()

// Démarrage : init = charger + startAutoProduction
onMounted(() => {
  store.init()
})

// Sauvegarde toutes les 5 secondes
setInterval(() => {
  store.sauvegarder()
}, 5000)

// Animation micro
const microClicked = ref(false)
const showPlusOne = ref(false)
const plusOneValue = computed(() => 1 * store.multiplicateur)

// Image du micro
const microImg = new URL('../assets/images/micro.png', import.meta.url).href

// Liste des upgrades (coût de base, le coût courant est calculé dynamiquement par le store)
const upgrades = [
  { nom: 'Studio maison', cout: 100, prod: 5, img: new URL('../assets/images/studio.png', import.meta.url).href },
  { nom: 'Producteur local', cout: 500, prod: 20, img: new URL('../assets/images/producteur.png', import.meta.url).href },
  { nom: 'Manager', cout: 1000, prod: 50, img: new URL('../assets/images/manager.png', import.meta.url).href },
  { nom: 'Label indépendant', cout: 5000, prod: 200, img: new URL('../assets/images/label.png', import.meta.url).href },
  { nom: 'Label international', cout: 20000, prod: 1000, img: new URL('../assets/images/immeuble.png', import.meta.url).href },
  { nom: 'Tournée nationale', cout: 50000, prod: 5000, img: new URL('../assets/images/bus.png', import.meta.url).href },
  { nom: 'Tournée mondiale', cout: 200000, prod: 20000, img: new URL('../assets/images/tournee.png', import.meta.url).href },
  { nom: 'Buzz TikTok', cout: 10000, mult: 2, img: new URL('../assets/images/buzz.png', import.meta.url).href },
  { nom: 'Featuring rappeur', cout: 50000, mult: 3, img: new URL('../assets/images/featuring.png', import.meta.url).href },
  { nom: 'Grammy Awards', cout: 100000, mult: 5, img: new URL('../assets/images/grammy.png', import.meta.url).href },
  { nom: 'Chaîne en or', cout: 75000, mult: 2, img: new URL('../assets/images/chaine.png', import.meta.url).href },
  { nom: 'Voiture de luxe', cout: 200000, prod: 5000, img: new URL('../assets/images/voiture.png', import.meta.url).href },
  { nom: 'Villa de star', cout: 500000, prod: 10000, img: new URL('../assets/images/villa.png', import.meta.url).href },
  { nom: 'Empire multimédia', cout: 1000000, prod: 50000, img: new URL('../assets/images/satellite.png', import.meta.url).href },
]

// Fonctions UI
function handleClick() {
  store.ajouterFans(1)

  microClicked.value = true
  setTimeout(() => (microClicked.value = false), 200)

  showPlusOne.value = true
  setTimeout(() => (showPlusOne.value = false), 600)
}

function countOwned(nom) {
  return store.countOwned(nom)
}

function cout(a) {
  return store.coutActuel(a)
}

function acheter(a) {
  store.acheterAmelioration(a)
}
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
  overflow-y: auto;
}

.left-panel {
  text-align: center;
  border-right: 3px solid #333;
}

.center-panel {
  text-align: center;
  border-right: 3px solid #333;
}

.right-panel {
  text-align: center;
}

.micro-wrapper {
  position: relative;
  display: inline-block;
}

.micro {
  width: 250px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.micro.clicked {
  transform: scale(1.2);
}

.plus-one {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  color: #ff005c;
  font-weight: bold;
  animation: floatUp 0.6s forwards;
}

@keyframes floatUp {
  0% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -40px); }
}

.environnement {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px auto;
  background: rgba(0,0,0,0.2);
  border: 2px solid #444;
  border-radius: 12px;
  padding: 10px;
  min-height: 150px;
}

.env-item {
  margin: 10px;
  text-align: center;
}

.env-img {
  width: 60px;
  height: 60px;
  display: block;
  margin: auto;
}

.env-item p {
  margin-top: 5px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}

.upgrade-card {
  display: flex;
  align-items: center;
  background: #111;
  border: 2px solid #ff005c;
  border-radius: 12px;
  padding: 10px;
  margin: 10px;
}

.upgrade-img {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}
</style>
