<template>
  <div id="app">
    <Navbar v-if="$route.name !== 'auth'" />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>


<style>
body {
  margin: 0;
  font-family: 'Arial Black', sans-serif;
  background: linear-gradient(135deg, #0d0d0d, #1a1a1a);
  color: #f1f1f1;
  text-align: center;
}

h1 {
  color: #ff005c;
  text-shadow: 0 0 10px #ff005c, 0 0 20px #ff4da6;
  margin-top: 20px;
}

button {
  background: #222;
  border: 2px solid #ff005c;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  padding: 12px 20px;
  margin: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background: #ff005c;
  color: #fff;
  transform: scale(1.05);
  box-shadow: 0 0 15px #ff005c;
}
</style>
