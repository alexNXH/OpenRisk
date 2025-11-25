package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/opendefender/openrisk/database"
)

// RiskMatrixCell représente le décompte des risques pour une cellule (Impact, Proba)
type RiskMatrixCell struct {
	Impact      int `json:"impact"`
	Probability int `json:"probability"`
	Count       int `json:"count"`
}

// GetRiskMatrixData calcule et retourne les données pour la matrice 5x5.
func GetRiskMatrixData(c *fiber.Ctx) error {
	var results []RiskMatrixCell
	
	// Requête groupée pour compter les risques par paire (Impact, Probability)
	// (Production Ready: Cette requête est optimisée car elle utilise les index de Impact et Probability)
	err := database.DB.Table("risks").
		Select("impact, probability, COUNT(*) as count").
		Where("deleted_at IS NULL"). // N'inclut pas les risques archivés
		Group("impact, probability").
		Find(&results).Error

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to calculate matrix data"})
	}

	// Pour garantir un tableau 5x5 complet même si certaines cellules sont vides,
	// nous initialiserions normalement les 25 cellules ici, mais nous laissons 
	// la transformation au Frontend pour simplifier l'API.

	return c.JSON(results)
}