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

## 🚀 Fonctionnalités Principales

### 👤 Parcours Propriétaire
| Fonctionnalité | Description |
|---------------|-------------|
| **Recherche intelligente** | Filtres par ville, service, tarif, notes |
| **Inscription différée** | Explorer et configurer avant de créer un compte |
| **Réservation 3 étapes** | Service → Détails → Confirmation |
| **Dashboard complet** | Stats, réservations, chiens, favoris |
| **Messagerie temps réel** | Communication directe avec les promeneurs |
| **Système de parrainage** | Gagnez des crédits en parrainant |

### 🚶 Parcours Promeneur
| Fonctionnalité | Description |
|---------------|-------------|
| **Inscription vérifiée** | Upload CNI, casier, assurance |
| **Dashboard professionnel** | Gains, demandes, statistiques |
| **Gestion des missions** | Accepter/refuser, envoyer preuves |
| **Profil public SEO** | Page personnalisée avec avis |
| **Badges et distinctions** | Valorisation de l'expérience |

### 🔒 Sécurité & Confiance
- Vérification manuelle des documents sous 48h
- Paiement escrow (24-48h avant libération)
- Preuves photo/vidéo obligatoires
- Avis certifiés (uniquement après service)
- Support 7j/7

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
| **Supabase** | Backend complet | 2.x |
| **React Router** | Navigation SPA | 6.x |
| **React Query** | Data fetching & cache | 5.x |
| **React Helmet** | SEO dynamique | 2.x |

---

## 📦 Installation & Démarrage

```bash
# Cloner le repository
git clone https://github.com/votre-username/dogwalking.git
cd dogwalking

# Installer les dépendances (pnpm recommandé)
pnpm install

# Lancer en développement
pnpm dev

# Build production
pnpm build

# Preview production
pnpm preview
```

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## 📁 Architecture du Projet

```
src/
├── assets/                    # Images et ressources statiques
│   ├── pages/                 # Images hero des pages (12 fichiers)
│   ├── homepage/              # Images sections homepage (5 fichiers)
│   ├── services/              # Images services détaillés (28 fichiers)
│   ├── testimonials/          # Photos témoignages
│   └── trust/                 # Images confiance et sécurité
│
├── components/
│   ├── seo/
│   │   └── SEOHead.tsx        # Composant SEO avec Schema.org
│   └── ui/                    # 50+ composants Shadcn personnalisés
│       ├── header.tsx         # Navigation responsive
│       ├── footer.tsx         # Footer 5 colonnes
│       ├── floating-contact.tsx # Bulle contact flottante
│       ├── hero-section.tsx   # Hero avec parallax
│       ├── services-section.tsx
│       ├── testimonials-section.tsx
│       └── ...
│
├── pages/
│   ├── Index.tsx              # Homepage SEO complète
│   ├── Auth.tsx               # Login/Register optimisé UX
│   ├── Dashboard.tsx          # Espace propriétaire
│   ├── WalkerDashboard.tsx    # Espace promeneur
│   ├── FindWalkers.tsx        # Recherche avec filtres
│   ├── BookWalk.tsx           # Réservation 3 étapes
│   ├── Profile.tsx            # Gestion profil
│   ├── services/              # 6 Pages piliers SEO
│   │   ├── ServicePromenade.tsx    # ~1550 mots
│   │   ├── ServiceGarde.tsx        # ~1450 mots
│   │   ├── ServiceVisite.tsx       # ~1500 mots
│   │   ├── ServiceDogSitting.tsx   # ~1600 mots
│   │   ├── ServicePetSitting.tsx   # ~1550 mots
│   │   └── ServiceMarcheReguliere.tsx # ~1580 mots
│   └── ...
│
├── hooks/                     # Hooks personnalisés
│   ├── use-toast.ts
│   ├── use-mobile.tsx
│   ├── useParallax.tsx
│   └── useScrollToTop.tsx
│
├── integrations/
│   └── supabase/
│       ├── client.ts          # Client Supabase configuré
│       └── types.ts           # Types auto-générés
│
├── data/
│   ├── localSeoData.ts        # Données zones SEO local
│   └── servicesData.ts        # Configuration services
│
├── lib/
│   └── utils.ts               # Utilitaires (cn, etc.)
│
├── index.css                  # Design tokens HSL
├── App.tsx                    # Routes et providers
└── main.tsx                   # Point d'entrée
```

---

## 🌐 Routes de l'Application

