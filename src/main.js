import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useGameStore } from './store/gameStore'

// Crée l'app Vue
const app = createApp(App)

// Installe Pinia et Router
app.use(createPinia())
app.use(router)

// Monte l'application
app.mount('#app')

// Initialise le store global du jeu
const store = useGameStore()
store.init()
