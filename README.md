# ☕ Coffee Shop Manager

Application web de gestion des stocks et achats pour coffee shop.

## Prérequis

- [Node.js 20+](https://nodejs.org/fr) — LTS recommandé
- [MongoDB](https://www.mongodb.com/try/download/community) installé et démarré localement

## Lancer le projet

### 1. Backend

```bash
cd backend
npm install
npm run seed      # Charger les données de test
npm run dev       # Démarrer le serveur (port 5000)
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # Démarrer Vite (port 5173)
```

### 3. Ouvrir l'app

👉 http://localhost:5173

---

## Structure

```
coffee-shop-manager/
├── backend/    # Node.js + Express + MongoDB
└── frontend/   # React + Vite + Tailwind CSS
```

## API

Backend disponible sur : `http://localhost:5000/api`

Health check : `http://localhost:5000/api/health`

## Données de test (seed)

- 12 produits (café, lait, sucre, pain...)
- 3 utilisateurs (1 admin + 2 employés)
- 7 mouvements de stock historiques
- Plusieurs produits en alerte/rupture pour tester les alertes

## Fonctionnalités

- ✅ Dashboard avec stats et alertes visuelles
- ✅ CRUD Produits (ajout, modification, suppression)
- ✅ Gestion des stocks (entrées / sorties)
- ✅ Historique filtrable (date, produit, type)
- ✅ Génération de liste d'achat avec pré-sélection automatique
- ✅ Envoi email simulé (MVP) — corps de l'email affiché dans la console backend
- ✅ Historique des listes d'achat + possibilité de renvoyer
