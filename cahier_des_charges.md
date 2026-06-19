# CAHIER DES CHARGES

Projet de fin de formation — Licence 2026

## 1. Présentation du Projet
### 1.1 Contexte général
Dans la région de la Kara au Togo, l'agriculture constitue la principale source de revenus pour la majorité de la population rurale. Les petits agriculteurs cultivent des produits vivriers essentiels tels que le maïs, l'igname, le sorgho et les arachides. Malgré leurs efforts de production, ils se heurtent à des obstacles structurels majeurs lors de la commercialisation de leurs produits.
La dépendance aux intermédiaires, le manque d'informations sur les prix du marché, les pertes post-récolte et l'absence de communication directe avec les acheteurs maintiennent ces agriculteurs dans un cycle de revenus insuffisants. Le développement rapide des technologies numériques et la généralisation des téléphones mobiles offrent cependant une opportunité de transformer ces pratiques.

### 1.2 Problématique
L'utilisation d'une plateforme numérique peut-elle améliorer la commercialisation des produits des petits agriculteurs dans la région de la Kara au Togo ?

### 1.3 Objectifs
**Objectif général :**
Concevoir et déployer une plateforme web permettant la mise en relation directe entre les petits agriculteurs et les acheteurs de la région de la Kara, afin d'améliorer leurs conditions de commercialisation et d'augmenter leurs revenus.

**Objectifs spécifiques :**
•	 Améliorer l'accès des agriculteurs à l'information sur les prix du marché en temps réel
•	 Réduire les pertes post-récolte en facilitant la mise en relation rapide avec les acheteurs
•	 Augmenter les revenus agricoles en supprimant ou réduisant les marges des intermédiaires

## 2. Périmètre du projet
### 2.1 Ce qui est inclus
•	Développement d'une plateforme web responsive accessible sur ordinateur et mobile
•	Gestion des comptes utilisateurs (agriculteurs et acheteurs)
•	Catalogue de produits agricoles avec recherche et filtres
•	Système de messagerie directe entre vendeurs et acheteurs
•	Module de gestion des commandes et de suivi de livraison
•	Simulateur de paiement mobile Yas (Togocel) et Moov Africa
•	Tableaux de bord personnalisés pour chaque type d'utilisateur
•	API REST sécurisée entre frontend et backend

### 2.2 Ce qui est exclu
•	Application mobile native (iOS / Android) — prévu en version ultérieure
•	Intégration avec une API de paiement réelle (remplacement par simulateur)
•	Gestion logistique et suivi GPS des livraisons
•	Système de notation et d'avis sur les agriculteurs
•	Module de gestion comptable avancée

## 3. Acteurs du Système
La plateforme Vendify implique trois types d'acteurs principaux :

| Acteur | Rôle | Droits et accès |
|---|---|---|
| Agriculteur | Producteur qui vend ses produits sur la plateforme | Publier/modifier/supprimer des produits, recevoir des commandes, consulter son tableau de bord, utiliser la messagerie |
| Acheteur | Particulier ou commerçant qui achète des produits agricoles | Parcourir le catalogue, passer des commandes, effectuer des paiements, utiliser la messagerie |
| Administrateur | Gestionnaire de la plateforme (équipe technique) | Gérer tous les utilisateurs, valider les comptes, modérer les produits, consulter les statistiques globales |

## 4. Besoins Fonctionnels

### 4.1 Gestion des comptes utilisateurs
- **Inscription:** L'utilisateur peut créer un compte en choisissant son rôle (agriculteur ou acheteur), en renseignant ses informations personnelles et sa localité
- **Connexion:** L'utilisateur peut se connecter avec son email et mot de passe. Un token JWT est généré via Laravel Sanctum
- **Déconnexion:** L'utilisateur peut se déconnecter et invalider son token d'authentification
- **Profil utilisateur:** L'utilisateur peut consulter et modifier ses informations personnelles (nom, téléphone, localité, photo)
- **Récupération mot de passe:** L'utilisateur peut réinitialiser son mot de passe via son email ou numéro de téléphone

### 4.2 Gestion des produits
- **Publication produit:** L'agriculteur peut publier un produit avec nom, description, prix, quantité disponible, catégorie, localité et photo
- **Modification produit:** L'agriculteur peut modifier les informations d'un produit existant à tout moment
- **Suppression produit:** L'agriculteur peut supprimer un produit de son catalogue
- **Catalogue public:** Tous les visiteurs peuvent consulter le catalogue de produits disponibles
- **Recherche & Filtres:** L'acheteur peut rechercher des produits par nom, catégorie, localité et tranche de prix
- **Fiche produit:** L'acheteur peut consulter le détail d'un produit (infos, vendeur, localité, stock disponible)