### Pages Publiques
| Route | Description | SEO |
|-------|-------------|-----|
| `/` | Page d'accueil | ✅ Schema LocalBusiness |
| `/tarifs` | Grille tarifaire | ✅ FAQ Schema |
| `/securite` | Garanties et sécurité | ✅ FAQ Schema |
| `/blog` | Articles et conseils | ✅ Blog Schema |
| `/qui-sommes-nous` | Présentation équipe | ✅ |
| `/walkers` | Recherche promeneurs | ✅ |
| `/walker/:id` | Profil promeneur | ✅ Dynamique |

### 6 Pages Services Piliers SEO
| Route | Service | Mots | FAQ |
|-------|---------|------|-----|
| `/services/promenade` | Promenade de chien | ~1550 | 6 questions |
| `/services/garde` | Garde de chiens | ~1450 | 6 questions |
| `/services/visite` | Visite à domicile | ~1500 | 6 questions |
| `/services/dog-sitting` | Dog Sitting | ~1600 | 8 questions |
| `/services/pet-sitting` | Pet Sitting Multi-Animaux | ~1550 | 8 questions |
| `/services/marche-reguliere` | Marche Régulière | ~1580 | 8 questions |

### Espace Utilisateur
| Route | Description |
|-------|-------------|
| `/auth` | Connexion / Inscription |
| `/dashboard` | Tableau de bord propriétaire |
| `/walker/dashboard` | Tableau de bord promeneur |
| `/bookings` | Mes réservations |
| `/book/:walkerId` | Réserver une prestation |
| `/profile` | Mon profil |
| `/messages` | Messagerie |

---

## 💾 Base de Données Supabase

### Tables Principales

| Table | Description | RLS |
|-------|-------------|-----|
| `profiles` | Profils utilisateurs | ✅ |
| `dogs` | Chiens enregistrés | ✅ |
| `walker_profiles` | Profils promeneurs | ✅ |
| `walker_documents` | Documents vérification | ✅ |
| `bookings` | Réservations | ✅ |
| `messages` | Messages temps réel | ✅ |
| `reviews` | Avis et notes | ✅ |
| `notifications` | Notifications | ✅ |

### Enums
- `service_type`: promenade, garde, visite, veterinaire
- `booking_status`: pending, confirmed, in_progress, completed, cancelled
- `user_type`: owner, walker, both

---

## 🎨 Design System

### Tokens CSS (HSL)
```css
--primary: /* Couleur principale */
--secondary: /* Couleur secondaire */
--accent: /* Accent */
--background: /* Fond */
--foreground: /* Texte */
--muted: /* Éléments discrets */
--destructive: /* Erreurs */
```

### Composants Clés
- **Buttons** : 5 variantes (default, outline, ghost, secondary, destructive)
- **Cards** : Ombres douces, hover effects
- **Forms** : Validation, états d'erreur
- **Modals** : Dialog Radix accessible
- **Animations** : Framer Motion (fade, slide, scale, stagger)

---

## 📈 SEO & Performance

### Optimisations SEO
- ✅ Meta tags dynamiques par page
- ✅ Schema.org (LocalBusiness, FAQ, Service, Blog)
- ✅ Sitemap XML automatique
- ✅ Canonical URLs
- ✅ Open Graph & Twitter Cards
- ✅ Images avec alt descriptifs
- ✅ Contenu 1300-1600 mots sur pages piliers

### Performance
- Code splitting automatique (Vite)
- Images optimisées
- Lazy loading
- Animations GPU-accelerated

---

## 🔧 Configuration Supabase

### Secrets requis
| Secret | Usage |
|--------|-------|
| `SUPABASE_URL` | URL du projet |
| `SUPABASE_ANON_KEY` | Clé publique |
| `STRIPE_SECRET_KEY` | Paiements (optionnel) |
| `RESEND_API_KEY` | Emails (optionnel) |

---

## 📅 Roadmap

### ✅ Complété (v1.0)
- [x] Authentification email
- [x] Recherche et réservation
- [x] Dashboards propriétaire/promeneur
- [x] Messagerie temps réel
- [x] SEO complet
- [x] Design responsive

### 🔜 Prochaines étapes
- [ ] Intégration Stripe (paiement escrow)
- [ ] Emails transactionnels
- [ ] Upload documents promeneurs
- [ ] Suivi GPS temps réel
- [ ] Application mobile (PWA)

---

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE)

---

## 🤝 Contribution

Les contributions sont bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

---

*Développé avec ❤️ pour les amoureux des chiens en France*
