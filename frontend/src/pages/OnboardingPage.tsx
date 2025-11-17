import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Term } from '../types';
import { onboardingApi, termsApi } from '../services/api';

const OnboardingPage: React.FC = () => {
  const [role, setRole] = useState<string>('viewer');
  const [cluster, setCluster] = useState<string>('');
  const [progress, setProgress] = useState<any>(null);
  const [pathTerms, setPathTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (role) {
      loadPath();
    }
  }, [role, cluster]);

  const loadProgress = async () => {
    try {
      const data = await onboardingApi.getProgress();
      setProgress(data);
    } catch (err: any) {
      console.error('Failed to load progress:', err);
    }
  };

  const loadPath = async () => {
    try {
      setLoading(true);
      const path = await onboardingApi.getPath({ role, cluster: cluster || undefined });
      
      // Load term details for the path
      if (path.term_ids && path.term_ids.length > 0) {
        const termPromises = path.term_ids.slice(0, 10).map((id: string) =>
          termsApi.get(id)
        );
        const terms = await Promise.all(termPromises);
        setPathTerms(terms);
      } else {
        setPathTerms([]);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load onboarding path');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await onboardingApi.complete();
      await loadProgress();
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Onboarding</h1>

      {progress && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-brand-dark mb-4">Your Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {progress.viewed_count || 0} of {progress.total_count || 0} terms viewed
              </span>
              <span className="text-sm font-medium text-brand-primary">
                {progress.progress_percent ? progress.progress_percent.toFixed(1) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-brand-primary h-3 rounded-full transition-all"
                style={{ width: `${Math.min(100, progress.progress_percent || 0)}%` }}
              ></div>
            </div>
          </div>
          {!progress.onboarding_completed && (
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Mark Onboarding Complete
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">Learning Path</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-2">
              Cluster (Optional)
            </label>
            <input
              type="text"
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
              placeholder="e.g., Risk Management"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
      )}

      {loading && <div className="text-center py-8">Loading...</div>}

      {pathTerms.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-brand-dark mb-4">Essential Terms</h2>
          <div className="space-y-3">
            {pathTerms.map((term) => (
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

      {!loading && pathTerms.length === 0 && role && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          No onboarding path found for this role and cluster combination.
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;

