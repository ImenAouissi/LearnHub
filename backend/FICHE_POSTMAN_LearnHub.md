# 🧪 Fiche Postman — Tester l'API LearnHub

> **Objectif** : vérifier que chaque route du backend marche, **sans utiliser le frontend**.
> **Fichier fourni** : `LearnHub.postman_collection.json` (43 requêtes prêtes à l'emploi, avec tests automatiques).

---

## 1 — C'est quoi Postman ?

Postman est un outil pour **envoyer des requêtes HTTP** à une API et voir la réponse. Pensez-y comme un « faux frontend » : au lieu de cliquer sur des boutons, vous envoyez directement la demande au backend.

| Sans Postman | Avec Postman |
| --- | --- |
| Il faut le frontend pour tester | On teste l'API seule |
| On ne voit pas le détail des erreurs | On voit le **statut**, le **JSON** et le **temps de réponse** |
| Tests à refaire à la main | Tests **automatiques** rejouables en un clic |

Téléchargement : <https://www.postman.com/downloads/> (le compte est facultatif, vous pouvez choisir « Skip » / « Lightweight API client »).

---

## 2 — Préparation (3 minutes)

1. **Démarrer l'application** depuis la racine du projet :
   ```
   docker compose up --build
   ```
2. **Vérifier que l'API répond** : ouvrez <http://localhost:5000/api/health> dans le navigateur. Vous devez voir :
   ```json
   { "status": "ok" }
   ```
3. **Importer la collection** dans Postman :
   - Cliquez sur **Import** (en haut à gauche)
   - Glissez le fichier `LearnHub.postman_collection.json`
   - La collection **LearnHub - Tests API** apparaît dans la colonne de gauche.

---

## 3 — Les variables de la collection

Cliquez sur la collection → onglet **Variables**. Certaines sont à régler, d'autres se remplissent **toutes seules**.

### À vérifier avant de commencer

| Variable | Valeur par défaut | À modifier si… |
| --- | --- | --- |
| `baseUrl` | `http://localhost:5000` | vous avez changé le port du backend |
| `adminEmail` | `admin@learnhub.local` | vous avez modifié `ADMIN_EMAIL` dans votre `.env` |
| `adminPassword` | `Admin1234` | vous avez modifié `ADMIN_PASSWORD` dans votre `.env` |
| `password` | `Test1234` | (mot de passe des comptes de test, libre) |

### Remplies automatiquement (ne pas toucher)

| Variable | Remplie par |
| --- | --- |
| `studentEmail`, `teacherEmail` | Requête 01.1 (emails uniques générés à chaque exécution) |
| `studentId`, `teacherId` | Requêtes 01.1 et 01.2 |
| `tokenStudent`, `tokenTeacher`, `tokenAdmin` | Requêtes de connexion 01.6, 01.7, 01.8 |
| `courseId` | Requête 02.2 (création du cours) |
| `chapterId1`, `chapterId2` | Requêtes 02.7 et 02.8 |

> 💡 **Pourquoi des emails générés ?** L'email est unique en base. Avec un email fixe, la 2ᵉ exécution renverrait `409`. Ici chaque exécution crée de **nouveaux** comptes : vous pouvez rejouer la collection autant de fois que vous voulez.

---

## 4 — Lancer tous les tests d'un coup (Collection Runner)

1. Clic droit sur la collection → **Run collection** (ou le bouton **Run**).
2. Laissez l'ordre par défaut (**ne le changez pas** : chaque dossier dépend du précédent).
3. Cliquez sur **Run LearnHub - Tests API**.
4. Résultat attendu : **toutes les lignes en vert** ✅.

```
✔ 00 - Santé                                   1 requête
✔ 01 - Utilisateurs                           15 requêtes
✔ 02 - Cours                                  11 requêtes
✔ 03 - Inscriptions et progression            10 requêtes
✔ 04 - Notifications                           2 requêtes
✔ 05 - Suppression d'un cours                  4 requêtes
```

---

## 5 — Les 43 requêtes : ce que chacune teste

> Le **code entre parenthèses** est le statut HTTP attendu. Beaucoup de tests vérifient volontairement une **erreur** : c'est ainsi qu'on prouve que la sécurité marche.

### 📁 00 — Santé

| N° | Requête | Attendu | Ce qu'on vérifie |
| --- | --- | --- | --- |
| 00.1 | `GET /api/health` | 200 | Le backend est vivant |

### 📁 01 — Utilisateurs (US01, US02, US03, US10)

| N° | Requête | Attendu | Ce qu'on vérifie |
| --- | --- | --- | --- |
| 01.1 | `POST /api/users/register` (étudiant) | **201** | Compte créé, **aucun mot de passe** dans la réponse |
| 01.2 | `POST /api/users/register` (formateur) | **201** | Compte formateur créé |
| 01.3 | Inscription avec email déjà pris | **409** | Email unique |
| 01.4 | Mot de passe de 3 caractères | **400** | Minimum 6 caractères |
| 01.5 | Rôle `admin` demandé | **400** | Impossible de devenir admin via le formulaire |
| 01.6 | `POST /api/users/login` (étudiant) | **200** | Un **token JWT** est renvoyé et sauvegardé |
| 01.7 | Connexion formateur | **200** | Token formateur sauvegardé |
| 01.8 | Connexion admin | **200** | Rôle `admin`, token admin sauvegardé |
| 01.9 | Mauvais mot de passe | **401** | Message d'erreur de connexion |
| 01.10 | `GET /api/users/me` | **200** | Je vois **mon** profil |
| 01.11 | `PUT /api/users/me` | **200** | Mon nom est modifié |
| 01.12 | `GET /api/users/me` **sans token** | **401** | Accès refusé si non connecté |
| 01.13 | `GET /api/users` (admin) | **200** | Liste de tous les utilisateurs |
| 01.14 | `GET /api/users?role=etudiant` (admin) | **200** | Le filtre ne renvoie que des étudiants |
| 01.15 | `GET /api/users` (étudiant) | **403** | Un étudiant n'a pas le droit |

### 📁 02 — Cours (US04, US05, US06, US07)

| N° | Requête | Attendu | Ce qu'on vérifie |
| --- | --- | --- | --- |
| 02.1 | `GET /api/courses` | 200 | Catalogue **public** (sans token) |
| 02.2 | `POST /api/courses` (formateur) | **201** | Cours créé, propriétaire = le formateur connecté |
| 02.3 | `POST /api/courses` (étudiant) | **403** | Seul un formateur peut créer |
| 02.4 | Création sans titre | **400** | Titre obligatoire |
| 02.5 | `GET /api/courses/{{courseId}}` | 200 | Détail avec la liste `chapters` |
| 02.6 | `GET /api/courses/abc` | **404** | Identifiant invalide géré proprement |
| 02.7 | `POST .../chapters` (chapitre 1) | **201** | Chapitre ajouté |
| 02.8 | `POST .../chapters` (chapitre 2) | **201** | Le cours a maintenant 2 chapitres |
| 02.9 | Ajout de chapitre par un étudiant | **403** | Rôle refusé |
| 02.10 | `PUT /api/courses/{{courseId}}` | 200 | Titre modifié |
| 02.11 | `GET /api/courses?category=Programmation` | 200 | Filtre par catégorie |

### 📁 03 — Inscriptions et progression (US08, US09)

| N° | Requête | Attendu | Ce qu'on vérifie |
| --- | --- | --- | --- |
| 03.1 | `POST /api/enrollments` (étudiant) | **201** | Inscription, progression = 0 |
| 03.2 | Même inscription une 2ᵉ fois | **409** | **Une seule** inscription par cours |
| 03.3 | Inscription par un formateur | **403** | Réservé aux étudiants |
| 03.4 | `courseId` = `000000000000000000000000` | **404** | Le code vérifie que le cours existe (MongoDB) |
| 03.5 | `courseId` = `abc` | **400** | Identifiant invalide |
| 03.6 | `GET /api/enrollments/mine` | 200 | 1 inscription à **0 %** |
| 03.7 | Terminer le chapitre 1 | 200 | Progression = **50 %** (1 sur 2) |
| 03.8 | Terminer le chapitre 2 | 200 | Progression = **100 %** |
| 03.9 | Terminer le chapitre 2 **encore** | 200 | Pas de doublon, reste à 100 % |
| 03.10 | `GET /api/enrollments/mine` | 200 | 100 % et tous les chapitres cochés |

### 📁 04 — Notifications (US11)

| N° | Requête | Attendu | Ce qu'on vérifie |
| --- | --- | --- | --- |
| 04.1 | `GET /api/notifications/mine` | 200 | Une notification de type `inscription` existe (créée via l'événement) |
| 04.2 | Même route **sans token** | **401** | Accès protégé |

### 📁 05 — Suppression d'un cours (US05)

| N° | Requête | Attendu | Ce qu'on vérifie |
| --- | --- | --- | --- |
| 05.1 | `DELETE /api/courses/{{courseId}}` (étudiant) | **403** | Rôle refusé |
| 05.2 | `DELETE /api/courses/{{courseId}}` (formateur propriétaire) | 200 | Cours supprimé + événement `course.deleted` |
| 05.3 | `GET /api/courses/{{courseId}}` | **404** | Le cours n'existe plus |
| 05.4 | `GET /api/notifications/mine` | 200 | Une notification `cours_supprime` doit apparaître |

> ⏱️ **05.4** : la notification est créée **en arrière-plan** après la suppression. Si elle n'apparaît pas tout de suite, renvoyez la requête une seconde plus tard. Cette requête n'a pas de test automatique sur le contenu, **regardez le corps de la réponse**.

---

## 6 — Envoyer une requête à la main (pour comprendre)

Pour bien comprendre ce que la collection fait à votre place, voici **comment créer la requête de connexion à la main**.

### Étape 1 — Créer une requête de connexion

1. **New → HTTP Request**
2. Méthode : **POST**
3. URL : `http://localhost:5000/api/users/login`
4. Onglet **Body** → choisir **raw** → format **JSON** :
   ```json
   {
     "email": "admin@learnhub.local",
     "password": "Admin1234"
   }
   ```
5. Cliquez **Send**.

Réponse attendue (statut **200 OK**) :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "Administrateur", "email": "admin@learnhub.local", "role": "admin" }
}
```

### Étape 2 — Utiliser le token sur une route protégée

1. Copiez la valeur de `token` (sans les guillemets).
2. Créez une requête **GET** `http://localhost:5000/api/users`
3. Onglet **Authorization** → Type **Bearer Token** → collez le token.
4. **Send** → vous obtenez la liste des utilisateurs.

