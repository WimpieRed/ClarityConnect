import React from 'react';
import { ClusterCoverage } from '../../types';

interface ClusterStatsProps {
  clusterName: string;
  coverage?: ClusterCoverage;
}

export const ClusterStats: React.FC<ClusterStatsProps> = ({ clusterName, coverage }) => {
  const clusterData = coverage?.clusters?.find((c) => c.cluster === clusterName);

  if (!clusterData) {
    return (
      <div className="text-center py-4 text-gray-500">No statistics available for this cluster</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-2xl font-bold text-brand-primary mb-1">
          {clusterData.terms_with_context}
        </div>
        <div className="text-sm text-gray-600">Terms with Context</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-2xl font-bold text-brand-primary mb-1">
          {clusterData.total_terms}
        </div>
        <div className="text-sm text-gray-600">Total Terms</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-2xl font-bold text-brand-primary mb-1">
          {clusterData.coverage_percent.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-600">Coverage</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full ${
              clusterData.coverage_percent >= 80
                ? 'bg-green-500'
                : clusterData.coverage_percent >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, clusterData.coverage_percent)}%` }}
          ></div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="text-2xl font-bold text-red-600 mb-1">{clusterData.gaps_count}</div>
        <div className="text-sm text-gray-600">Open Gaps</div>
      </div>
    </div>
  );
};

