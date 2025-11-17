-- ClarityConnect Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table (for governance tracking, even without auth initially)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin')),
    department VARCHAR(100), -- User's department/cluster
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Branding configuration table
CREATE TABLE IF NOT EXISTS branding_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id VARCHAR(255) DEFAULT 'default',
    light_color VARCHAR(7) DEFAULT '#EAF9E7',
    pastel_color VARCHAR(7) DEFAULT '#C0E6BA',
    primary_color VARCHAR(7) DEFAULT '#4CA771',
    dark_color VARCHAR(7) DEFAULT '#013237',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id)
);

-- Terms table - main glossary entries
CREATE TABLE IF NOT EXISTS terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term VARCHAR(255) NOT NULL,
    base_definition TEXT NOT NULL,
    category VARCHAR(100),
    code_name VARCHAR(255), -- Code/system name for IT definitions (e.g., API endpoint, system identifier)
    tags TEXT[], -- Array of tags for categorization
    compliance_frameworks TEXT[], -- Array of compliance frameworks (e.g., 'BCBS 239', 'GDPR', 'FICA')
    visibility_type VARCHAR(50) DEFAULT 'public' CHECK (visibility_type IN ('public', 'department_restricted')),
    allowed_departments TEXT[], -- Which departments can see this term (when visibility_type is 'department_restricted')
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

-- Create GIN index for full-text search on terms
CREATE INDEX IF NOT EXISTS idx_terms_search ON terms USING gin(to_tsvector('english', term || ' ' || COALESCE(base_definition, '')));

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_terms_category ON terms(category);

-- Term contexts - contextual variations across clusters/systems
CREATE TABLE IF NOT EXISTS term_contexts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_id UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    cluster VARCHAR(100),
    system VARCHAR(100),
    product VARCHAR(100),
    context_definition TEXT NOT NULL,
    business_rules TEXT[], -- Array of business rules for this context
    compliance_required BOOLEAN DEFAULT FALSE, -- Whether this context requires compliance tracking
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

-- Create indexes for context filtering
CREATE INDEX IF NOT EXISTS idx_term_contexts_term_id ON term_contexts(term_id);
CREATE INDEX IF NOT EXISTS idx_term_contexts_cluster ON term_contexts(cluster);
CREATE INDEX IF NOT EXISTS idx_term_contexts_system ON term_contexts(system);

-- Term examples - real-world usage examples
CREATE TABLE IF NOT EXISTS term_examples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_id UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    context_id UUID REFERENCES term_contexts(id) ON DELETE CASCADE,
    example_text TEXT NOT NULL,
    source VARCHAR(255),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for examples lookup
CREATE INDEX IF NOT EXISTS idx_term_examples_term_id ON term_examples(term_id);
CREATE INDEX IF NOT EXISTS idx_term_examples_context_id ON term_examples(context_id);

-- Term relationships - related terms, synonyms, antonyms
CREATE TABLE IF NOT EXISTS term_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_id UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    related_term_id UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL CHECK (relationship_type IN ('synonym', 'antonym', 'related', 'see_also', 'parent', 'child')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(term_id, related_term_id, relationship_type)
);

-- Create indexes for relationships
CREATE INDEX IF NOT EXISTS idx_term_relationships_term_id ON term_relationships(term_id);
CREATE INDEX IF NOT EXISTS idx_term_relationships_related_term_id ON term_relationships(related_term_id);

-- Term proposals - proposed updates/changes
CREATE TABLE IF NOT EXISTS term_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_id UUID REFERENCES terms(id) ON DELETE CASCADE,
    proposal_type VARCHAR(50) NOT NULL CHECK (proposal_type IN ('create', 'update', 'delete', 'merge')),
    proposed_data JSONB, -- Flexible JSON structure for proposed changes
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    proposed_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for proposals
CREATE INDEX IF NOT EXISTS idx_term_proposals_term_id ON term_proposals(term_id);
CREATE INDEX IF NOT EXISTS idx_term_proposals_status ON term_proposals(status);
CREATE INDEX IF NOT EXISTS idx_term_proposals_proposed_by ON term_proposals(proposed_by);