### 4.3 Gestion des commandes
- **Panier d'achat:** L'acheteur peut ajouter des produits à son panier, modifier les quantités et supprimer des articles
- **Passer une commande:** L'acheteur peut valider son panier et renseigner ses informations de livraison
- **Suivi de commande:** L'acheteur peut suivre le statut de sa commande (en attente, confirmée, en transit, livrée)
- **Gestion commandes reçues:** L'agriculteur peut consulter, confirmer ou refuser les commandes reçues
- **Historique commandes:** Les deux acteurs peuvent consulter l'historique complet de leurs commandes

### 4.4 Messagerie
- **Messagerie directe:** Un acheteur peut envoyer un message à un agriculteur depuis la fiche produit ou le tableau de bord
- **Partage de produit:** L'utilisateur peut partager une fiche produit directement dans une conversation
- **Notifications:** L'utilisateur reçoit une notification lors d'un nouveau message non lu
- **Historique des messages:** Les conversations sont sauvegardées et accessibles à tout moment

### 4.5 Paiement mobile
- **Simulateur Yas:** Simulation du paiement mobile via le service Yas de Togocel avec numéro et montant
- **Simulateur Moov Africa:** Simulation du paiement mobile via Moov Africa avec confirmation automatique
- **Confirmation paiement:** Génération d'une référence de paiement et confirmation automatique de la commande après paiement
- **Historique paiements:** L'utilisateur peut consulter l'historique de ses transactions effectuées

### 4.6 Tableaux de bord
- **Dashboard agriculteur:** Affichage des métriques clés : produits publiés, commandes reçues, revenus du mois, messages non lus
- **Dashboard acheteur:** Affichage des commandes passées, commandes en transit, total dépensé, agriculteurs favoris
- **Dashboard administrateur:** Statistiques globales : nombre d'utilisateurs, produits, commandes, revenus de la plateforme

## 5. Besoins Non Fonctionnels

### 5.1 Performance
•	Le temps de chargement des pages ne doit pas dépasser 3 secondes sur une connexion 3G
•	L'API REST doit répondre en moins de 500 ms pour les requêtes courantes
•	La plateforme doit supporter au minimum 100 utilisateurs simultanés

### 5.2 Sécurité
•	Toutes les communications entre le frontend et le backend doivent être chiffrées via HTTPS
•	L'authentification doit être gérée par token (Laravel Sanctum) avec expiration automatique
•	Les mots de passe doivent être hashés avec bcrypt avant stockage en base de données
•	Les données sensibles des utilisateurs doivent être protégées contre les injections SQL et les attaques XSS

### 5.3 Disponibilité & Fiabilité
•	La plateforme doit être disponible 24h/24 et 7j/7 avec un taux de disponibilité minimal de 95%
•	Des sauvegardes automatiques de la base de données doivent être effectuées quotidiennement
•	En cas d'erreur serveur, un message clair et adapté doit être affiché à l'utilisateur

### 5.4 Ergonomie & Accessibilité
•	L'interface doit être intuitive et utilisable sans formation préalable
•	Le design doit être responsive et fonctionnel sur ordinateur, tablette et smartphone
•	Les messages d'erreur doivent être clairs et formulés en français simple
•	Les champs obligatoires des formulaires doivent être clairement indiqués

### 5.5 Maintenabilité
•	Le code doit être organisé selon l'architecture MVC et respecter les conventions Laravel et React.js
•	Chaque module doit être documenté (commentaires dans le code, README)
•	Le projet doit être versionné avec Git et hébergé sur GitHub

## 7. Contraintes du Projet
**Contraintes techniques**
•	Le projet doit obligatoirement utiliser Laravel pour le backend et React.js pour le frontend
•	La base de données doit être MySQL — aucun autre SGBD n'est autorisé
•	Le paiement mobile doit être simulé (pas d'intégration réelle d'API de paiement)
•	L'application doit fonctionner sans installation particulière côté utilisateur (accès via navigateur)

## 9. Livrables Attendus
| Livrable | Description |
|---|---|
| Code source complet | Projet Laravel + React.js versionné sur GitHub avec README d'installation |
| Rapport de mémoire | Document complet incluant introduction, cadre théorique, méthodologie, résultats et conclusion |
| Cahier des charges | Ce document validé par le maître de stage |
| Application déployée | Plateforme accessible en ligne via URL publique |
| Présentation soutenance | Diaporama de présentation du projet |
