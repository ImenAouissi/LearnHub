# 📘 Comprendre LearnHub — Guide pour débutants

> Ce guide explique le projet **LearnHub** (version monolithe) pas à pas, comme si vous le voyiez pour la première fois.
> - **Backend** : expliqué **en détail**, fichier par fichier, ligne importante par ligne importante.
> - **Frontend** : expliqué **simplement** (les ABC).
> - Aucun pré-requis : chaque mot technique est expliqué quand il apparaît.

---

## Table des matières

1. [C'est quoi LearnHub ?](#1--cest-quoi-learnhub-)
2. [Les mots à connaître avant de commencer](#2--les-mots-à-connaître-avant-de-commencer)
3. [Vue d'ensemble : l'architecture](#3--vue-densemble--larchitecture)
4. [L'arborescence complète du projet](#4--larborescence-complète-du-projet)
5. [Les fichiers à la racine](#5--les-fichiers-à-la-racine)
6. [Le BACKEND en détail](#6--le-backend-en-détail)
7. [Le FRONTEND : les ABC](#7--le-frontend--les-abc)
8. [Scénario complet : que se passe-t-il quand je m'inscris à un cours ?](#8--scénario-complet--que-se-passe-t-il-quand-je-minscris-à-un-cours-)
9. [Les codes d'erreur HTTP utilisés](#9--les-codes-derreur-http-utilisés)
10. [Erreurs de débutant fréquentes](#10--erreurs-de-débutant-fréquentes)
11. [Tableau récapitulatif : « quel fichier fait quoi ? »](#11--tableau-récapitulatif--quel-fichier-fait-quoi-)

---

## 1 — C'est quoi LearnHub ?

**LearnHub** est un petit site web d'apprentissage en ligne (comme une mini-Udemy).

| Rôle | Ce qu'il peut faire |
| --- | --- |
| 👩‍🎓 **Étudiant** | Voir le catalogue, s'inscrire à un cours, suivre sa progression, recevoir des notifications |
| 👨‍🏫 **Formateur** | Créer, modifier, supprimer ses cours et y ajouter des chapitres |
| 🛡️ **Admin** | Voir la liste de tous les utilisateurs |

Le projet est un **monolithe** : tout le backend est **un seul programme**. Plus tard (TP suivant), on le découpera en plusieurs petits programmes (les *microservices*).

---

## 2 — Les mots à connaître avant de commencer

| Mot | Explication simple |
| --- | --- |
| **Frontend** | La partie **visible** : les pages, les boutons, les formulaires. Elle tourne dans le navigateur. |
| **Backend** | La partie **cachée** : le « cerveau » qui applique les règles et parle aux bases de données. Elle tourne sur un serveur. |
| **API** | Le « guichet » du backend. Le frontend y envoie des demandes (« donne-moi les cours ») et reçoit des réponses. |
| **REST** | Une façon d'organiser une API : une adresse par ressource (`/api/courses`) + des verbes (GET, POST, PUT, DELETE). |
| **GET / POST / PUT / DELETE** | Lire / Créer / Modifier / Supprimer. |
| **JSON** | Un format texte pour échanger des données : `{ "name": "Sara", "role": "etudiant" }`. |
| **Base de données** | Un « classeur géant » où l'on range les informations de façon durable. |
| **PostgreSQL** | Base de données en **tableaux** (tables, lignes, colonnes), très stricte. |
| **MongoDB** | Base de données en **documents JSON**, souple. |
| **Node.js** | Permet d'exécuter du JavaScript **hors du navigateur** (c'est ce qui fait tourner le backend). |
| **Express** | Une bibliothèque Node.js pour construire une API facilement. |
| **Middleware** | Un « contrôleur à l'entrée » : une fonction qui s'exécute **avant** la route (ex. « êtes-vous connecté ? »). |
| **JWT** | Un « badge » signé donné à la connexion. Le frontend le montre à chaque demande pour prouver qui il est. |
| **bcrypt / hachage** | On ne garde jamais un mot de passe en clair : on garde son *empreinte*, impossible à inverser. |
| **Docker** | Une « boîte » qui contient un programme et tout ce qu'il lui faut. Il marche pareil sur tous les ordinateurs. |
| **Docker Compose** | Un fichier qui décrit **plusieurs boîtes** et les lance toutes avec une seule commande. |
| **Variable d'environnement** | Un réglage donné de l'extérieur (mot de passe, secret) pour ne pas l'écrire dans le code. |

---

## 3 — Vue d'ensemble : l'architecture

### 🍽️ L'analogie du restaurant

| Dans le restaurant | Dans LearnHub |
| --- | --- |
| Le **client** | Vous, dans le navigateur |
| La **carte et la salle** | Le **frontend** (React) |
| Le **serveur** qui prend la commande | L'**API** (Express) |
| La **cuisine** | Les **modules** du backend (users, courses…) |
| Le **réfrigérateur** et le **garde-manger** | Les **bases de données** (PostgreSQL et MongoDB) |
| La **carte d'identité du client** | Le **token JWT** |

### Le schéma

```
┌────────────────────┐          ┌───────────────────────────────────────────┐
│    NAVIGATEUR      │          │            BACKEND (Express :5000)        │
│                    │          │         UN SEUL PROGRAMME = monolithe     │
│  Frontend React    │  HTTP    │                                           │
│  http://localhost  │ ───────► │  ┌─────────┐  ┌─────────┐                 │
│       :5173        │  + JWT   │  │  users  │  │ courses │                 │
│                    │ ◄─────── │  └────┬────┘  └────┬────┘                 │
└────────────────────┘   JSON   │  ┌────┴─────────┐ ┌┴────────────────┐     │
                                │  │ enrollments  │ │  notifications  │     │
                                │  └──────┬───────┘ └────────┬────────┘     │
                                │         │   événements     │              │
                                │         └──── (events) ────┘              │
                                └─────────┬────────────────────┬────────────┘
                                          │                    │
                                  ┌───────▼───────┐    ┌───────▼───────┐
                                  │  PostgreSQL   │    │    MongoDB    │
                                  │ • users       │    │ • courses     │
                                  │ • enrollments │    │ • notifications│
                                  │ • completed_  │    └───────────────┘
                                  │   chapters    │
                                  └───────────────┘
```

### Pourquoi DEUX bases de données ?

| Base | Ce qu'on y met | Pourquoi |
| --- | --- | --- |
| **PostgreSQL** | Utilisateurs, inscriptions, chapitres terminés | Données **strictes** : email unique, rôle limité, « une seule inscription par cours ». La base contrôle tout ça toute seule. |
| **MongoDB** | Cours (avec leurs chapitres), notifications | Un cours est **un bloc** qu'on lit et écrit d'un coup, avec ses chapitres dedans. Les notifications sont de simples messages ajoutés en masse. |

### Les 4 conteneurs Docker

Quand vous tapez `docker compose up`, **4 « boîtes »** démarrent :

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐
│ postgres │  │  mongo   │  │ backend  │  │ frontend  │
│  :5432   │  │  :27017  │  │  :5000   │  │   :5173   │
└──────────┘  └──────────┘  └──────────┘  └───────────┘
```

---

## 4 — L'arborescence complète du projet

```
LearnHub/
├── README.md                  ← présentation du projet
├── docker-compose.yml         ← lance les 4 conteneurs ensemble
├── .env.example               ← modèle des réglages (sans vrais secrets)
├── .env                       ← VOS réglages réels (ne jamais le partager !)
├── .gitignore                 ← liste ce que Git doit ignorer
│
├── backend/                   ← 🧠 le cerveau (Express)
│   ├── README.md
│   ├── Dockerfile             ← recette de la boîte Docker du backend
│   ├── .dockerignore          ← ce que Docker ne doit pas copier
│   ├── package.json           ← carte d'identité + liste des bibliothèques
│   └── src/                   ← tout le code source
│       ├── index.js           ← POINT D'ENTRÉE : démarre le serveur
│       ├── config.js          ← lit les réglages (.env)
│       ├── events.js          ← bus de messages internes
│       ├── db/                ← connexions aux bases
│       │   ├── postgres.js
│       │   └── mongo.js
│       ├── models/            ← forme des données MongoDB
│       │   ├── Course.js
│       │   └── Notification.js
│       ├── middleware/        ← les « contrôleurs d'entrée »
│       │   ├── asyncHandler.js
│       │   └── auth.js
│       └── modules/           ← un fichier par domaine fonctionnel
│           ├── users.js
│           ├── courses.js
│           ├── enrollments.js
│           └── notifications.js
│
└── frontend/                  ← 🎨 la partie visible (React)
    ├── README.md
    ├── Dockerfile
    ├── .dockerignore
    ├── package.json
    ├── vite.config.js         ← réglages de l'outil Vite
    ├── index.html             ← l'unique page HTML
    └── src/
        ├── main.jsx           ← démarre React
        ├── App.jsx            ← menu + liste des pages
        ├── AuthContext.jsx    ← « qui est connecté ? »
        ├── api.js             ← parler au backend
        ├── index.css          ← les styles (couleurs, mise en page)
        └── pages/             ← un fichier par écran
            ├── Catalogue.jsx
            ├── CourseDetail.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Profile.jsx
            ├── MyCourses.jsx
            ├── TeacherCourses.jsx
            ├── AdminUsers.jsx
            └── Notifications.jsx
```

---

## 5 — Les fichiers à la racine

### 5.1 — `.env.example` et `.env` : les réglages

```env
POSTGRES_USER=learnhub
POSTGRES_PASSWORD=changez_moi
POSTGRES_DB=learnhub
JWT_SECRET=changez_ce_secret_long_et_aleatoire
ADMIN_EMAIL=admin@learnhub.local
ADMIN_PASSWORD=Admin1234
```

| Variable | Rôle |
| --- | --- |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Identifiants et nom de la base PostgreSQL |
| `JWT_SECRET` | La « clé secrète » qui sert à **signer** les badges JWT. Si quelqu'un la connaît, il peut fabriquer de faux badges ! |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Le compte admin créé automatiquement au démarrage |

- `.env.example` = **le modèle**, on peut le publier sur GitHub.
- `.env` = **la vraie copie** avec vos vrais secrets, **jamais** publiée (créée avec `cp .env.example .env`).

> 💡 **Pourquoi ce système ?** Écrire un mot de passe directement dans le code, c'est comme coller son code de carte bancaire sur la carte. Avec `.env`, les secrets restent sur *votre* machine.

### 5.2 — `.gitignore`

```
node_modules/
.env
*.log
dist/
```

Dit à Git : « n'enregistre pas ces éléments ».
- `node_modules/` : dossier énorme de bibliothèques, recréé par `npm install`.
- `.env` : vos secrets.
- `*.log` : fichiers de journaux.
- `dist/` : fichiers générés automatiquement.

### 5.3 — `docker-compose.yml` : le chef d'orchestre

Il décrit **4 services** (4 conteneurs). Lisons-les un par un.

#### Service `postgres`

```yaml
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: ${POSTGRES_USER}
    ...
  volumes:
    - pgdata:/var/lib/postgresql/data
  healthcheck: ...
```

| Ligne | Signification |
| --- | --- |
| `image: postgres:16-alpine` | On utilise une image **déjà prête** de PostgreSQL 16 (version légère « alpine »). |
| `environment` | Donne les identifiants. `${POSTGRES_USER}` = « va lire cette valeur dans le fichier `.env` ». |
| `volumes: pgdata:...` | **Disque durable** : sans ça, les données disparaîtraient à chaque arrêt du conteneur. |
| `healthcheck` | Toutes les 5 s, Docker demande « es-tu prêt ? » (`pg_isready`). Utile pour que le backend attende. |

#### Service `mongo`

Même idée avec l'image `mongo:7`, un volume `mongodata` et un healthcheck qui fait un `ping`.

#### Service `backend`

```yaml
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
    postgres: { condition: service_healthy }
    mongo:    { condition: service_healthy }
  volumes:
    - ./backend:/app
    - /app/node_modules
  command: npm run dev
```

| Ligne | Signification |
| --- | --- |
| `build: ./backend` | « Construis l'image à partir du `Dockerfile` du dossier `backend` ». |
| `ports: "5000:5000"` | Format `PORT_PC:PORT_CONTENEUR`. Ouvre le port 5000 du conteneur sur le port 5000 de votre ordinateur. |
| `DATABASE_URL` | **L'adresse de connexion à PostgreSQL**. Notez `@postgres:5432` : dans Docker, on appelle un autre conteneur **par le nom de son service** (`postgres`), pas par `localhost`. |
| `MONGO_URL` | Pareil pour MongoDB (`mongo`). |
| `depends_on ... service_healthy` | « N'allume le backend que quand les deux bases répondent ». Évite l'erreur *ECONNREFUSED*. |
| `volumes: ./backend:/app` | **Partage** votre dossier avec le conteneur : vous modifiez un fichier → le conteneur le voit tout de suite (rechargement automatique). |
| `volumes: /app/node_modules` | Protège le `node_modules` **du conteneur** pour qu'il ne soit pas écrasé par celui de votre PC. |
| `command: npm run dev` | Lance avec **nodemon** (redémarre le serveur quand le code change). |

#### Service `frontend`

Même principe : port `5173`, variable `VITE_API_URL: http://localhost:5000/api` (l'adresse du backend **vue depuis le navigateur**), et dépend du backend.

#### Section `volumes:` finale

```yaml
volumes:
  pgdata:
  mongodata:
```
Déclare les deux « disques durables » utilisés plus haut.

> ⚠️ `docker compose down` **garde** les données. `docker compose down -v` les **efface**.

---

# 6 — Le BACKEND en détail

## 6.1 — Comment une requête voyage dans le backend

C'est **LA** notion la plus importante. Une demande du frontend traverse des « étages » dans cet ordre :

```
 Requête HTTP du frontend
        │
        ▼
 ① cors()               → « ce site a-t-il le droit de m'appeler ? »
        │
        ▼
 ② express.json()       → transforme le texte JSON reçu en objet JavaScript (req.body)
        │
        ▼
 ③ Le bon module        → /api/users, /api/courses, /api/enrollments...
        │      ┌─────────────────────────────────────────┐
        │      │ ④ authenticate    « avez-vous un badge ? »│
        │      │ ⑤ requireRole     « avez-vous le bon rôle?»│
        │      │ ⑥ la route elle-même (la vraie logique)  │
        │      └─────────────────────────────────────────┘
        ▼
 ⑦ Réponse JSON (ou une erreur)
```

Si un étage dit « non » (pas de badge, mauvais rôle…), la requête **s'arrête là** et une erreur est renvoyée. C'est le principe du **middleware**.

---

## 6.2 — `backend/package.json`

La **carte d'identité** du backend.

```json
{
  "name": "learnhub-backend",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon -L src/index.js"
  },
  "dependencies": { ... },
  "devDependencies": { "nodemon": "^3.1.4" }
}
```

| Partie | Signification |
| --- | --- |
| `main` | Fichier principal du projet. |
| `scripts.start` | `npm start` → lance le serveur normalement. |
| `scripts.dev` | `npm run dev` → lance avec **nodemon** qui **redémarre automatiquement** à chaque modification. `-L` = vérifie les changements de façon compatible avec Docker/Windows. |
| `dependencies` | Bibliothèques **nécessaires au fonctionnement**. |
| `devDependencies` | Bibliothèques **utiles seulement pour développer**. |

### Les bibliothèques

| Bibliothèque | À quoi elle sert |
| --- | --- |
| **express** | Crée le serveur et les routes |
| **cors** | Autorise le frontend (autre adresse/port) à appeler l'API |
| **pg** | Parle à PostgreSQL |
| **mongoose** | Parle à MongoDB (et décrit la forme des données) |
| **bcryptjs** | Hache les mots de passe |
| **jsonwebtoken** | Crée et vérifie les JWT |
| **dotenv** | Lit le fichier `.env` |
| **nodemon** | Redémarrage automatique en développement |

> 💡 `^4.19.2` : le `^` signifie « cette version ou une plus récente *compatible* ».

---

## 6.3 — `backend/Dockerfile`

La **recette de cuisine** pour fabriquer la boîte du backend.

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

| Ligne | Ce qu'elle fait |
| --- | --- |
| `FROM node:20-alpine` | Part d'une base qui contient déjà **Node.js 20** (version légère). |
| `WORKDIR /app` | Travaille dans le dossier `/app` **à l'intérieur** de la boîte. |
| `COPY package*.json ./` | Copie **d'abord seulement** `package.json` (et `package-lock.json`). |
| `RUN npm install` | Installe les bibliothèques. |
| `COPY . .` | Copie ensuite **tout le reste** du code. |
| `EXPOSE 5000` | Indique que l'application écoute sur le port 5000 (documentation). |
| `CMD ["npm","start"]` | Commande lancée au démarrage de la boîte. |

> 💡 **Pourquoi copier `package.json` en premier ?** Docker met chaque étape en cache. Tant que `package.json` ne change pas, il **saute** le long `npm install` aux reconstructions suivantes. Un petit truc qui fait gagner beaucoup de temps.

`.dockerignore` contient `node_modules` : on n'envoie pas dans la boîte le dossier de bibliothèques de votre PC.

---

## 6.4 — `backend/src/config.js` : la salle des réglages

```js
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

- `require('dotenv').config()` : charge le fichier `.env` (utile hors Docker).
- `process.env.XXX` : lit une variable d'environnement.
- `process.env.PORT || 5000` : « utilise `PORT` s'il existe, **sinon** 5000 ».
- `module.exports = {...}` : **partage** ces valeurs avec les autres fichiers, qui font ensuite `require('../config')`.

**Pourquoi un fichier dédié ?** Pour lire les réglages **à un seul endroit**. Les autres fichiers ne touchent jamais directement à `process.env`.

---

## 6.5 — Les bases de données (`src/db/`)

### `postgres.js` : connexion + création des tables

```js
const pool = new Pool({ connectionString: databaseUrl });
```

Un **Pool** est un « groupe de connexions réutilisables » : au lieu d'ouvrir/fermer une connexion à chaque requête (lent), on en garde quelques-unes ouvertes.

La fonction `initPostgres()` crée **3 tables** au démarrage avec `CREATE TABLE IF NOT EXISTS` (« crée-la **seulement si elle n'existe pas** », donc sans danger si on relance).

#### Table `users`

| Colonne | Type | Signification |
| --- | --- | --- |
| `id` | `SERIAL PRIMARY KEY` | Numéro automatique unique (1, 2, 3…) |
| `name` | `VARCHAR(100) NOT NULL` | Nom, obligatoire |
| `email` | `VARCHAR(150) UNIQUE NOT NULL` | **Unique** : deux comptes ne peuvent pas avoir le même email |
| `password_hash` | `VARCHAR(100) NOT NULL` | L'**empreinte** du mot de passe (jamais le mot de passe lui-même) |
| `role` | `CHECK (role IN ('etudiant','formateur','admin'))` | Seules ces 3 valeurs sont acceptées |
| `created_at` | `TIMESTAMP DEFAULT NOW()` | Date de création, remplie automatiquement |

#### Table `enrollments` (inscriptions)

| Colonne | Signification |
| --- | --- |
| `id` | Numéro de l'inscription |
| `user_id` | Quel étudiant → `REFERENCES users(id)` (**clé étrangère** : doit exister dans `users`) |
| `course_id` | Quel cours → **identifiant MongoDB** (texte) |
| `progress` | Pourcentage de progression (0 à 100), `DEFAULT 0` |
| `UNIQUE (user_id, course_id)` | **Un étudiant ne peut s'inscrire qu'une fois au même cours** |
| `ON DELETE CASCADE` | Si l'utilisateur est supprimé, ses inscriptions le sont aussi |

> ⚠️ **Point important** : `course_id` n'a **pas** de clé étrangère, car le cours est dans **une autre base** (MongoDB). PostgreSQL ne peut pas vérifier qu'il existe. C'est donc **le code** (`enrollments.js`) qui s'en charge.

#### Table `completed_chapters` (chapitres terminés)

| Colonne | Signification |
| --- | --- |
| `enrollment_id` | Quelle inscription |
| `chapter_id` | Quel chapitre (identifiant MongoDB) |
| `PRIMARY KEY (enrollment_id, chapter_id)` | Clé **composée** : le même chapitre ne peut pas être marqué « terminé » deux fois pour la même inscription |

Exemple de contenu :

```
enrollments                              completed_chapters
┌────┬─────────┬────────────┬──────────┐ ┌───────────────┬────────────┐
│ id │ user_id │ course_id  │ progress │ │ enrollment_id │ chapter_id │
├────┼─────────┼────────────┼──────────┤ ├───────────────┼────────────┤
│  1 │    2    │ 66ab...f1  │    50    │ │       1       │  66ab..c1  │
└────┴─────────┴────────────┴──────────┘ └───────────────┴────────────┘
                      (cours à 2 chapitres, 1 terminé → 50 %)
```

### `mongo.js`

```js
async function connectMongo() {
  await mongoose.connect(mongoUrl);
  console.log('MongoDB connecte');
}
```

Se connecte à MongoDB via **mongoose**. `await` = « attends que ce soit fini avant de continuer ».

> 💡 **`async` / `await`** : certaines actions prennent du temps (parler à une base). `await` met le code en pause **sur cette ligne** jusqu'à la réponse, sans bloquer le reste du serveur. Une fonction qui contient `await` doit être déclarée `async`.

---

## 6.6 — Les modèles MongoDB (`src/models/`)

Un **modèle** décrit la **forme** des documents (comme le plan d'un formulaire).

### `Course.js`

```js
const chapterSchema = new mongoose.Schema({
  title:   { type: String, required: true, trim: true },
  content: { type: String, required: true },
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category:    { type: String, default: 'General', trim: true },
  ownerId:     { type: Number, required: true },
  chapters:    [chapterSchema],
}, { timestamps: true });
```

| Option | Signification |
| --- | --- |
| `type: String` | Doit être du texte |
| `required: true` | Obligatoire |
| `trim: true` | Retire les espaces inutiles au début/fin |
| `default: 'General'` | Valeur par défaut si rien n'est fourni |
| `timestamps: true` | Ajoute **automatiquement** `createdAt` et `updatedAt` |
| `ownerId` | **L'id du formateur** (celui de la table `users` de PostgreSQL) |
| `chapters: [chapterSchema]` | **Les chapitres sont DANS le cours** (liste de sous-documents) |

Un cours ressemble à ça dans MongoDB :

```json
{
  "_id": "66ab12...",
  "title": "Introduction à JavaScript",
  "description": "Les bases du langage",
  "category": "Programmation",
  "ownerId": 3,
  "chapters": [
    { "_id": "66ab13...", "title": "Variables", "content": "..." },
    { "_id": "66ab14...", "title": "Fonctions", "content": "..." }
  ],
  "createdAt": "2026-10-26T10:00:00Z"
}
```

> 💡 Avec une base en tableaux, il faudrait **deux tables** (cours + chapitres) et une **jointure**. Avec MongoDB, on lit **tout d'un coup**.

### `Notification.js`

Trois champs : `userId` (à qui), `type` (`inscription` ou `cours_supprime`), `message` (le texte). Plus les dates automatiques.

---

## 6.7 — `src/events.js` : le bus de messages

```js
const { EventEmitter } = require('events');
module.exports = new EventEmitter();
```

Une seule vraie ligne, mais très importante. Un **EventEmitter** est comme un **haut-parleur dans un bureau** :

- Quelqu'un **annonce** : `events.emit('enrollment.created', {...})` → « Une inscription vient d'avoir lieu ! »
- Quelqu'un d'autre **écoute** : `events.on('enrollment.created', ...)` → « Je réagis quand j'entends ça ».

L'annonceur n'a **pas besoin de savoir qui écoute**, et n'attend pas de réponse.

```
 enrollments.js                              notifications.js
 ┌───────────────┐   emit('enrollment.created')   ┌───────────────┐
 │ « Marie est   │ ─────────────────────────────► │ « Je crée la  │
 │  inscrite ! » │          (bus events)          │  notification »│
 └───────────────┘                                └───────────────┘
 répond tout de suite à l'étudiant                 travaille en arrière-plan
```

**Avantage** : l'inscription répond **vite** à l'étudiant, sans attendre l'envoi de la notification.

**Deux événements existent dans le projet :**

| Événement | Émis par | Écouté par | Effet |
| --- | --- | --- | --- |
| `enrollment.created` | `enrollments.js` | `notifications.js` | Crée une notification « Inscription confirmée » |
| `course.deleted` | `courses.js` | `notifications.js` | Prévient les inscrits et supprime leurs inscriptions |

---

## 6.8 — Les middlewares (`src/middleware/`)

### `asyncHandler.js`

```js
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

**Problème résolu** : avec Express 4, si une fonction `async` plante (ex. base de données injoignable), l'erreur n'est **pas** attrapée et le serveur peut se bloquer.

**Solution** : `asyncHandler` « enveloppe » chaque route. Si une erreur survient, elle est envoyée à `next(err)`, c'est-à-dire au **gestionnaire d'erreurs** global de `index.js`.

C'est comme mettre chaque route dans un **filet de sécurité**. Vous le verrez partout :

```js
router.get('/', asyncHandler(async (req, res) => { ... }));
```

### `auth.js` : le contrôleur d'entrée

#### Fonction 1 — `authenticate` : « avez-vous un badge valide ? »

```js
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide ou expire' });
  }
}
```

Pas à pas :

1. Le frontend envoie un en-tête : `Authorization: Bearer eyJhbGciOi...`
2. `header.slice(7)` retire les 7 premiers caractères (`"Bearer "`) pour garder **uniquement le token**.
3. Pas de token → **401** « Token manquant ».
4. `jwt.verify(token, jwtSecret)` vérifie que :
   - le token a bien été **signé avec notre secret** (pas falsifié),
   - il n'a pas **expiré**.
5. Si c'est bon : `req.user = { id, name, role }` → **toutes les fonctions suivantes** savent qui fait la demande.
6. `next()` = « passe à l'étape suivante ».
7. Si invalide → **401** « Token invalide ou expire ».

#### Fonction 2 — `requireRole` : « avez-vous le bon rôle ? »

```js
const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'Acces refuse' });
```

- `requireRole('formateur')` crée un contrôleur qui laisse passer **uniquement les formateurs**.
- On peut en donner plusieurs : `requireRole('formateur', 'admin')`.
- Mauvais rôle → **403** « Acces refuse ».

> 🔑 **401 vs 403** : **401** = « je ne sais pas qui vous êtes » (pas connecté). **403** = « je sais qui vous êtes, mais vous n'avez pas le droit ».

#### Comment ils s'utilisent (toujours dans cet ordre)

```js
router.post('/', authenticate, requireRole('formateur'), asyncHandler(async (req, res) => { ... }));
//                ① connecté ?   ② bon rôle ?             ③ la vraie logique
```

---

## 6.9 — Les modules (`src/modules/`)

Chaque module = **un domaine** = **un `Router` Express** (un mini-serveur de routes). Ils correspondent aux futurs microservices.

### 6.9.1 — `users.js` (utilisateurs)

Préfixe d'adresse : `/api/users`

| Route | Qui ? | Rôle |
| --- | --- | --- |
| `POST /register` | Tout le monde | Créer un compte |
| `POST /login` | Tout le monde | Se connecter |
| `GET /me` | Connecté | Voir son profil |
| `PUT /me` | Connecté | Modifier son profil |
| `GET /` | Admin | Lister les utilisateurs |

#### `POST /register` (créer un compte)

Les étapes, dans l'ordre :

```
1. Récupérer name, email, password, role dans req.body
2. Un champ manquant ?                    → 400
3. Mot de passe < 6 caractères ?          → 400
4. Rôle différent de etudiant/formateur ? → 400   (on ne peut PAS devenir admin ici !)
5. Cet email existe déjà ?                → 409
6. Hacher le mot de passe avec bcrypt
7. Insérer dans la base
8. Répondre 201 avec l'utilisateur (SANS le mot de passe)
```

Les lignes clés :

```js
const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
```
> 🛡️ **`$1` et le tableau `[email]`** : ce sont des **requêtes paramétrées**. La valeur est envoyée *séparément* de la requête SQL. Cela protège contre l'**injection SQL** (une attaque où un pirate glisse du code SQL dans un champ de formulaire). **Ne jamais** construire du SQL en collant du texte.

```js
const hash = await bcrypt.hash(password, 10);
```
> 🔐 Transforme `"monmotdepasse"` en quelque chose comme `$2a$10$N9qo8uLOickgx2ZMRZoMye...`. Le `10` est le **coût** : plus il est grand, plus le calcul est lent (donc plus dur à casser par force brute). Deux utilisateurs avec le même mot de passe auront **deux empreintes différentes** (bcrypt ajoute un « sel » aléatoire).

```js
'INSERT INTO users (...) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role'
```
> `RETURNING` renvoie la ligne créée **sans** `password_hash` : on ne renvoie jamais l'empreinte au frontend.

#### `POST /login` (se connecter)

```js
const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
const user = rows[0];
const ok = user && (await bcrypt.compare(password || '', user.password_hash));
if (!ok) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, jwtSecret, { expiresIn: '4h' });
res.json({ token, user: { id, name, email, role } });
```

1. Cherche l'utilisateur par email.
2. `bcrypt.compare` compare le mot de passe saisi avec l'empreinte (on ne « déchiffre » jamais, on **re-calcule et compare**).
3. **Le même message d'erreur** que l'email soit inconnu ou que le mot de passe soit faux. Pourquoi ? Pour ne pas aider un pirate à savoir **quels emails existent** dans le système.
4. `jwt.sign(...)` fabrique le badge : il contient `id`, `name`, `role`, est signé avec `jwtSecret` et **expire après 4 heures**.
5. On renvoie le token + les infos utilisateur.

> 🪪 **Un JWT ressemble à ça** : `xxxxx.yyyyy.zzzzz` (3 parties : en-tête, contenu, signature). Le contenu est **lisible** (pas secret !) mais **ne peut pas être modifié** sans casser la signature. Ne mettez donc jamais de mot de passe dedans.

#### `GET /me` et `PUT /me`

- `authenticate` met l'identité dans `req.user`, donc `req.user.id` dit **qui** est connecté. Un utilisateur ne peut donc voir/modifier **que son propre profil**.
- `PUT` vérifie que le nouvel email n'est pas pris **par quelqu'un d'autre** : `WHERE email = $1 AND id <> $2` (`<>` = « différent de »).

#### `GET /` (admin)

`authenticate` + `requireRole('admin')`. Le filtre optionnel `?role=etudiant` se lit avec `req.query.role`.

---

### 6.9.2 — `courses.js` (cours)

Préfixe : `/api/courses`

| Route | Qui ? | Rôle |
| --- | --- | --- |
| `GET /` | **Public** | Catalogue (sans chapitres) |
| `GET /:id` | **Public** | Détail d'un cours + chapitres |
| `POST /` | Formateur | Créer un cours |
| `PUT /:id` | Formateur **propriétaire** | Modifier un cours |
| `DELETE /:id` | Formateur **propriétaire** | Supprimer un cours |
| `POST /:id/chapters` | Formateur **propriétaire** | Ajouter un chapitre |

#### Le middleware maison `loadOwnedCourse`

```js
const loadOwnedCourse = asyncHandler(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404)...
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404)...
  if (course.ownerId !== req.user.id) return res.status(403)...
  req.course = course;
  next();
});
```

Ce « contrôleur » est utilisé par les 3 routes qui modifient un cours. Il vérifie :

1. L'identifiant a un **format valide** (sinon Mongo plante).
2. Le cours **existe** → sinon **404**.
3. L'utilisateur connecté en est **le propriétaire** → sinon **403**.
4. Il range le cours dans `req.course` pour que la route n'ait pas à le rechercher à nouveau.

> 🔒 **Pourquoi c'est essentiel** : sans ça, n'importe quel formateur pourrait supprimer le cours d'un collègue. Être *formateur* ne suffit pas, il faut être **le propriétaire**.

#### `GET /` (catalogue)

```js
const filter = req.query.category ? { category: req.query.category } : {};
const courses = await Course.find(filter)
  .select('title description category ownerId createdAt')
  .sort({ createdAt: -1 });
```
- `?category=Programmation` filtre par catégorie (sinon filtre vide = tout).
- `.select(...)` ne renvoie que **ces champs** → les chapitres (lourds) sont exclus du catalogue.
- `.sort({ createdAt: -1 })` : du plus récent au plus ancien.

#### `POST /` (créer)

`authenticate` → `requireRole('formateur')` → vérifie titre et description → `Course.create({..., ownerId: req.user.id})`.
> Le propriétaire est **pris dans le token**, jamais dans le corps de la requête : impossible de « créer un cours au nom de quelqu'un d'autre ».

#### `PUT /:id` (modifier)

Ordre des contrôles : `authenticate` → `requireRole('formateur')` → `loadOwnedCourse` → logique. On ne modifie que les champs fournis, puis `req.course.save()`.

#### `DELETE /:id` (supprimer)

```js
const { _id, title } = req.course;
await req.course.deleteOne();
events.emit('course.deleted', { courseId: String(_id), title });
res.json({ message: 'Cours supprime' });
```
Le cours est supprimé, puis **on annonce** `course.deleted` : le module notifications préviendra les étudiants inscrits.

#### `POST /:id/chapters` (ajouter un chapitre)

```js
req.course.chapters.push({ title, content });
await req.course.save();
```
On **ajoute dans la liste** `chapters` du document, puis on sauvegarde.

---

### 6.9.3 — `enrollments.js` (inscriptions et progression)

Préfixe : `/api/enrollments` — **réservé aux étudiants**.

| Route | Rôle |
| --- | --- |
| `POST /` | S'inscrire à un cours |
| `GET /mine` | Mes cours avec ma progression |
| `POST /:courseId/chapters/:chapterId/complete` | Marquer un chapitre terminé |

#### `POST /` (s'inscrire)

```
1. courseId valide ?                         → sinon 400
2. Le cours existe dans MongoDB ?            → sinon 404   ← contrôle fait par le CODE
3. INSERT dans enrollments (PostgreSQL)
4. Si doublon (erreur 23505)                 → 409 « déjà inscrit »
5. events.emit('enrollment.created', ...)    → on prévient les notifications
6. Répondre 201 immédiatement
```

Le code clé :
```js
} catch (err) {
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Vous etes deja inscrit a ce cours' });
  }
  throw err;
}
```
> `23505` est le code PostgreSQL pour « violation d'unicité ». Grâce à `UNIQUE (user_id, course_id)`, **c'est la base de données** qui empêche le doublon. Le code n'a qu'à traduire l'erreur en message clair. Les autres erreurs sont relancées avec `throw err`.

#### `GET /mine` (mes cours)

C'est la route la plus intéressante : elle **assemble des données venant de deux bases**.

```
1. PostgreSQL : mes inscriptions        (id, course_id, progress)
2. MongoDB    : les cours correspondants (Course.find({_id: {$in: [...]}}))
3. PostgreSQL : mes chapitres terminés
4. Le CODE fusionne le tout en un seul résultat
```

Résultat renvoyé pour chaque cours :
```json
{
  "enrollmentId": 1,
  "courseId": "66ab12...",
  "title": "Introduction à JavaScript",
  "progress": 50,
  "chapters": [
    { "id": "66ab13...", "title": "Variables", "done": true },
    { "id": "66ab14...", "title": "Fonctions", "done": false }
  ]
}
```

> ⚠️ Impossible de faire une « jointure SQL » entre PostgreSQL et MongoDB : **c'est le code JavaScript qui fait la jointure**. Si le cours a été supprimé, on affiche `'(cours supprime)'`.

#### `POST /:courseId/chapters/:chapterId/complete` (chapitre terminé)

```
1. Suis-je inscrit à ce cours ?     → sinon 404
2. Le cours et le chapitre existent ? → sinon 404
3. INSERT INTO completed_chapters ... ON CONFLICT DO NOTHING
4. Recalculer la progression
5. Renvoyer { progress }
```
- `ON CONFLICT DO NOTHING` : si le chapitre était déjà terminé, **on ne fait rien** (pas d'erreur).
- `updateProgress` :
```js
const { rows } = await pool.query('SELECT COUNT(*)::int AS done FROM completed_chapters WHERE enrollment_id = $1', [enrollmentId]);
const progress = totalChapters ? Math.round((rows[0].done * 100) / totalChapters) : 0;
```
> Exemple : 1 chapitre terminé sur 3 → `1 × 100 / 3 = 33,33` → arrondi à **33 %**. Le `totalChapters ? ... : 0` évite une **division par zéro** si le cours n'a aucun chapitre.

---

### 6.9.4 — `notifications.js`

Ce module est **différent** : il exporte deux choses.

```js
module.exports = { router, registerListeners };
```

#### `registerListeners()` : les « oreilles »

**Écoute n°1 : `enrollment.created`**
```js
events.on('enrollment.created', ({ userId, courseTitle }) => {
  setImmediate(async () => {
    ...
    await Notification.create({ userId, type: 'inscription', message });
  });
});
```
- `setImmediate` : exécute le travail **juste après** avoir répondu à l'étudiant → vraiment **asynchrone**.
- `try/catch` : si la notification échoue, ça **ne casse pas** l'inscription.

**Écoute n°2 : `course.deleted`**
```js
const { rows } = await pool.query('SELECT user_id FROM enrollments WHERE course_id = $1', [courseId]);
for (const row of rows) {
  await Notification.create({ userId: row.user_id, type: 'cours_supprime', message: `...` });
}
await pool.query('DELETE FROM enrollments WHERE course_id = $1', [courseId]);
```
1. Retrouve **tous les étudiants inscrits** au cours supprimé.
2. Crée **une notification pour chacun**.
3. Supprime ensuite leurs inscriptions.

#### `GET /mine`
Renvoie **mes** notifications, de la plus récente à la plus ancienne (`userId: req.user.id`).

---

## 6.10 — `src/index.js` : le chef d'orchestre du backend

C'est le **point d'entrée** : le premier fichier exécuté. Lisons-le de haut en bas.

### Partie 1 — Créer l'application

```js
const app = express();
app.use(cors());
app.use(express.json());
```

| Ligne | Rôle |
| --- | --- |
| `express()` | Crée l'application |
| `app.use(cors())` | Autorise les appels venant d'un autre site (le frontend sur `:5173` appelle le backend sur `:5000`). Sans ça, le navigateur **bloque** : erreur « CORS ». |
| `app.use(express.json())` | Convertit le JSON des requêtes en objet (`req.body`). Sans ça, `req.body` serait vide. |

### Partie 2 — Les routes

```js
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/users',         require('./modules/users'));
app.use('/api/courses',       require('./modules/courses'));
app.use('/api/enrollments',   require('./modules/enrollments'));
app.use('/api/notifications', require('./modules/notifications').router);
require('./modules/notifications').registerListeners();
```

- `/api/health` : la route « est-ce que le serveur est vivant ? » (utile pour tester).
- `app.use('/api/users', ...)` : « tout ce qui commence par `/api/users` va vers le module `users` ». Ainsi la route `/login` du module devient **`/api/users/login`**.
- La dernière ligne **active les écouteurs d'événements** : sans elle, personne n'écouterait les annonces !

### Partie 3 — Les filets de sécurité

```js
app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

app.use((err, req, res, next) => {
  if (err.code === '23505') return res.status(409).json({ error: 'Cette ressource existe deja' });
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});
```

- Le 1er attrape **toute adresse inconnue** → 404. Il est placé **après** toutes les routes : si aucune n'a répondu, c'est qu'elle n'existe pas.
- Le 2e (avec **4 paramètres** : c'est ce qui le désigne comme gestionnaire d'erreurs) reçoit toutes les erreurs envoyées par `asyncHandler`. Il répond **500** avec un message volontairement vague : les détails restent dans les logs, **jamais** montrés à l'utilisateur.

> ⚠️ **L'ordre compte** dans Express : les middlewares et routes s'exécutent dans l'ordre où ils sont écrits.

### Partie 4 — `seedAdmin()` : créer l'admin

Un admin ne peut **pas** s'inscrire via le formulaire (le rôle est refusé). Au démarrage, `seedAdmin` :
1. regarde si un utilisateur avec `ADMIN_EMAIL` existe,
2. sinon, le **crée** avec `ADMIN_PASSWORD` (haché) et le rôle `admin`.

### Partie 5 — `start()` : la séquence de démarrage

```js
async function start() {
  await initPostgres();     // 1. connexion PostgreSQL + création des tables
  await connectMongo();     // 2. connexion MongoDB
  await seedAdmin();        // 3. création de l'admin
  app.listen(port, ...);    // 4. SEULEMENT ENSUITE : ouvrir le serveur aux requêtes
}

start().catch((err) => {
  console.error('Demarrage impossible', err);
  process.exit(1);
});
```

Le serveur n'ouvre ses portes **qu'une fois tout prêt**. Si une étape échoue → message d'erreur + arrêt du programme (`exit(1)`).

Vous verrez dans les logs :
```
PostgreSQL connecte, tables pretes
MongoDB connecte
Compte admin cree : admin@learnhub.local
API LearnHub sur le port 5000
```

---

## 6.11 — Résumé du backend en une image

```
index.js  ──────────────  démarre tout
   │
   ├── config.js ───────── lit .env
   ├── db/postgres.js ──── PostgreSQL + 3 tables
   ├── db/mongo.js ─────── MongoDB
   │
   ├── middleware/auth.js ── authenticate, requireRole
   ├── middleware/asyncHandler.js ── filet de sécurité des erreurs
   ├── events.js ────────── bus de messages
   │
   └── modules/
        ├── users.js ────────── PostgreSQL  (comptes, login, profil, liste admin)
        ├── courses.js ──────── MongoDB     (cours, chapitres)  ──emit──┐
        ├── enrollments.js ──── PostgreSQL + MongoDB ──────────emit──┐  │
        └── notifications.js ── MongoDB  ◄─────────── écoute ─────────┴──┘
```

---

# 7 — Le FRONTEND : les ABC

> Ici on reste simple : l'idée générale et le rôle de chaque fichier.

## 7.1 — Les 5 idées de React à retenir

| Idée | Explication simple |
| --- | --- |
| **Composant** | Un **morceau d'écran réutilisable**, écrit comme une fonction (`Catalogue`, `Login`…). Une page = un assemblage de composants. |
| **JSX** | Du HTML écrit **dans** du JavaScript (`<h2>Catalogue</h2>`). C'est pour ça que les fichiers finissent par `.jsx`. |
| **État (`useState`)** | La **mémoire** d'un composant. Quand elle change, l'écran se met à jour tout seul. |
| **`useEffect`** | « Fais ceci **quand la page s'affiche** » (ex. charger la liste des cours). |
| **Routes** | Associent une **adresse** (`/login`) à une **page** (`<Login />`). |

### Exemple minimal : le Catalogue (simplifié)

```jsx
const [courses, setCourses] = useState([]);       // mémoire : liste vide au départ

useEffect(() => {
  api('/courses').then(setCourses);               // au chargement : demande au backend
}, []);

return courses.map((c) => <div>{c.title}</div>);  // affiche un bloc par cours
```

Le cycle : **page affichée → demande au backend → réponse → mémoire mise à jour → écran redessiné**.

## 7.2 — Les fichiers du frontend

| Fichier | Rôle simple |
| --- | --- |
| **`index.html`** | L'**unique page HTML**. Elle contient juste `<div id="root"></div>` : une boîte vide où React dessine tout le site (on appelle ça une *Single Page Application*). |
| **`package.json`** | Liste les bibliothèques : **react**, **react-dom**, **react-router-dom** (les routes), **vite** (l'outil de développement). |
| **`vite.config.js`** | Réglages de **Vite** (l'outil qui lance le site en développement). `host: true` permet l'accès depuis l'extérieur du conteneur ; `usePolling` assure le rechargement automatique sous Docker/Windows. |
| **`Dockerfile`** | Comme celui du backend, mais lance `npm run dev` sur le port 5173. |
| **`src/main.jsx`** | **Le démarreur** : branche React dans la boîte `root` et enveloppe l'application dans le routeur et le contexte d'authentification. |
| **`src/App.jsx`** | **Le menu** (qui change selon le rôle) et **la liste des routes**. Contient aussi `Private`, un composant qui **bloque l'accès** à une page si on n'est pas connecté ou pas du bon rôle. |
| **`src/AuthContext.jsx`** | La **mémoire globale** de « qui est connecté ». Fournit `user`, `login()`, `logout()`, `updateUser()` à **toutes** les pages. |
| **`src/api.js`** | **Une seule fonction `api()`** pour parler au backend. Elle ajoute automatiquement le token JWT dans chaque demande et transforme les erreurs en messages. |
| **`src/index.css`** | Les styles : couleurs, cartes, menu. |
| **`src/pages/`** | **Un fichier par écran** (voir ci-dessous). |

### Le fichier `api.js` en deux mots

```js
const token = localStorage.getItem('token');
const res = await fetch(API + path, {
  headers: { ..., Authorization: `Bearer ${token}` },
});
```
Toutes les pages appellent `api('/courses')` au lieu de réécrire `fetch(...)` à chaque fois. Le token est lu dans le **`localStorage`** (petit espace de stockage du navigateur) pour qu'on reste connecté même après avoir rafraîchi la page.

### Les 9 pages

| Page | Adresse | Qui peut la voir ? | Ce qu'elle fait |
| --- | --- | --- | --- |
| `Catalogue.jsx` | `/` | Tout le monde | Liste des cours + barre de recherche |
| `CourseDetail.jsx` | `/courses/:id` | Tout le monde | Détail d'un cours + bouton « S'inscrire » |
| `Login.jsx` | `/login` | Tout le monde | Formulaire de connexion |
| `Register.jsx` | `/register` | Tout le monde | Formulaire de création de compte |
| `Profile.jsx` | `/profile` | Connecté | Voir/modifier son profil |
| `MyCourses.jsx` | `/my-courses` | Étudiant | Mes cours, cases à cocher de progression |
| `Notifications.jsx` | `/notifications` | Étudiant | Mes notifications |
| `TeacherCourses.jsx` | `/teacher` | Formateur | Créer/modifier/supprimer cours et chapitres |
| `AdminUsers.jsx` | `/admin/users` | Admin | Liste des utilisateurs avec filtre par rôle |

### Le fil conducteur du frontend

```
 index.html  ──►  main.jsx  ──►  App.jsx  ──►  pages/*.jsx  ──►  api.js  ──►  BACKEND
 (boîte vide)   (démarre       (menu +       (un écran        (appelle
                 React)         routes)       chacun)          l'API)
```

> ⚠️ **Sécurité côté frontend** : cacher un lien dans le menu (ou bloquer une page avec `Private`) est **du confort**, pas de la sécurité : n'importe qui peut modifier le code dans son navigateur. La **vraie** protection est dans le **backend** (`authenticate`, `requireRole`, propriétaire du cours). C'est lui qui fait foi.

---

# 8 — Scénario complet : que se passe-t-il quand je m'inscris à un cours ?

Suivons **Marie (étudiante)** qui clique sur « S'inscrire » dans `CourseDetail`.

```
 NAVIGATEUR                    BACKEND                           BASES
 ──────────                    ───────                           ─────

 ① Clic sur « S'inscrire »
   api('/enrollments',
     POST, {courseId})
   + header Authorization: Bearer <token>
        │
        ▼
                           ② cors()  ✔
                           ③ express.json()  → req.body = {courseId}
                           ④ authenticate    → token OK → req.user = {id:2, role:'etudiant'}
                           ⑤ requireRole('etudiant') ✔
                           ⑥ Route POST /
                              a) courseId valide ? ✔
                              b) Course.findById ─────────────────► MongoDB : le cours existe ✔
                              c) INSERT enrollments ──────────────► PostgreSQL : ligne créée ✔
                              d) events.emit('enrollment.created')
                                       │                                 
                              e) res.status(201).json(...)             
        ◄───────────────────────────── réponse immédiate à Marie
 ⑦ Le bouton affiche
    « Inscrit ! »
                                       │ (en arrière-plan, juste après)
                                       ▼
                           ⑧ notifications.js entend l'événement
                              Notification.create ───────────────► MongoDB : notification enregistrée
                              console.log('[NOTIFICATION] ...')

 ⑨ Plus tard, Marie ouvre « Notifications »
    GET /api/notifications/mine ──► Notification.find ◄─────────── MongoDB
    « Inscription confirmée au cours : ... »
```

**Si Marie clique une 2ᵉ fois :** à l'étape c), PostgreSQL refuse (contrainte `UNIQUE`), le code reçoit l'erreur `23505` et répond **409 « Vous êtes déjà inscrit »**.

---

# 9 — Les codes d'erreur HTTP utilisés

| Code | Nom | Quand ? | Exemple dans LearnHub |
| --- | --- | --- | --- |
| **200** | OK | Tout va bien | Lecture réussie |
| **201** | Created | Quelque chose a été créé | Compte, cours, inscription créés |
| **400** | Bad Request | Données invalides ou manquantes | Mot de passe trop court |
| **401** | Unauthorized | **Pas connecté** (ou token invalide) | Token manquant/expiré, mauvais mot de passe |
| **403** | Forbidden | Connecté mais **pas le droit** | Étudiant qui tente de créer un cours |
| **404** | Not Found | Introuvable | Cours inexistant, route inconnue |
| **409** | Conflict | Doublon | Email déjà utilisé, déjà inscrit |
| **500** | Server Error | Bug ou panne côté serveur | Base de données injoignable |

> 💡 Les codes commençant par **2** = succès, **4** = erreur de **l'appelant**, **5** = erreur du **serveur**.

---

# 10 — Erreurs de débutant fréquentes

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| `The "POSTGRES_USER" variable is not set` | Pas de fichier `.env` | `cp .env.example .env` à côté de `docker-compose.yml` |
| `password authentication failed` | Vous avez changé le mot de passe après la 1ʳᵉ création de la base | `docker compose down -v` puis `docker compose up --build` |
| `ECONNREFUSED` | La base n'était pas prête | Relancer, vérifier avec `docker compose ps` |
| Le frontend affiche « Failed to fetch » | Backend arrêté | Ouvrir `http://localhost:5000/api/health` ; `docker compose logs backend` |
| `port is already allocated` | Un autre programme utilise le port | L'arrêter, ou changer le port à **gauche** du `:` (ex. `"5001:5000"`) |
| 401 « Token manquant » | Pas connecté ou token expiré (4 h) | Se reconnecter |
| 403 « Acces refuse » | Mauvais rôle | Se connecter avec le bon type de compte |
| Le catalogue est vide après `down -v` | Les volumes (donc les données) ont été supprimés | Normal : recréer comptes et cours |
| `.env` apparaît dans `git status` | `.gitignore` manquant | Créer `.gitignore` ; si déjà committé : `git rm --cached .env` et **changer les secrets** |

---

# 11 — Tableau récapitulatif : « quel fichier fait quoi ? »

### Racine

| Fichier | En une phrase |
| --- | --- |
| `docker-compose.yml` | Lance les 4 conteneurs (postgres, mongo, backend, frontend) |
| `.env` / `.env.example` | Les réglages et secrets (le modèle / la vraie copie) |
| `.gitignore` | Ce que Git doit ignorer |

### Backend (`backend/`)

| Fichier | En une phrase |
| --- | --- |
| `Dockerfile` | Recette de la boîte du backend |
| `package.json` | Liste des bibliothèques et commandes |
| `src/index.js` | **Démarre tout** : middlewares, modules, gestion d'erreurs, admin, serveur |
| `src/config.js` | Lit les variables d'environnement |
| `src/events.js` | Bus de messages entre modules |
| `src/db/postgres.js` | Connexion PostgreSQL + création des 3 tables |
| `src/db/mongo.js` | Connexion MongoDB |
| `src/models/Course.js` | Forme d'un cours (avec ses chapitres dedans) |
| `src/models/Notification.js` | Forme d'une notification |
| `src/middleware/asyncHandler.js` | Attrape les erreurs des routes `async` |
| `src/middleware/auth.js` | Vérifie le token (`authenticate`) et le rôle (`requireRole`) |
| `src/modules/users.js` | Comptes, connexion, profil, liste admin |
| `src/modules/courses.js` | Catalogue, création/modif/suppression, chapitres |
| `src/modules/enrollments.js` | Inscription, progression, chapitres terminés |
| `src/modules/notifications.js` | Écoute les événements, crée et liste les notifications |

### Frontend (`frontend/`)

| Fichier | En une phrase |
| --- | --- |
| `index.html` | L'unique page HTML (une boîte vide) |
| `vite.config.js` | Réglages de l'outil Vite |
| `src/main.jsx` | Démarre React |
| `src/App.jsx` | Menu + routes + protection des pages |
| `src/AuthContext.jsx` | Mémorise l'utilisateur connecté |
| `src/api.js` | Fonction unique pour appeler le backend avec le token |
| `src/index.css` | Styles |
| `src/pages/*.jsx` | Un écran par fichier |

---

## 🎯 À retenir en 7 points

1. **Frontend** = ce qu'on voit ; **Backend** = les règles et les données ; **Bases** = le stockage.
2. Le backend est un **monolithe** : un seul programme, 4 modules (`users`, `courses`, `enrollments`, `notifications`).
3. **PostgreSQL** pour le strict (comptes, inscriptions) ; **MongoDB** pour le flexible (cours, notifications).
4. Une requête traverse des **middlewares** : `authenticate` (connecté ?) → `requireRole` (bon rôle ?) → la route.
5. Les mots de passe sont **hachés** (bcrypt) ; la connexion renvoie un **JWT** valable 4 h.
6. Les modules se parlent par **événements** (`emit` / `on`) : l'inscription répond vite, la notification suit en arrière-plan.
7. **Docker Compose** démarre tout avec une commande : `docker compose up --build`.

> 🔭 **Pour la suite (TP5)** : on découpera chaque module en **microservice indépendant**. Regardez bien les endroits où les modules se « touchent » (ex. `enrollments.js` qui lit le modèle `Course`, ou `notifications.js` qui lit la table `enrollments`) : ce sont les **points de couplage** qu'il faudra casser.
