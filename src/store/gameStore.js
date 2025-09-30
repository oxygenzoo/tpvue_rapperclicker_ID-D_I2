import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // --- Core jeu ---
    fans: 0,
    productionAuto: 0,       // base / seconde (avant multiplicateur)
    multiplicateur: 1,

    // Inventaire / Améliorations / Succès
    ameliorations: [],       // non utilisé ici, gardé si besoin plus tard
    succes: [],
    environnement: [],       // { nom, img, count }

    // Statistiques cumulées
    stats: {
      totalFans: 0,          // total cumulé (clic+auto)
      clics: 0,
      auto: 0,
    },

    // Classement & défis
    joueurs: [],             // [{ pseudo, score }]
    defis: [],               // [{ from, to, date }]

    // Utilisateurs
    utilisateurs: [],        // [{ pseudo, password, role }]
    utilisateurActif: null,  // { pseudo, role, ... }

    // Runtime
    startedAt: null,         // timestamp pour calculer moyenne / minute
    _autoInterval: null,     // non persisté (exclu dans sauvegarde)
  }),

  getters: {
    // Production réelle / sec en tenant compte du multiplicateur
    productionParSeconde: (state) => state.productionAuto * state.multiplicateur,
    productionParMinute: (state, getters) => getters.productionParSeconde * 60,

    // Moyenne globale de fans/minute depuis startedAt
    fansParMinute: (state) => {
      if (!state.startedAt || state.stats.totalFans <= 0) return 0
      const elapsedMs = Date.now() - state.startedAt
      const minutes = Math.max(elapsedMs / 60000, 0.001)
      return Number((state.stats.totalFans / minutes).toFixed(2))
    },

    // Classement trié (copie pour ne pas muter l'état)
    classement: (state) => [...state.joueurs].sort((a, b) => b.score - a.score),

    isAdmin: (state) => !!state.utilisateurActif && state.utilisateurActif.role === 'admin',
  },

  actions: {
    // --- Cycle de vie ---
    init() {
      this.charger()
      if (!this.startedAt) this.startedAt = Date.now()
      this.startAutoProduction()
    },

    // --- Authentification ---
    register(pseudo, password, role = 'joueur') {
      const existe = this.utilisateurs.find(u => u.pseudo === pseudo)
      if (existe) throw new Error('Pseudo déjà utilisé')

      this.utilisateurs.push({ pseudo, password, role })
      localStorage.setItem('rapperClickerUsers', JSON.stringify(this.utilisateurs))
    },

    login(pseudo, password) {
      const user = this.utilisateurs.find(
        u => u.pseudo === pseudo && u.password === password
      )
      if (!user) throw new Error('Identifiants invalides')

      this.utilisateurActif = user
      localStorage.setItem('rapperClickerActiveUser', user.pseudo)

      // Charger la sauvegarde de cet utilisateur et (re)lancer la prod auto
      this.charger()
      this.startAutoProduction()
    },

    logout() {
      this.stopAutoProduction()
      localStorage.removeItem('rapperClickerActiveUser')
      this.utilisateurActif = null
    },

    // --- Gameplay ---
    ajouterFans(amount = 1, source = 'clic') {
      const gain = amount * this.multiplicateur
      this.fans += gain
      this.stats.totalFans += gain

      if (source === 'clic') this.stats.clics += amount
      else if (source === 'auto') this.stats.auto += amount

      this.debloquerSucces()
    },

    // coût progressif : base * 1.15^count (arrondi à l'entier)
    coutActuel(item) {
      const base = item.cout || 0
      const count = this.countOwned(item.nom)
      return Math.floor(base * Math.pow(1.15, count))
    },

    countOwned(nom) {
      const e = this.environnement.find(x => x.nom === nom)
      return e ? e.count : 0
    },

    acheterAmelioration(item) {
      const cost = this.coutActuel(item)
      if (this.fans < cost) return false

      this.fans -= cost

      if (item.prod) this.productionAuto += item.prod
      if (item.mult) this.multiplicateur *= item.mult

      const existant = this.environnement.find(e => e.nom === item.nom)
      if (existant) {
        existant.count++
      } else {
        this.environnement.push({ nom: item.nom, img: item.img, count: 1 })
      }

      this.sauvegarder()
      return true
    },

    debloquerSucces() {
      const paliers = [
        { seuil: 100, nom: '🔥 Star locale' },
        { seuil: 1000, nom: '🎧 Artiste reconnu' },
        { seuil: 10000, nom: '🏆 Superstar' },
        { seuil: 100000, nom: '🌍 Légende mondiale' },
      ]

      paliers.forEach(s => {
        if (this.fans >= s.seuil && !this.succes.includes(s.nom)) {
          this.succes.push(s.nom)
          // 👉 tu peux brancher ici une notification/toast dans l'UI
        }
      })
    },

    // --- Production auto (store = source de vérité) ---
    startAutoProduction() {
      if (this._autoInterval) return
      this._autoInterval = setInterval(() => {
        if (this.productionAuto > 0) {
          this.ajouterFans(this.productionAuto, 'auto')
        }
      }, 1000)
    },

    stopAutoProduction() {
      if (this._autoInterval) {
        clearInterval(this._autoInterval)
        this._autoInterval = null
      }
    },

    // --- Sauvegarde ---
    sauvegarder() {
      // éviter de persister le timer
      const { _autoInterval, ...persist } = this.$state

      if (this.utilisateurActif) {
        localStorage.setItem('rapperClickerActiveUser', this.utilisateurActif.pseudo)
        localStorage.setItem('save_' + this.utilisateurActif.pseudo, JSON.stringify(persist))
      }
      localStorage.setItem('rapperClickerUsers', JSON.stringify(this.utilisateurs))
      localStorage.setItem('rapperClickerClassement', JSON.stringify(this.joueurs))
    },

    charger() {
      const users = localStorage.getItem('rapperClickerUsers')
      if (users) this.utilisateurs = JSON.parse(users)

      // restaurer l'utilisateur actif si présent
      const active = localStorage.getItem('rapperClickerActiveUser')
      if (!this.utilisateurActif && active) {
        this.utilisateurActif = this.utilisateurs.find(u => u.pseudo === active) || null
      }

      // charger sauvegarde utilisateur
      if (this.utilisateurActif) {
        const data = localStorage.getItem('save_' + this.utilisateurActif.pseudo)
        if (data) this.$patch(JSON.parse(data))
      }

      const classement = localStorage.getItem('rapperClickerClassement')
      if (classement) this.joueurs = JSON.parse(classement)

      if (!this.startedAt) this.startedAt = Date.now()
    },

    // --- Classement ---
    enregistrerJoueur(pseudo) {
      const existant = this.joueurs.find(j => j.pseudo === pseudo)
      if (existant) {
        existant.score = Math.max(existant.score, this.fans)
      } else {
        this.joueurs.push({ pseudo, score: this.fans })
      }
      this.joueurs.sort((a, b) => b.score - a.score)
      this.sauvegarder()
    },

    // --- Admin tools (bonus) ---
    adminReset(pseudo) {
      if (!this.utilisateurActif || this.utilisateurActif.role !== 'admin') {
        throw new Error('Action réservée à un admin')
      }
      if (!pseudo) return
      // remet la sauvegarde du joueur ciblé à zéro
      const key = 'save_' + pseudo
      const blank = {
        ...this.$state,
        fans: 0,
        productionAuto: 0,
        multiplicateur: 1,
        environnement: [],
        succes: [],
        stats: { totalFans: 0, clics: 0, auto: 0 },
      }
      const { _autoInterval, ...persist } = blank
      localStorage.setItem(key, JSON.stringify(persist))
    },

    adminSetScore(pseudo, score) {
      if (!this.utilisateurActif || this.utilisateurActif.role !== 'admin') {
        throw new Error('Action réservée à un admin')
      }
      const j = this.joueurs.find(x => x.pseudo === pseudo)
      if (j) j.score = score
      else this.joueurs.push({ pseudo, score })
      this.joueurs.sort((a, b) => b.score - a.score)
      this.sauvegarder()
    },

    // --- Défi entre joueurs (simple trace) ---
    defierJoueur(pseudoCible) {
      if (!this.utilisateurActif) throw new Error('Connecte-toi pour défier')
      this.defis.push({ from: this.utilisateurActif.pseudo, to: pseudoCible, date: Date.now() })
      this.sauvegarder()
    },
  }
})
