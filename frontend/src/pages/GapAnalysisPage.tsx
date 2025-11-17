import React, { useState, useEffect } from 'react';
import { gapApi, clusterApi, analyticsApi } from '../services/api';
import { GapAnalysis, Cluster, GapAnalytics, ClusterCoverage } from '../types';
import { GapFilters } from '../components/GapAnalysis/GapFilters';
import { GapList } from '../components/GapAnalysis/GapList';
import { CoverageMatrix } from '../components/GapAnalysis/CoverageMatrix';

const GapAnalysisPage: React.FC = () => {
  const [gaps, setGaps] = useState<GapAnalysis[]>([]);
  const [clusters, setClusters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [gapType, setGapType] = useState('');
  const [cluster, setCluster] = useState('');
  const [severity, setSeverity] = useState('');
  const [resolved, setResolved] = useState('');
  const [analytics, setAnalytics] = useState<GapAnalytics | null>(null);
  const [coverage, setCoverage] = useState<ClusterCoverage | null>(null);
  const [activeTab, setActiveTab] = useState<'gaps' | 'coverage'>('gaps');
  const limit = 20;

  useEffect(() => {
    loadClusters();
    loadGaps();
    loadAnalytics();
    loadCoverage();
  }, [page, gapType, cluster, severity, resolved]);

  const loadClusters = async () => {
    try {
      const clusterList = await clusterApi.list();
      setClusters(clusterList.map((c) => c.name));
    } catch (err) {
      console.error('Failed to load clusters:', err);
    }
  };

  const loadGaps = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gapApi.list({
        limit,
        offset: (page - 1) * limit,
        gap_type: gapType || undefined,
        cluster: cluster || undefined,
        severity: severity || undefined,
        resolved: resolved ? resolved === 'true' : undefined,
      });
      setGaps(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load gaps');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await analyticsApi.getGapAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  const loadCoverage = async () => {
    try {
      const data = await analyticsApi.getClusterCoverage();
      setCoverage(data);
    } catch (err) {
      console.error('Failed to load coverage:', err);
    }
  };

  const handleDetectGaps = async () => {
    try {
      setLoading(true);
      await gapApi.detect();
      await loadGaps();
      await loadAnalytics();
      await loadCoverage();
    } catch (err: any) {
      setError(err.message || 'Failed to detect gaps');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await gapApi.resolve(id);
      await loadGaps();
      await loadAnalytics();
    } catch (err: any) {
      setError(err.message || 'Failed to resolve gap');
    }
  };

  const handleClearFilters = () => {
    setGapType('');
    setCluster('');
    setSeverity('');
    setResolved('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">Gap Analysis</h1>
        <button
          onClick={handleDetectGaps}
          disabled={loading}
          className="bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Detecting...' : 'Detect Gaps'}
        </button>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-brand-primary mb-1">{analytics.total_gaps}</div>
            <div className="text-sm text-gray-600">Total Gaps</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">{analytics.resolved_gaps}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {analytics.gaps_by_type?.conflicting_definition || 0}
            </div>
            <div className="text-sm text-gray-600">Conflicts</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {analytics.gaps_by_severity?.high || 0}
            </div>
            <div className="text-sm text-gray-600">High Severity</div>
          </div>
        </div>
      )}

      <div className="flex space-x-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('gaps')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'gaps'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-gray-600 hover:text-brand-primary'
          }`}
        >
          Gaps
        </button>
        <button
          onClick={() => setActiveTab('coverage')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'coverage'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-gray-600 hover:text-brand-primary'
          }`}
        >
          Coverage Matrix
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
      )}

      {activeTab === 'gaps' && (
        <>
          <GapFilters
            gapType={gapType}
            cluster={cluster}
            severity={severity}
            resolved={resolved}
            onGapTypeChange={(value) => {
              setGapType(value);
              setPage(1);
            }}
            onClusterChange={(value) => {
              setCluster(value);
              setPage(1);
            }}
            onSeverityChange={(value) => {
              setSeverity(value);
              setPage(1);
            }}
            onResolvedChange={(value) => {
              setResolved(value);
              setPage(1);
            }}
            clusters={clusters}
            onClear={handleClearFilters}
          />

          <GapList gaps={gaps} onResolve={handleResolve} loading={loading} />

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-light"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-light"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'coverage' && coverage && (
        <CoverageMatrix coverage={coverage} />
      )}
    </div>
  );
};

export default GapAnalysisPage;

