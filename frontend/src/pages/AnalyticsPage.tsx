import React, { useState, useEffect } from 'react';
import { termsApi, analyticsApi } from '../services/api';
import { Term, GapAnalytics, ClusterCoverage } from '../types';

const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTerms: 0,
    categories: {} as Record<string, number>,
    topTerms: [] as Array<{ term: string; views: number }>,
    tags: {} as Record<string, number>,
    recentTerms: [] as Term[],
  });
  const [gapAnalytics, setGapAnalytics] = useState<GapAnalytics | null>(null);
  const [clusterCoverage, setClusterCoverage] = useState<ClusterCoverage | null>(null);

  useEffect(() => {
    loadAnalytics();
    loadGapAnalytics();
    loadClusterCoverage();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await termsApi.list({ limit: 10000 });
      const allTerms = response.data;

      setTerms(allTerms);

      // Calculate statistics
      const categories: Record<string, number> = {};
      const tags: Record<string, number> = {};
      
      allTerms.forEach(term => {
        // Category stats
        if (term.category) {
          categories[term.category] = (categories[term.category] || 0) + 1;
        }
        
        // Tag stats
        term.tags?.forEach(tag => {
          tags[tag] = (tags[tag] || 0) + 1;
        });
      });

      // Get recent terms (last 5)
      const recentTerms = [...allTerms]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      // Simulate views (in real app, this would come from analytics)
      const topTerms = allTerms
        .map(term => ({
          term: term.term,
          views: Math.floor(Math.random() * 100) + 1, // Simulated
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      setStats({
        totalTerms: allTerms.length,
        categories,
        topTerms,
        tags,
        recentTerms,
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGapAnalytics = async () => {
    try {
      const data = await analyticsApi.getGapAnalytics();
      setGapAnalytics(data);
    } catch (error) {
      console.error('Failed to load gap analytics:', error);
    }
  };

  const loadClusterCoverage = async () => {
    try {
      const data = await analyticsApi.getClusterCoverage();
      setClusterCoverage(data);
    } catch (error) {
      console.error('Failed to load cluster coverage:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  const topCategories = Object.entries(stats.categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topTags = Object.entries(stats.tags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-brand-primary mb-2">{stats.totalTerms}</div>
          <div className="text-gray-600">Total Terms</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-brand-primary mb-2">{Object.keys(stats.categories).length}</div>
          <div className="text-gray-600">Categories</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-brand-primary mb-2">{Object.keys(stats.tags).length}</div>
          <div className="text-gray-600">Unique Tags</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-brand-primary mb-2">
            {stats.topTerms.reduce((sum, t) => sum + t.views, 0)}
          </div>
          <div className="text-gray-600">Total Views</div>
        </div>
      </div>

      {gapAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-red-600 mb-2">{gapAnalytics.total_gaps}</div>
            <div className="text-gray-600">Total Gaps</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">{gapAnalytics.resolved_gaps}</div>
            <div className="text-gray-600">Resolved Gaps</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {gapAnalytics.gaps_by_type?.conflicting_definition || 0}
            </div>
            <div className="text-gray-600">Conflicts</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {gapAnalytics.gaps_by_severity?.high || 0}
            </div>
            <div className="text-gray-600">High Severity</div>
          </div>
        </div>
      )}

      {clusterCoverage && clusterCoverage.clusters && clusterCoverage.clusters.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-brand-dark mb-4">Cluster Coverage</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-brand-pastel">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                    Cluster
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                    Coverage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                    Gaps
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clusterCoverage.clusters.map((cluster, idx) => (
                  <tr key={idx} className="hover:bg-brand-light">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-brand-dark">
                      {cluster.cluster}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              cluster.coverage_percent >= 80
                                ? 'bg-green-500'
                                : cluster.coverage_percent >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, cluster.coverage_percent)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">
                          {cluster.coverage_percent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          cluster.gaps_count > 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {cluster.gaps_count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-brand-dark mb-4 flex items-center">
            📊 Top Categories
            <span className="ml-2 text-sm font-normal text-gray-500">({topCategories.length} shown)</span>
          </h2>
          <div className="space-y-3">
            {topCategories.length > 0 ? (
              topCategories.map(([category, count]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700">{category}</span>
                    <span className="font-semibold text-brand-primary">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-primary h-2 rounded-full"
                      style={{ width: `${(count / stats.totalTerms) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No categories available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-brand-dark mb-4 flex items-center">
            🏷️ Top Tags
            <span className="ml-2 text-sm font-normal text-gray-500">({topTags.length} shown)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {topTags.length > 0 ? (
              topTags.map(([tag, count]) => (
                <div
                  key={tag}
                  className="px-3 py-1 bg-brand-pastel text-brand-dark rounded-full text-sm hover:bg-brand-primary hover:text-white transition-colors cursor-default"
                  title={`Used ${count} times`}
                >
                  {tag} ({count})
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No tags available</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-brand-dark mb-4 flex items-center">
            👁️ Most Viewed Terms
          </h2>
          <div className="space-y-2">
            {stats.topTerms.length > 0 ? (
              stats.topTerms.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-brand-light rounded transition-colors">
                  <span className="text-gray-700">{item.term}</span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <span className="mr-1">👁️</span>
                    {item.views} views
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No view data available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-brand-dark mb-4 flex items-center">
            🆕 Recently Added
          </h2>
          <div className="space-y-2">
            {stats.recentTerms.length > 0 ? (
              stats.recentTerms.map((term) => (
                <div key={term.id} className="p-2 hover:bg-brand-light rounded transition-colors">
                  <div className="font-medium text-brand-primary">{term.term}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="mr-1">📅</span>
                    {new Date(term.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent terms</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

