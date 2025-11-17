package models

import (
	"time"

	"github.com/google/uuid"
)

// User represents a user in the system
type User struct {
	ID                   uuid.UUID  `json:"id"`
	Email                string     `json:"email"`
	Name                 string     `json:"name"`
	Role                 string     `json:"role"` // viewer, editor, admin
	Department           *string    `json:"department,omitempty"`
	OnboardingCompleted  bool       `json:"onboarding_completed"`
	OnboardingCompletedAt *time.Time `json:"onboarding_completed_at,omitempty"`
	CreatedAt            time.Time  `json:"created_at"`
	UpdatedAt            time.Time  `json:"updated_at"`
}

// BrandingConfig represents branding color palette configuration
type BrandingConfig struct {
	ID             uuid.UUID `json:"id"`
	OrganizationID string    `json:"organization_id"`
	LightColor     string    `json:"light_color"`
	PastelColor    string    `json:"pastel_color"`
	PrimaryColor   string    `json:"primary_color"`
	DarkColor      string    `json:"dark_color"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// Term represents a glossary term
type Term struct {
	ID                 uuid.UUID `json:"id"`
	Term               string    `json:"term"`
	BaseDefinition     string    `json:"base_definition"`
	Category           *string   `json:"category,omitempty"`
	CodeName           *string   `json:"code_name,omitempty"` // Code/system name for IT definitions
	Tags               []string  `json:"tags,omitempty"`
	ComplianceFrameworks []string `json:"compliance_frameworks,omitempty"` // e.g., 'BCBS 239', 'GDPR', 'FICA'
	VisibilityType     *string   `json:"visibility_type,omitempty"` // 'public' or 'department_restricted'
	AllowedDepartments []string  `json:"allowed_departments,omitempty"` // Which departments can see this term
	CreatedBy          *uuid.UUID `json:"created_by,omitempty"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
	UpdatedBy          *uuid.UUID `json:"updated_by,omitempty"`
	Contexts           []TermContext `json:"contexts,omitempty"`
	Examples           []TermExample `json:"examples,omitempty"`
	Relationships      []TermRelationship `json:"relationships,omitempty"`
}

