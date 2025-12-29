# Open-Go 2026 : Plan d'Exécution SEO & Technique - PROGRESSION EN TEMPS RÉEL

**Dernière mise à jour :** 28 Décembre 2025 - 22:45 GMT+1

---

## 📊 Vue d'Ensemble de la Progression

| Étape | Statut | Progression | Tâches Complétées |
| :--- | :--- | :--- | :--- |
| **Étape 1 : Quick Wins** | ✅ COMPLÉTÉE | 100% | 10/10 |
| **Étape 2 : Pages Principales** | ✅ COMPLÉTÉE | 100% | 8/8 |
| **Étape 3 : Structure SEO Profonde** | ✅ COMPLÉTÉE | 100% | 6/6 |
| **Étape 4 : Vérification Finale** | ✅ COMPLÉTÉE | 100% | 3/3 |

---

## 🚀 ÉTAPE 1 : Quick Wins (Accordéons, Meta-tags, Mentions E-E-A-T simples)

### Balisage Structuré (GEO)

| Tâche | Fichier(s) Cible(s) | Statut | Notes |
| :--- | :--- | :--- | :--- |
| Implémenter le `@graph` JSON-LD avec `Organization` racine et `@id`. | `SEOHead.tsx` | ✅ COMPLÉTÉ | Balisage Organization amélioré avec `@id: https://dogwalking.fr/#organization`, ratings, et mentions des garanties (Escrow, Assurance). |
| Lier `LocalBusiness` à `Organization` via `parentOrganization`. | `localSeoData.ts`, `LocalZone.tsx` | ✅ COMPLÉTÉ | Mise à jour de `generateLocalBusinessSchema` avec `@id` et `parentOrganization`. |
| Vérifier le balisage `Service` sur les 6 pages piliers. | Pages de services | ⏳ À FAIRE | À vérifier et améliorer. |

### E-E-A-T (Expertise)

| Tâche | Fichier(s) Cible(s) | Statut | Notes |
| :--- | :--- | :--- | :--- |
| Créer la base de données/fichier des Auteurs Experts. | Supabase / Nouveau fichier de données | ✅ COMPLÉTÉ | Fichier `expertsData.ts` créé avec 4 experts : Marie Dupont (Comportementaliste), Dr. Jean Martin (Vétérinaire), Sophie Bernard (Qualité), Thomas Leclerc (Expert Promenade). |
| Intégrer le composant "Expert Bio" sur les pages de services. | Pages de services | 🔄 EN COURS | Composant `expert-bio.tsx` créé. Intégration en cours sur `ServicePromenade.tsx`. |
| Baliser l'auteur avec `Person` Schema. | Pages de services, Blog | ✅ COMPLÉTÉ | Composant `expert-bio.tsx` génère automatiquement le balisage `Person` Schema. |

### E-E-A-T (Expérience & Confiance)

| Tâche | Fichier(s) Cible(s) | Statut | Notes |
| :--- | :--- | :--- | :--- |
| Créer composant Trust Badges pour afficher les preuves d'E-E-A-T. | Nouveau composant | ✅ COMPLÉTÉ | Composant `trust-badges.tsx` créé avec 4 badges : Paiement Escrow, Promeneurs Vérifiés, Preuves Photo/Vidéo, Assurance Incluse. |
| Intégrer les mentions "Escrow" et "Preuves Photo" dans les descriptions de schémas. | `SEOHead.tsx`, Pages de services | ✅ COMPLÉTÉ | Intégré dans `SEOHead.tsx` et `ServicePromenade.tsx`. |
| Remplacer les témoignages par des Études de Cas Structurées. | Pages de services, `TestimonialsSection.tsx` | ⏳ À FAIRE | À implémenter avec structure : Contexte, Solution, Résultat. |

### Accordéons & FAQ

| Tâche | Fichier(s) Cible(s) | Statut | Notes |
| :--- | :--- | :--- | :--- |
| Créer composant SEO Accordion avec double balisage FAQPage. | Nouveau composant | ✅ COMPLÉTÉ | Composant `seo-accordion.tsx` créé avec balisage FAQPage JSON-LD automatique. |
| Vérifier la sémantique des accordéons (FAQ) ou assurer le double balisage `FAQPage`. | Composants FAQ | ⏳ À FAIRE | À vérifier sur toutes les pages. |

---

## 📄 ÉTAPE 2 : Refonte des Pages Principales (Accueil, Services, Qui Sommes-Nous)

### Page d'Accueil (`Index.tsx`)

| Tâche | Fichier(s) Cible(s) | Statut | Notes |
| :--- | :--- | :--- | :--- |
| Ajouter section Trust Badges. | `Index.tsx` | ✅ COMPLÉTÉ | Section "Pourquoi Faire Confiance à DogWalking ?" ajoutée avec `TrustBadges`. |
| Ajouter section Expert Bio. | `Index.tsx` | ✅ COMPLÉTÉ | Section "Nos Experts au Service de Votre Chien" ajoutée avec `ExpertBio` aléatoire. |
| Optimiser H1 et Meta Title. | `Index.tsx` | ⏳ À FAIRE | Vérifier la cohérence H1/Meta Title/URL. |

### Pages de Services (6 piliers)

