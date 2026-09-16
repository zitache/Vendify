# Vendify — Plateforme AgriKara

> Marketplace agricole connectant les producteurs de la région Kara (Togo) aux acheteurs locaux, avec paiement mobile intégré (Moov Africa / Yas).

---

## Description

**Vendify** est une plateforme web développée dans le cadre d'un mémoire de fin d'études. Elle vise à digitaliser la chaîne de distribution agricole dans la région de la Kara au Togo en supprimant les intermédiaires entre les agriculteurs et les acheteurs.

**Problème résolu :** Les petits producteurs agricoles de la région Kara n'ont pas accès à des marchés élargis et subissent des pertes dues aux intermédiaires. Les acheteurs, eux, peinent à trouver des produits frais à prix justes et à payer facilement.

**Solution :** Une plateforme web fullstack permettant aux agriculteurs de publier leurs produits, aux acheteurs de commander en ligne et de payer via mobile money (Moov Africa / Yas / T-Money), avec un système de gestion des retraits pour les agriculteurs.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 19 + Vite 8 + Tailwind CSS v4 |
| Backend | Laravel 12 (API REST) |
| Auth | Laravel Sanctum (token-based) |
| Base de données | MySQL (via XAMPP) |
| Paiement | KiKiaPay (Moov Africa & Yas / T-Money) |
| Routage | React Router v7 |
| Graphiques | Recharts v2 |

---

## Fonctionnalités

### Agriculteur
- Inscription et connexion
- Gestion des produits (CRUD + images)
- Consultation du solde crédité à chaque commande confirmée
- Demande de retrait (Moov Africa ou Yas) avec numéro de téléphone
- Messagerie interne

### Acheteur
- Parcours du catalogue avec filtres
- Panier et validation de commande
- Paiement sécurisé via widget KiKiaPay (Moov / Yas)
- Historique des commandes
- Messagerie interne

### Administrateur
- Tableau de bord avec statistiques et graphiques (revenus, utilisateurs, commandes)
- Gestion des utilisateurs
- Validation / rejet des demandes de retrait (5 % de commission prélevés)
- Vue globale des commandes

---

## Architecture du projet

```text
Projet AgriKara/
├── frontend/                  # Application React
│   ├── src/
│   │   ├── pages/             # Pages (Home, Catalog, Cart, Checkout, Dashboard…)
│   │   │   ├── admin/         # Pages admin (Dashboard, Users, Withdrawals)
│   │   │   └── farmer/        # Pages agriculteur (MyProducts, Withdrawals)
│   │   ├── components/
│   │   │   ├── layout/        # DashboardLayout, Sidebar
│   │   │   └── products/      # ProductForm, ProductCard
│   │   ├── context/           # AuthContext, CartContext
│   │   └── api/               # Configuration axios
│   ├── .env                   # VITE_API_URL, VITE_KKIAPAY_PUBLIC_KEY
│   └── package.json
│
├── backend/                   # API Laravel 12
│   ├── app/
│   │   ├── Http/Controllers/  # Auth, Product, Order, Payment, Dashboard, Withdrawal
│   │   └── Models/            # User, Product, Order, OrderItem, Withdrawal, Message
│   ├── routes/api.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── .env                   # DB_*, KKIAPAY_PRIVATE_KEY
│
└── README.md
```

---

## Installation & lancement

### Prérequis
- PHP 8.2+, Composer
- Node.js 20+, npm
- MySQL (XAMPP recommandé)

### Backend

```bash
cd backend
composer install
cp .env.example .env
# Remplir DB_DATABASE, DB_USERNAME, DB_PASSWORD, KKIAPAY_PRIVATE_KEY
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
# API disponible sur http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Remplir VITE_API_URL=http://localhost:8000/api
# Remplir VITE_KKIAPAY_PUBLIC_KEY
npm run dev
# App disponible sur http://localhost:5173
```

---

## Variables d'environnement

### `frontend/.env`
```
VITE_API_URL=http://localhost:8000/api
VITE_KKIAPAY_PUBLIC_KEY=<votre_clé_publique_kkiapay>
VITE_KKIAPAY_SANDBOX=true
```

### `backend/.env` (clés essentielles)
```
DB_DATABASE=vendify_db
DB_USERNAME=root
DB_PASSWORD=
KKIAPAY_PRIVATE_KEY=<votre_clé_privée_kkiapay>
KKIAPAY_SANDBOX=true
```

---

## Flux de paiement (KiKiaPay)

```
Acheteur → Panier → POST /api/orders (commande créée)
       → Widget KiKiaPay s'ouvre (Moov / Yas)
       → Paiement confirmé → callback transactionId
       → POST /api/payments/verify
       → Laravel vérifie auprès de KiKiaPay API
       → Commande confirmée + solde agriculteur crédité (- 5% commission)
```

---

## Auteur

Projet de mémoire — IAEC  
Filière : Génie logiciel 
Année : 2025–2026