// TermContext represents a contextual variation of a term
type TermContext struct {
	ID                uuid.UUID `json:"id"`
	TermID            uuid.UUID `json:"term_id"`
	Cluster           *string   `json:"cluster,omitempty"`
	System            *string   `json:"system,omitempty"`
	Product           *string   `json:"product,omitempty"`
	ContextDefinition string    `json:"context_definition"`
	BusinessRules     []string  `json:"business_rules,omitempty"`
	ComplianceRequired bool     `json:"compliance_required"`
	CreatedBy         *uuid.UUID `json:"created_by,omitempty"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
	UpdatedBy         *uuid.UUID `json:"updated_by,omitempty"`
}

// TermExample represents a usage example for a term
type TermExample struct {
	ID        uuid.UUID `json:"id"`
	TermID    uuid.UUID `json:"term_id"`
	ContextID *uuid.UUID `json:"context_id,omitempty"`
	ExampleText string  `json:"example_text"`
	Source    *string   `json:"source,omitempty"`
	CreatedBy *uuid.UUID `json:"created_by,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// TermRelationship represents a relationship between terms
type TermRelationship struct {
	ID              uuid.UUID `json:"id"`
	TermID          uuid.UUID `json:"term_id"`
	RelatedTermID   uuid.UUID `json:"related_term_id"`
	RelationshipType string  `json:"relationship_type"` // synonym, antonym, related, see_also, parent, child
	CreatedBy       *uuid.UUID `json:"created_by,omitempty"`
	CreatedAt       time.Time `json:"created_at"`
	RelatedTerm     *Term     `json:"related_term,omitempty"`
}

// TermProposal represents a proposed change to a term
type TermProposal struct {
	ID           uuid.UUID              `json:"id"`
	TermID       *uuid.UUID             `json:"term_id,omitempty"`
	ProposalType string                 `json:"proposal_type"` // create, update, delete, merge
	ProposedData map[string]interface{} `json:"proposed_data"`
	Reason       *string                `json:"reason,omitempty"`
	Status       string                 `json:"status"` // pending, approved, rejected
	ProposedBy   *uuid.UUID             `json:"proposed_by,omitempty"`
	ReviewedBy   *uuid.UUID             `json:"reviewed_by,omitempty"`
	ReviewedAt   *time.Time             `json:"reviewed_at,omitempty"`
	CreatedAt    time.Time              `json:"created_at"`
	UpdatedAt    time.Time              `json:"updated_at"`
}

// TermFlag represents a flagged issue with a term
type TermFlag struct {
	ID          uuid.UUID `json:"id"`
	TermID      uuid.UUID `json:"term_id"`
	FlagType    string    `json:"flag_type"` // inconsistency, outdated, duplicate, incorrect, other
	Description string    `json:"description"`
	Status      string    `json:"status"` // open, resolved, dismissed
	FlaggedBy   *uuid.UUID `json:"flagged_by,omitempty"`
	ResolvedBy  *uuid.UUID `json:"resolved_by,omitempty"`
	ResolvedAt  *time.Time `json:"resolved_at,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateTermRequest represents a request to create a new term
type CreateTermRequest struct {
	Term                string   `json:"term" binding:"required"`
	BaseDefinition      string   `json:"base_definition" binding:"required"`
	Category            *string  `json:"category,omitempty"`
	CodeName            *string  `json:"code_name,omitempty"`
	Tags                []string `json:"tags,omitempty"`
	ComplianceFrameworks []string `json:"compliance_frameworks,omitempty"`
}

// UpdateTermRequest represents a request to update a term
type UpdateTermRequest struct {
	Term                *string  `json:"term,omitempty"`
	BaseDefinition      *string  `json:"base_definition,omitempty"`
	Category            *string  `json:"category,omitempty"`
	CodeName            *string  `json:"code_name,omitempty"`
	Tags                []string `json:"tags,omitempty"`
	ComplianceFrameworks []string `json:"compliance_frameworks,omitempty"`
	ChangeReason        *string  `json:"change_reason,omitempty"`
}

// CreateContextRequest represents a request to create a term context
type CreateContextRequest struct {
	Cluster            *string  `json:"cluster,omitempty"`
	System             *string  `json:"system,omitempty"`
	Product            *string  `json:"product,omitempty"`
	ContextDefinition  string   `json:"context_definition" binding:"required"`
	BusinessRules      []string `json:"business_rules,omitempty"`
	ComplianceRequired *bool    `json:"compliance_required,omitempty"`
}

// CreateExampleRequest represents a request to create a term example
type CreateExampleRequest struct {
	ContextID   *uuid.UUID `json:"context_id,omitempty"`
	ExampleText string     `json:"example_text" binding:"required"`
	Source      *string    `json:"source,omitempty"`
}

// CreateRelationshipRequest represents a request to create a term relationship
type CreateRelationshipRequest struct {
	RelatedTermID   uuid.UUID `json:"related_term_id" binding:"required"`
	RelationshipType string   `json:"relationship_type" binding:"required"`
}

// SearchRequest represents a search query
type SearchRequest struct {
	Query    string   `json:"query" form:"q"`
	Category *string  `json:"category" form:"category"`
	Cluster  *string  `json:"cluster" form:"cluster"`
	System   *string  `json:"system" form:"system"`
	Tags     []string `json:"tags" form:"tags"`
	Limit    int      `json:"limit" form:"limit"`
	Offset   int      `json:"offset" form:"offset"`
}

// CreateProposalRequest represents a request to create a proposal
type CreateProposalRequest struct {
	TermID       *uuid.UUID              `json:"term_id,omitempty"`
	ProposalType string                  `json:"proposal_type" binding:"required"`
	ProposedData map[string]interface{}  `json:"proposed_data" binding:"required"`
	Reason       *string                 `json:"reason,omitempty"`
}

// CreateFlagRequest represents a request to create a flag
type CreateFlagRequest struct {
	FlagType    string `json:"flag_type" binding:"required"`
	Description string `json:"description" binding:"required"`
}

// Cluster represents a business cluster/division
type Cluster struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	OwnerID     *uuid.UUID `json:"owner_id,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// GapAnalysis represents a detected gap in terminology
type GapAnalysis struct {
	ID              uuid.UUID `json:"id"`
	TermID          uuid.UUID `json:"term_id"`
	GapType         string    `json:"gap_type"` // missing_context, conflicting_definition, outdated
	AffectedClusters []string  `json:"affected_clusters"`
	Severity        string    `json:"severity"` // high, medium, low
	Description     *string   `json:"description,omitempty"`
	DetectedAt      time.Time `json:"detected_at"`
	ResolvedAt      *time.Time `json:"resolved_at,omitempty"`
	ResolvedBy      *uuid.UUID `json:"resolved_by,omitempty"`
	Term            *Term     `json:"term,omitempty"`
}

// TermUsageLog represents a usage log entry for analytics
type TermUsageLog struct {
	ID        uuid.UUID `json:"id"`
	TermID    uuid.UUID `json:"term_id"`
	Cluster   *string   `json:"cluster,omitempty"`
	UserID    *uuid.UUID `json:"user_id,omitempty"`
	Action    string    `json:"action"` // viewed, searched, referenced
	CreatedAt time.Time `json:"created_at"`
}

// CreateClusterRequest represents a request to create a cluster
type CreateClusterRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description *string `json:"description,omitempty"`
}

// ResolveGapRequest represents a request to resolve a gap
type ResolveGapRequest struct {
	ResolvedBy *uuid.UUID `json:"resolved_by,omitempty"`
}

// Notification represents a user notification
type Notification struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Type      string    `json:"type"` // 'proposal', 'flag', 'gap_resolved', 'new_term'
	Message   string    `json:"message"`
	Read      bool      `json:"read"`
	CreatedAt time.Time `json:"created_at"`
}

// TermVersion represents a version of a term for audit trail
type TermVersion struct {
	ID           uuid.UUID              `json:"id"`
	TermID       uuid.UUID              `json:"term_id"`
	VersionNumber int                    `json:"version_number"`
	TermData     map[string]interface{} `json:"term_data"`
	ChangedBy    *uuid.UUID              `json:"changed_by,omitempty"`
	ChangeReason *string                 `json:"change_reason,omitempty"`
	CreatedAt    time.Time               `json:"created_at"`
}

// OnboardingPath represents a learning path for onboarding
type OnboardingPath struct {
	ID         uuid.UUID `json:"id"`
	Role       string    `json:"role"`
	Cluster    *string   `json:"cluster,omitempty"`
	TermIDs    []uuid.UUID `json:"term_ids"`
	OrderIndex *int      `json:"order_index,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
}

