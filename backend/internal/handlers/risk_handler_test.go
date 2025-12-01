package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/opendefender/openrisk/database"
	"github.com/opendefender/openrisk/internal/core/domain"
)

func setupAppWithDB(t *testing.T) *fiber.App {
	// In-memory SQLite for fast tests
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open sqlite: %v", err)
	}

	// migrate schema
	if err := db.AutoMigrate(&domain.User{}, &domain.Risk{}, &domain.Mitigation{}, &domain.Asset{}, &domain.RiskHistory{}); err != nil {
		t.Fatalf("auto migrate failed: %v", err)
	}

	// replace global DB used by handlers
	database.DB = db

	app := fiber.New()
	api := app.Group("/api/v1")
	api.Post("/risks", CreateRisk)
	api.Get("/risks/:id", GetRisk)
	api.Patch("/risks/:id", UpdateRisk)
	api.Delete("/risks/:id", DeleteRisk)

	return app
}

func TestRiskCRUDFlow(t *testing.T) {
	app := setupAppWithDB(t)

	// 1. Create risk
	payload := map[string]interface{}{
		"title":       "Test Risk",
		"description": "desc",
		"impact":      3,
		"probability": 4,
	}
	b, _ := json.Marshal(payload)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/risks", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)
	if resp.StatusCode != 201 {
		t.Fatalf("expected 201 got %d", resp.StatusCode)
	}

	var created domain.Risk
	json.NewDecoder(resp.Body).Decode(&created)
	if created.ID == uuid.Nil {
		t.Fatalf("expected created id, got nil")
	}

	// 2. Get risk
	getReq := httptest.NewRequest(http.MethodGet, "/api/v1/risks/"+created.ID.String(), nil)
	getResp, _ := app.Test(getReq)
	if getResp.StatusCode != 200 {
		t.Fatalf("expected 200 got %d", getResp.StatusCode)
	}

	// 3. Update risk
	updatePayload := map[string]interface{}{"title": "Updated", "impact": 5}
	ub, _ := json.Marshal(updatePayload)
	upReq := httptest.NewRequest(http.MethodPatch, "/api/v1/risks/"+created.ID.String(), bytes.NewReader(ub))
	upReq.Header.Set("Content-Type", "application/json")
	upResp, _ := app.Test(upReq)
	if upResp.StatusCode != 200 {
		t.Fatalf("expected 200 on update got %d", upResp.StatusCode)
	}

	var updated domain.Risk
	json.NewDecoder(upResp.Body).Decode(&updated)
	if updated.Title != "Updated" || updated.Impact != 5 {
		t.Fatalf("update did not apply: %+v", updated)
	}

	// 4. Delete
	delReq := httptest.NewRequest(http.MethodDelete, "/api/v1/risks/"+created.ID.String(), nil)
	delResp, _ := app.Test(delReq)
	if delResp.StatusCode != 204 {
		t.Fatalf("expected 204 on delete got %d", delResp.StatusCode)
	}
}

func TestCreateValidationFail(t *testing.T) {
	app := setupAppWithDB(t)

	// Missing required title
	payload := map[string]interface{}{"impact": 3, "probability": 4}
	b, _ := json.Marshal(payload)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/risks", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)
	if resp.StatusCode != 400 {
		t.Fatalf("expected 400 got %d", resp.StatusCode)
	}
}
