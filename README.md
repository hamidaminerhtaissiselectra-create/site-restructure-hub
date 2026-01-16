# 🐕 DogWalking - Plateforme de Promeneurs de Chiens Vérifiés en France

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Connected-green.svg)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-purple.svg)](https://www.framer.com/motion/)

---

## 📋 Présentation

**DogWalking** est la plateforme n°1 en France pour trouver des promeneurs de chiens professionnels vérifiés. Notre mission : garantir la sécurité et le bien-être de votre compagnon grâce à :

- ✅ **Promeneurs 100% vérifiés** (CNI, casier judiciaire, assurance RC)
- ✅ **Paiement escrow sécurisé** (argent bloqué jusqu'à validation)
- ✅ **Preuves photo/vidéo obligatoires** à chaque mission
- ✅ **Assurance incluse** jusqu'à 2M€

---

## 🎯 Objectif : Surpasser Rover.com

### Analyse Concurrentielle Rover.com

| Fonctionnalité Rover | Status DogWalking | Amélioration |
|---------------------|-------------------|--------------|
| Recherche par localisation | ✅ Fait | + Filtres avancés |
| Profils promeneurs | ✅ Fait | + Badges, vérification FR |
| Réservation en ligne | ✅ Fait | + 3 étapes simplifiées |
| Messagerie | ✅ Fait | + Temps réel Supabase |
| Paiement sécurisé | 🔜 En cours | + Escrow 48h |
| Avis certifiés | ✅ Fait | + Post-service uniquement |
| Application mobile | ⚪ À faire | PWA + App native |
| Suivi GPS | ⚪ À faire | + Temps réel |
| Couverture France | ✅ Fait | + SEO local 100 villes |
| Support client | 🔜 En cours | + Chat 7j/7 |

### Avantages Compétitifs DogWalking

1. **🇫🇷 Focus France** - Vérification adaptée (casier B3, CNI française)
2. **🔒 Sécurité renforcée** - Documents vérifiés manuellement sous 48h
3. **💰 Tarification transparente** - Commission 13% vs 20% Rover
4. **📸 Preuves obligatoires** - Photos/vidéos à chaque promenade
5. **🎁 Programme parrainage** - 15€ parrain, 10€ filleul
6. **🌍 SEO local** - Pages dédiées par ville/département

---

## 🚀 Fonctionnalités Principales

### 👤 Parcours Propriétaire
| Fonctionnalité | Description | Status |
|---------------|-------------|--------|
| **Recherche intelligente** | Filtres par ville, service, tarif, notes | ✅ |
| **Dashboard unifié** | 7 onglets (Aperçu, Chiens, Réservations, Promeneurs, Messages, Parrainage, Profil) | ✅ |
| **Upload photo profil** | Stockage Supabase bucket 'avatars' | ✅ |
| **Upload photo chien** | Stockage Supabase bucket 'dog-photos' | ✅ |
| **Barre de recherche dashboard** | Actions rapides avec ⌘K | ✅ |
| **Paramètres avancés** | Thème, notifications, confidentialité | ✅ |
| **Réservation 3 étapes** | Service → Détails → Confirmation | ✅ |
| **Messagerie temps réel** | Communication directe promeneurs | ✅ |
| **Système parrainage** | Code unique, tracking, récompenses | ✅ |

### 🚶 Parcours Promeneur
| Fonctionnalité | Description | Status |
|---------------|-------------|--------|
| **Dashboard unifié** | 7 onglets (Aperçu, Missions, Gains, Dispo, Messages, Performance, Profil) | ✅ |
| **Upload documents** | CNI, casier B3, assurance RC Pro via Supabase Storage | ✅ |
| **Gestion tarifs** | Tarif horaire, zone, chiens max, tarification dynamique | ✅ |
| **Upload photo profil** | Stockage Supabase bucket 'avatars' | ✅ |
| **Badges et distinctions** | Vérifié, Top Promeneur, etc. | ✅ |
| **Statistiques performance** | Taux acceptation, note moyenne, revenus | ✅ |
| **Profil public SEO** | Page personnalisée avec avis | ✅ |

### 🔒 Sécurité & Confiance
- ✅ Vérification manuelle des documents sous 48h
- ✅ Upload documents vers bucket privé 'walker-documents'
- ✅ Preuves photo/vidéo via bucket privé 'walk-proofs'
- 🔜 Paiement escrow (24-48h avant libération)
- ✅ Avis certifiés (uniquement après service)
- 🔜 Support 7j/7

---

## 🛠️ Stack Technique

| Technologie | Usage | Version |
|-------------|-------|---------|
| **React** | Framework UI | 18.3 |
| **TypeScript** | Typage strict | 5.0 |
| **Vite** | Build & HMR | 5.x |
| **Tailwind CSS** | Styling utility-first | 3.4 |
| **Shadcn/UI** | Composants accessibles | Latest |
| **Framer Motion** | Animations fluides | 12.x |
| **Supabase** | Backend complet (Auth, DB, Storage, Edge Functions) | 2.x |
| **React Router** | Navigation SPA | 6.x |
| **React Query** | Data fetching & cache | 5.x |
| **React Helmet** | SEO dynamique | 2.x |

---

## 📁 Architecture du Projet

```
src/
├── assets/                    # Images et ressources statiques
│   ├── pages/                 # Images hero des pages
│   ├── homepage/              # Images sections homepage
│   ├── services/              # Images services détaillés
│   ├── testimonials/          # Photos témoignages
│   └── trust/                 # Images confiance et sécurité
│
├── components/
│   ├── dashboard/
│   │   ├── owner/             # Composants dashboard propriétaire
│   │   │   ├── OverviewTab.tsx
│   │   │   ├── DogsTab.tsx
│   │   │   ├── BookingsTab.tsx
│   │   │   ├── WalkersTab.tsx
│   │   │   ├── MessagesTab.tsx
│   │   │   ├── ReferralTab.tsx
│   │   │   └── ProfileTab.tsx
│   │   ├── walker/            # Composants dashboard promeneur
│   │   │   ├── OverviewTab.tsx
│   │   │   ├── BookingsTab.tsx
│   │   │   ├── EarningsTab.tsx
│   │   │   ├── AvailabilityTab.tsx
│   │   │   ├── MessagesTab.tsx
│   │   │   ├── PerformanceTab.tsx
│   │   │   └── ProfileTab.tsx
│   │   └── shared/            # Composants partagés
│   │       ├── DashboardSearch.tsx    # Recherche ⌘K
│   │       ├── AvatarUpload.tsx       # Upload photo profil
│   │       ├── DogPhotoUpload.tsx     # Upload photo chien
│   │       ├── DocumentUpload.tsx     # Upload documents vérification
│   │       ├── PricingSettings.tsx    # Gestion tarifs
│   │       └── AdvancedSettings.tsx   # Paramètres avancés
│   ├── seo/
│   │   └── SEOHead.tsx        # Composant SEO avec Schema.org
│   └── ui/                    # 50+ composants Shadcn personnalisés
│
├── pages/
│   ├── dashboard/
│   │   ├── OwnerDashboard.tsx    # Dashboard propriétaire unifié
│   │   └── WalkerDashboard.tsx   # Dashboard promeneur unifié
│   ├── services/              # 6 Pages piliers SEO
│   └── ...
│
├── hooks/                     # Hooks personnalisés
├── integrations/supabase/     # Client et types Supabase
├── data/                      # Données statiques
└── lib/                       # Utilitaires
```

---

## 🌐 Routes de l'Application

### Dashboards Unifiés (Nouveaux)
| Route | Description |
|-------|-------------|
| `/dashboard?tab=apercu` | Vue d'ensemble propriétaire |
| `/dashboard?tab=chiens` | Gestion des chiens |
| `/dashboard?tab=reservations` | Historique réservations |
| `/dashboard?tab=promeneurs` | Favoris et recherche |
| `/dashboard?tab=messages` | Messagerie |
| `/dashboard?tab=parrainage` | Programme parrainage |
| `/dashboard?tab=profil` | Profil et paramètres |
| `/walker/dashboard?tab=apercu` | Vue d'ensemble promeneur |
| `/walker/dashboard?tab=missions` | Gestion missions |
| `/walker/dashboard?tab=gains` | Revenus et retraits |
| `/walker/dashboard?tab=disponibilites` | Planning |
| `/walker/dashboard?tab=messages` | Messagerie |
| `/walker/dashboard?tab=performance` | Statistiques |
| `/walker/dashboard?tab=profil` | Profil, tarifs, documents |

---

## 💾 Supabase Storage Buckets

| Bucket | Public | Usage |
|--------|--------|-------|
| `avatars` | ✅ Oui | Photos profil utilisateurs |
| `dog-photos` | ✅ Oui | Photos des chiens |
| `walker-documents` | ❌ Non | Documents vérification (CNI, casier, assurance) |
| `walk-proofs` | ❌ Non | Preuves photo/vidéo des promenades |

---

## 📅 Roadmap - Surpasser Rover.com

### ✅ Phase 1 : Fondations (COMPLET)
- [x] Authentification email Supabase
- [x] Dashboards unifiés propriétaire/promeneur (7 onglets chacun)
- [x] Upload photos profil (humain + chien)
- [x] Upload documents vérification promeneurs
- [x] Gestion tarifs promeneurs (dynamique, zone, chiens max)
- [x] Paramètres avancés (thème, notifications, confidentialité)
- [x] Barre de recherche intelligente ⌘K
- [x] SEO complet 6 pages piliers
- [x] Design responsive premium

### 🔜 Phase 2 : Paiement & Transactions (EN COURS)
- [ ] **Intégration Stripe Connect** - Paiements marketplace
- [ ] **Edge function `create-checkout`** - Création session paiement
- [ ] **Edge function `stripe-webhook`** - Gestion webhooks
- [ ] **Paiement escrow** - Blocage 48h avant libération
- [ ] **Facturation automatique** - Génération PDF
- [ ] **Gestion remboursements** - Politique annulation

### 🔜 Phase 3 : Communication (EN COURS)
- [ ] **Emails transactionnels Resend** - Confirmations, rappels
- [ ] **Notifications push** - Service workers PWA
- [ ] **SMS alertes** - Twilio pour urgences
- [ ] **Chat temps réel amélioré** - Indicateurs frappe, vu

### ⚪ Phase 4 : Fonctionnalités Avancées
- [ ] **Suivi GPS temps réel** - Carte live pendant promenade
- [ ] **Calendrier synchronisé** - Google Calendar, iCal
- [ ] **Récurrence réservations** - Abonnements hebdo/mensuel
- [ ] **Multi-chiens** - Gestion pack famille
- [ ] **Urgences** - Bouton SOS promeneur

### ⚪ Phase 5 : Mobile & Scale
- [ ] **PWA optimisée** - Install, offline, push
- [ ] **Application native** - React Native ou Flutter
- [ ] **API publique** - Partenaires vétérinaires
- [ ] **Expansion géographique** - Belgique, Suisse

### ⚪ Phase 6 : Administration
- [ ] **Interface Admin sécurisée** - Gestion utilisateurs
- [ ] **Modération documents** - Validation CNI/casier
- [ ] **Tableau de bord analytics** - KPIs business
- [ ] **Gestion litiges** - Médiation automatisée

---

## 🏆 Objectifs vs Rover.com

| Métrique | Rover | DogWalking Cible |
|----------|-------|------------------|
| Commission | 20% | **13%** ✅ |
| Vérification | Basique | **Manuelle 48h** ✅ |
| Preuves mission | Optionnel | **Obligatoire** ✅ |
| Assurance | 1M€ | **2M€** |
| Support | Email | **Chat 7j/7** |
| SEO local | Faible | **100 villes** ✅ |
| Parrainage | 10€ | **15€/10€** ✅ |

---

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE)

---

*Développé avec ❤️ pour les amoureux des chiens en France - Objectif : Devenir le leader français 🇫🇷*
