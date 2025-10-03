import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // données du jeu
    fans: 0,
    productionAuto: 0, 
    multiplicateur: 1,

    // inventaire et succès
    environnement: [], 
    succes: [],
    stats: { totalFans: 0, clics: 0, auto: 0 },

    // global
    joueurs: [],             
    defis: [],               
    utilisateurs: [
      { pseudo: "admin", password: "admin123", role: "admin" }
    ],
    utilisateurActif: null,

    // difficulté
    difficulteGlobale: 1, 

    // runtime
    startedAt: null,   
    _autoInterval: null, 
  }),

  getters: {
    // production
    productionParSeconde: (s) => s.productionAuto * s.multiplicateur,
    productionParMinute: (s, g) => g.productionParSeconde * 60,

    // fans/min
    fansParMinute: (s) => {
      if (!s.startedAt || s.stats.totalFans <= 0) return 0
      const minutes = Math.max((Date.now() - s.startedAt) / 60000, 0.001)
      return Number((s.stats.totalFans / minutes).toFixed(2))
    },

    // classement trié
    classement: (s) => [...s.joueurs].sort((a, b) => b.score - a.score),
    isAdmin: (s) => !!s.utilisateurActif && s.utilisateurActif.role === 'admin',
  },

  actions: {
    // init
    init() {
      this.charger()
      if (!this.startedAt) this.startedAt = Date.now()
      this.startAutoProduction()
    },

    // inscription
    register(pseudo, password, role = 'joueur') {
      const existe = this.utilisateurs.find(u => u.pseudo === pseudo)
      if (existe) throw new Error('Pseudo déjà utilisé')

      this.utilisateurs.push({ pseudo, password, role })
      this._saveGlobal()
    },

    // connexion
    login(pseudo, password) {
      const user = this.utilisateurs.find(u => u.pseudo === pseudo && u.password === password)
      if (!user) throw new Error('Identifiants invalides')

      this.utilisateurActif = user
      localStorage.setItem('rapperClickerActiveUser', user.pseudo)

      this.charger()
      this.startAutoProduction()
    },

    // déconnexion
    logout() {
      this.stopAutoProduction()
      localStorage.removeItem('rapperClickerActiveUser')
      this.utilisateurActif = null
    },

    // ajouter fans
    ajouterFans(amount = 1, source = 'clic') {
      const gain = amount * this.multiplicateur
      this.fans += gain
      this.stats.totalFans += gain

      if (source === 'clic') this.stats.clics += amount
      else if (source === 'auto') this.stats.auto += amount

      this.debloquerSucces()
    },

    // nombre d’items
    countOwned(nom) {
      const e = this.environnement.find(x => x.nom === nom)
      return e ? e.count : 0
    },

    // coût exponentiel
    coutExponentiel(base, count) {
      return Math.floor(base * Math.pow(1.25, count))
    },

    // coût avec difficulté
    coutAvecDifficulte(item) {
      const count = this.countOwned(item.nom)
      const base = item.cout || 0

      const coutDeBase = item.unique
        ? base
        : this.coutExponentiel(base, count)

      return Math.floor(coutDeBase * this.difficulteGlobale)
    },

    // vérifie si item unique déjà pris
    uniqueDejaPris(item) {
      return !!item.unique && this.countOwned(item.nom) > 0
    },

    // achat
    acheterAmelioration(item) {
      if (this.uniqueDejaPris(item)) return false

      const cost = this.coutAvecDifficulte(item)
      if (this.fans < cost) return false

      this.fans -= cost

      if (item.prod) this.productionAuto += item.prod
      if (item.mult) this.multiplicateur *= item.mult

      const existant = this.environnement.find(e => e.nom === item.nom)
      if (existant) existant.count++
      else this.environnement.push({ nom: item.nom, img: item.img, count: 1, unique: !!item.unique })

      const inflation = item.unique ? 1.15 : 1.08
      this.difficulteGlobale = Number((this.difficulteGlobale * inflation).toFixed(3))

      this.sauvegarder()
      return true
    },

    // succès
    debloquerSucces() {
      const paliers = [
        { seuil: 100, nom: '🔥 Star locale' },
        { seuil: 1000, nom: '🎧 Artiste reconnu' },
        { seuil: 10000, nom: '🏆 Superstar' },
        { seuil: 100000, nom: '🌍 Légende mondiale' },
      ]
      for (const s of paliers) {
        if (this.fans >= s.seuil && !this.succes.includes(s.nom)) {
          this.succes.push(s.nom)
        }
      }
    },

    // auto-prod
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

    // sauvegarde
    _buildUserSave() {
      return {
        fans: this.fans,
        productionAuto: this.productionAuto,
        multiplicateur: this.multiplicateur,
        environnement: this.environnement,
        succes: this.succes,
        stats: this.stats,
        startedAt: this.startedAt,
        difficulteGlobale: this.difficulteGlobale,
      }
    },

    _applyUserSave(data) {
      const keys = [
        'fans', 'productionAuto', 'multiplicateur',
        'environnement', 'succes', 'stats',
        'startedAt', 'difficulteGlobale'
      ]
      const patch = {}
      for (const k of keys) if (k in data) patch[k] = data[k]
      this.$patch(patch)
    },

    _saveGlobal() {
      localStorage.setItem('rapperClickerUsers', JSON.stringify(this.utilisateurs))
      localStorage.setItem('rapperClickerClassement', JSON.stringify(this.joueurs))
      localStorage.setItem('rapperClickerDefis', JSON.stringify(this.defis))
      if (this.utilisateurActif) {
        localStorage.setItem('rapperClickerActiveUser', this.utilisateurActif.pseudo)
      }
    },

    sauvegarder() {
      if (this.utilisateurActif) {
        localStorage.setItem('save_' + this.utilisateurActif.pseudo, JSON.stringify(this._buildUserSave()))
      }
      this._saveGlobal()
    },

    charger() {
      // admin garanti
      const hasAdmin = this.utilisateurs.some(u => u.role === 'admin')
      if (!hasAdmin) {
        this.utilisateurs.push({ pseudo: 'admin', password: 'admin123', role: 'admin' })
      }

      const users = localStorage.getItem('rapperClickerUsers')
      if (users) this.utilisateurs = JSON.parse(users)

      const classement = localStorage.getItem('rapperClickerClassement')
      if (classement) this.joueurs = JSON.parse(classement)

      const defis = localStorage.getItem('rapperClickerDefis')
      if (defis) this.defis = JSON.parse(defis)

      const active = localStorage.getItem('rapperClickerActiveUser')
      if (!this.utilisateurActif && active) {
        this.utilisateurActif = this.utilisateurs.find(u => u.pseudo === active) || null
      }

      if (this.utilisateurActif) {
        const data = localStorage.getItem('save_' + this.utilisateurActif.pseudo)
        if (data) this._applyUserSave(JSON.parse(data))
      }

      if (!this.startedAt) this.startedAt = Date.now()
      if (!this.difficulteGlobale || this.difficulteGlobale < 1) this.difficulteGlobale = 1
    },

    // classement
    enregistrerJoueur(pseudo) {
      let user = this.utilisateurs.find(u => u.pseudo === pseudo)
      if (!user) {
        user = { pseudo, password: '', role: 'joueur' }
        this.utilisateurs.push(user)
      }
      const j = this.joueurs.find(x => x.pseudo === pseudo)
      if (j) j.score = Math.max(j.score, this.fans)
      else this.joueurs.push({ pseudo, score: this.fans })

      this.joueurs.sort((a, b) => b.score - a.score)
      this.sauvegarder()
    },

    // admin reset
    adminReset(pseudo) {
      if (!this.isAdmin) throw new Error('Action réservée à un admin')
      const blank = {
        fans: 0,
        productionAuto: 0,
        multiplicateur: 1,
        environnement: [],
        succes: [],
        stats: { totalFans: 0, clics: 0, auto: 0 },
        startedAt: Date.now(),
        difficulteGlobale: 1,
      }
      localStorage.setItem('save_' + pseudo, JSON.stringify(blank))

      const j = this.joueurs.find(x => x.pseudo === pseudo)
      if (j) j.score = 0

      this._saveGlobal()
    },

    // admin set score
    adminSetScore(pseudo, score) {
      if (!this.isAdmin) throw new Error('Action réservée à un admin')
      const j = this.joueurs.find(x => x.pseudo === pseudo)
      if (j) j.score = score
      else this.joueurs.push({ pseudo, score })
      this.joueurs.sort((a, b) => b.score - a.score)
      this._saveGlobal()
    },

    // défier
    defierJoueur(pseudoCible) {
      if (!this.utilisateurActif) throw new Error('Connecte-toi pour défier')
      this.defis.push({ from: this.utilisateurActif.pseudo, to: pseudoCible, date: Date.now() })
      this._saveGlobal()
    },
  }
})
