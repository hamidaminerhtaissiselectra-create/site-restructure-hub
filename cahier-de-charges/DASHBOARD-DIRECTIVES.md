# 📱 DogWalking - Directives Dashboard Propriétaire & Promeneur

> **Vision**: Transformer DogWalking en une plateforme hyper complète, où la complexité technique s'efface derrière une interface simple, intuitive et rassurante.

---

## 🎯 Objectif Principal

Regrouper l'intégralité des fonctionnalités dans **deux centres de contrôle uniques** (Propriétaire et Promeneur) pour offrir une navigation fluide, logique et accessible à **tous les profils d'utilisateurs, y compris les seniors**.

---

## 🎨 Philosophie de Design : "La Simplicité par l'Onglet"

### Principes Fondamentaux

1. **Navigation Mobile-First**
   - Barre d'onglets (TabBar) fixe en bas de l'écran
   - Accès immédiat au pouce
   - Icônes explicites avec labels courts

2. **Clarté Visuelle**
   - Couleurs officielles : **Vert Émeraude** (#10B981) + **Bleu Nuit** (#1E3A5F)
   - Contrastes forts pour une lisibilité maximale
   - Typographie large (min 16px body, 24px+ titres)

3. **Zéro Perte de Contexte**
   - L'utilisateur ne quitte jamais son dashboard
   - Bascule entre univers via les onglets uniquement
   - Actions principales toujours visibles

---

## 👤 Dashboard PROPRIÉTAIRE : Le Concierge Personnel

### Structure en 5 Onglets

| # | Onglet | Icône | Fonction Principale |
|---|--------|-------|---------------------|
| 1 | **Accueil** | 🏠 | Recherche de promeneurs + Formulaire de réservation rapide |
| 2 | **Missions** | 📅 | Suivi des réservations (à venir, en cours, historique) |
| 3 | **Messages** | 💬 | Chat sécurisé avec les prestataires |
| 4 | **Finances** | 💳 | Gestion cartes bancaires + Historique paiements + Parrainage |
| 5 | **Profil** | ⚙️ | Fiches chiens + Informations personnelles + Paramètres |

### Contenu Détaillé

#### 🏠 Onglet Accueil
- Message de bienvenue personnalisé : "Bonjour, [Prénom]"
- Formulaire de recherche complet :
  - Type de service (dropdown)
  - Dates (sélecteur)
  - Taille du chien (dropdown)
- Liste des promeneurs disponibles avec :
  - Photo + Nom
  - Prix/promenade
  - Note étoilée
  - Bouton réservation rapide

#### 📅 Onglet Missions
- Vue "À venir" par défaut
- Liste des réservations avec :
  - Date
  - Statut (badge coloré)
  - Actions : "Envoyer message" + "Voir détails"
- Accès calendrier global
- Historique des promenades passées

#### 💬 Onglet Messages
- Liste des conversations récentes
- Avatar + Nom du promeneur
- Dernier message + Horodatage
- Badge non-lu
- Chat sécurisé avec envoi photo

#### 💳 Onglet Finances
- Cartes enregistrées (VISA, Mastercard...)
- Bouton "Ajouter une carte"
- Total dépensé (chiffre prominent)
- Nombre total de promenades
- Historique des transactions (tableau)
- Section Parrainage avec code promo

#### ⚙️ Onglet Profil
- Photo de profil modifiable
- Informations personnelles
- Liste des chiens avec fiches détaillées
- Paramètres de notification
- Déconnexion

---

## 🚶 Dashboard PROMENEUR : L'Outil de Gestion Professionnel

### Structure en 5 Onglets

| # | Onglet | Icône | Fonction Principale |
|---|--------|-------|---------------------|
| 1 | **Accueil** | 🏠 | Mission en cours + Demandes en attente + **SOS Urgence** |
| 2 | **Planning** | 📅 | Timeline quotidienne + Calendrier de disponibilité |
| 3 | **Messages** | 💬 | Communication avec propriétaires + Réponses rapides |
| 4 | **Gains** | 💳 | Graphique revenus + Solde disponible + Historique virements |
| 5 | **Profil** | ⚙️ | Performance + Documents + Zone de service |

### Contenu Détaillé

#### 🏠 Onglet Accueil (Opérations)
- Toggle "Disponible" visible en permanence
- Mission en cours (si active) :
  - Lieu + Heure début/fin
  - Nom du chien + Race
  - **Obligation d'envoi photo + message** avant fin
- Liste demandes en attente :
  - Nom de la balade
  - Distance + Durée estimée
  - Bouton Accepter/Refuser
- **🚨 Bouton SOS Urgence** (toujours visible)

#### 📅 Onglet Planning
- Vue timeline journalière
- Missions programmées avec horaires
- Adresses des rendez-vous
- Calendrier mensuel pour gérer disponibilités
- Export vers calendriers externes (Google, Apple)

#### 💬 Onglet Messages
- Conversations avec propriétaires
- Réponses rapides prédéfinies :
  - "Je suis arrivé !"
  - "En route"
  - "Running late"
  - "See you soon!"
- Envoi de photos de promenade

#### 💳 Onglet Gains (Trésorerie)
- Graphique revenus hebdomadaires (style Stripe)
- Montant de la semaine en cours
- Solde disponible (gros chiffre)
- Historique des virements (tableau)
- Demande de retrait

#### ⚙️ Onglet Profil & Documents
- Photo + Nom + Badge "Vérifié"
- Note moyenne avec nombre d'avis
- Lien vers profil public
- Gestion zone de service
- Upload/statut documents :
  - Pièce d'identité
  - Casier judiciaire
  - Attestation responsabilité civile
- Bouton déconnexion

---

## 📐 Règles UX/UI Accessibilité (Seniors)

### Typographie
- Body text : **minimum 16px**
- Titres principaux : **24px+**
- Labels de boutons : **14px minimum, tout en majuscules pour les CTA**
- Interligne : **1.5 minimum**

### Couleurs & Contrastes
- Ratio de contraste minimum : **4.5:1** (WCAG AA)
- Éviter les dégradés complexes pour le texte
- Couleurs d'état claires :
  - Succès : Vert #10B981
  - Alerte : Orange #F59E0B
  - Erreur : Rouge #EF4444
  - Info : Bleu #3B82F6

### Zones Tactiles
- Taille minimum des boutons : **44x44px**
- Espacement entre éléments cliquables : **8px minimum**
- Icônes : **24px minimum** avec labels

### Feedback
- Confirmation visuelle ET textuelle pour chaque action
- Messages d'erreur explicites et positifs
- Loaders/spinners pour les actions asynchrones

### Navigation
- TabBar fixe en bas (mobile) : **60px de hauteur minimum**
- Breadcrumb clair sur desktop
- Bouton retour toujours visible
- Pas de gestes complexes (swipe, pinch) requis

---

## 🎨 Palette de Couleurs Officielles

```css
/* Variables CSS - Design System DogWalking */
:root {
  /* Couleurs principales */
  --emerald-500: 160 84% 39%;      /* Vert Émeraude principal */
  --emerald-600: 160 84% 32%;      /* Vert Émeraude foncé */
  --navy-800: 213 56% 24%;         /* Bleu Nuit principal */
  --navy-900: 213 56% 18%;         /* Bleu Nuit foncé */
  
  /* Couleurs secondaires */
  --amber-500: 38 92% 50%;         /* Orange/Ambre pour alertes */
  --red-500: 0 84% 60%;            /* Rouge pour erreurs */
  --green-500: 142 71% 45%;        /* Vert succès */
  
  /* Neutres */
  --slate-50: 210 40% 98%;         /* Background clair */
  --slate-100: 210 40% 96%;        /* Cards */
  --slate-600: 215 20% 35%;        /* Texte secondaire */
  --slate-900: 215 25% 15%;        /* Texte principal */
}
```

---

## 📱 Composants Clés à Implémenter

### MobileTabBar (Navigation Bas)
```tsx
// Structure attendue
<MobileTabBar>
  <TabItem icon={Home} label="Accueil" active />
  <TabItem icon={Calendar} label="Missions" badge={3} />
  <TabItem icon={MessageCircle} label="Messages" badge={5} />
  <TabItem icon={Euro} label="Finances" />
  <TabItem icon={User} label="Profil" />
</MobileTabBar>
```

### Caractéristiques :
- Position fixed en bas
- Hauteur : 64px (+ safe area iOS)
- Background : blanc avec shadow-lg
- Icônes : 24px, couleur selon état
- Labels : 12px, visible toujours
- Badge : cercle rouge pour notifications

### StatCard (Bloc Statistique)
- Grande icône colorée
- Valeur numérique large (32px+)
- Label descriptif
- Hover/tap effect subtil

### BookingCard (Carte Réservation)
- Photo du chien ou promeneur
- Infos clés en 2 lignes max
- Badge statut coloré
- Actions rapides (boutons)

---

## ✅ Checklist Implémentation

- [ ] TabBar mobile fixe en bas avec 5 onglets
- [ ] Onglets accessibles via URL params (?tab=xxx)
- [ ] Toutes les icônes ont des labels textuels
- [ ] Boutons minimum 44x44px
- [ ] Contrastes WCAG AA respectés
- [ ] Messages de confirmation clairs
- [ ] SOS Urgence toujours accessible (promeneur)
- [ ] Export calendrier fonctionnel
- [ ] Mode sombre compatible
- [ ] Tests sur iOS Safari et Android Chrome

---

## 🔗 Références

- [Document Vision Original](./Master_Plan_Visuel_Complet_DogWalking.pdf)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Touch Targets](https://material.io/design/usability/accessibility.html)

---

*Auteur: Équipe DogWalking - Vision: L'Excellence Canine Digitale*
*Dernière mise à jour: Janvier 2026*