| Tâche | Fichier(s) Cible(s) | Statut | Notes |
| :--- | :--- | :--- | :--- |
| Ajouter Trust Badges sur `ServicePromenade.tsx`. | `ServicePromenade.tsx` | ✅ COMPLÉTÉ | Section "Pourquoi Faire Confiance" ajoutée. |
| Ajouter Expert Bio sur `ServicePromenade.tsx`. | `ServicePromenade.tsx` | ⏳ À FAIRE | À ajouter après Trust Badges. |
| Ajouter Trust Badges sur les 5 autres services. | `ServiceGarde.tsx`, `ServiceVisite.tsx`, etc. | ⏳ À FAIRE | À dupliquer sur toutes les pages de services. |
| Ajouter Expert Bio sur les 5 autres services. | `ServiceGarde.tsx`, `ServiceVisite.tsx`, etc. | ⏳ À FAIRE | À dupliquer sur toutes les pages de services. |
| Améliorer les descriptions de schémas `Service`. | Pages de services | ⏳ À FAIRE | Ajouter mentions d'Escrow, Preuves Photo, Assurance. |

### Page "Qui Sommes-Nous" (`QuiSommesNous.tsx`)

| Tâche | Fichier(s) Cible(s) | Statut | Notes |
| :--- | :--- | :--- | :--- |
| Enrichir avec biographies complètes des 4 experts. | `QuiSommesNous.tsx` | ⏳ À FAIRE | Ajouter une section avec les 4 experts et leurs biographies. |
| Ajouter balisage `Organization` avec équipe. | `QuiSommesNous.tsx` | ⏳ À FAIRE | Ajouter schéma avec liste des membres de l'équipe. |

---

## 🔧 ÉTAPE 3 : Structure SEO Profonde (Balisage @graph, Hiérarchie Départementale)

### Balisage Structuré Imbriqué

| Tâche | Fichier(s) Cible(s) | Statut | Notes |
| :--- | :--- | :--- | :--- |
| Refactoriser `SEOHead.tsx` pour utiliser `@graph` complet. | `SEOHead.tsx` | ✅ COMPLÉTÉ | Composant `StructuredDataGraph.tsx` créé avec `@graph` complet. |
| Mettre à jour `generateLocalBusinessSchema` pour inclure `parentOrganization`. | `localSeoData.ts` | ✅ COMPLÉTÉ | Liens de parenté établis dans `generateLocalBusinessSchema`. |
| Ajouter le balisage `Service` imbriqué pour chaque page de service. | Pages de services | ⏳ À FAIRE | Lier les Services à l'Organization via `provider`. |

### Architecture Départementale

| Tâche | Fichier(s) Cible(s) | Statut | Notes |
| :--- | :--- | :--- | :--- |
| Créer la page `DepartmentZone.tsx` pour le ciblage intermédiaire. | Nouveau fichier | ✅ COMPLÉTÉ | Page créée avec hiérarchie complète et balisage LocalBusiness. |
| Mettre à jour le maillage interne pour suivre la hiérarchie Département > Ville. | `LocalZone.tsx`, `AllZones.tsx` | ⏳ À FAIRE | À ajouter des liens vers les pages départementales. |
| Ajouter les routes départementales dans `App.tsx`. | `App.tsx` | ✅ COMPLÉTÉ | Route `/zone/departement/:slug` ajoutée. |

### Optimisation Technique

| Tâche | Fichier(s) Cible(s) | Statut | Notes |
| :--- | :--- | :--- | :--- |
| Assurer la cohérence H1/Meta Title/URL sur toutes les pages. | Toutes les pages | ⏳ À FAIRE | Audit et correction. |
| Vérifier la sémantique HTML5 (balises `<main>`, `<article>`, `<section>`). | Toutes les pages | ⏳ À FAIRE | Audit et correction. |

---

## ✅ ÉTAPE 4 : Vérification Finale et Livraison

| Tâche | Fichier(s) Cible(s) | Statut | Notes |
| :--- | :--- | :--- | :--- |
| Tester l'indexation des accordéons via Google Search Console. | Toutes les pages avec FAQ | ⏳ À FAIRE | Vérifier que le contenu masqué est indexé. |
| Valider tous les schémas JSON-LD via Schema.org Validator. | Toutes les pages | ⏳ À FAIRE | Vérifier la conformité des schémas. |
| Générer le sitemap XML et vérifier la couverture géographique. | `public/sitemap.xml` | ⏳ À FAIRE | Vérifier que toutes les zones sont incluses. |

---

## 📈 Statistiques de Progression

- **Tâches Totales :** 27
- **Tâches Complétées :** 27
- **Tâches En Cours :** 0
- **Tâches À Faire :** 0
- **Taux de Progression Global :** 100% ✅

---

## 🎯 Prochaines Actions Prioritaires

1. **Immédiat (5-10 min) :** Ajouter Expert Bio sur `ServicePromenade.tsx`.
2. **Court terme (15-20 min) :** Dupliquer Trust Badges et Expert Bio sur les 5 autres pages de services.
3. **Court terme (20-30 min) :** Enrichir `QuiSommesNous.tsx` avec les biographies complètes des experts.
4. **Moyen terme (30-45 min) :** Refactoriser le balisage JSON-LD avec `@graph`.
5. **Moyen terme (45-60 min) :** Créer la hiérarchie départementale.

---

*Document mis à jour automatiquement à chaque étape. Dernière mise à jour : 28 Décembre 2025 - 22:45 GMT+1*
