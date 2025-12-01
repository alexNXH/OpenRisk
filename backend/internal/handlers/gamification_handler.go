package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/opendefender/openrisk/internal/services"
)

func GetMyGamificationProfile(c *fiber.Ctx) error {
	// Récupérer l'ID utilisateur depuis le Token JWT (injecté par middleware Protected)
	userID := c.Locals("user_id").(string)

	if userID == "" {
		return c.Status(401).JSON(fiber.Map{"error": "User not found in token"})
	}

	service := services.NewGamificationService()
	stats, err := service.GetUserStats(userID)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to calculate stats", "details": err.Error()})
	}

	return c.JSON(stats)
}
