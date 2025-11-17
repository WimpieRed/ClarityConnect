import axios from 'axios';
import {
  Term,
  CreateTermRequest,
  UpdateTermRequest,
  CreateContextRequest,
  CreateExampleRequest,
  CreateRelationshipRequest,
  CreateProposalRequest,
  CreateFlagRequest,
  TermProposal,
  TermFlag,
  BrandingConfig,
  PaginatedResponse,
  SearchRequest,
  GapAnalysis,
  Cluster,
  ClusterCoverage,
  GapAnalytics,
  TermContext,
  AccessRequest,
  CreateAccessRequestRequest,
  Notification,
  TermVersion,
  VersionComparison,
} from '../types';
import { mockApi } from './mockData';

// Set to true to use mock data instead of real API
const USE_MOCK_DATA = true;

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api/v1' : 'http://localhost:3001/api/v1');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include user department header
api.interceptors.request.use((config) => {
  const department = localStorage.getItem('clarityconnect_user_department');
  if (department) {
    config.headers['X-User-Department'] = department;
  }
  return config;
});

// Terms API
export const termsApi = {
  list: async (params?: { limit?: number; offset?: number; category?: string }): Promise<PaginatedResponse<Term>> => {
    if (USE_MOCK_DATA) return mockApi.terms.list(params);
    const response = await api.get('/terms', { params });
    return response.data;
  },

  get: async (id: string): Promise<Term> => {
    if (USE_MOCK_DATA) return mockApi.terms.get(id);
    const response = await api.get(`/terms/${id}`);
    return response.data;
  },

  create: async (data: CreateTermRequest): Promise<Term> => {
    if (USE_MOCK_DATA) return mockApi.terms.create(data);
    const response = await api.post('/terms', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTermRequest): Promise<Term> => {
    if (USE_MOCK_DATA) return mockApi.terms.update(id, data);
    const response = await api.put(`/terms/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) return mockApi.terms.delete(id);
    await api.delete(`/terms/${id}`);
  },

  createContext: async (termId: string, data: CreateContextRequest) => {
    if (USE_MOCK_DATA) return mockApi.terms.createContext(termId, data);
    const response = await api.post(`/terms/${termId}/contexts`, data);
    return response.data;
  },

  createExample: async (termId: string, data: CreateExampleRequest) => {
    if (USE_MOCK_DATA) return mockApi.terms.createExample(termId, data);
    const response = await api.post(`/terms/${termId}/examples`, data);
    return response.data;
  },

  createRelationship: async (termId: string, data: CreateRelationshipRequest) => {
    if (USE_MOCK_DATA) return mockApi.terms.createRelationship(termId, data);
    const response = await api.post(`/terms/${termId}/relationships`, data);
    return response.data;
  },
};

// Search API
export const searchApi = {
  search: async (params: SearchRequest): Promise<PaginatedResponse<Term>> => {
    if (USE_MOCK_DATA) return mockApi.search.search(params);
    const response = await api.get('/search', { params });
    return response.data;
  },
};

// Governance API
export const governanceApi = {
  proposals: {
    list: async (params?: { limit?: number; offset?: number; status?: string }): Promise<PaginatedResponse<TermProposal>> => {
      if (USE_MOCK_DATA) return mockApi.governance.proposals.list(params);
      const response = await api.get('/proposals', { params });
      return response.data;
    },

    get: async (id: string): Promise<TermProposal> => {
      if (USE_MOCK_DATA) return mockApi.governance.proposals.get(id);
      const response = await api.get(`/proposals/${id}`);
      return response.data;
    },

    create: async (data: CreateProposalRequest): Promise<TermProposal> => {
      if (USE_MOCK_DATA) return mockApi.governance.proposals.create(data);
      const response = await api.post('/proposals', data);
      return response.data;
    },

    updateStatus: async (id: string, status: 'approved' | 'rejected'): Promise<TermProposal> => {
      if (USE_MOCK_DATA) return mockApi.governance.proposals.updateStatus(id, status);
      const response = await api.patch(`/proposals/${id}/status`, { status });
      return response.data;
    },
  },

  flags: {
    list: async (params?: { limit?: number; offset?: number; term_id?: string; status?: string }): Promise<PaginatedResponse<TermFlag>> => {
      if (USE_MOCK_DATA) return mockApi.governance.flags.list(params);
      const response = await api.get('/flags', { params });
      return response.data;
    },

    get: async (id: string): Promise<TermFlag> => {
      if (USE_MOCK_DATA) return mockApi.governance.flags.get(id);
      const response = await api.get(`/flags/${id}`);
      return response.data;
    },

    create: async (termId: string, data: CreateFlagRequest): Promise<TermFlag> => {
      if (USE_MOCK_DATA) return mockApi.governance.flags.create(termId, data);
      const response = await api.post(`/terms/${termId}/flags`, data);
      return response.data;
    },

    updateStatus: async (id: string, status: 'open' | 'resolved' | 'dismissed'): Promise<TermFlag> => {
      if (USE_MOCK_DATA) return mockApi.governance.flags.updateStatus(id, status);
      const response = await api.patch(`/flags/${id}/status`, { status });
      return response.data;
    },
  },
};

// Branding API
export const brandingApi = {
  get: async (organizationId?: string): Promise<BrandingConfig> => {
    if (USE_MOCK_DATA) return mockApi.branding.get(organizationId);
    const response = await api.get('/branding', { params: { organization_id: organizationId } });
    return response.data;
  },

  update: async (config: Partial<BrandingConfig>, organizationId?: string): Promise<BrandingConfig> => {
    if (USE_MOCK_DATA) return mockApi.branding.update(config, organizationId);
    const response = await api.put('/branding', config, { params: { organization_id: organizationId } });
    return response.data;
  },
};

// Compliance API
export const complianceApi = {
  getDashboard: async (framework?: string): Promise<any> => {
    if (USE_MOCK_DATA) return mockApi.compliance.getDashboard(framework);
    const response = await api.get('/compliance/dashboard', { params: { framework } });
    return response.data;
  },

  getTerms: async (framework: string): Promise<{ data: Term[]; total: number }> => {
    if (USE_MOCK_DATA) return mockApi.compliance.getTerms(framework);
    const response = await api.get('/compliance/terms', { params: { framework } });
    return response.data;
  },

  getGaps: async (framework?: string): Promise<{ data: GapAnalysis[]; total: number }> => {
    if (USE_MOCK_DATA) return mockApi.compliance.getGaps(framework);
    const response = await api.get('/compliance/gaps', { params: { framework } });
    return response.data;
  },
};

// Usage API
export const usageApi = {
  getTermViewCount: async (termId: string): Promise<{ term_id: string; view_count: number }> => {
    if (USE_MOCK_DATA) return { term_id: termId, view_count: 0 };
    const response = await api.get(`/terms/${termId}/views`);
    return response.data;
  },

  getRecentlyViewed: async (limit?: number): Promise<{ data: Array<{ term_id: string; term: string; base_definition: string; last_viewed: string }> }> => {
    if (USE_MOCK_DATA) return { data: [] };
    const response = await api.get('/usage/recently-viewed', { params: { limit } });
    return response.data;
  },
};

// Gap Analysis API
export const gapApi = {
  list: async (params?: {
    limit?: number;
    offset?: number;
    gap_type?: string;
    cluster?: string;
    severity?: string;
    resolved?: boolean;
  }): Promise<PaginatedResponse<GapAnalysis>> => {
    if (USE_MOCK_DATA) return mockApi.gaps.list(params);
    const response = await api.get('/gaps', { params });
    return response.data;
  },

  get: async (id: string): Promise<GapAnalysis> => {
    if (USE_MOCK_DATA) return mockApi.gaps.get(id);
    const response = await api.get(`/gaps/${id}`);
    return response.data;
  },

  detect: async (): Promise<{ message: string; gaps_detected: number; gaps: GapAnalysis[] }> => {
    if (USE_MOCK_DATA) return mockApi.gaps.detect();
    const response = await api.post('/gaps/detect');
    return response.data;
  },

  resolve: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) return mockApi.gaps.resolve(id);
    await api.patch(`/gaps/${id}/resolve`);
  },
};

// Cluster API
export const clusterApi = {
  list: async (): Promise<Cluster[]> => {
    if (USE_MOCK_DATA) return mockApi.clusters.list();
    const response = await api.get('/clusters');
    return response.data;
  },

  getTerms: async (clusterName: string): Promise<Term[]> => {
    if (USE_MOCK_DATA) return mockApi.clusters.getTerms(clusterName);
    const response = await api.get(`/clusters/${encodeURIComponent(clusterName)}/terms`);
    return response.data;
  },

  getComparison: async (clusterName: string): Promise<any> => {
    if (USE_MOCK_DATA) return mockApi.clusters.getComparison(clusterName);
    const response = await api.get(`/clusters/${encodeURIComponent(clusterName)}/comparison`);
    return response.data;
  },
};

// Analytics API
export const analyticsApi = {
  getGapAnalytics: async (): Promise<GapAnalytics> => {
    if (USE_MOCK_DATA) return mockApi.analytics.getGapAnalytics();
    const response = await api.get('/analytics/gaps');
    return response.data;
  },

  getClusterCoverage: async (): Promise<ClusterCoverage> => {
    if (USE_MOCK_DATA) return mockApi.analytics.getClusterCoverage();
    const response = await api.get('/analytics/cluster-coverage');
    return response.data;
  },
};

// Term Cluster Comparison API
export const termClusterApi = {
  getComparison: async (termId: string): Promise<Record<string, TermContext[]>> => {
    if (USE_MOCK_DATA) return mockApi.termCluster.getComparison(termId);
    const response = await api.get(`/terms/${termId}/cluster-comparison`);
    return response.data;
  },
};

// Access Requests API
export const accessRequestsApi = {
  list: async (): Promise<PaginatedResponse<AccessRequest>> => {
    if (USE_MOCK_DATA) return mockApi.accessRequests.list();
    const response = await api.get('/access-requests');
    return response.data;
  },

  get: async (id: string): Promise<AccessRequest> => {
    if (USE_MOCK_DATA) return mockApi.accessRequests.get(id);
    const response = await api.get(`/access-requests/${id}`);
    return response.data;
  },

  create: async (data: CreateAccessRequestRequest): Promise<AccessRequest> => {
    if (USE_MOCK_DATA) return mockApi.accessRequests.create(data);
    const response = await api.post('/access-requests', data);
    return response.data;
  },
};

// Onboarding API
export const onboardingApi = {
  getProgress: async (): Promise<any> => {
    if (USE_MOCK_DATA) return mockApi.onboarding.getProgress();
    const response = await api.get('/onboarding/progress');
    return response.data;
  },

  getPath: async (params: { role: string; cluster?: string }): Promise<{ term_ids: string[] }> => {
    if (USE_MOCK_DATA) return mockApi.onboarding.getPath(params);
    const response = await api.get('/onboarding/path', { params });
    return response.data;
  },

  complete: async (): Promise<void> => {
    if (USE_MOCK_DATA) return mockApi.onboarding.complete();
    await api.post('/onboarding/complete');
  },
};

// Notifications API
export const notificationsApi = {
  list: async (): Promise<Notification[]> => {
    if (USE_MOCK_DATA) return mockApi.notifications.list();
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    if (USE_MOCK_DATA) return mockApi.notifications.markAsRead(id);
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<void> => {
    if (USE_MOCK_DATA) return mockApi.notifications.markAllAsRead();
    await api.patch('/notifications/read-all');
  },
};

// Versions API
export const versionsApi = {
  list: async (termId: string): Promise<TermVersion[]> => {
    if (USE_MOCK_DATA) return mockApi.versions.list(termId);
    const response = await api.get(`/terms/${termId}/versions`);
    return response.data;
  },

  get: async (versionId: string): Promise<TermVersion> => {
    if (USE_MOCK_DATA) return mockApi.versions.get(versionId);
    const response = await api.get(`/versions/${versionId}`);
    return response.data;
  },

  compare: async (version1Id: string, version2Id: string): Promise<VersionComparison> => {
    if (USE_MOCK_DATA) return mockApi.versions.compare(version1Id, version2Id);
    const response = await api.get('/versions/compare', {
      params: { version1: version1Id, version2: version2Id },
    });
    return response.data;
  },

  rollback: async (termId: string, versionId: string): Promise<Term> => {
    if (USE_MOCK_DATA) return mockApi.versions.rollback(termId, versionId);
    const response = await api.post(`/terms/${termId}/rollback`, { version_id: versionId });
    return response.data;
  },
};

export default api;

