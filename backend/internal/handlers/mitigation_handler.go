package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/opendefender/openrisk/database"
	"github.com/opendefender/openrisk/internal/core/domain"
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