# Rapper Clicker

Un jeu clicker fait avec Vue 3 + Pinia + Vue Router, où tu deviens une star du rap en gagnant des fans, achetant des améliorations et défiant d’autres joueurs.

## Fonctionnalités

Clicker Game : Clique sur le micro pour gagner des fans.

Production automatique : Achète des machines (studios, producteurs, managers, etc.) qui génèrent des fans automatiquement.

Multiplicateurs : Achète des micros spéciaux, tournées, buzz TikTok, etc. pour multiplier tes gains.

Succès : Débloque des succès au fil de ta progression (Star locale, Superstar, Légende mondiale, etc.).

Classement en ligne : Sauvegarde ton score et compare-toi aux autres joueurs.

Défis : Défie un autre joueur et essaye de dépasser son score.

Compte joueur : Inscription, connexion, changement de pseudo/mot de passe, réinitialisation de partie.

Admin Panel :

Gérer les utilisateurs (reset, suppression, changement de rôle).

Modifier les scores.

Forcer des succès.

Envoyer des notifications aux joueurs.

Purge globale des données.

## Installation

Cloner le projet :
```
git clone https://github.com/ton-projet/rapper-clicker.git
cd rapper-clicker
```

Installer les dépendances :
```
npm install
```

Lancer le serveur de développement :
```
npm run dev
```

Ouvrir le projet sur http://localhost:5173


Technologies utilisées

Vue 3
 (Composition API)

Pinia
 (store global)

Vue Router
 (navigation)

Vite
 (build et serveur de dev)

Structure du projet
```
src/
│
├── assets/          # Images et logo
├── components/      # Navbar, boutons, éléments UI
├── store/           # Pinia (gameStore)
├── views/           # Pages principales (Home, Stats, Classement, Admin, Auth)
├── App.vue          # Point d'entrée principal
└── main.js          # Setup Vue, Router et Pinia
```

Auteurs

Guignabert Enzo
Projet développé dans le cadre d’un apprentissage Vue.js.
jeu hebergé sur https://tpvue-rapperclicker-id-d-i2.vercel.app/
