## OpenRisk — Roadmap & TODO (vérifié le dépôt)

Date: 2025-12-04

Ce fichier centralise la roadmap priorisée et l'état actuel du projet. J'ai effectué une vérification rapide du dépôt pour marquer l'état des priorités.

Légende:
- ✅ = implémenté / livré
- ⚠️ = partiellement livré / PoC / à stabiliser
- ⬜ = non démarré / à planifier

PRINCIPES : garder la liste focalisée (3–5 priorités actives), commencer les features critiques par un PoC, ajouter critères d'acceptation pour chaque priorité.

=== RÉCAPITULATIF RAPIDE (vérifié) ===
- ✅ Risk CRUD API : `backend/internal/handlers/risk_handler.go` (handlers, validation), migrations présentes.
- ✅ Risk CRUD Frontend : composants `CreateRiskModal`, `EditRiskModal`, store/hooks (`useRiskStore`).
- ✅ Score engine : `backend/internal/services/score_service.go` + tests (`score_service_test.go`) + docs (`docs/score_calculation.md`).
- ✅ Frameworks classification : DB (migrations), backend model, frontend selectors.
- ✅ Mitigation UI : `MitigationEditModal` + endpoints/handlers (`mitigation_handler.go`).
- ⚠️ Mitigation sub-actions (checklist) : migration + model exist in docs/migrations, handlers work in-progress.
- ✅ OpenAPI spec: `docs/openapi.yaml` (minimal OpenAPI pour Risk endpoints).
- ✅ Sync PoC & TheHive adapter: `backend/internal/adapters/thehive/client.go` + `workers/sync_engine.go` (PoC adapter + sync engine wiring).
- ⬜ RBAC & multi-tenant: mentionné en docs mais non implémenté.
- ⬜ Helm / k8s charts: docs/README mention Helm, pas de chart produit.
- ⬜ Marketplace, advanced connectors (Splunk, Elastic, AWS Security Hub): listed as PoC priorities, non implémentés.

---

## Priorités Immédiates (MVP → 30 jours)

1) Stabiliser le MVP Risques & Mitigations (status: ✅ 85% DONE)
 - Actions:
   - ✅ Finaliser Mitigation sub-actions : migration 0003/0004 créées, endpoints (create/toggle/delete) implémentés, frontend checklist fonctionnelle.
   - ⚠️ Couvrir handlers critiques par tests unitaires : fichier `mitigation_subaction_handler_test.go` créé (HTTP validation layer); full integration tests docker-compose pending.
   - ⬜ Lier events: émettre webhook `risk.created` et `mitigation.updated` depuis handlers (PoC) (1-2 jours).
 - Critères d'acceptation:
   - ✅ Checklist sub-actions CRUD fonctionne (API + UI) ; 6+ unit tests couvrent validation layer.
   - ⚠️ Tests d'intégration complets nécessitent docker-compose + test DB setup.
   - ⬜ Webhook documenté et PoC implémenté.

2) API-First & OpenAPI completion (status: ✅ DONE)
 - Actions:
   - ✅ Étendre `docs/openapi.yaml` : couverture complète des 29 endpoints (Health, Auth, Risks CRUD, Mitigations CRUD, Sub-actions, Assets, Statistics, Export, Gamification).
   - ✅ Créer `docs/API_REFERENCE.md` : documentation exhaustive avec exemples request/response pour tous endpoints.
   - ✅ Définir security schemes (Bearer JWT) et validation schemas.
 - Critères d'acceptation: ✅ OpenAPI 3.0 complète avec tous endpoints; ✅ API_REFERENCE.md détaillé avec 50+ exemples.
 - **Statut**: Livré le 2025-12-06. Prêt pour tooling (swagger-ui, redoc, code generation).

3) Tests & CI (status: ⬜ NEXT PRIORITY — 5–7 jours)
 - Actions:
   - Set up docker-compose for test environment (test DB, Redis for cache testing).
   - Integration tests: Risk CRUD + Mitigation CRUD handlers with real DB.
   - CI pipeline GitHub Actions: lint (golangci-lint, eslint) → test → build → docker image.
 - Critères: pipeline ✅ on PRs, integration tests ≥ 60% coverage, docker image pushes to registry.
 - **Recommandation**: Commencer par docker-compose setup puis intégration tests, puis GitHub Actions.

---

## Plateforme & Intégrations (Quarter)

- Sync Engine: PoC présent (`workers/sync_engine.go`), TheHive adapter, OpenCTI Adapter; transformer PoC en connecteur stable (idempotency, retries, metrics).
- Priorités PoC → Production : TheHive (done/PoC) → OpenCTI (config existante) → Cortex (playbooks) → Splunk/Elastic.
- Ajouter EventBus / Webhooks et un broker léger (NATS / Redis streams) pour découpler intégrations.

Critères d'acceptation pour un connecteur prêt-prod:
- tests d'intégration simulant l'API tierce.
- idempotency et retry policy implémentés.
- metrics & logs exposés.

---

## Sécurité, Multi-tenant & Gouvernance

- RBAC & Multi-tenant : planifier PoC (phase 1: RBAC simple basé sur roles, phase 2: tenant isolation via `tenant_id` sur tables). Non implémenté → Priorité Q2.
- Hardening: dependency SCA, security scans, CSP, rate limiting (déjà headers Helmet middleware présent).

---

## UX & Design System

- Créer `OpenDefender Design System` (tokens Tailwind + Storybook) — planifier sprint dédié.
- Prioriser onboarding flows et dashboard widgets (drag & drop futur).

---

## Roadmap courte (5 livrables concrets)
1. Mitigation sub-actions (API + UI) — 3 jours
2. OpenAPI full coverage + API_REFERENCE — 4 jours
3. CI (GitHub Actions) + integration tests — 7 jours
4. Sync Engine hardening (idempotency, retries, metrics) — 7 jours
5. RBAC PoC (role-based, auth middleware) — 10 jours

---



