import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '../store/gameStore'
import HomeView from '../views/HomeView.vue'
import StatsView from '../views/StatsView.vue'
import ClassementView from '../views/ClassementView.vue'
import AuthView from '../views/AuthView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/stats', name: 'stats', component: StatsView, meta: { requiresAuth: true } },
  { path: '/classement', name: 'classement', component: ClassementView, meta: { requiresAuth: true } },
  { path: '/auth', name: 'auth', component: AuthView, meta: { guest: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useGameStore()

  if (to.meta.requiresAuth && !store.utilisateurActif) {
    // Pas connecté → redirection vers Auth
    return next('/auth')
  }

  if (to.meta.guest && store.utilisateurActif) {
    // Déjà connecté → redirection vers Home
    return next('/')
  }

  next()
})

export default router
