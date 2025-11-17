import React from 'react';

interface GapFiltersProps {
  gapType: string;
  cluster: string;
  severity: string;
  resolved: string;
  onGapTypeChange: (value: string) => void;
  onClusterChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
  onResolvedChange: (value: string) => void;
  clusters: string[];
  onClear: () => void;
}

export const GapFilters: React.FC<GapFiltersProps> = ({
  gapType,
  cluster,
  severity,
  resolved,
  onGapTypeChange,
  onClusterChange,
  onSeverityChange,
  onResolvedChange,
  clusters,
  onClear,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-brand-dark mb-2">Gap Type</label>
          <select
            value={gapType}
            onChange={(e) => onGapTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
          >
            <option value="">All Types</option>
            <option value="missing_context">Missing Context</option>
            <option value="conflicting_definition">Conflicting Definition</option>
            <option value="outdated">Outdated</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-brand-dark mb-2">Cluster</label>
          <select
            value={cluster}
            onChange={(e) => onClusterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
          >
            <option value="">All Clusters</option>
            {clusters.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-brand-dark mb-2">Severity</label>
          <select
            value={severity}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
          >
            <option value="">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-brand-dark mb-2">Status</label>
          <select
            value={resolved}
            onChange={(e) => onResolvedChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
          >
            <option value="">All</option>
            <option value="false">Open</option>
            <option value="true">Resolved</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onClear}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