> 🔑 Postman ajoute en réalité l'en-tête `Authorization: Bearer <token>`. C'est exactement ce que fait `api.js` côté frontend et ce que lit le middleware `authenticate` côté backend.

### Étape 3 — Voir l'erreur 401

Même requête **sans** token → `401` avec `{ "error": "Token manquant" }`. Avec un token d'**étudiant** → `403` avec `{ "error": "Acces refuse" }`.

---

## 7 — Comment lire une réponse Postman

| Zone | Où ? | À regarder |
| --- | --- | --- |
| **Statut** | En haut à droite de la réponse | `200`, `201`, `400`, `401`, `403`, `404`, `409`, `500` |
| **Body** | Onglet principal | Le JSON renvoyé (ou le message `error`) |
| **Test Results** | Onglet à côté de Body | Les tests ✅ passés / ❌ échoués |
| **Console** | Menu **View → Show Postman Console** | Les requêtes réellement envoyées (très utile pour déboguer) |

### Les statuts en un coup d'œil

| Code | Sens | Exemple |
| --- | --- | --- |
| **200** | OK | Lecture réussie |
| **201** | Créé | Compte, cours, inscription |
| **400** | Données invalides | Mot de passe trop court |
| **401** | Pas connecté | Token manquant, expiré ou faux |
| **403** | Connecté mais pas le droit | Étudiant qui crée un cours |
| **404** | Introuvable | Cours inexistant |
| **409** | Doublon | Email pris, déjà inscrit |
| **500** | Bug serveur | Voir `docker compose logs backend` |

