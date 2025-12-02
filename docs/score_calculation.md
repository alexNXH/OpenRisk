# Score Calculation

Ce document décrit la formule utilisée par OpenRisk pour calculer le score d'un risque, les facteurs de criticité des assets, les cas limites et des exemples de calcul.

## Formule

- Base: impact × probability
- Facteur final: moyenne des facteurs de criticité des assets associés (avg_factor)
- Score final: base × avg_factor
- Arrondi: le score est arrondi à 2 décimales

En pseudo‑formule:

base = impact * probability

avg_factor = (Σ factor(asset_i)) / Nassets  (par défaut 1.0 si pas d'assets)

final = round(base * avg_factor, 2)

## Facteurs de criticité (mapping)

Les facteurs appliqués aux assets sont les suivants (voir `backend/internal/services/score_service.go`):

- `Low`      → 0.8
- `Medium`   → 1.0
- `High`     → 1.25
- `Critical` → 1.5

Si un asset possède une criticité inconnue, le facteur par défaut `1.0` est utilisé.

## Cas limites

- Aucun asset associé: avg_factor = 1.0 → final = base
- Asset(s) avec criticité non reconnue: ces assets comptent pour `1.0` dans la moyenne
- Impact/probability hors plage attendue (1-5): la validation API empêche normalement ces valeurs; si présente, la fonction calcule néanmoins avec les valeurs reçues

## Exemple 1 — Pas d'assets

- impact = 3, probability = 4
- base = 12
- avg_factor = 1.0
- final = 12.00

## Exemple 2 — Plusieurs assets

- impact = 2, probability = 5 → base = 10
- assets: [Low (0.8), High (1.25)] → avg_factor = (0.8 + 1.25) / 2 = 1.025
- final = 10 × 1.025 = 10.25

## Emplacement du code

- Implémentation: `backend/internal/services/score_service.go` (fonction `ComputeRiskScore`)
- Tests unitaires: `backend/internal/services/score_service_test.go`
- Appels depuis handlers: `backend/internal/handlers/risk_handler.go` (`CreateRisk` et `UpdateRisk`)

## Recommandations

- Documenter toute modification des facteurs dans ce fichier et ajouter un test unitaire correspondant.
- Si vous souhaitez une autre formule (p. ex. poids non linéaires ou minimum/maximum), proposer un ticket/PR et ajouter une migration de tests.

---

Fichier généré automatiquement par l'outil de documentation interne.