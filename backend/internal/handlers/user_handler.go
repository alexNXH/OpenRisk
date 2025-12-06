package handlers

import (
	"github.com/gofiber/fiber/v2"
	// "github.com/golang-jwt/jwt/v5"
	"github.com/opendefender/openrisk/database"
	"github.com/opendefender/openrisk/internal/core/domain"
	"golang.org/x/crypto/bcrypt"
)

// GetMe : Récupère les infos de l'utilisateur connecté
func GetMe(c *fiber.Ctx) error {
	userID := c.Locals("user_id") // Récupéré depuis le middleware JWT
	var user domain.User

	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}
	return c.JSON(user)
}

// SeedAdminUser : Crée un admin par défaut si la base est vide
// À appeler au démarrage dans main.go
func SeedAdminUser() {
	var count int64
	database.DB.Model(&domain.User{}).Count(&count)
	if count == 0 {
		// Find or create admin role
		var adminRole domain.Role
		if err := database.DB.Where("name = ?", "admin").First(&adminRole).Error; err != nil {
			// Create admin role if it doesn't exist
			adminRole = domain.Role{
				Name:        "admin",
				Description: "Full system access",
				Permissions: []string{domain.PermissionAll},
			}
			database.DB.Create(&adminRole)
		}

		hash, _ := bcrypt.GenerateFromPassword([]byte("admin123"), 14)
		admin := domain.User{
			Email:    "admin@opendefender.io",
			Username: "admin",
			Password: string(hash),
			FullName: "System Administrator",
			RoleID:   adminRole.ID,
			IsActive: true,
		}
		database.DB.Create(&admin)
		println("🔐 Default Admin created: admin@opendefender.io / admin123")
	}
}
