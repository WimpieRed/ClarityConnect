import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Term, GapAnalysis } from '../types';
import { complianceApi } from '../services/api';

const ComplianceDashboardPage: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<string>('BCBS 239');
  const [dashboard, setDashboard] = useState<any>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [gaps, setGaps] = useState<GapAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const frameworks = ['BCBS 239', 'GDPR', 'FICA', 'Basel III', 'All'];

  useEffect(() => {
    loadDashboard();
    loadTerms();
    loadGaps();
  }, [selectedFramework]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const framework = selectedFramework === 'All' ? undefined : selectedFramework;
      const data = await complianceApi.getDashboard(framework);
      setDashboard(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadTerms = async () => {
    try {
      if (selectedFramework === 'All') {
        setTerms([]);
        return;
      }
      const data = await complianceApi.getTerms(selectedFramework);
      setTerms(data.data || []);
    } catch (err: any) {
      console.error('Failed to load terms:', err);
    }
  };

  const loadGaps = async () => {
    try {
      const framework = selectedFramework === 'All' ? undefined : selectedFramework;
      const data = await complianceApi.getGaps(framework);
      setGaps(data.data || []);
    } catch (err: any) {
      console.error('Failed to load gaps:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">Compliance Dashboard</h1>
        <Link
          to="/analytics"
          className="text-brand-primary hover:text-brand-dark text-sm"
        >
          View Analytics →
        </Link>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-brand-dark mb-2">
          Select Compliance Framework
        </label>
        <select
          value={selectedFramework}
          onChange={(e) => setSelectedFramework(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
        >
          {frameworks.map((fw) => (
            <option key={fw} value={fw}>
              {fw}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
      )}

      {loading && <div className="text-center py-8">Loading...</div>}

      {dashboard && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-brand-primary mb-2">
              {dashboard.total_terms || 0}
            </div>
            <div className="text-gray-600">Total Terms</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {dashboard.terms_with_compliance_context || 0}
            </div>
            <div className="text-gray-600">With Compliance Context</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {dashboard.clusters_covered || 0}
            </div>
            <div className="text-gray-600">Clusters Covered</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {dashboard.coverage_percent ? dashboard.coverage_percent.toFixed(1) : 0}%
            </div>
            <div className="text-gray-600">Coverage</div>
          </div>
        </div>
      )}

      {gaps.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-brand-dark mb-4">Compliance Gaps</h2>
          <div className="space-y-3">
            {gaps.map((gap) => (
              <div key={gap.id} className="border-l-4 border-red-500 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    gap.severity === 'high' ? 'bg-red-100 text-red-800' :
                    gap.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {gap.severity}
                  </span>
                  <span className="text-sm text-gray-600">{gap.gap_type}</span>
                </div>
                {gap.description && (
                  <p className="text-sm text-gray-700">{gap.description}</p>
                )}
                {gap.affected_clusters && gap.affected_clusters.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Affected: {gap.affected_clusters.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {terms.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-brand-dark mb-4">
            Terms for {selectedFramework}
          </h2>
          <div className="space-y-3">
            {terms.map((term) => (
              <Link
                key={term.id}
                to={`/terms/${term.id}`}
                className="block p-3 rounded-lg hover:bg-brand-light transition-colors"
              >
                <div className="font-medium text-brand-primary">{term.term}</div>
                <div className="text-sm text-gray-600 line-clamp-1">{term.base_definition}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceDashboardPage;

