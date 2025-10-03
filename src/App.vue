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
  margin-top: 20px;
}

button {
  background: #222;
  border: 2px solid #ff005c;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  padding: 10px 16px;
  margin: 10px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

button:hover {
  background: #ff005c;
  color: #fff;
  transform: scale(1.03);
}
</style>
