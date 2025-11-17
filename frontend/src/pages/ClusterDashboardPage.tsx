import React, { useState, useEffect } from 'react';
import { clusterApi, gapApi, analyticsApi } from '../services/api';
import { Cluster, Term, GapAnalysis, ClusterCoverage } from '../types';
import { ClusterStats } from '../components/ClusterDashboard/ClusterStats';
import { ClusterTerms } from '../components/ClusterDashboard/ClusterTerms';
import { ClusterGaps } from '../components/ClusterDashboard/ClusterGaps';

const ClusterDashboardPage: React.FC = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string>('');
  const [terms, setTerms] = useState<Term[]>([]);
  const [gaps, setGaps] = useState<GapAnalysis[]>([]);
  const [coverage, setCoverage] = useState<ClusterCoverage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'terms' | 'gaps'>('terms');

  useEffect(() => {
    loadClusters();
    loadCoverage();
  }, []);

  useEffect(() => {
    if (selectedCluster) {
      loadClusterData();
    }
  }, [selectedCluster]);

  const loadClusters = async () => {
    try {
      const clusterList = await clusterApi.list();
      setClusters(clusterList);
      if (clusterList.length > 0 && !selectedCluster) {
        setSelectedCluster(clusterList[0].name);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load clusters');
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

  const loadClusterData = async () => {
    if (!selectedCluster) return;

    try {
      setLoading(true);
      setError(null);

      const [termsData, gapsData] = await Promise.all([
        clusterApi.getTerms(selectedCluster),
        gapApi.list({ cluster: selectedCluster, resolved: false, limit: 100 }),
      ]);

      setTerms(termsData);
      setGaps(gapsData.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load cluster data');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveGap = async (id: string) => {
    try {
      await gapApi.resolve(id);
      await loadClusterData();
    } catch (err: any) {
      setError(err.message || 'Failed to resolve gap');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Cluster Dashboard</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-brand-dark mb-2">
          Select Cluster
        </label>
        <select
          value={selectedCluster}
          onChange={(e) => setSelectedCluster(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
        >
          <option value="">Select a cluster...</option>
          {clusters.map((cluster) => (
            <option key={cluster.id} value={cluster.name}>
              {cluster.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
      )}

      {selectedCluster && (
        <>
          <ClusterStats clusterName={selectedCluster} coverage={coverage || undefined} />

          <div className="flex space-x-4 mb-6 border-b border-gray-300">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'terms'
                  ? 'text-brand-primary border-b-2 border-brand-primary'
                  : 'text-gray-600 hover:text-brand-primary'
              }`}
            >
              Terms ({terms.length})
            </button>
            <button
              onClick={() => setActiveTab('gaps')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'gaps'
                  ? 'text-brand-primary border-b-2 border-brand-primary'
                  : 'text-gray-600 hover:text-brand-primary'
              }`}
            >
              Gaps ({gaps.length})
            </button>
          </div>

          {activeTab === 'terms' && (
            <ClusterTerms terms={terms} loading={loading} />
          )}

          {activeTab === 'gaps' && (
            <ClusterGaps gaps={gaps} onResolve={handleResolveGap} loading={loading} />
          )}
        </>
      )}

      {!selectedCluster && (
        <div className="text-center py-8 text-gray-500">
          Please select a cluster to view its dashboard
        </div>
      )}
    </div>
  );
};

export default ClusterDashboardPage;

