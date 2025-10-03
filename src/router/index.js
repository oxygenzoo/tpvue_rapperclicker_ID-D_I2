import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '../store/gameStore'
import HomeView from '../views/HomeView.vue'
import StatsView from '../views/StatsView.vue'
import ClassementView from '../views/ClassementView.vue'
import AuthView from '../views/AuthView.vue'
import AdminView from '../views/AdminView.vue'

// routes
const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/stats', name: 'stats', component: StatsView, meta: { requiresAuth: true } },
  { path: '/classement', name: 'classement', component: ClassementView, meta: { requiresAuth: true } },
  { path: '/auth', name: 'auth', component: AuthView, meta: { guest: true } },
  { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// garde de navigation
router.beforeEach((to, from, next) => {
  const store = useGameStore()

  // si besoin d'être connecté
  if (to.meta.requiresAuth && !store.utilisateurActif) {
    return next('/auth')
  }

  // si déjà connecté
  if (to.meta.guest && store.utilisateurActif) {
    return next('/')
  }

  next()
})

export default router
