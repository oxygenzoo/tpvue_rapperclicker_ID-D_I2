<template>
  <div class="stats-container">
    <h1>Statistiques du jeu</h1>

    <div class="stat-card">
      <h2>Fans actuels</h2>
      <p>{{ store.fans }}</p>
    </div>

    <div class="stat-card">
      <h2>Production</h2>
      <p>{{ store.productionParSeconde }}/sec</p>
      <p>{{ store.productionParMinute }}/min</p>
    </div>

    <div class="stat-card">
      <h2>Total fans cumulés</h2>
      <p>{{ store.stats.totalFans }}</p>
    </div>

    <div class="stat-card">
      <h2>Moyenne fans/minute</h2>
      <p>{{ store.fansParMinute }}</p>
    </div>

    <div class="stat-card">
      <h2>Détails</h2>
      <p>Par clics : {{ store.stats.clics }}</p>
      <p>Auto-production : {{ store.stats.auto }}</p>
      <p v-if="store.stats.totalFans > 0">
        {{ Math.round((store.stats.clics / store.stats.totalFans) * 100) }}% clics /
        {{ Math.round((store.stats.auto / store.stats.totalFans) * 100) }}% auto
      </p>
      <p v-else>Pas encore de stats</p>
    </div>

    <div class="stat-card">
      <h2>🏆 Classement</h2>
      <ol>
        <li v-for="j in store.classement" :key="j.pseudo">
          {{ j.pseudo }} : {{ j.score }} fans
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../store/gameStore'
const store = useGameStore()
</script>

<style scoped>
.stats-container {
  text-align: center;
  padding: 20px;
  color: #fff;
}

.stat-card {
  background: #111;
  border: 2px solid #ff005c;
  border-radius: 12px;
  padding: 20px;
  margin: 15px auto;
  width: 320px;
  box-shadow: 0 0 10px #ff005c55;
}

ol {
  text-align: left;
  margin: 0 auto;
  max-width: 280px;
}
</style>
