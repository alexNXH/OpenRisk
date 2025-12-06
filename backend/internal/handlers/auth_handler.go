package handlers

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/opendefender/openrisk/database"
	"github.com/opendefender/openrisk/internal/core/domain"
	"github.com/opendefender/openrisk/internal/middleware"
	"github.com/opendefender/openrisk/internal/services"
	"golang.org/x/crypto/bcrypt"
)

type LoginInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type RegisterInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
	Username string `json:"username" validate:"required,min=3"`
	FullName string `json:"full_name" validate:"required"`
}

type RefreshInput struct {
	Token string `json:"token" validate:"required"`
}

type AuthResponse struct {
	Token     string   `json:"token"`
	User      *UserDTO `json:"user"`
	ExpiresIn int64    `json:"expires_in"`
}

type UserDTO struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	FullName string `json:"full_name"`
	Role     string `json:"role"`
}

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler() *AuthHandler {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-secret-key"
	}
	authService := services.NewAuthService(jwtSecret, 24*time.Hour)
	return &AuthHandler{
		authService: authService,
	}
}

// Login handles user authentication and returns JWT token
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	input := new(LoginInput)
	if err := c.BodyParser(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validate input
	if input.Email == "" || input.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email and password required"})
	}

	if len(input.Password) < 8 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	var user domain.User
	// Find user by email with role preload
	if err := database.DB.Preload("Role").Where("email = ?", input.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// Check if user is active
	if !user.IsActive {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "User account is inactive"})
	}

	// Generate JWT token
	token, err := h.authService.GenerateToken(&user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	// Update last login timestamp
	_ = h.authService.UpdateLastLogin(user.ID)

	return c.Status(fiber.StatusOK).JSON(AuthResponse{
		Token: token,
		User: &UserDTO{
			ID:       user.ID.String(),
			Email:    user.Email,
			Username: user.Username,
			FullName: user.FullName,
			Role:     user.Role.Name,
		},
		ExpiresIn: 24 * 60 * 60,
	})
}

// RefreshToken generates a new JWT token for authenticated user
func (h *AuthHandler) RefreshToken(c *fiber.Ctx) error {
	// Get user claims from context (set by auth middleware)
	claims := middleware.GetUserClaims(c)
	if claims == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	// Fetch user from database
	var user domain.User
	if err := database.DB.Preload("Role").First(&user, "id = ?", claims.ID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Check if user is still active
	if !user.IsActive {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "User account is inactive"})
	}

	// Generate new token
	newToken, err := h.authService.GenerateToken(&user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.Status(fiber.StatusOK).JSON(AuthResponse{
		Token: newToken,
		User: &UserDTO{
			ID:       user.ID.String(),
			Email:    user.Email,
			Username: user.Username,
			FullName: user.FullName,
			Role:     user.Role.Name,
		},
		ExpiresIn: 24 * 60 * 60,
	})
}

// GetProfile returns current user's profile
func (h *AuthHandler) GetProfile(c *fiber.Ctx) error {
	// Get user claims from context
	claims := middleware.GetUserClaims(c)
	if claims == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	// Fetch user from database
	var user domain.User
	if err := database.DB.Preload("Role").First(&user, "id = ?", claims.ID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.Status(fiber.StatusOK).JSON(UserDTO{
		ID:       user.ID.String(),
		Email:    user.Email,
		Username: user.Username,
		FullName: user.FullName,
		Role:     user.Role.Name,
	})
}

// Register creates a new user account
func (h *AuthHandler) Register(c *fiber.Ctx) error {
	input := new(RegisterInput)
	if err := c.BodyParser(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validate input
	if input.Email == "" || input.Password == "" || input.Username == "" || input.FullName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "All fields are required"})
	}

	if len(input.Password) < 8 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Password must be at least 8 characters"})
	}

	if len(input.Username) < 3 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Username must be at least 3 characters"})
	}

	// Check if email already exists
	var existingUser domain.User
	if err := database.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Email already in use"})
	}

	// Check if username already exists
	if err := database.DB.Where("username = ?", input.Username).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Username already in use"})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to process password"})
	}

	// Get viewer role (default role for new users)
	var viewerRole domain.Role
	if err := database.DB.Where("name = ?", "viewer").First(&viewerRole).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Default role not found"})
	}

	// Create new user
	newUser := domain.User{
		Email:    input.Email,
		Username: input.Username,
		FullName: input.FullName,
		Password: string(hashedPassword),
		RoleID:   viewerRole.ID,
		IsActive: true,
	}

	if err := database.DB.Create(&newUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}

	// Reload with role
	if err := database.DB.Preload("Role").First(&newUser, "id = ?", newUser.ID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve user"})
	}

	// Generate JWT token
	token, err := h.authService.GenerateToken(&newUser)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.Status(fiber.StatusCreated).JSON(AuthResponse{
		Token: token,
		User: &UserDTO{
			ID:       newUser.ID.String(),
			Email:    newUser.Email,
			Username: newUser.Username,
			FullName: newUser.FullName,
			Role:     newUser.Role.Name,
		},
		ExpiresIn: 24 * 60 * 60,
	})
}
