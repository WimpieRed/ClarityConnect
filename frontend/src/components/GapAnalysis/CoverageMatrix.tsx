import React from 'react';
import { ClusterCoverage } from '../../types';

interface CoverageMatrixProps {
  coverage: ClusterCoverage;
}

export const CoverageMatrix: React.FC<CoverageMatrixProps> = ({ coverage }) => {
  const getCoverageColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!coverage.clusters || coverage.clusters.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No cluster coverage data available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-brand-dark mb-4">Cluster Coverage Matrix</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-brand-pastel">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                Cluster
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-dark uppercase tracking-wider">
                Terms with Context
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
            {coverage.clusters.map((cluster, idx) => (
              <tr key={idx} className="hover:bg-brand-light">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-brand-dark">
                  {cluster.cluster}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {cluster.terms_with_context} / {cluster.total_terms}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full ${getCoverageColor(cluster.coverage_percent)}`}
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
  );
};

