package domain

import (
	"time"
	"github.com/google/uuid"
)

// Incident représente une alerte ou un cas (Contrat avec TheHive)
type Incident struct {
	ID          uuid.UUID
	Title       string
	Status      string
	Severity    string
	CreatedAt   time.Time
	Description string 
    Source      string
    ExternalID  string
}

// Threat représente une information de menace (Contrat avec OpenCTI)
type Threat struct {
	ID          uuid.UUID
	Name        string
	TLP         string // Traffic Light Protocol
	ReportedAt  time.Time
}

// Control représente un contrôle de sécurité/conformité (Contrat avec OpenRMF)
type Control struct {
	ID          uuid.UUID
	Name        string
	Framework   string // Ex: NIST, ISO 27001
	Status      string // Implemented, Planned, N/A
}