---

## 8 — Problèmes fréquents

| Problème | Cause probable | Solution |
| --- | --- | --- |
| `Could not get any response` / `ECONNREFUSED` | Le backend n'est pas lancé | `docker compose up`, puis test de <http://localhost:5000/api/health> |
| **01.8** échoue en **401** | `adminEmail` / `adminPassword` ne correspondent pas à votre `.env`, ou vous avez changé le `.env` **après** le premier lancement | Corriger les variables de la collection, ou `docker compose down -v` puis `docker compose up --build` |
| Les requêtes 02.x / 03.x échouent en **401** | Les connexions (01.6 à 01.8) n'ont pas été exécutées avant | Lancer la collection **dans l'ordre**, depuis le début |
| `{{courseId}}` apparaît tel quel dans l'URL | Le cours n'a pas été créé (02.2 a échoué) | Vérifier le résultat de 02.2 et ses tests |
| Token expiré (401 après un long moment) | Le JWT dure **4 heures** | Relancer les connexions 01.6 à 01.8 |
| **03.2** renvoie 201 au lieu de 409 | Vous avez modifié l'ordre ou changé le corps de la requête | Remettre l'ordre d'origine |
| 05.4 sans notification de suppression | Notification créée en arrière-plan, pas encore prête | Renvoyer la requête une seconde plus tard |
| Les tests passent mais la base se remplit | Normal : chaque exécution crée de nouveaux comptes et cours | `docker compose down -v` pour tout remettre à zéro |

---

## 9 — Aller plus loin

- **Exporter les résultats** : dans le Runner, bouton **Export Results** (utile pour le livrable : capture des tests verts).
- **Ajouter un test** : dans une requête, onglet **Scripts → Post-response**, par exemple :
  ```js
  pm.test("Statut 200", function () {
      pm.response.to.have.status(200);
  });
  ```
- **Tester en ligne de commande** avec Newman (le Postman en terminal) :
  ```
  npm install -g newman
  newman run LearnHub.postman_collection.json
  ```
- **Idées d'exercices** : ajouter une requête pour la future route `DELETE /api/enrollments/:courseId` (exercice 1 du TP), et un test qui vérifie qu'un formateur ne peut pas supprimer le cours d'un **autre** formateur (il faudra créer un 2ᵉ compte formateur).
