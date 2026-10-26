# TP N°4 — Le monolithe LearnHub : React, Express.js, PostgreSQL, MongoDB et Docker

*Module : Architecture logicielle et Microservices — Projet fil rouge LearnHub — Sprint 1 (Fondations)*

| Durée | Pré-requis | Travail | Résultat attendu |
| --- | --- | --- | --- |
| 1 séance de 3 h (+ travail de groupe) | TP2 (Git et GitHub) terminé, Docker Desktop installé | Équipe de 3 à 4 apprenants | Une application LearnHub claire, moderne (thème clair et sombre, adaptée au téléphone), qui marche en une seule commande : `docker compose up` |

## Table des matières

- [Partie 1 — Contexte et objectifs](#partie-1--contexte-et-objectifs)
- [Partie 2 — Notions à connaître](#partie-2--notions-à-connaître)
- [Partie 3 — Pré-requis et vérification du poste](#partie-3--pré-requis-et-vérification-du-poste)
- [Partie 4 — Cahier des charges](#partie-4--cahier-des-charges)
- [Partie 5 — Architecture du monolithe](#partie-5--architecture-du-monolithe)
  - [5.1 — Vue d'ensemble](#51--vue-densemble)
  - [5.2 — Pourquoi deux bases de données ?](#52--pourquoi-deux-bases-de-données-)
- [Partie 6 — Organisation de l'équipe et du Git](#partie-6--organisation-de-léquipe-et-du-git)
  - [6.1 — Répartition du travail](#61--répartition-du-travail)
  - [6.2 — Le déroulement avec Git](#62--le-déroulement-avec-git)
- [Partie 7 — Structure du projet](#partie-7--structure-du-projet)
- [Partie 8 — Étape 1 : Docker et les réglages](#partie-8--étape-1--docker-et-les-réglages)
  - [8.1 — Les réglages : .env.example et .env](#81--les-réglages--envexample-et-env)
  - [8.2 — .gitignore (à la racine)](#82--gitignore-à-la-racine)
  - [8.3 — docker-compose.yml (à la racine)](#83--docker-composeyml-à-la-racine)
  - [8.4 — Les Dockerfiles](#84--les-dockerfiles)
- [Partie 9 — Étape 2 : le backend Express](#partie-9--étape-2--le-backend-express)
  - [9.1 — package.json](#91--packagejson)
  - [9.2 — Configuration](#92--configuration)
  - [9.3 — Les bases de données](#93--les-bases-de-données)
  - [9.4 — Les modèles MongoDB](#94--les-modèles-mongodb)
  - [9.5 — Événements et middlewares](#95--événements-et-middlewares)
  - [9.6 — Module users (US01, US02, US03, US10)](#96--module-users-us01-us02-us03-us10)
  - [9.7 — Module courses (US04, US05, US06, US07)](#97--module-courses-us04-us05-us06-us07)
  - [9.8 — Module enrollments (US08, US09)](#98--module-enrollments-us08-us09)
  - [9.9 — Module notifications (US11)](#99--module-notifications-us11)
  - [9.10 — Module stats (tableau de bord)](#910--module-stats-tableau-de-bord)
  - [9.11 — Le point d'entrée](#911--le-point-dentrée)
  - [9.12 — README du backend](#912--readme-du-backend)
- [Partie 10 — Étape 3 : le frontend React](#partie-10--étape-3--le-frontend-react)
  - [10.1 — Configuration du projet](#101--configuration-du-projet)
  - [10.2 — Les styles (le design)](#102--les-styles-le-design)
  - [10.3 — Le cœur : démarrage, appels à l'API, données partagées](#103--le-cœur--démarrage-appels-à-lapi-données-partagées)
  - [10.4 — Les composants réutilisables](#104--les-composants-réutilisables)
  - [10.5 — Les routes](#105--les-routes)
  - [10.6 — Les pages](#106--les-pages)
  - [10.7 — README du frontend](#107--readme-du-frontend)
- [Partie 11 — Étape 4 : lancer et tester](#partie-11--étape-4--lancer-et-tester)
  - [11.1 — Démarrer toute l'application](#111--démarrer-toute-lapplication)
  - [11.2 — Scénario de test dans le navigateur](#112--scénario-de-test-dans-le-navigateur)
  - [11.3 — Tester l'API sans le frontend](#113--tester-lapi-sans-le-frontend)
  - [11.4 — Regarder dans les bases](#114--regarder-dans-les-bases)
- [Partie 12 — Référence de l'API](#partie-12--référence-de-lapi)
- [Partie 13 — Travail demandé et livrables](#partie-13--travail-demandé-et-livrables)
  - [13.1 — Questions de compréhension](#131--questions-de-compréhension)
  - [13.2 — Exercices d'amélioration](#132--exercices-damélioration)
  - [13.3 — Livrable](#133--livrable)
  - [13.4 — Barème](#134--barème)
- [Partie 14 — Les limites du monolithe : préparation du TP5](#partie-14--les-limites-du-monolithe--préparation-du-tp5)
- [Partie 15 — Problèmes fréquents](#partie-15--problèmes-fréquents)
- [Partie 16 — Aide-mémoire Docker](#partie-16--aide-mémoire-docker)

---

## Partie 1 — Contexte et objectifs

Dans le TP précédent, vous avez créé le dépôt LearnHub avec cette structure :

```
LearnHub/
├── README.md
├── frontend/
│   └── README.md
└── backend/
    └── README.md
```

Il est temps de mettre du code dedans. Dans ce TP, vous construisez **LearnHub en version monolithe** : une seule application backend qui contient **tous** les domaines du projet (utilisateurs, cours, inscriptions, notifications), et un frontend React moderne qui l'utilise.

**Pourquoi commencer par un monolithe ?** Parce que c'est la méthode la plus simple pour faire marcher toutes les user stories. Dans le TP suivant, vous le **découperez en microservices**. Vous aurez alors un point de comparaison concret : vous verrez ce qui devient plus difficile (et pourquoi), au lieu de le lire dans un cours.

**À la fin de ce TP, vous saurez :**

- expliquer ce qu'est un monolithe, avec ses avantages et ses limites ;
- écrire une API REST avec Express.js (routes, middlewares, authentification JWT) ;
- utiliser **deux bases de données** dans la même application (PostgreSQL et MongoDB) et justifier ce choix ;
- créer un frontend React bien organisé (pages, composants, hooks, services) avec un design moderne ;
- lancer toute l'application avec Docker et Docker Compose ;
- travailler en équipe avec Git (branches, pull requests, conflits) sur un vrai projet.

## Partie 2 — Notions à connaître

| Terme | Définition simple |
| --- | --- |
| Monolithe | Une application déployée **en un seul bloc**. Tous les domaines (utilisateurs, cours...) sont dans le même programme, qui tourne dans un seul processus. |
| Microservices | L'inverse : plusieurs petites applications indépendantes, chacune avec sa base. (Sujet du TP5.) |
| API REST | Une façon d'organiser un serveur : chaque ressource a une adresse (`/api/courses`) et on utilise les verbes HTTP : GET (lire), POST (créer), PUT (modifier), DELETE (supprimer). |
| Express.js | Une bibliothèque Node.js pour écrire une API REST facilement. |
| Route | Une adresse de l'API associée à une fonction. Exemple : `POST /api/users/login`. |
| Middleware | Une fonction qui s'exécute **avant** la route pour faire une vérification (exemple : « l'utilisateur est-il connecté ? »). |
| Hachage (bcrypt) | On ne stocke **jamais** un mot de passe en clair : on stocke son empreinte, impossible à inverser. À la connexion, on compare les empreintes. |
| JWT (JSON Web Token) | Un « badge » signé que le serveur donne à la connexion. Le frontend le renvoie à chaque requête pour prouver qui il est. Il contient l'identifiant et le rôle de l'utilisateur. |
| Base relationnelle (PostgreSQL) | Des tables avec des colonnes, des liens entre elles et des contraintes strictes. Idéale pour des données qui doivent rester cohérentes (comptes, inscriptions). |
| Base documents (MongoDB) | Des documents JSON flexibles. Idéale pour des contenus qui ont une forme variable et qu'on lit en bloc (un cours avec ses chapitres). |
| Conteneur Docker | Une « boîte » qui contient une application et tout ce dont elle a besoin. Elle marche pareil sur tous les ordinateurs. |
| Docker Compose | Un fichier (`docker-compose.yml`) qui décrit **plusieurs conteneurs** et les lance ensemble avec une seule commande. |
| Variable d'environnement | Un réglage donné à l'application depuis l'extérieur (mot de passe de base, secret JWT). Elle évite d'écrire des secrets dans le code. |
| Événement interne | Un message envoyé **à l'intérieur** du programme : « une inscription vient d'avoir lieu ». Un autre module l'écoute et réagit, sans que l'inscription l'attende. |

## Partie 3 — Pré-requis et vérification du poste

| Outil | Pourquoi | Vérification |
| --- | --- | --- |
| Git et un compte GitHub | Travail d'équipe (TP2) | `git --version` |
| Docker Desktop | Lancer toute l'application | `docker --version` et `docker compose version` |
| Un éditeur (Visual Studio Code) | Écrire le code | — |
| Node.js 20 (facultatif) | Seulement pour tester hors Docker | `node --version` |

Ouvrez **Docker Desktop** et attendez que l'icône indique « running ». Sous Windows, Docker Desktop demande WSL 2 : acceptez son installation. Testez :

```
docker run --rm hello-world
```

Le message « Hello from Docker! » confirme que tout fonctionne. Si la commande échoue avec « cannot connect to the Docker daemon », c'est que Docker Desktop n'est pas démarré.

## Partie 4 — Cahier des charges

Vous réalisez les 11 user stories du backlog du Sprint 0. Chacune correspond à une ou plusieurs routes de l'API et à une page du frontend.

| ID | User story | Route(s) de l'API | Page React | Priorité |
| --- | --- | --- | --- | --- |
| US01 | Créer un compte (rôle choisi, mot de passe haché, email unique) | `POST /api/users/register` | Register | Haute |
| US02 | Se connecter (token JWT, message d'erreur clair) | `POST /api/users/login` | Login | Haute |
| US03 | Consulter et modifier son profil | `GET` et `PUT /api/users/me` | Profile | Moyenne |
| US04 | Créer un cours (formateur uniquement) | `POST /api/courses` | TeacherCourses, CourseEditor | Haute |
| US05 | Modifier ou supprimer son cours (propriétaire uniquement, étudiants inscrits informés) | `PUT` et `DELETE /api/courses/:id` | TeacherCourses, CourseEditor | Moyenne |
| US06 | Ajouter des chapitres à un cours | `POST /api/courses/:id/chapters` | CourseEditor | Haute |
| US07 | Consulter le catalogue, puis le détail d'un cours | `GET /api/courses` et `GET /api/courses/:id` | Home, CourseDetail | Haute |
| US08 | S'inscrire à un cours (une seule fois, progression à 0 %) | `POST /api/enrollments` | CourseDetail | Haute |
| US09 | Suivre sa progression (chapitre terminé, pourcentage automatique) | `GET /api/enrollments/mine`, `POST /api/enrollments/:courseId/chapters/:chapterId/complete` | MyCourses, Learn | Haute |
| US10 | Lister tous les utilisateurs (admin, filtre par rôle) | `GET /api/users?role=` | AdminUsers | Moyenne |
| US11 | Recevoir une confirmation après inscription (asynchrone) | `GET /api/notifications/mine` | Notifications | Basse |

Trois rôles existent : **etudiant**, **formateur** et **admin**. Le compte admin ne peut pas être créé depuis le formulaire : il est créé automatiquement au démarrage (voir `seedAdmin` dans le backend).

## Partie 5 — Architecture du monolithe

### 5.1 — Vue d'ensemble

```mermaid
flowchart LR
    U[Navigateur] --> F[Frontend React :5173]
    F -->|HTTP + JWT| B
    subgraph B[Backend Express :5000 - UN SEUL PROGRAMME]
        M1[Module users]
        M2[Module courses]
        M3[Module enrollments]
        M4[Module notifications]
        M5[Module stats]
        EV((Evenements internes))
        M3 -.->|enrollment.created| EV
        M2 -.->|course.deleted| EV
        EV -.-> M4
    end
    M5 --> PG
    M5 --> MG
    M1 --> PG[(PostgreSQL)]
    M3 --> PG
    M2 --> MG[(MongoDB)]
    M4 --> MG
```

Les modules sont **dans le même programme**. Ils partagent le même processus, la même connexion aux bases et, pour s'envoyer des messages, un simple bus d'événements (`events.js`). C'est ce qui fait de cette application un monolithe. Les domaines correspondent exactement aux futurs microservices : user-service, course-service, enrollment-service, notification-service.

### 5.2 — Pourquoi deux bases de données ?

| Données | Base | Pourquoi |
| --- | --- | --- |
| Utilisateurs | PostgreSQL | Email unique, rôles limités, mot de passe : des données **strictes** que la base doit contrôler. |
| Inscriptions et chapitres terminés | PostgreSQL | Relations (un utilisateur, plusieurs inscriptions), contrainte « une seule inscription par cours », calcul de progression avec `COUNT`. |
| Cours et chapitres | MongoDB | Un cours est un **document** qui contient ses chapitres : on le lit et on l'écrit en bloc, sans jointure. Facile à faire évoluer (vidéo, quiz...). |
| Notifications | MongoDB | Des messages simples, ajoutés en grand nombre, jamais modifiés. |

**Point d'attention :** `enrollments.course_id` contient l'identifiant d'un cours stocké dans MongoDB. PostgreSQL ne peut pas vérifier qu'un identifiant existe dans une **autre** base : c'est donc le code (module enrollments) qui contrôle que le cours existe. Retenez cette remarque : elle revient dans le TP5.

## Partie 6 — Organisation de l'équipe et du Git

### 6.1 — Répartition du travail

Chaque membre prend un module, côté backend **et** côté frontend. Dans un groupe de 3, le 3e membre prend aussi les notifications.

| Membre | Backend | Frontend | User stories |
| --- | --- | --- | --- |
| 1 (chef) | Base du projet (Docker, config, bases, middleware) + `modules/users.js` + `modules/stats.js` | Base React (styles, composants, contextes, App.jsx), Login, Register, Profile, Dashboard, AdminUsers | US01, US02, US03, US10 |
| 2 | `models/Course.js` + `modules/courses.js` | Home, CourseDetail, TeacherCourses, CourseEditor | US04, US05, US06, US07 |
| 3 | `modules/enrollments.js` | MyCourses, Learn | US08, US09 |
| 4 | `models/Notification.js` + `modules/notifications.js` + `events.js` | Notifications | US11 |

### 6.2 — Le déroulement avec Git

Les règles du TP2 s'appliquent : **plus aucun push direct sur main**, une branche par tâche, une pull request relue par un autre membre.

1. **Le chef** crée la base (Partie 7, Partie 8 et le début de la Partie 9) sur une branche `feature/base-monolithe`, ouvre une PR, la fait relire et la fusionne. Dans son `index.js`, les lignes de modules qui n'existent pas encore sont mises **en commentaire** (`//`).
2. **Tous les membres** récupèrent main (`git switch main`, puis `git pull`).
3. Chaque membre crée sa branche : `feature/users`, `feature/courses`, `feature/enrollments`, `feature/notifications`. Il écrit son module, **enlève le `//` de sa ligne dans `index.js`**, teste, committe avec des messages clairs (`feat: ajoute la route de connexion`), pousse et ouvre sa PR.
4. Chaque PR est relue par le membre suivant dans l'ordre alphabétique, puis fusionnée.
5. `App.jsx` (frontend) est modifié par **tout le monde** : vous aurez un conflit. Vous savez le résoudre (TP2, partie 10) : on garde toutes les lignes utiles.

Ajoutez dans chaque PR la liste de contrôle du modèle de PR : aucun secret dans les fichiers, `.env` bien ignoré, README à jour.

## Partie 7 — Structure du projet

Le projet est organisé pour qu'on retrouve chaque chose au premier coup d'œil : **un dossier = une responsabilité**.

```
LearnHub/
├── README.md
├── docker-compose.yml
├── .env.example               <- modèle des réglages (committé)
├── .env                       <- vos vrais réglages (JAMAIS committé)
├── .gitignore
├── backend/
│   ├── README.md
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js           <- point d'entrée : branche les modules
│       ├── config.js          <- lit les variables d'environnement
│       ├── events.js          <- bus d'événements interne
│       ├── db/                <- connexions aux bases
│       │   ├── postgres.js
│       │   └── mongo.js
│       ├── models/            <- modèles MongoDB
│       │   ├── Course.js
│       │   └── Notification.js
│       ├── middleware/        <- vérifications avant les routes
│       │   ├── asyncHandler.js
│       │   └── auth.js
│       └── modules/           <- un fichier par domaine métier
│           ├── users.js
│           ├── courses.js
│           ├── enrollments.js
│           ├── notifications.js
│           └── stats.js
└── frontend/
    ├── README.md
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx           <- démarrage de React
        ├── App.jsx            <- toutes les routes (adresses des pages)
        ├── styles/            <- thème (couleurs) et styles
        ├── services/api.js    <- appels au backend
        ├── context/           <- données partagées (connexion, messages)
        ├── hooks/useFetch.js  <- chargement des données
        ├── utils/format.js    <- petites fonctions utiles
        ├── components/        <- briques réutilisables (menu, carte de cours...)
        └── pages/             <- un fichier par écran
            ├── teacher/       <- écrans du formateur
            └── admin/         <- écrans de l'administrateur
```

**La règle d'organisation du frontend :** une **page** (`pages/`) assemble des **composants** (`components/`), récupère ses données avec le **hook** `useFetch`, qui passe par le **service** `api.js`. Une page ne contient jamais d'appel `fetch` direct.

**Pour créer les dossiers d'un coup** (depuis la racine de LearnHub, dans Git Bash) :

```
mkdir -p backend/src/db backend/src/models backend/src/middleware backend/src/modules
mkdir -p frontend/src/styles frontend/src/services frontend/src/context frontend/src/hooks
mkdir -p frontend/src/utils frontend/src/components frontend/src/pages/teacher frontend/src/pages/admin
```

## Partie 8 — Étape 1 : Docker et les réglages

| Qui fait cette partie ? |
| --- |
| Le chef, sur la branche `feature/base-monolithe`. |

### 8.1 — Les réglages : .env.example et .env

Ce fichier liste les réglages dont l'application a besoin. Il est committé **sans vrais secrets**.

```env
POSTGRES_USER=learnhub
POSTGRES_PASSWORD=changez_moi
POSTGRES_DB=learnhub
JWT_SECRET=changez_ce_secret_long_et_aleatoire
ADMIN_EMAIL=admin@learnhub.local
ADMIN_PASSWORD=Admin1234
```

Chaque membre copie ce modèle en `.env` et **choisit ses propres valeurs** (mot de passe de base, secret JWT long et aléatoire) :

```
cp .env.example .env
```

Le fichier `.env` est dans `.gitignore` : il ne doit **jamais** apparaître dans `git status`. Vérifiez-le.

### 8.2 — .gitignore (à la racine)

```text
node_modules/
.env
*.log
dist/
```

### 8.3 — docker-compose.yml (à la racine)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10

  mongo:
    image: mongo:7
    volumes:
      - mongodata:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping')"]
      interval: 5s
      timeout: 10s
      retries: 10

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      MONGO_URL: mongodb://mongo:27017/learnhub
      JWT_SECRET: ${JWT_SECRET}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
    depends_on:
      postgres:
        condition: service_healthy
      mongo:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:5000/api
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  pgdata:
  mongodata:
```

**Ce qu'il faut comprendre :**

| Élément | Explication |
| --- | --- |
| `services` | Les 4 conteneurs : `postgres`, `mongo`, `backend`, `frontend`. |
| `${POSTGRES_USER}` | Valeur lue dans votre fichier `.env`. |
| `volumes: pgdata` | Les données de PostgreSQL sont gardées dans un « volume » : elles survivent à l'arrêt des conteneurs. |
| `healthcheck` | Docker teste si la base est prête. Le backend attend (`depends_on` + `service_healthy`) pour ne pas démarrer trop tôt. |
| `@postgres:5432` | Dans le réseau Docker, le nom du service (`postgres`, `mongo`) sert d'adresse. Pas `localhost` ! |
| `ports: "5000:5000"` | Ouvre le port 5000 de votre PC vers le conteneur : `http://localhost:5000`. |
| `./backend:/app` | Le code de votre dossier est partagé avec le conteneur : vous modifiez, le serveur redémarre tout seul (`nodemon`). |
| `/app/node_modules` | Garde les bibliothèques installées dans le conteneur, sans les écraser par votre dossier. |

### 8.4 — Les Dockerfiles

`backend/Dockerfile` — la recette pour construire l'image du backend :

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

`frontend/Dockerfile` :

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

Ajoutez aussi un fichier `.dockerignore` dans chacun des deux dossiers, pour ne pas copier `node_modules` dans l'image :

```
echo 'node_modules' > backend/.dockerignore
printf 'node_modules\ndist\n' > frontend/.dockerignore
```

## Partie 9 — Étape 2 : le backend Express

### 9.1 — package.json

Les bibliothèques utilisées : **express** (le serveur), **cors** (autorise le frontend à appeler l'API), **pg** (PostgreSQL), **mongoose** (MongoDB), **bcryptjs** (hachage), **jsonwebtoken** (JWT), **dotenv** (lecture du `.env`), **nodemon** (redémarrage automatique en développement).

`backend/package.json` :

```json
{
  "name": "learnhub-backend",
  "version": "1.0.0",
  "description": "Monolithe LearnHub (Express, PostgreSQL, MongoDB)",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon -L src/index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.0",
    "pg": "^8.12.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

### 9.2 — Configuration

`backend/src/config.js` : un seul endroit qui lit les variables d'environnement.

```js
// backend/src/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
};
```

### 9.3 — Les bases de données

`backend/src/db/postgres.js` : la connexion et la création des **trois tables** au démarrage.

```js
// backend/src/db/postgres.js
const { Pool } = require('pg');
const { databaseUrl } = require('../config');

const pool = new Pool({ connectionString: databaseUrl });

async function initPostgres() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(100) NOT NULL,
      email         VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(100) NOT NULL,
      role          VARCHAR(20)  NOT NULL CHECK (role IN ('etudiant', 'formateur', 'admin')),
      created_at    TIMESTAMP DEFAULT NOW()
    )`);

  // course_id est l'identifiant d'un cours stocke dans MongoDB :
  // pas de cle etrangere possible entre deux bases differentes.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id  VARCHAR(30) NOT NULL,
      progress   INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (user_id, course_id)
    )`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS completed_chapters (
      enrollment_id INTEGER NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
      chapter_id    VARCHAR(30) NOT NULL,
      PRIMARY KEY (enrollment_id, chapter_id)
    )`);
}

module.exports = { pool, initPostgres };
```

Points à retenir : `UNIQUE` sur l'email empêche deux comptes identiques ; `CHECK (role IN ...)` limite les rôles possibles ; `UNIQUE (user_id, course_id)` empêche une double inscription ; `ON DELETE CASCADE` supprime les inscriptions d'un utilisateur supprimé.

`backend/src/db/mongo.js` :

```js
// backend/src/db/mongo.js
const mongoose = require('mongoose');
const { mongoUrl } = require('../config');

async function connectMongo() {
  await mongoose.connect(mongoUrl);
  console.log('MongoDB connecte');
}

module.exports = { connectMongo };
```

### 9.4 — Les modèles MongoDB

`backend/src/models/Course.js` : un cours **contient** ses chapitres.

```js
// backend/src/models/Course.js
const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General', trim: true },
    ownerId: { type: Number, required: true }, // id du formateur dans PostgreSQL
    ownerName: { type: String, default: '' }, // copie du nom, pour l'afficher sans appeler PostgreSQL
    chapters: [chapterSchema], // les chapitres restent dans l'ordre de creation
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
```

`backend/src/models/Notification.js` :

```js
// backend/src/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
```

### 9.5 — Événements et middlewares

`backend/src/events.js` : le bus d'événements.

```js
// backend/src/events.js
const { EventEmitter } = require('events');

// Un "bus" d'evenements interne au monolithe.
// Les modules s'envoient des messages sans s'appeler directement.
module.exports = new EventEmitter();
```

`backend/src/middleware/asyncHandler.js` :

```js
// backend/src/middleware/asyncHandler.js
// Express 4 n'attrape pas les erreurs des fonctions async : on les transmet nous-memes.
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
```

`backend/src/middleware/auth.js` : vérifie le token JWT et le rôle.

```js
// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Connexion requise' });
  try {
    req.user = jwt.verify(token, jwtSecret); // { id, name, role }
    next();
  } catch {
    res.status(401).json({ error: 'Session expirée, reconnectez-vous' });
  }
}

const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'Accès refusé' });

module.exports = { authenticate, requireRole };
```

`authenticate` lit l'en-tête `Authorization: Bearer <token>`, vérifie la signature du token et place l'utilisateur dans `req.user`. `requireRole('formateur')` refuse (erreur 403) tout utilisateur qui n'a pas ce rôle. Les erreurs HTTP à connaître : **400** données invalides, **401** non connecté, **403** accès interdit, **404** introuvable, **409** conflit (doublon).

### 9.6 — Module users (US01, US02, US03, US10)

`backend/src/modules/users.js` :

```js
// backend/src/modules/users.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/postgres');
const { jwtSecret } = require('../config');
const { authenticate, requireRole } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// US01 - Creer un compte
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nom, email et mot de passe sont obligatoires' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
  }
  if (!['etudiant', 'formateur'].includes(role)) {
    return res.status(400).json({ error: 'Le rôle doit être étudiant ou formateur' });
  }
  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (exists.rows.length > 0) {
    return res.status(409).json({ error: 'Cet email est déjà utilisé' });
  }
  const hash = await bcrypt.hash(password, 10); // mot de passe hache (bcrypt)
  const { rows } = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, hash, role]
  );
  res.status(201).json(rows[0]);
}));

// US02 - Se connecter (renvoie un token JWT)
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];
  const ok = user && (await bcrypt.compare(password || '', user.password_hash));
  if (!ok) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, jwtSecret, { expiresIn: '4h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}));

// US03 - Consulter son profil
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
  res.json(rows[0]);
}));

// US03 - Modifier son profil
router.put('/me', authenticate, asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nom et email sont obligatoires' });
  const other = await pool.query('SELECT id FROM users WHERE email = $1 AND id <> $2', [email, req.user.id]);
  if (other.rows.length > 0) {
    return res.status(409).json({ error: 'Cet email est déjà utilisé par un autre compte' });
  }
  const { rows } = await pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role',
    [name, email, req.user.id]
  );
  res.json(rows[0]);
}));

// US10 - Lister les utilisateurs (admin), filtre ?role=etudiant
router.get('/', authenticate, requireRole('admin'), asyncHandler(async (req, res) => {
  const { role } = req.query;
  const { rows } = role
    ? await pool.query('SELECT id, name, email, role FROM users WHERE role = $1 ORDER BY id', [role])
    : await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
  res.json(rows);
}));

module.exports = router;
```

**À observer :** les requêtes SQL utilisent `$1`, `$2` (requêtes **paramétrées**) : c'est ce qui protège contre l'injection SQL. Ne construisez jamais une requête en collant du texte de l'utilisateur dedans. À la connexion, le message d'erreur est le même que l'email ou le mot de passe soit faux : on ne dit pas à un attaquant quel compte existe.

### 9.7 — Module courses (US04, US05, US06, US07)

`backend/src/modules/courses.js` :

```js
// backend/src/modules/courses.js
const router = require('express').Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const { pool } = require('../db/postgres');
const events = require('../events');
const { authenticate, requireRole } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Charge le cours et vérifie que l'utilisateur connecté en est le propriétaire
const loadOwnedCourse = asyncHandler(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: 'Cours introuvable' });
  }
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Cours introuvable' });
  if (course.ownerId !== req.user.id) {
    return res.status(403).json({ error: "Vous n'êtes pas le propriétaire de ce cours" });
  }
  req.course = course;
  next();
});

// US07 - Catalogue (public) : sans le contenu des chapitres, avec leur nombre
router.get('/', asyncHandler(async (req, res) => {
  const match = req.query.category ? { category: req.query.category } : {};
  const courses = await Course.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        title: 1, description: 1, category: 1, ownerId: 1, ownerName: 1, createdAt: 1,
        chaptersCount: { $size: '$chapters' },
      },
    },
  ]);
  res.json(courses);
}));

// Liste des catégories existantes (pour les filtres du catalogue)
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Course.distinct('category');
  res.json(categories.filter(Boolean).sort());
}));

// US07 - Détail d'un cours avec ses chapitres (public)
router.get('/:id', asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: 'Cours introuvable' });
  }
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Cours introuvable' });
  res.json(course);
}));

// US04 - Créer un cours (formateur uniquement)
router.post('/', authenticate, requireRole('formateur'), asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Titre et description sont obligatoires' });
  }
  const { rows } = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
  const course = await Course.create({
    title, description, category, ownerId: req.user.id, ownerName: rows[0] ? rows[0].name : '',
  });
  res.status(201).json(course);
}));

// US05 - Modifier un cours (propriétaire uniquement)
router.put('/:id', authenticate, requireRole('formateur'), loadOwnedCourse, asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (title) req.course.title = title;
  if (description) req.course.description = description;
  if (category) req.course.category = category;
  await req.course.save();
  res.json(req.course);
}));

// US05 - Supprimer un cours (propriétaire uniquement)
router.delete('/:id', authenticate, requireRole('formateur'), loadOwnedCourse, asyncHandler(async (req, res) => {
  const { _id, title } = req.course;
  await req.course.deleteOne();
  events.emit('course.deleted', { courseId: String(_id), title }); // les inscrits seront informés
  res.json({ message: 'Cours supprimé' });
}));

// US06 - Ajouter un chapitre
router.post('/:id/chapters', authenticate, requireRole('formateur'), loadOwnedCourse, asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Titre et contenu du chapitre sont obligatoires' });
  }
  req.course.chapters.push({ title, content });
  await req.course.save();
  res.status(201).json(req.course);
}));

// Supprimer un chapitre
router.delete('/:id/chapters/:chapterId', authenticate, requireRole('formateur'), loadOwnedCourse, asyncHandler(async (req, res) => {
  const chapter = req.course.chapters.id(req.params.chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapitre introuvable' });
  chapter.deleteOne();
  await req.course.save();
  res.json(req.course);
}));

module.exports = router;
```

**À observer :** le catalogue utilise un `aggregate` MongoDB pour renvoyer le **nombre** de chapitres sans leur contenu (les listes restent légères). Le nom du formateur (`ownerName`) est **copié** dans le cours à la création : on évite d'interroger PostgreSQL à chaque affichage du catalogue. `loadOwnedCourse` est un middleware qui vérifie que **le formateur connecté est le propriétaire** du cours (`ownerId`). Sans cette vérification, n'importe quel formateur pourrait supprimer le cours d'un autre. La suppression émet l'événement `course.deleted` : le module de notifications préviendra les inscrits (US05).

### 9.8 — Module enrollments (US08, US09)

`backend/src/modules/enrollments.js` :

```js
// backend/src/modules/enrollments.js
const router = require('express').Router();
const mongoose = require('mongoose');
const { pool } = require('../db/postgres');
const Course = require('../models/Course');
const events = require('../events');
const { authenticate, requireRole } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Recalcule le pourcentage de progression d'une inscription
async function updateProgress(enrollmentId, totalChapters) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS done FROM completed_chapters WHERE enrollment_id = $1',
    [enrollmentId]
  );
  const progress = totalChapters ? Math.round((rows[0].done * 100) / totalChapters) : 0;
  await pool.query('UPDATE enrollments SET progress = $1 WHERE id = $2', [progress, enrollmentId]);
  return progress;
}

// US08 - S'inscrire a un cours
router.post('/', authenticate, requireRole('etudiant'), asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ error: 'courseId invalide' });
  }
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ error: 'Cours introuvable' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING id, course_id, progress',
      [req.user.id, courseId]
    );
    // US11 - on previent le module de notification sans l'attendre
    events.emit('enrollment.created', { userId: req.user.id, courseTitle: course.title });
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Vous êtes déjà inscrit à ce cours' });
    }
    throw err;
  }
}));

// US09 - Mes cours avec ma progression
router.get('/mine', authenticate, requireRole('etudiant'), asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, course_id, progress FROM enrollments WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );
  const courses = await Course.find({ _id: { $in: rows.map((r) => r.course_id) } });
  const done = await pool.query(
    'SELECT enrollment_id, chapter_id FROM completed_chapters WHERE enrollment_id = ANY($1::int[])',
    [rows.map((r) => r.id)]
  );
  const result = rows.map((enr) => {
    const course = courses.find((c) => String(c._id) === enr.course_id);
    const doneIds = done.rows.filter((d) => d.enrollment_id === enr.id).map((d) => d.chapter_id);
    return {
      enrollmentId: enr.id,
      courseId: enr.course_id,
      title: course ? course.title : '(cours supprimé)',
      category: course ? course.category : '',
      ownerName: course ? course.ownerName : '',
      progress: enr.progress,
      chapters: course
        ? course.chapters.map((ch) => ({ id: String(ch._id), title: ch.title, done: doneIds.includes(String(ch._id)) }))
        : [],
    };
  });
  res.json(result);
}));

// US09 - Marquer un chapitre comme termine
router.post('/:courseId/chapters/:chapterId/complete', authenticate, requireRole('etudiant'), asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  const enr = await pool.query('SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2', [req.user.id, courseId]);
  if (!enr.rows[0]) return res.status(404).json({ error: "Vous n'êtes pas inscrit à ce cours" });
  const course = mongoose.isValidObjectId(courseId) ? await Course.findById(courseId) : null;
  const chapter = course && course.chapters.id(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapitre introuvable' });
  await pool.query(
    'INSERT INTO completed_chapters (enrollment_id, chapter_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [enr.rows[0].id, chapterId]
  );
  const progress = await updateProgress(enr.rows[0].id, course.chapters.length);
  res.json({ progress });
}));

module.exports = router;
```

**À observer :** dans ce module, on utilise **PostgreSQL et MongoDB dans la même fonction** (`Course.findById` puis `INSERT INTO enrollments`). Dans un monolithe, c'est trivial. Dans le TP5, ces deux données seront dans deux services différents : il faudra un appel réseau. Notez aussi que l'inscription ne **crée pas** la notification elle-même : elle émet un événement `enrollment.created` puis répond tout de suite.

### 9.9 — Module notifications (US11)

`backend/src/modules/notifications.js` :

```js
// backend/src/modules/notifications.js
const router = require('express').Router();
const Notification = require('../models/Notification');
const { pool } = require('../db/postgres');
const events = require('../events');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// US11 - Confirmation d'inscription, envoyee de facon asynchrone
// Le module "enrollments" emet un evenement puis repond tout de suite a l'etudiant.
function registerListeners() {
  events.on('enrollment.created', ({ userId, courseTitle }) => {
    setImmediate(async () => {
      try {
        const message = `Inscription confirmée au cours : ${courseTitle}`;
        await Notification.create({ userId, type: 'inscription', message });
        console.log(`[NOTIFICATION] utilisateur ${userId} : ${message}`);
      } catch (err) {
        console.error('Erreur notification', err);
      }
    });
  });

  // US05 - Prevenir les etudiants inscrits quand un cours est supprime
  events.on('course.deleted', async ({ courseId, title }) => {
    try {
      const { rows } = await pool.query('SELECT user_id FROM enrollments WHERE course_id = $1', [courseId]);
      for (const row of rows) {
        await Notification.create({
          userId: row.user_id,
          type: 'cours_supprime',
          message: `Le cours "${title}" a été supprimé par son formateur`,
        });
      }
      await pool.query('DELETE FROM enrollments WHERE course_id = $1', [courseId]);
    } catch (err) {
      console.error('Erreur notification de suppression', err);
    }
  });
}

// Mes notifications
router.get('/mine', authenticate, asyncHandler(async (req, res) => {
  const list = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(list);
}));

module.exports = { router, registerListeners };
```

**À observer :** `setImmediate` exécute l'écriture de la notification **après** la réponse de l'inscription : c'est ce qui rend l'envoi asynchrone (critère d'acceptation de US11). La « notification » est ici un document MongoDB et une ligne dans la console (`docker compose logs backend`), ce qui correspond à « visible dans un log » de l'énoncé.

### 9.10 — Module stats (tableau de bord)

`backend/src/modules/stats.js` : calcule les chiffres du tableau de bord selon le rôle (cours suivis pour un étudiant, étudiants inscrits pour un formateur, totaux pour l'admin).

```js
// backend/src/modules/stats.js
const router = require('express').Router();
const { pool } = require('../db/postgres');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Chiffres du tableau de bord, adaptés au rôle de l'utilisateur connecté
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const { id, role } = req.user;

  if (role === 'etudiant') {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS enrolled,
              COUNT(*) FILTER (WHERE progress = 100)::int AS completed,
              COALESCE(ROUND(AVG(progress)), 0)::int AS average
       FROM enrollments WHERE user_id = $1`,
      [id]
    );
    const notifications = await Notification.countDocuments({ userId: id });
    return res.json({ role, ...rows[0], notifications });
  }

  if (role === 'formateur') {
    const courses = await Course.find({ ownerId: id }).select('chapters');
    const ids = courses.map((c) => String(c._id));
    const chapters = courses.reduce((sum, c) => sum + c.chapters.length, 0);
    const { rows } = await pool.query(
      'SELECT COUNT(DISTINCT user_id)::int AS students FROM enrollments WHERE course_id = ANY($1::text[])',
      [ids]
    );
    return res.json({ role, courses: courses.length, chapters, students: rows[0].students });
  }

  // admin
  const users = await pool.query('SELECT role, COUNT(*)::int AS n FROM users GROUP BY role');
  const byRole = { etudiant: 0, formateur: 0, admin: 0 };
  users.rows.forEach((r) => { byRole[r.role] = r.n; });
  const enrollments = await pool.query('SELECT COUNT(*)::int AS n FROM enrollments');
  const courses = await Course.countDocuments();
  res.json({
    role,
    users: byRole.etudiant + byRole.formateur + byRole.admin,
    students: byRole.etudiant,
    teachers: byRole.formateur,
    courses,
    enrollments: enrollments.rows[0].n,
  });
}));

module.exports = router;
```

**À observer :** ce module lit les **deux bases** (PostgreSQL pour les inscriptions, MongoDB pour les cours). Les requêtes SQL `COUNT`, `AVG`, `GROUP BY` sont faites par la base elle-même : c'est bien plus rapide que de tout charger en mémoire pour compter. Retenez aussi qu'un module « transversal » comme celui-ci sera difficile à placer dans un microservice (TP5).

### 9.11 — Le point d'entrée

`backend/src/index.js` :

```js
// backend/src/index.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { port, adminEmail, adminPassword } = require('./config');
const { pool, initPostgres } = require('./db/postgres');
const { connectMongo } = require('./db/mongo');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Chaque module = une ligne. Si un module n'est pas encore ecrit, mettez sa ligne en commentaire (//).
app.use('/api/users', require('./modules/users'));
app.use('/api/courses', require('./modules/courses'));
app.use('/api/enrollments', require('./modules/enrollments'));
app.use('/api/notifications', require('./modules/notifications').router);
app.use('/api/stats', require('./modules/stats'));
require('./modules/notifications').registerListeners();

app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

app.use((err, req, res, next) => {
  if (err.code === '23505') return res.status(409).json({ error: 'Cette ressource existe déjà' });
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Cree le compte administrateur au premier demarrage (un admin ne peut pas s'inscrire seul)
async function seedAdmin() {
  if (!adminEmail || !adminPassword) return;
  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
  if (exists.rows.length === 0) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ('Administrateur', $1, $2, 'admin')",
      [adminEmail, hash]
    );
    console.log('Compte admin créé :', adminEmail);
  }
}

async function start() {
  await initPostgres();
  console.log('PostgreSQL connecte, tables pretes');
  await connectMongo();
  await seedAdmin();
  app.listen(port, () => console.log(`API LearnHub sur le port ${port}`));
}

start().catch((err) => {
  console.error('Démarrage impossible', err);
  process.exit(1);
});
```

Chaque module est branché par **une seule ligne** `app.use(...)`. C'est ce qui permet au chef de commenter (`//`) les modules pas encore écrits, et aux membres de les activer chacun dans leur branche.

### 9.12 — README du backend

Remplacez le contenu de `backend/README.md` (créé au TP2) :

```
# Backend LearnHub (monolithe)

API REST Express.js, port 5000.

- Bases : PostgreSQL (utilisateurs, inscriptions) et MongoDB (cours, notifications)
- Modules : users, courses, enrollments, notifications
- Lancement : `docker compose up` depuis la racine du projet
- Santé de l'API : http://localhost:5000/api/health
```

## Partie 10 — Étape 3 : le frontend React

Le frontend est un projet **React + Vite** avec un design moderne : thème clair et sombre, cartes de cours, tableau de bord par rôle, page d'apprentissage, messages de confirmation (« toasts »), états de chargement et écrans vides soignés. Les icônes viennent de la bibliothèque **lucide-react**, la navigation de **react-router-dom**.

### 10.1 — Configuration du projet

`frontend/package.json` :

```json
{
  "name": "learnhub-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "lucide-react": "^0.453.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0"
  }
}
```

`frontend/vite.config.js` : `host: true` permet d'ouvrir le site depuis l'extérieur du conteneur ; `usePolling` règle un problème de rechargement automatique sous Windows.

```js
// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: { usePolling: true }, // necessaire pour Docker sous Windows
  },
});
```

`frontend/index.html` :

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎓</text></svg>" />
    <title>LearnHub - Apprenez à votre rythme</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 10.2 — Les styles (le design)

Le design repose sur des **variables CSS** (couleurs, ombres, arrondis). Le thème sombre ne fait que remplacer ces variables : aucune page n'a besoin de le connaître. Pour changer l'identité visuelle de LearnHub, modifiez uniquement `--primary` dans ce fichier.

`frontend/src/styles/theme.css` :

```css
/* Couleurs et réglages de base. Le thème sombre remplace les valeurs ci-dessous. */
:root {
  --bg: #f5f6fb;
  --surface: #ffffff;
  --surface-2: #f0f1f9;
  --text: #1a1d3a;
  --muted: #666b8d;
  --border: #e4e6f2;
  --primary: #5b5bd6;
  --primary-hover: #4a4ac0;
  --primary-soft: #ececff;
  --success: #16a34a;
  --success-soft: #dcfce7;
  --danger: #dc2626;
  --danger-soft: #fee2e2;
  --warning-soft: #fef3c7;
  --radius: 14px;
  --shadow: 0 1px 2px rgba(20, 24, 60, 0.06), 0 4px 16px rgba(20, 24, 60, 0.06);
  --shadow-lg: 0 10px 30px rgba(20, 24, 60, 0.15);
}

[data-theme='dark'] {
  --bg: #0f1120;
  --surface: #181b30;
  --surface-2: #20243d;
  --text: #eceefc;
  --muted: #9aa0c4;
  --border: #2b3052;
  --primary: #8080f0;
  --primary-hover: #9696ff;
  --primary-soft: #26294d;
  --success: #4ade80;
  --success-soft: #153324;
  --danger: #f87171;
  --danger-soft: #3b1a1d;
  --warning-soft: #3a2f14;
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.6);
}
```

`frontend/src/styles/app.css` : boutons, cartes, formulaires, grilles, navigation, adaptation au téléphone (`@media (max-width: 820px)`).

```css
/* ---------- Base ---------- */
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4 { line-height: 1.25; margin: 0 0 8px; letter-spacing: -0.01em; }
h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.1rem; }
p { margin: 0 0 12px; }
a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
.container { max-width: 1120px; margin: 0 auto; padding: 24px 20px 64px; }
.muted { color: var(--muted); }
.row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.spacer { flex: 1; }
.stack { display: grid; gap: 16px; }

/* ---------- Navigation ---------- */
.navbar { position: sticky; top: 0; z-index: 20; background: var(--surface); border-bottom: 1px solid var(--border); }
.navbar-inner { max-width: 1120px; margin: 0 auto; padding: 10px 20px; display: flex; align-items: center; gap: 8px; }
.brand { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.15rem; color: var(--text); margin-right: 16px; }
.brand:hover { text-decoration: none; }
.brand-logo { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; color: white; background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.nav-links { display: flex; gap: 4px; flex: 1; }
.nav-link { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 10px; color: var(--muted); font-weight: 500; }
.nav-link:hover { background: var(--surface-2); text-decoration: none; color: var(--text); }
.nav-link.active { background: var(--primary-soft); color: var(--primary); }
.nav-actions { display: flex; align-items: center; gap: 8px; }
.menu-toggle { display: none; }
.avatar { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: 0.85rem; color: white; background: linear-gradient(135deg, #6366f1, #ec4899); flex-shrink: 0; }
.avatar-lg { width: 72px; height: 72px; font-size: 1.5rem; }

/* ---------- Boutons ---------- */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 9px 16px; border-radius: 10px; border: 1px solid transparent; font: inherit; font-weight: 600; cursor: pointer; background: var(--primary); color: white; transition: background 0.15s, transform 0.05s; }
.btn:hover { background: var(--primary-hover); text-decoration: none; }
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-secondary { background: var(--surface); color: var(--text); border-color: var(--border); }
.btn-secondary:hover { background: var(--surface-2); }
.btn-ghost { background: transparent; color: var(--muted); padding: 8px 10px; }
.btn-ghost:hover { background: var(--surface-2); color: var(--text); }
.btn-danger { background: var(--danger); }
.btn-danger:hover { background: var(--danger); filter: brightness(0.9); }
.btn-sm { padding: 6px 12px; font-size: 0.875rem; }
.btn-block { width: 100%; }

/* ---------- Formulaires ---------- */
.field { display: grid; gap: 6px; }
.field label { font-weight: 600; font-size: 0.9rem; }
.input, .select, .textarea { width: 100%; font: inherit; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; }
.input:focus, .select:focus, .textarea:focus { outline: 2px solid var(--primary); outline-offset: 1px; border-color: transparent; }
.textarea { min-height: 110px; resize: vertical; }
.form { display: grid; gap: 16px; }
.search { position: relative; }
.search svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); }
.search .input { padding-left: 40px; }
.segmented { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: var(--surface-2); padding: 4px; border-radius: 12px; }
.segmented button { border: 0; background: transparent; padding: 9px; border-radius: 9px; font: inherit; font-weight: 600; cursor: pointer; color: var(--muted); }
.segmented button.active { background: var(--surface); color: var(--primary); box-shadow: var(--shadow); }

/* ---------- Cartes, badges, grilles ---------- */
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
.grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 600; background: var(--primary-soft); color: var(--primary); }
.badge-success { background: var(--success-soft); color: var(--success); }
.badge-warning { background: var(--warning-soft); color: #b45309; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { border: 1px solid var(--border); background: var(--surface); color: var(--muted); padding: 6px 14px; border-radius: 999px; font: inherit; font-size: 0.9rem; font-weight: 500; cursor: pointer; }
.chip:hover { color: var(--text); }
.chip.active { background: var(--primary); border-color: var(--primary); color: white; }

/* ---------- Carte de cours ---------- */
.course-card { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); color: var(--text); transition: transform 0.15s, box-shadow 0.15s; }
.course-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); text-decoration: none; }
.course-cover { height: 110px; display: grid; place-items: center; color: rgba(255, 255, 255, 0.9); position: relative; }
.course-cover .badge { position: absolute; top: 12px; left: 12px; background: rgba(255, 255, 255, 0.92); color: #333; }
.course-body { padding: 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.course-body p { color: var(--muted); font-size: 0.9rem; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.course-meta { margin-top: auto; padding-top: 10px; display: flex; justify-content: space-between; color: var(--muted); font-size: 0.85rem; }
.course-meta span { display: inline-flex; align-items: center; gap: 4px; }

/* ---------- Accueil ---------- */
.hero { border-radius: 20px; padding: 48px 32px; margin-bottom: 28px; color: white; background: linear-gradient(135deg, #4f46e5, #7c3aed 60%, #c026d3); position: relative; overflow: hidden; }
.hero h1 { font-size: 2.4rem; max-width: 560px; }
.hero p { max-width: 520px; opacity: 0.92; font-size: 1.05rem; }
.hero .search { max-width: 480px; margin-top: 20px; }
.hero .input { border: 0; padding: 14px 14px 14px 44px; }
.section-head { display: flex; align-items: end; justify-content: space-between; gap: 12px; margin: 28px 0 16px; flex-wrap: wrap; }

/* ---------- Authentification ---------- */
.auth { max-width: 440px; margin: 32px auto; }
.auth h2 { text-align: center; }
.auth .sub { text-align: center; color: var(--muted); margin-bottom: 20px; }
.auth-foot { text-align: center; margin-top: 16px; color: var(--muted); font-size: 0.92rem; }

/* ---------- Tableau de bord ---------- */
.stats { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); }
.stat { display: flex; align-items: center; gap: 14px; }
.stat-icon { width: 46px; height: 46px; border-radius: 12px; display: grid; place-items: center; background: var(--primary-soft); color: var(--primary); }
.stat-value { font-size: 1.7rem; font-weight: 800; line-height: 1.1; }
.stat-label { color: var(--muted); font-size: 0.85rem; }

/* ---------- Progression ---------- */
.progress { height: 8px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
.progress > div { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #6366f1, #22c55e); transition: width 0.4s; }
.progress-label { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--muted); margin-bottom: 6px; }

/* ---------- Détail d'un cours ---------- */
.detail { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
.detail-banner { border-radius: var(--radius); padding: 32px; color: white; margin-bottom: 20px; }
.detail-banner h1 { margin-bottom: 8px; }
.side-card { position: sticky; top: 84px; }
.lesson-row { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
.lesson-num { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: var(--primary-soft); color: var(--primary); font-weight: 700; font-size: 0.85rem; flex-shrink: 0; }

/* ---------- Page d'apprentissage ---------- */
.learn { display: grid; grid-template-columns: 300px 1fr; gap: 24px; align-items: start; }
.lesson-list { display: grid; gap: 6px; }
.lesson-btn { display: flex; align-items: center; gap: 10px; text-align: left; width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid transparent; background: transparent; font: inherit; color: var(--text); cursor: pointer; }
.lesson-btn:hover { background: var(--surface-2); }
.lesson-btn.active { background: var(--primary-soft); border-color: var(--primary); }
.lesson-btn .done { color: var(--success); }
.lesson-content { white-space: pre-wrap; font-size: 1.02rem; line-height: 1.75; }

/* ---------- Tableaux ---------- */
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); padding: 10px 14px; border-bottom: 1px solid var(--border); }
.table td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.table tr:last-child td { border-bottom: 0; }
.user-cell { display: flex; align-items: center; gap: 12px; }

/* ---------- États vides, chargement ---------- */
.empty { text-align: center; padding: 48px 20px; color: var(--muted); }
.empty svg { color: var(--primary); margin-bottom: 10px; }
.empty h3 { color: var(--text); }
.skeleton { border-radius: var(--radius); height: 250px; background: linear-gradient(90deg, var(--surface-2) 25%, var(--surface) 50%, var(--surface-2) 75%); background-size: 200% 100%; animation: shimmer 1.3s infinite; }
@keyframes shimmer { to { background-position: -200% 0; } }
.alert { padding: 12px 14px; border-radius: 10px; background: var(--danger-soft); color: var(--danger); font-weight: 500; }

/* ---------- Fenêtre de confirmation et messages ---------- */
.overlay { position: fixed; inset: 0; z-index: 40; background: rgba(10, 12, 30, 0.55); display: grid; place-items: center; padding: 20px; }
.modal { background: var(--surface); border-radius: var(--radius); padding: 24px; max-width: 440px; width: 100%; box-shadow: var(--shadow-lg); }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.toasts { position: fixed; bottom: 20px; right: 20px; z-index: 50; display: grid; gap: 10px; }
.toast { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 12px; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg); font-weight: 500; animation: slide 0.25s ease-out; }
.toast-success svg { color: var(--success); }
.toast-error svg { color: var(--danger); }
@keyframes slide { from { transform: translateY(12px); opacity: 0; } }

.footer { text-align: center; color: var(--muted); font-size: 0.85rem; padding: 24px; border-top: 1px solid var(--border); }

/* ---------- Mobile ---------- */
@media (max-width: 820px) {
  .detail, .learn { grid-template-columns: 1fr; }
  .side-card { position: static; }
  .hero { padding: 32px 22px; }
  .hero h1 { font-size: 1.8rem; }
  .menu-toggle { display: inline-flex; }
  .nav-links { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; background: var(--surface); padding: 10px 20px 16px; border-bottom: 1px solid var(--border); }
  .nav-links.open { display: flex; }
  .navbar-inner { position: relative; }
  .nav-actions .user-name { display: none; }
}
```

### 10.3 — Le cœur : démarrage, appels à l'API, données partagées

`frontend/src/main.jsx` :

```jsx
// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import './styles/theme.css';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

`frontend/src/services/api.js` : **une seule fonction** pour appeler le backend. Elle ajoute le token et transforme les erreurs de l'API en messages affichables. Si le token a expiré, elle prévient l'application qui déconnecte l'utilisateur.

```js
// frontend/src/services/api.js
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Une seule fonction pour parler au backend : ajoute le token et renvoie du JSON.
export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(API + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Token expiré : on prévient l'application pour qu'elle déconnecte l'utilisateur
    if (res.status === 401 && token) window.dispatchEvent(new Event('auth:expired'));
    throw new Error(data.error || 'Erreur serveur');
  }
  return data;
}
```

`frontend/src/hooks/useFetch.js` : un **hook personnalisé** qui charge une adresse et fournit `data`, `loading` et `error`. Il évite de recopier le même code de chargement dans chaque page.

```js
// frontend/src/hooks/useFetch.js
import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';

// Charge une adresse de l'API et gère "chargement / erreur / données".
// Passer null comme adresse = ne rien charger.
export function useFetch(path) {
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: '' });

  const load = useCallback(() => {
    if (!path) {
      setState({ data: null, loading: false, error: '' });
      return Promise.resolve();
    }
    setState((s) => ({ ...s, loading: true, error: '' }));
    return api(path)
      .then((data) => setState({ data, loading: false, error: '' }))
      .catch((e) => setState({ data: null, loading: false, error: e.message }));
  }, [path]);

  useEffect(() => { load(); }, [load]);

  return { ...state, reload: load };
}
```

`frontend/src/context/AuthContext.jsx` : garde en mémoire l'utilisateur connecté, accessible partout avec `useAuth()`.

```jsx
// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  function login(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  function updateUser(newUser) {
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  }

  // Si le backend dit "session expirée", on déconnecte proprement
  useEffect(() => {
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
```

`frontend/src/context/ToastContext.jsx` : les petits messages de succès ou d'erreur, accessibles partout avec `useToast()`.

```jsx
// frontend/src/context/ToastContext.jsx
import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

// Petits messages qui apparaissent en bas de l'écran puis disparaissent
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, type, message }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3500);
  }, []);

  const toast = {
    success: (message) => show('success', message),
    error: (message) => show('error', message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
```

`frontend/src/utils/format.js` : couleur de dégradé par catégorie, initiales, dates en français.

```js
// frontend/src/utils/format.js
export const ROLE_LABELS = { etudiant: 'Étudiant', formateur: 'Formateur', admin: 'Administrateur' };

// Une couleur de dégradé stable pour chaque catégorie
const GRADIENTS = [
  ['#6366f1', '#8b5cf6'],
  ['#0ea5e9', '#6366f1'],
  ['#10b981', '#0ea5e9'],
  ['#f59e0b', '#ef4444'],
  ['#ec4899', '#8b5cf6'],
  ['#14b8a6', '#22c55e'],
];

export function gradientFor(text = '') {
  let hash = 0;
  for (const ch of text) hash = (hash * 31 + ch.charCodeAt(0)) % 1000;
  const [a, b] = GRADIENTS[hash % GRADIENTS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

export function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
}

export function formatDate(value) {
  return new Date(value).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}
```

### 10.4 — Les composants réutilisables

Un composant est une brique d'interface utilisée à plusieurs endroits.

`components/Avatar.jsx`

```jsx
// frontend/src/components/Avatar.jsx
import { initials } from '../utils/format.js';

export default function Avatar({ name, large }) {
  return <div className={`avatar ${large ? 'avatar-lg' : ''}`}>{initials(name)}</div>;
}
```

`components/ProgressBar.jsx`

```jsx
// frontend/src/components/ProgressBar.jsx
export default function ProgressBar({ value, label }) {
  return (
    <div>
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <strong>{value} %</strong>
        </div>
      )}
      <div className="progress"><div style={{ width: `${value}%` }} /></div>
    </div>
  );
}
```

`components/EmptyState.jsx` : l'écran « rien à afficher » avec un message utile.

```jsx
// frontend/src/components/EmptyState.jsx
export default function EmptyState({ icon: Icon, title, text, children }) {
  return (
    <div className="card empty">
      {Icon && <Icon size={40} />}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
```

`components/CourseCard.jsx` : la carte d'un cours, utilisée dans le catalogue et dans « Mes cours ».

```jsx
// frontend/src/components/CourseCard.jsx
import { Link } from 'react-router-dom';
import { BookOpen, Layers, UserRound } from 'lucide-react';
import { gradientFor } from '../utils/format.js';
import ProgressBar from './ProgressBar.jsx';

// Carte d'un cours. Si "progress" est donné, on affiche la barre de progression.
export default function CourseCard({ course, to, progress }) {
  return (
    <Link to={to || `/courses/${course._id}`} className="course-card">
      <div className="course-cover" style={{ background: gradientFor(course.category) }}>
        <span className="badge">{course.category}</span>
        <BookOpen size={44} />
      </div>
      <div className="course-body">
        <h3>{course.title}</h3>
        {course.description && <p>{course.description}</p>}
        {progress !== undefined && <ProgressBar value={progress} />}
        <div className="course-meta">
          <span><UserRound size={15} /> {course.ownerName || 'Formateur'}</span>
          {course.chaptersCount !== undefined && (
            <span><Layers size={15} /> {course.chaptersCount} chapitre{course.chaptersCount > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
```

`components/CardGridSkeleton.jsx` : les blocs gris animés pendant le chargement.

```jsx
// frontend/src/components/CardGridSkeleton.jsx
// Des blocs gris animés pendant le chargement, pour éviter une page vide
export default function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => <div className="skeleton" key={i} />)}
    </div>
  );
}
```

`components/ConfirmDialog.jsx` : la fenêtre « Êtes-vous sûr ? » avant une suppression.

```jsx
// frontend/src/components/ConfirmDialog.jsx
// Fenêtre "Êtes-vous sûr ?" avant une action dangereuse (suppression...)
export default function ConfirmDialog({ title, text, confirmLabel = 'Confirmer', onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="muted">{text}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
```

`components/ThemeToggle.jsx` : le bouton clair / sombre.

```jsx
// frontend/src/components/ThemeToggle.jsx
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

// Bouton clair / sombre. Le choix est gardé dans le navigateur.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button className="btn btn-ghost" title="Changer de thème" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
```

`components/Navbar.jsx` : le menu, qui change selon le rôle de l'utilisateur.

```jsx
// frontend/src/components/Navbar.jsx
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, BookOpen, GraduationCap, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';
import ThemeToggle from './ThemeToggle.jsx';

// Les liens du menu changent selon le rôle de l'utilisateur
function linksFor(user) {
  const links = [{ to: '/', label: 'Catalogue', icon: BookOpen, end: true }];
  if (!user) return links;
  links.push({ to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard });
  if (user.role === 'etudiant') {
    links.push({ to: '/my-courses', label: 'Mes cours', icon: GraduationCap });
    links.push({ to: '/notifications', label: 'Notifications', icon: Bell });
  }
  if (user.role === 'formateur') links.push({ to: '/teacher', label: 'Gérer mes cours', icon: GraduationCap });
  if (user.role === 'admin') links.push({ to: '/admin/users', label: 'Utilisateurs', icon: Users });
  return links;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-logo"><GraduationCap size={20} /></span> LearnHub
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          {linksFor(user).map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/profile" className="row" style={{ gap: 8, color: 'inherit' }}>
                <Avatar name={user.name} />
                <span className="user-name">{user.name}</span>
              </Link>
              <button className="btn btn-ghost" title="Déconnexion" onClick={() => { logout(); navigate('/'); }}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Connexion</Link>
              <Link to="/register" className="btn btn-sm">Créer un compte</Link>
            </>
          )}
          <button className="btn btn-ghost menu-toggle" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
```

`components/Layout.jsx` : le cadre commun à toutes les pages.

```jsx
// frontend/src/components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

// Le cadre commun à toutes les pages : menu en haut, contenu, pied de page
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">LearnHub — projet fil rouge, module Architecture logicielle et microservices</footer>
    </>
  );
}
```

`components/ProtectedRoute.jsx` : protège un groupe de pages.

```jsx
// frontend/src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Protège un groupe de pages : il faut être connecté (et avoir le bon rôle si "roles" est donné).
// Attention : c'est du confort d'affichage. La vraie sécurité est dans le backend.
export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
```

**Attention :** protéger une page dans React ne protège **pas** les données. La vraie protection est dans le backend (`authenticate`, `requireRole`). Le frontend ne fait que cacher les écrans.

### 10.5 — Les routes

`frontend/src/App.jsx` : la liste de toutes les adresses de l'application, regroupées par rôle. C'est le fichier que **tout le monde modifie** : prévoyez des conflits Git !

```jsx
// frontend/src/App.jsx
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import MyCourses from './pages/MyCourses.jsx';
import Learn from './pages/Learn.jsx';
import Notifications from './pages/Notifications.jsx';
import TeacherCourses from './pages/teacher/TeacherCourses.jsx';
import CourseEditor from './pages/teacher/CourseEditor.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages pour tout utilisateur connecté */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Étudiant */}
        <Route element={<ProtectedRoute roles={['etudiant']} />}>
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/learn/:courseId" element={<Learn />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* Formateur */}
        <Route element={<ProtectedRoute roles={['formateur']} />}>
          <Route path="/teacher" element={<TeacherCourses />} />
          <Route path="/teacher/new" element={<CourseEditor />} />
          <Route path="/teacher/courses/:id" element={<CourseEditor />} />
        </Route>

        {/* Administrateur */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

### 10.6 — Les pages

Chaque page est un fichier de `frontend/src/pages/`, écrit par le membre responsable du module.

**Home.jsx : le catalogue (US07)** : recherche, filtres par catégorie, grille de cartes.

```jsx
// frontend/src/pages/Home.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SearchX } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import CourseCard from '../components/CourseCard.jsx';
import CardGridSkeleton from '../components/CardGridSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';

// US07 - Catalogue de cours (accessible sans compte)
export default function Home() {
  const { user } = useAuth();
  const { data: courses, loading, error } = useFetch('/courses');
  const { data: categories } = useFetch('/courses/categories');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const shown = (courses || []).filter(
    (c) =>
      (!category || c.category === category) &&
      (c.title + c.description).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <section className="hero">
        <h1>Apprenez à votre rythme, avec les meilleurs formateurs</h1>
        <p>Parcourez le catalogue, inscrivez-vous en un clic et suivez votre progression chapitre par chapitre.</p>
        <div className="search">
          <Search size={18} />
          <input className="input" placeholder="Rechercher un cours..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {!user && <Link to="/register" className="btn btn-secondary" style={{ marginTop: 16 }}>Créer un compte gratuit</Link>}
      </section>

      <div className="chips">
        <button className={`chip ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')}>Tous</button>
        {(categories || []).map((c) => (
          <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div className="section-head">
        <h2>Catalogue ({shown.length})</h2>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading && <CardGridSkeleton />}
      {!loading && !error && shown.length === 0 && (
        <EmptyState icon={SearchX} title="Aucun cours trouvé" text="Essayez un autre mot-clé ou une autre catégorie." />
      )}
      <div className="grid">
        {shown.map((c) => <CourseCard key={c._id} course={c} />)}
      </div>
    </>
  );
}
```

**CourseDetail.jsx : détail d'un cours et inscription (US07, US08)**

```jsx
// frontend/src/pages/CourseDetail.jsx
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layers, Lock, Pencil, UserRound } from 'lucide-react';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { gradientFor } from '../utils/format.js';
import ProgressBar from '../components/ProgressBar.jsx';

// US07 - Détail d'un cours, US08 - Inscription
export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { data: course, loading, error } = useFetch(`/courses/${id}`);
  // Seul un étudiant a des inscriptions : on ne charge la liste que pour lui
  const { data: mine, reload } = useFetch(user?.role === 'etudiant' ? '/enrollments/mine' : null);
  const enrollment = (mine || []).find((e) => e.courseId === id);

  async function enroll() {
    try {
      await api('/enrollments', { method: 'POST', body: { courseId: id } });
      toast.success('Inscription réussie ! Une confirmation vous est envoyée.');
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (loading) return <div className="skeleton" />;
  if (error) return <div className="alert">{error}</div>;

  const isOwner = user?.role === 'formateur' && user.id === course.ownerId;

  return (
    <div className="detail">
      <div>
        <div className="detail-banner" style={{ background: gradientFor(course.category) }}>
          <span className="badge">{course.category}</span>
          <h1 style={{ marginTop: 12 }}>{course.title}</h1>
          <div className="row" style={{ opacity: 0.9 }}>
            <UserRound size={16} /> {course.ownerName || 'Formateur'}
          </div>
        </div>

        <div className="card stack">
          <div>
            <h3>À propos de ce cours</h3>
            <p className="muted" style={{ marginBottom: 0 }}>{course.description}</p>
          </div>
        </div>

        <h3 style={{ margin: '24px 0 12px' }}>Programme ({course.chapters.length} chapitre{course.chapters.length > 1 ? 's' : ''})</h3>
        <div className="stack" style={{ gap: 10 }}>
          {course.chapters.length === 0 && <p className="muted">Le formateur n'a pas encore ajouté de chapitre.</p>}
          {course.chapters.map((ch, i) => (
            <div className="lesson-row" key={ch._id}>
              <span className="lesson-num">{i + 1}</span>
              <span style={{ flex: 1 }}>{ch.title}</span>
              {!enrollment && <Lock size={16} className="muted" />}
            </div>
          ))}
        </div>
      </div>

      <aside className="card side-card stack">
        {enrollment ? (
          <>
            <ProgressBar value={enrollment.progress} label="Votre progression" />
            <Link to={`/learn/${id}`} className="btn btn-block">Continuer le cours</Link>
          </>
        ) : user?.role === 'etudiant' ? (
          <button className="btn btn-block" onClick={enroll}>S'inscrire à ce cours</button>
        ) : !user ? (
          <button className="btn btn-block" onClick={() => navigate('/login')}>Connectez-vous pour vous inscrire</button>
        ) : null}

        {isOwner && (
          <Link to={`/teacher/courses/${id}`} className="btn btn-secondary btn-block"><Pencil size={16} /> Modifier ce cours</Link>
        )}
        <div className="row muted"><Layers size={16} /> {course.chapters.length} chapitres</div>
      </aside>
    </div>
  );
}
```

**Login.jsx (US02)**

```jsx
// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

// US02 - Connexion
export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api('/users/login', { method: 'POST', body: form });
      login(data.token, data.user);
      toast.success(`Bienvenue ${data.user.name} !`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card auth">
      <h2>Content de vous revoir</h2>
      <p className="sub">Connectez-vous pour accéder à votre espace</p>
      <form className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input id="password" className="input" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error && <div className="alert">{error}</div>}
        <button className="btn btn-block" disabled={busy}>{busy ? 'Connexion...' : 'Se connecter'}</button>
      </form>
      <p className="auth-foot">Pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
    </div>
  );
}
```

**Register.jsx (US01)**

```jsx
// frontend/src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

// US01 - Création de compte
export default function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'etudiant' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/users/register', { method: 'POST', body: form });
      toast.success('Compte créé ! Vous pouvez vous connecter.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card auth">
      <h2>Créer un compte</h2>
      <p className="sub">Rejoignez LearnHub en quelques secondes</p>
      <form className="form" onSubmit={submit}>
        <div className="segmented">
          <button type="button" className={form.role === 'etudiant' ? 'active' : ''} onClick={() => setForm({ ...form, role: 'etudiant' })}>Je suis étudiant</button>
          <button type="button" className={form.role === 'formateur' ? 'active' : ''} onClick={() => setForm({ ...form, role: 'formateur' })}>Je suis formateur</button>
        </div>
        <div className="field">
          <label htmlFor="name">Nom complet</label>
          <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input id="password" className="input" type="password" autoComplete="new-password" minLength={6} placeholder="6 caractères minimum" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error && <div className="alert">{error}</div>}
        <button className="btn btn-block" disabled={busy}>{busy ? 'Création...' : 'Créer mon compte'}</button>
      </form>
      <p className="auth-foot">Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
    </div>
  );
}
```

**Dashboard.jsx : tableau de bord selon le rôle**

```jsx
// frontend/src/pages/Dashboard.jsx
import { Link } from 'react-router-dom';
import { Bell, BookOpen, CheckCircle2, GraduationCap, Layers, TrendingUp, UserCheck, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { ROLE_LABELS } from '../utils/format.js';

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="card stat">
      <div className="stat-icon"><Icon size={22} /></div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

// Tableau de bord : des chiffres et des raccourcis adaptés au rôle
export default function Dashboard() {
  const { user } = useAuth();
  const { data: s, loading, error } = useFetch('/stats/me');

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <div>
          <h1>Bonjour {user.name} 👋</h1>
          <p className="muted" style={{ margin: 0 }}>Votre espace {ROLE_LABELS[user.role].toLowerCase()}</p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading && <div className="skeleton" style={{ height: 90 }} />}

      {s?.role === 'etudiant' && (
        <>
          <div className="stats">
            <Stat icon={BookOpen} value={s.enrolled} label="Cours suivis" />
            <Stat icon={CheckCircle2} value={s.completed} label="Cours terminés" />
            <Stat icon={TrendingUp} value={`${s.average} %`} label="Progression moyenne" />
            <Stat icon={Bell} value={s.notifications} label="Notifications" />
          </div>
          <div className="row" style={{ marginTop: 24 }}>
            <Link to="/my-courses" className="btn">Continuer mes cours</Link>
            <Link to="/" className="btn btn-secondary">Explorer le catalogue</Link>
          </div>
        </>
      )}

      {s?.role === 'formateur' && (
        <>
          <div className="stats">
            <Stat icon={BookOpen} value={s.courses} label="Cours publiés" />
            <Stat icon={Layers} value={s.chapters} label="Chapitres écrits" />
            <Stat icon={UserCheck} value={s.students} label="Étudiants inscrits" />
          </div>
          <div className="row" style={{ marginTop: 24 }}>
            <Link to="/teacher/new" className="btn">Créer un nouveau cours</Link>
            <Link to="/teacher" className="btn btn-secondary">Gérer mes cours</Link>
          </div>
        </>
      )}

      {s?.role === 'admin' && (
        <>
          <div className="stats">
            <Stat icon={Users} value={s.users} label="Utilisateurs" />
            <Stat icon={GraduationCap} value={s.students} label="Étudiants" />
            <Stat icon={UserCheck} value={s.teachers} label="Formateurs" />
            <Stat icon={BookOpen} value={s.courses} label="Cours" />
            <Stat icon={CheckCircle2} value={s.enrollments} label="Inscriptions" />
          </div>
          <div className="row" style={{ marginTop: 24 }}>
            <Link to="/admin/users" className="btn">Voir les utilisateurs</Link>
          </div>
        </>
      )}
    </>
  );
}
```

**Profile.jsx (US03)**

```jsx
// frontend/src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ROLE_LABELS } from '../utils/format.js';
import Avatar from '../components/Avatar.jsx';

// US03 - Consulter et modifier son profil
export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    api('/users/me').then((u) => setForm({ name: u.name, email: u.email })).catch((e) => toast.error(e.message));
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      const u = await api('/users/me', { method: 'PUT', body: form });
      updateUser({ ...user, name: u.name, email: u.email });
      toast.success('Profil mis à jour');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="card auth">
      <div className="stack" style={{ justifyItems: 'center', marginBottom: 20 }}>
        <Avatar name={form.name || user.name} large />
        <span className="badge">{ROLE_LABELS[user.role]}</span>
      </div>
      <form className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="name">Nom</label>
          <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <button className="btn btn-block">Enregistrer les modifications</button>
      </form>
    </div>
  );
}
```

**MyCourses.jsx : mes cours (US09)**

```jsx
// frontend/src/pages/MyCourses.jsx
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import CourseCard from '../components/CourseCard.jsx';
import CardGridSkeleton from '../components/CardGridSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';

// US09 - Mes cours et ma progression
export default function MyCourses() {
  const { data, loading, error } = useFetch('/enrollments/mine');

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h1>Mes cours</h1>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <CardGridSkeleton count={3} />}
      {data && data.length === 0 && (
        <EmptyState icon={GraduationCap} title="Vous n'êtes inscrit à aucun cours" text="Parcourez le catalogue pour commencer.">
          <Link to="/" className="btn">Voir le catalogue</Link>
        </EmptyState>
      )}
      <div className="grid">
        {(data || []).map((e) => (
          <CourseCard
            key={e.enrollmentId}
            to={`/learn/${e.courseId}`}
            progress={e.progress}
            course={{ title: e.title, category: e.category, ownerName: e.ownerName, chaptersCount: e.chapters.length }}
          />
        ))}
      </div>
    </>
  );
}
```

**Learn.jsx : suivre un cours chapitre par chapitre (US09)**

```jsx
// frontend/src/pages/Learn.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { api } from '../services/api.js';
import { useFetch } from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

// US09 - Suivre un cours chapitre par chapitre
export default function Learn() {
  const { courseId } = useParams();
  const toast = useToast();
  const { data: course, loading, error } = useFetch(`/courses/${courseId}`);
  const { data: mine, reload } = useFetch('/enrollments/mine');
  const [current, setCurrent] = useState(0);

  const enrollment = (mine || []).find((e) => e.courseId === courseId);

  // À l'ouverture, on se place sur le premier chapitre non terminé
  useEffect(() => {
    if (enrollment) {
      const firstTodo = enrollment.chapters.findIndex((c) => !c.done);
      setCurrent(firstTodo === -1 ? 0 : firstTodo);
    }
  }, [enrollment?.enrollmentId]);

  async function complete(chapterId) {
    try {
      const { progress } = await api(`/enrollments/${courseId}/chapters/${chapterId}/complete`, { method: 'POST' });
      toast.success(progress === 100 ? 'Bravo, cours terminé ! 🎉' : 'Chapitre terminé');
      await reload();
      if (current < course.chapters.length - 1) setCurrent(current + 1);
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (loading || !mine) return <div className="skeleton" />;
  if (error) return <div className="alert">{error}</div>;
  if (!enrollment) {
    return (
      <div className="card auth stack">
        <h3>Vous n'êtes pas inscrit à ce cours</h3>
        <Link to={`/courses/${courseId}`} className="btn">Voir le cours</Link>
      </div>
    );
  }

  const chapter = course.chapters[current];
  const done = enrollment.chapters[current]?.done;

  return (
    <>
      <Link to="/my-courses" className="row muted" style={{ marginBottom: 12 }}><ArrowLeft size={16} /> Mes cours</Link>
      <h1>{course.title}</h1>
      <div style={{ maxWidth: 420, marginBottom: 20 }}><ProgressBar value={enrollment.progress} label="Progression" /></div>

      {course.chapters.length === 0 ? (
        <p className="muted">Le formateur n'a pas encore ajouté de chapitre.</p>
      ) : (
        <div className="learn">
          <aside className="card">
            <h3>Chapitres</h3>
            <div className="lesson-list">
              {course.chapters.map((ch, i) => (
                <button key={ch._id} className={`lesson-btn ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)}>
                  {enrollment.chapters[i]?.done ? <CheckCircle2 size={18} className="done" /> : <Circle size={18} className="muted" />}
                  <span>{i + 1}. {ch.title}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="card stack">
            <h2>{chapter.title}</h2>
            <div className="lesson-content">{chapter.content}</div>
            <div className="row">
              {done ? (
                <span className="badge badge-success"><CheckCircle2 size={14} /> Chapitre terminé</span>
              ) : (
                <button className="btn" onClick={() => complete(chapter._id)}>Marquer comme terminé</button>
              )}
              <span className="spacer" />
              <button className="btn btn-secondary btn-sm" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Précédent</button>
              <button className="btn btn-secondary btn-sm" disabled={current === course.chapters.length - 1} onClick={() => setCurrent(current + 1)}>Suivant</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
```

**Notifications.jsx (US11)**

```jsx
// frontend/src/pages/Notifications.jsx
import { Bell, BookCheck, Trash2 } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import { formatDate } from '../utils/format.js';
import EmptyState from '../components/EmptyState.jsx';

// US11 - Voir ses notifications
export default function Notifications() {
  const { data, loading, error } = useFetch('/notifications/mine');

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h1>Notifications</h1>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <div className="skeleton" style={{ height: 90 }} />}
      {data && data.length === 0 && <EmptyState icon={Bell} title="Aucune notification" text="Vos confirmations d'inscription apparaîtront ici." />}
      <div className="stack" style={{ gap: 10 }}>
        {(data || []).map((n) => (
          <div className="card row" key={n._id} style={{ padding: 16 }}>
            <div className="stat-icon">{n.type === 'inscription' ? <BookCheck size={20} /> : <Trash2 size={20} />}</div>
            <div style={{ flex: 1 }}>
              <div>{n.message}</div>
              <small className="muted">{formatDate(n.createdAt)}</small>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
```

**teacher/TeacherCourses.jsx : liste de mes cours (US04, US05)**

```jsx
// frontend/src/pages/teacher/TeacherCourses.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookPlus, Layers, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import EmptyState from '../../components/EmptyState.jsx';

// US04, US05 - Liste de mes cours (formateur)
export default function TeacherCourses() {
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch('/courses');
  const [toDelete, setToDelete] = useState(null);

  const mine = (data || []).filter((c) => c.ownerId === user.id);

  async function remove() {
    try {
      await api(`/courses/${toDelete._id}`, { method: 'DELETE' });
      toast.success('Cours supprimé. Les étudiants inscrits sont prévenus.');
      setToDelete(null);
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h1>Mes cours ({mine.length})</h1>
        <Link to="/teacher/new" className="btn"><PlusCircle size={18} /> Nouveau cours</Link>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading && <div className="skeleton" style={{ height: 160 }} />}
      {data && mine.length === 0 && (
        <EmptyState icon={BookPlus} title="Vous n'avez pas encore de cours" text="Créez votre premier cours et ajoutez des chapitres.">
          <Link to="/teacher/new" className="btn">Créer un cours</Link>
        </EmptyState>
      )}

      {mine.length > 0 && (
        <div className="card table-wrap" style={{ padding: 0 }}>
          <table className="table">
            <thead><tr><th>Cours</th><th>Catégorie</th><th>Chapitres</th><th /></tr></thead>
            <tbody>
              {mine.map((c) => (
                <tr key={c._id}>
                  <td><Link to={`/courses/${c._id}`}><strong>{c.title}</strong></Link></td>
                  <td><span className="badge">{c.category}</span></td>
                  <td><span className="row muted" style={{ gap: 6 }}><Layers size={15} /> {c.chaptersCount}</span></td>
                  <td>
                    <div className="row" style={{ justifyContent: 'flex-end', gap: 6 }}>
                      <Link to={`/teacher/courses/${c._id}`} className="btn btn-secondary btn-sm"><Pencil size={14} /> Modifier</Link>
                      <button className="btn btn-ghost btn-sm" title="Supprimer" onClick={() => setToDelete(c)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Supprimer ce cours ?"
          text={`« ${toDelete.title} » sera supprimé définitivement. Les étudiants inscrits seront informés.`}
          confirmLabel="Supprimer"
          onConfirm={remove}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
```

**teacher/CourseEditor.jsx : créer ou modifier un cours et ses chapitres (US04, US05, US06)**

```jsx
// frontend/src/pages/teacher/CourseEditor.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { useFetch } from '../../hooks/useFetch.js';
import { useToast } from '../../context/ToastContext.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

// US04, US05, US06 - Créer ou modifier un cours, et gérer ses chapitres
export default function CourseEditor() {
  const { id } = useParams(); // absent = création d'un nouveau cours
  const navigate = useNavigate();
  const toast = useToast();
  const { data: course, error, reload } = useFetch(id ? `/courses/${id}` : null);
  const { data: categories } = useFetch('/courses/categories');
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [chapter, setChapter] = useState({ title: '', content: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (course) setForm({ title: course.title, description: course.description, category: course.category });
  }, [course]);

  async function saveCourse(e) {
    e.preventDefault();
    try {
      if (id) {
        await api(`/courses/${id}`, { method: 'PUT', body: form });
        toast.success('Cours enregistré');
        reload();
      } else {
        const created = await api('/courses', { method: 'POST', body: form });
        toast.success('Cours créé. Ajoutez maintenant des chapitres.');
        navigate(`/teacher/courses/${created._id}`, { replace: true });
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function addChapter(e) {
    e.preventDefault();
    try {
      await api(`/courses/${id}/chapters`, { method: 'POST', body: chapter });
      setChapter({ title: '', content: '' });
      toast.success('Chapitre ajouté');
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeChapter(chapterId) {
    try {
      await api(`/courses/${id}/chapters/${chapterId}`, { method: 'DELETE' });
      toast.success('Chapitre supprimé');
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeCourse() {
    try {
      await api(`/courses/${id}`, { method: 'DELETE' });
      toast.success('Cours supprimé');
      navigate('/teacher');
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (error) return <div className="alert">{error}</div>;

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h1>{id ? 'Modifier le cours' : 'Nouveau cours'}</h1>
        {id && <button className="btn btn-secondary" onClick={() => setConfirmDelete(true)}><Trash2 size={16} /> Supprimer le cours</button>}
      </div>

      <div className="stack">
        <form className="card form" onSubmit={saveCourse}>
          <h3>Informations générales</h3>
          <div className="field">
            <label htmlFor="title">Titre</label>
            <input id="title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="field">
            <label htmlFor="category">Catégorie</label>
            <input id="category" className="input" list="categories" placeholder="Ex : DevOps, Web, Sécurité" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <datalist id="categories">{(categories || []).map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div><button className="btn">{id ? 'Enregistrer' : 'Créer le cours'}</button></div>
        </form>

        {id && course && (
          <div className="card stack">
            <h3>Chapitres ({course.chapters.length})</h3>
            {course.chapters.map((ch, i) => (
              <div className="lesson-row" key={ch._id}>
                <span className="lesson-num">{i + 1}</span>
                <span style={{ flex: 1 }}>{ch.title}</span>
                <button className="btn btn-ghost btn-sm" title="Supprimer" onClick={() => removeChapter(ch._id)}><Trash2 size={16} /></button>
              </div>
            ))}
            <form className="form" onSubmit={addChapter} style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div className="field">
                <label htmlFor="ch-title">Nouveau chapitre</label>
                <input id="ch-title" className="input" placeholder="Titre du chapitre" value={chapter.title} onChange={(e) => setChapter({ ...chapter, title: e.target.value })} required />
              </div>
              <textarea className="textarea" placeholder="Contenu du chapitre" value={chapter.content} onChange={(e) => setChapter({ ...chapter, content: e.target.value })} required />
              <div><button className="btn"><Plus size={16} /> Ajouter le chapitre</button></div>
            </form>
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Supprimer ce cours ?"
          text="Cette action est définitive. Les étudiants inscrits seront informés."
          confirmLabel="Supprimer"
          onConfirm={removeCourse}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}
```

**admin/AdminUsers.jsx (US10)**

```jsx
// frontend/src/pages/admin/AdminUsers.jsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch.js';
import { ROLE_LABELS } from '../../utils/format.js';
import Avatar from '../../components/Avatar.jsx';

const ROLES = [['', 'Tous'], ['etudiant', 'Étudiants'], ['formateur', 'Formateurs'], ['admin', 'Admins']];

// US10 - Liste des utilisateurs (admin), filtrable par rôle
export default function AdminUsers() {
  const [role, setRole] = useState('');
  const [query, setQuery] = useState('');
  const { data, loading, error } = useFetch('/users' + (role ? `?role=${role}` : ''));

  const shown = (data || []).filter((u) => (u.name + u.email).toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h1>Utilisateurs ({shown.length})</h1>
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <div className="chips">
          {ROLES.map(([value, label]) => (
            <button key={value} className={`chip ${role === value ? 'active' : ''}`} onClick={() => setRole(value)}>{label}</button>
          ))}
        </div>
        <span className="spacer" />
        <div className="search" style={{ minWidth: 240 }}>
          <Search size={16} />
          <input className="input" placeholder="Rechercher..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <div className="skeleton" style={{ height: 160 }} />}
      {data && (
        <div className="card table-wrap" style={{ padding: 0 }}>
          <table className="table">
            <thead><tr><th>Utilisateur</th><th>Email</th><th>Rôle</th></tr></thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u.id}>
                  <td><div className="user-cell"><Avatar name={u.name} /> {u.name}</div></td>
                  <td className="muted">{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-warning' : ''}`}>{ROLE_LABELS[u.role]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
```

### 10.7 — README du frontend

Remplacez le contenu de `frontend/README.md` :

```
# Frontend LearnHub

Application React + Vite, port 5173.

- Pages : catalogue, détail d'un cours, apprentissage, tableau de bord, gestion des cours (formateur), utilisateurs (admin), notifications
- Thème clair / sombre, adapté au téléphone
- L'adresse de l'API est donnée par la variable VITE_API_URL
- Lancement : `docker compose up` depuis la racine du projet
```

## Partie 11 — Étape 4 : lancer et tester

### 11.1 — Démarrer toute l'application

Depuis la racine de LearnHub (là où se trouve `docker-compose.yml`) :

```
docker compose up --build
```

La première fois, Docker télécharge les images et installe les bibliothèques : comptez quelques minutes. Attendez ces lignes dans les logs :

```
backend-1  | PostgreSQL connecte, tables pretes
backend-1  | MongoDB connecte
backend-1  | Compte admin cree : admin@learnhub.local
backend-1  | API LearnHub sur le port 5000
```

Puis ouvrez :

| Adresse | Ce que vous devez voir |
| --- | --- |
| http://localhost:5000/api/health | `{"status":"ok"}` |
| http://localhost:5173 | Le catalogue LearnHub (vide au début) |

Pour arrêter : `Ctrl + C`, puis `docker compose down` (les données sont conservées). Pour **tout effacer**, bases comprises : `docker compose down -v`.

### 11.2 — Scénario de test dans le navigateur

Faites ce scénario **dans l'ordre** avec deux navigateurs (ou une fenêtre privée) pour jouer deux rôles.

| N° | Rôle | Action | Résultat attendu |
| --- | --- | --- | --- |
| 1 | Formateur | « Créer un compte », choisir « Je suis formateur », puis se connecter | Tableau de bord formateur avec 3 compteurs à 0 |
| 2 | Formateur | « Gérer mes cours », « Nouveau cours » : titre « Introduction à Git », catégorie « DevOps » | Le cours est créé, la page d'édition s'ouvre |
| 3 | Formateur | Ajouter 2 chapitres dans la page d'édition | Les chapitres apparaissent dans la liste |
| 4 | Visiteur | Ouvrir le catalogue sans être connecté | Le cours est visible, avec sa catégorie et ses 2 chapitres |
| 5 | Étudiant | Créer un compte étudiant, se connecter, ouvrir le cours | Bouton « S'inscrire à ce cours » |
| 6 | Étudiant | Cliquer sur « S'inscrire » | Message de réussite, le bouton devient « Continuer le cours » |
| 7 | Étudiant | Essayer de s'inscrire de nouveau (en rechargeant la page puis via curl, voir 11.3) | Erreur « Vous êtes déjà inscrit à ce cours » |
| 8 | Étudiant | Menu « Notifications » | Une confirmation d'inscription |
| 9 | Étudiant | « Continuer le cours », cliquer sur « Marquer comme terminé » pour le chapitre 1 | Progression à 50 %, passage au chapitre 2 |
| 10 | Étudiant | Tableau de bord | « Cours suivis : 1 », « Progression moyenne : 50 % » |
| 11 | Admin | Se connecter avec le compte admin du `.env` | Tableau de bord avec les totaux, menu « Utilisateurs » filtrable par rôle |
| 12 | Formateur | Supprimer le cours (fenêtre de confirmation) | Cours retiré de la liste |
| 13 | Étudiant | Menu « Notifications » | Notification « cours supprimé » |
| 14 | Tous | Cliquer sur l'icône lune / soleil du menu, réduire la fenêtre du navigateur | Thème sombre, menu qui se replie sur téléphone |

### 11.3 — Tester l'API sans le frontend

Les commandes `curl` permettent de tester l'API comme le ferait un autre programme. Dans Git Bash :

```
curl http://localhost:5000/api/health

curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Sara","email":"sara@test.com","password":"secret123","role":"formateur"}'

curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sara@test.com","password":"secret123"}'
```

La connexion renvoie un `token`. Copiez-le dans une variable, puis utilisez-le :

```
TOKEN="collez-le-token-ici"

curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Docker pour debutants","description":"Les bases de Docker","category":"DevOps"}'

curl http://localhost:5000/api/courses

curl http://localhost:5000/api/users -H "Authorization: Bearer $TOKEN"
```

La dernière commande doit répondre **403 Acces refuse** : un formateur n'est pas admin. C'est la preuve que la sécurité par rôle marche. Vous pouvez aussi utiliser **Postman** ou l'extension **Thunder Client** de Visual Studio Code.

### 11.4 — Regarder dans les bases

```
docker compose exec postgres psql -U learnhub -d learnhub -c 'SELECT id, name, email, role FROM users;'
docker compose exec postgres psql -U learnhub -d learnhub -c 'SELECT * FROM enrollments;'
docker compose exec mongo mongosh learnhub --eval 'db.courses.find().pretty()'
docker compose exec mongo mongosh learnhub --eval 'db.notifications.find().pretty()'
```

Remplacez `learnhub` après `-U` et `-d` par les valeurs de votre `.env` si vous les avez changées. Constatez : le mot de passe des utilisateurs est une longue chaîne illisible (haché), les cours contiennent leurs chapitres, et les inscriptions ne contiennent que l'identifiant du cours.

## Partie 12 — Référence de l'API

| Méthode | Route | Accès | Corps de la requête | Codes de réponse |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | Public | — | 200 |
| POST | `/api/users/register` | Public | name, email, password, role (etudiant ou formateur) | 201, 400, 409 |
| POST | `/api/users/login` | Public | email, password | 200 (token), 401 |
| GET | `/api/users/me` | Connecté | — | 200, 401 |
| PUT | `/api/users/me` | Connecté | name, email | 200, 400, 409 |
| GET | `/api/users?role=` | Admin | — | 200, 403 |
| GET | `/api/courses?category=` | Public | — | 200 |
| GET | `/api/courses/categories` | Public | — | 200 |
| GET | `/api/courses/:id` | Public | — | 200, 404 |
| POST | `/api/courses` | Formateur | title, description, category | 201, 400, 403 |
| PUT | `/api/courses/:id` | Propriétaire | title, description, category | 200, 403, 404 |
| DELETE | `/api/courses/:id` | Propriétaire | — | 200, 403, 404 |
| POST | `/api/courses/:id/chapters` | Propriétaire | title, content | 201, 400, 403 |
| DELETE | `/api/courses/:id/chapters/:chapterId` | Propriétaire | — | 200, 403, 404 |
| POST | `/api/enrollments` | Étudiant | courseId | 201, 404, 409 |
| GET | `/api/enrollments/mine` | Étudiant | — | 200 |
| POST | `/api/enrollments/:courseId/chapters/:chapterId/complete` | Étudiant | — | 200, 404 |
| GET | `/api/notifications/mine` | Connecté | — | 200 |
| GET | `/api/stats/me` | Connecté | — | 200 (chiffres selon le rôle) |

## Partie 13 — Travail demandé et livrables

### 13.1 — Questions de compréhension

| Question | Votre réponse |
| --- | --- |
| Pourquoi ne stocke-t-on pas les mots de passe en clair ? Que contient la colonne `password_hash` ? | |
| Pourquoi le message d'erreur de connexion est-il identique pour « email inconnu » et « mot de passe faux » ? | |
| Quelle est la différence entre une erreur 401 et une erreur 403 ? Donnez un exemple de LearnHub pour chacune. | |
| Pourquoi les cours sont-ils dans MongoDB et les inscriptions dans PostgreSQL ? | |
| Pourquoi n'y a-t-il pas de clé étrangère entre `enrollments.course_id` et la table des cours ? | |
| Que se passe-t-il si PostgreSQL tombe en panne ? Quelles pages du site continuent à marcher ? | |
| Dans l'inscription, que gagne-t-on à utiliser un événement (`enrollment.created`) plutôt qu'à créer la notification directement ? | |
| Dans le monolithe, si le module de notifications a un bug qui plante le programme, que devient le module des cours ? | |

### 13.2 — Exercices d'amélioration

Pour chaque exercice, créez une **branche**, faites une **pull request** relue.

| N° | Exercice | Niveau |
| --- | --- | --- |
| 1 | Ajouter la route `DELETE /api/enrollments/:courseId` pour se désinscrire d'un cours. | Facile |
| 2 | Empêcher un formateur de s'inscrire à un cours : vérifier que la route renvoie bien une erreur 403. | Facile |
| 3 | Ajouter un tri du catalogue (plus récents, ordre alphabétique) dans `Home.jsx`. | Moyen |
| 4 | Ajouter la pagination du catalogue (9 cours par page) avec des boutons Précédent / Suivant. | Moyen |
| 5 | Afficher dans « Mes cours » la date d'inscription et un bouton « Reprendre là où j'en étais ». | Moyen |
| 6 | Ajouter la validation du format de l'email dans `register`. | Moyen |
| 7 | Écrire 3 tests automatiques de l'API avec `node:test` et `fetch` (inscription, connexion, accès refusé). | Difficile |
| 8 | Sécurité : le contenu des chapitres est renvoyé à tout visiteur (`GET /api/courses/:id`). Le réserver aux étudiants inscrits et au formateur propriétaire, côté **backend**. | Difficile |

### 13.3 — Livrable

**Le dépôt GitHub du groupe** doit contenir, sur la branche main :

- le projet complet qui démarre avec `docker compose up --build` après `cp .env.example .env` ;
- aucun fichier `.env`, aucun `node_modules` ;
- un `README.md` racine mis à jour (description du projet, commandes de lancement, rôles de chaque membre) ;
- toutes les modifications arrivées par **pull request relue** (au moins une PR par membre) ;
- un historique de commits clair, avec des messages conformes (`feat:`, `fix:`, `docs:`).

**Chaque apprenant rend** un document `NOM_Prenom_TP4` avec :

- une capture de `docker compose ps` (4 conteneurs démarrés) ;
- une capture du catalogue et une du tableau de bord (clair ou sombre) ;
- une capture du résultat de la requête SQL sur `enrollments` et de `db.notifications.find()` ;
- une capture de votre pull request approuvée ;
- les réponses aux questions de compréhension.

### 13.4 — Barème

| Critère | Points |
| --- | --- |
| Le projet démarre en une commande, sans secret dans le dépôt | 4 |
| Les 11 user stories fonctionnent (scénario de la partie 11.2) | 5 |
| Interface claire et soignée : navigation, messages d'erreur, états vides, adaptation au téléphone | 1 |
| Sécurité : mots de passe hachés, JWT, rôles, propriétaire du cours | 3 |
| Utilisation correcte des deux bases (PostgreSQL et MongoDB) | 2 |
| Travail Git : branches, PR relues, messages de commit | 3 |
| Questions de compréhension | 2 |
| **Total** | **20** |

## Partie 14 — Les limites du monolithe : préparation du TP5

Votre monolithe marche. Avant de passer au TP5, observez ses faiblesses. Elles justifient le passage aux microservices.

| Constat | Dans le monolithe | Conséquence |
| --- | --- | --- |
| Un bug dans un module peut faire tomber **tout** le programme. | Un plantage du module notifications arrête aussi le catalogue. | Fragilité : un seul point de défaillance. |
| Tout se déploie **ensemble**. | Corriger une faute dans les notifications oblige à redéployer toute l'application. | Déploiements risqués et lents. |
| Les modules s'appellent **directement**. | `enrollments.js` utilise le modèle `Course` du module cours. | Couplage fort : changer un module peut en casser un autre. |
| Une seule technologie, un seul programme. | Impossible de passer les notifications à un autre langage ou de les faire tourner sur un autre serveur. | Peu de liberté de choix. |
| On ne peut pas dimensionner **une partie**. | Si le catalogue reçoit 1000 visites par minute, il faut dupliquer toute l'application. | Gaspillage de ressources. |
| Les bases sont partagées. | `enrollments.js` lit la base des cours. | Les équipes ne sont pas indépendantes. |

**Ce que vous ferez au TP5 :** transformer chaque module (`users`, `courses`, `enrollments`, `notifications`) en un **service indépendant** avec sa propre base, et remplacer l'événement interne par un vrai message (RabbitMQ). Les trois points de couplage à repérer dès maintenant :

1. `enrollments.js` appelle `Course.findById(...)` : comment un service d'inscription connaîtra-t-il un cours qu'il ne possède pas ?
2. `notifications.js` lit la table `enrollments` pour la suppression d'un cours : comment fera-t-il quand il n'aura plus accès à cette base ?
3. L'authentification (`authenticate`) est un middleware partagé : comment chaque service vérifiera-t-il le token ?

**Notez vos réponses** : elles seront la base du TP5.

## Partie 15 — Problèmes fréquents

| Problème | Cause probable | Solution |
| --- | --- | --- |
| `docker: command not found` ou « Cannot connect to the Docker daemon » | Docker Desktop n'est pas installé ou pas démarré | Démarrer Docker Desktop et attendre « running » |
| Le port 5000, 5173 ou 5432 est déjà utilisé (`port is already allocated`) | Un autre programme utilise ce port | L'arrêter, ou changer le port à gauche du `:` dans `docker-compose.yml` (exemple : `"5001:5000"`) |
| Le backend s'arrête avec « password authentication failed » | Le mot de passe du `.env` a été changé après la première création de la base | `docker compose down -v` (efface les données) puis `docker compose up --build` |
| `Demarrage impossible` avec `ECONNREFUSED` | La base n'était pas encore prête | Relancer `docker compose up` ; vérifier `docker compose ps` |
| Variables vides : `The "POSTGRES_USER" variable is not set` | Le fichier `.env` n'existe pas ou n'est pas à la racine | `cp .env.example .env` à côté de `docker-compose.yml` |
| Le frontend charge mais « Failed to fetch » | Le backend n'est pas démarré ou `VITE_API_URL` est faux | Ouvrir `http://localhost:5000/api/health` ; regarder `docker compose logs backend` |
| Erreur CORS dans la console du navigateur | Le backend n'a pas `app.use(cors())` ou n'est pas joignable | Vérifier `index.js` ; redémarrer le backend |
| 401 « Token manquant » | Vous n'êtes pas connecté, ou le token a expiré (4 h) | Se reconnecter |
| 403 « Acces refuse » | Mauvais rôle pour cette route | Se connecter avec le bon rôle (voir la partie 12) |
| `Cannot find module` dans les logs du backend | Une bibliothèque manque dans l'image | `docker compose up --build` (reconstruit les images) |
| Le code modifié n'est pas pris en compte | Rechargement bloqué | Vérifier `nodemon -L` (backend) et `usePolling` (frontend) ; sinon `docker compose restart backend` |
| Le catalogue est vide après `docker compose down -v` | Les volumes ont été supprimés avec les bases | Normal : recréer les comptes et les cours |
| Un fichier `.env` apparaît dans `git status` | `.gitignore` absent ou fichier déjà suivi | Créer `.gitignore` ; si déjà committé : `git rm --cached .env`, committer, et **changer les secrets** |
| Le conflit sur `App.jsx` ou `index.js` | Plusieurs membres ont modifié les mêmes lignes | Résoudre comme au TP2 : garder toutes les lignes utiles, retirer les marqueurs |

## Partie 16 — Aide-mémoire Docker

| Commande | Ce qu'elle fait |
| --- | --- |
| `docker compose up --build` | Construit les images et démarre tout (logs à l'écran) |
| `docker compose up -d` | Démarre en arrière-plan |
| `docker compose ps` | Liste les conteneurs et leur état |
| `docker compose logs -f backend` | Suit les logs du backend (Ctrl + C pour quitter) |
| `docker compose restart backend` | Redémarre un service |
| `docker compose exec backend sh` | Ouvre un terminal dans le conteneur backend |
| `docker compose exec postgres psql -U learnhub -d learnhub` | Ouvre la console PostgreSQL |
| `docker compose exec mongo mongosh learnhub` | Ouvre la console MongoDB |
| `docker compose down` | Arrête et supprime les conteneurs (données conservées) |
| `docker compose down -v` | Idem **et supprime les données** des bases |
| `docker system prune` | Nettoie les images et conteneurs inutilisés |
