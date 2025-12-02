package handlers

import (
	"sort"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/opendefender/openrisk/database"
	"github.com/opendefender/openrisk/internal/core/domain"
	"github.com/opendefender/openrisk/internal/services"
)

// AddMitigation ajoute une action corrective à un risque
func AddMitigation(c *fiber.Ctx) error {
	riskID := c.Params("id")

	// Validation UUID
	if _, err := uuid.Parse(riskID); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid Risk ID"})
	}

	mitigation := new(domain.Mitigation)
	if err := c.BodyParser(mitigation); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Lier au risque
	mitigation.RiskID = uuid.MustParse(riskID)
	mitigation.Status = domain.MitigationPlanned

	if err := database.DB.Create(mitigation).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create mitigation"})
	}

	return c.Status(201).JSON(mitigation)
}

// ToggleMitigationStatus change le statut (PLANNED <-> DONE)
func ToggleMitigationStatus(c *fiber.Ctx) error {
	mitigationID := c.Params("mitigationId")
	var mitigation domain.Mitigation

	if err := database.DB.First(&mitigation, "id = ?", mitigationID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Mitigation not found"})
	}

	// Logique de bascule simple
	if mitigation.Status == domain.MitigationDone {
		mitigation.Status = domain.MitigationInProgress
		mitigation.Progress = 50
	} else {
		mitigation.Status = domain.MitigationDone
		mitigation.Progress = 100
	}

	database.DB.Save(&mitigation)
	return c.JSON(mitigation)
}

// GetRecommendedMitigations expose la liste des mitigations triées par SPP.
func GetRecommendedMitigations(c *fiber.Ctx) error {
	service := services.NewRecommendationService()

	// 1. Récupérer et calculer les priorités
	mitigations, err := service.GetPrioritizedMitigations()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get prioritized mitigations"})
	}

	// 2. Trier la liste dans le Handler avant l'envoi (meilleure pratique)
	// On veut le SPP le plus élevé en premier.
	sort.Slice(mitigations, func(i, j int) bool {
		return mitigations[i].WeightedPriority > mitigations[j].WeightedPriority
	})

	return c.JSON(mitigations)
}

// UpdateMitigation met à jour les champs éditables d'une mitigation
func UpdateMitigation(c *fiber.Ctx) error {
	mitigationID := c.Params("mitigationId")
	var mitigation domain.Mitigation

	if err := database.DB.First(&mitigation, "id = ?", mitigationID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Mitigation not found"})
	}

	// Parse payload
	payload := struct {
		Title          *string `json:"title"`
		Assignee       *string `json:"assignee"`
		Status         *string `json:"status"`
		Progress       *int    `json:"progress"`
		DueDate        *string `json:"due_date"`
		Cost           *int    `json:"cost"`
		MitigationTime *int    `json:"mitigation_time"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid payload"})
	}

	if payload.Title != nil {
		mitigation.Title = *payload.Title
	}
	if payload.Assignee != nil {
		mitigation.Assignee = *payload.Assignee
	}
	if payload.Status != nil {
		mitigation.Status = domain.MitigationStatus(*payload.Status)
	}
	if payload.Progress != nil {
		mitigation.Progress = *payload.Progress
	}
	if payload.Cost != nil {
		mitigation.Cost = *payload.Cost
	}
	if payload.MitigationTime != nil {
		mitigation.MitigationTime = *payload.MitigationTime
	}
	if payload.DueDate != nil {
		// try parse RFC3339
		if t, err := time.Parse(time.RFC3339, *payload.DueDate); err == nil {
			mitigation.DueDate = t
		}
	}

	if err := database.DB.Save(&mitigation).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not update mitigation"})
	}

	return c.JSON(mitigation)
}
