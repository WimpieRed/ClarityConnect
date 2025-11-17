export interface User {
  id: string;
  email: string;
  name: string;
  role: 'viewer' | 'editor' | 'admin';
  department?: string;
  onboarding_completed: boolean;
  onboarding_completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BrandingConfig {
  id: string;
  organization_id: string;
  light_color: string;
  pastel_color: string;
  primary_color: string;
  dark_color: string;
  created_at: string;
  updated_at: string;
}

export interface Term {
  id: string;
  term: string;
  base_definition: string;
  category?: string;
  code_name?: string;
  tags?: string[];
  compliance_frameworks?: string[];
  visibility_type?: 'public' | 'department_restricted';
  allowed_departments?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  updated_by?: string;
  contexts?: TermContext[];
  examples?: TermExample[];
  relationships?: TermRelationship[];
}

export interface TermContext {
  id: string;
  term_id: string;
  cluster?: string;
  system?: string;
  product?: string;
  context_definition: string;
  business_rules?: string[];
  compliance_required: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface TermExample {
  id: string;
  term_id: string;
  context_id?: string;
  example_text: string;
  source?: string;
  created_by?: string;
  created_at: string;
}

export interface TermRelationship {
  id: string;
  term_id: string;
  related_term_id: string;
  relationship_type: 'synonym' | 'antonym' | 'related' | 'see_also' | 'parent' | 'child';
  created_by?: string;
  created_at: string;
  related_term?: Term;
}

export interface TermProposal {
  id: string;
  term_id?: string;
  proposal_type: 'create' | 'update' | 'delete' | 'merge';
  proposed_data: Record<string, any>;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  proposed_by?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TermFlag {
  id: string;
  term_id: string;
  flag_type: 'inconsistency' | 'outdated' | 'duplicate' | 'incorrect' | 'other';
  description: string;
  status: 'open' | 'resolved' | 'dismissed';
  flagged_by?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTermRequest {
  term: string;
  base_definition: string;
  category?: string;
  code_name?: string;
  tags?: string[];
  compliance_frameworks?: string[];
}

export interface UpdateTermRequest {
  term?: string;
  base_definition?: string;
  category?: string;
  code_name?: string;
  tags?: string[];
  compliance_frameworks?: string[];
}

export interface CreateContextRequest {
  cluster?: string;
  system?: string;
  product?: string;
  context_definition: string;
  business_rules?: string[];
  compliance_required?: boolean;
}

export interface CreateExampleRequest {
  context_id?: string;
  example_text: string;
  source?: string;
}

export interface CreateRelationshipRequest {
  related_term_id: string;
  relationship_type: string;
}

export interface CreateProposalRequest {
  term_id?: string;
  proposal_type: string;
  proposed_data: Record<string, any>;
  reason?: string;
}

export interface CreateFlagRequest {
  flag_type: string;
  description: string;
}

export interface SearchRequest {
  q: string;
  category?: string;
  cluster?: string;
  system?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface Cluster {
  id: string;
  name: string;
  description?: string;
  owner_id?: string;
  created_at: string;
  updated_at: string;
}

export interface GapAnalysis {
  id: string;
  term_id: string;
  gap_type: 'missing_context' | 'conflicting_definition' | 'outdated';
  affected_clusters: string[];
  severity: 'high' | 'medium' | 'low';
  description?: string;
  detected_at: string;
  resolved_at?: string;
  resolved_by?: string;
  term?: Term;
}

export interface ClusterCoverage {
  clusters: Array<{
    cluster: string;
    terms_with_context: number;
    total_terms: number;
    coverage_percent: number;
    gaps_count: number;
  }>;
  total_terms: number;
}

export interface GapAnalytics {
  total_gaps: number;
  resolved_gaps: number;
  gaps_by_type: Record<string, number>;
  gaps_by_severity: Record<string, number>;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'proposal' | 'flag' | 'gap_resolved' | 'new_term';
  message: string;
  read: boolean;
  created_at: string;
}

export interface TermVersion {
  id: string;
  term_id: string;
  version_number: number;
  term_data: Record<string, any>;
  changed_by?: string;
  change_reason?: string;
  created_at: string;
}

export interface VersionComparison {
  version1: TermVersion;
  version2: TermVersion;
  differences: Record<string, { old: any; new: any }>;
}

export interface OnboardingPath {
  id: string;
  role: string;
  cluster?: string;
  term_ids: string[];
  order_index?: number;
  created_at: string;
}

export interface AccessRequest {
  id: string;
  term_id: string;
  term_name?: string;
  requested_by?: string;
  requested_by_name?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_by_name?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAccessRequestRequest {
  term_id: string;
  reason: string;
}