-- Term flags - flagged inconsistencies or issues
CREATE TABLE IF NOT EXISTS term_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_id UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    flag_type VARCHAR(50) NOT NULL CHECK (flag_type IN ('inconsistency', 'outdated', 'duplicate', 'incorrect', 'other')),
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
    flagged_by UUID REFERENCES users(id),
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for flags
CREATE INDEX IF NOT EXISTS idx_term_flags_term_id ON term_flags(term_id);
CREATE INDEX IF NOT EXISTS idx_term_flags_status ON term_flags(status);

-- Clusters table - Manage cluster metadata and ownership
CREATE TABLE IF NOT EXISTS clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for cluster name lookup
CREATE INDEX IF NOT EXISTS idx_clusters_name ON clusters(name);

-- Gap analyses table - Track detected gaps (missing contexts, conflicting definitions, outdated info)
CREATE TABLE IF NOT EXISTS gap_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_id UUID REFERENCES terms(id) ON DELETE CASCADE,
    gap_type VARCHAR(50) NOT NULL CHECK (gap_type IN ('missing_context', 'conflicting_definition', 'outdated')),
    affected_clusters TEXT[] NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('high', 'medium', 'low')),
    description TEXT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id)
);

-- Create indexes for gap analyses
CREATE INDEX IF NOT EXISTS idx_gap_analyses_term_id ON gap_analyses(term_id);
CREATE INDEX IF NOT EXISTS idx_gap_analyses_gap_type ON gap_analyses(gap_type);
CREATE INDEX IF NOT EXISTS idx_gap_analyses_severity ON gap_analyses(severity);
CREATE INDEX IF NOT EXISTS idx_gap_analyses_resolved_at ON gap_analyses(resolved_at) WHERE resolved_at IS NULL;

-- Term usage logs table (optional) - Track term usage for analytics
CREATE TABLE IF NOT EXISTS term_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_id UUID REFERENCES terms(id) ON DELETE CASCADE,
    cluster VARCHAR(100),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- 'viewed', 'searched', 'referenced'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for term usage logs
CREATE INDEX IF NOT EXISTS idx_term_usage_logs_term_id ON term_usage_logs(term_id);
CREATE INDEX IF NOT EXISTS idx_term_usage_logs_cluster ON term_usage_logs(cluster);
CREATE INDEX IF NOT EXISTS idx_term_usage_logs_created_at ON term_usage_logs(created_at);

-- Onboarding paths table - Define learning paths for different roles
CREATE TABLE IF NOT EXISTS onboarding_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(100) NOT NULL,
    cluster VARCHAR(100),
    term_ids UUID[] NOT NULL,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for onboarding paths
CREATE INDEX IF NOT EXISTS idx_onboarding_paths_role ON onboarding_paths(role);
CREATE INDEX IF NOT EXISTS idx_onboarding_paths_cluster ON onboarding_paths(cluster);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'proposal', 'flag', 'gap_resolved', 'new_term'
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read) WHERE read = FALSE;

-- Term versions table - Audit trail for term changes
CREATE TABLE IF NOT EXISTS term_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_id UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    term_data JSONB NOT NULL, -- Full term snapshot
    changed_by UUID REFERENCES users(id),
    change_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for term versions
CREATE INDEX IF NOT EXISTS idx_term_versions_term_id ON term_versions(term_id);
CREATE INDEX IF NOT EXISTS idx_term_versions_version ON term_versions(term_id, version_number);

-- Create index for compliance frameworks
CREATE INDEX IF NOT EXISTS idx_terms_compliance_frameworks ON terms USING gin(compliance_frameworks);

-- Insert default branding configuration
INSERT INTO branding_config (organization_id, light_color, pastel_color, primary_color, dark_color)
VALUES ('default', '#EAF9E7', '#C0E6BA', '#4CA771', '#013237')
ON CONFLICT (organization_id) DO NOTHING;

-- Create a default admin user (for POC, can be removed when auth is added)
INSERT INTO users (id, email, name, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@clarityconnect.local', 'System Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

