import React from 'react';
import { Link } from 'react-router-dom';
import { GapAnalysis } from '../../types';

interface GapListProps {
  gaps: GapAnalysis[];
  onResolve: (id: string) => void;
  loading?: boolean;
}

export const GapList: React.FC<GapListProps> = ({ gaps, onResolve, loading }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGapTypeLabel = (type: string) => {
    switch (type) {
      case 'missing_context':
        return 'Missing Context';
      case 'conflicting_definition':
        return 'Conflicting Definition';
      case 'outdated':
        return 'Outdated';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading gaps...</div>
    );
  }

  if (gaps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No gaps found</div>
    );
  }

  return (
    <div className="space-y-4">
      {gaps.map((gap) => (
        <div
          key={gap.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(gap.severity)}`}>
                  {gap.severity.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-brand-pastel text-brand-dark rounded-full text-xs font-medium">
                  {getGapTypeLabel(gap.gap_type)}
                </span>
                {gap.resolved_at && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Resolved
                  </span>
                )}
              </div>
              {gap.term && (
                <Link
                  to={`/terms/${gap.term_id}`}
                  className="text-xl font-semibold text-brand-primary hover:text-brand-dark mb-2 block"
                >
                  {gap.term.term}
                </Link>
              )}
              {gap.description && (
                <p className="text-gray-700 mb-2">{gap.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm text-gray-600">Affected clusters:</span>
                {gap.affected_clusters.map((cluster, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-brand-light text-brand-dark rounded text-xs"
                  >
                    {cluster}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Detected: {new Date(gap.detected_at).toLocaleDateString()}
              </p>
            </div>
            {!gap.resolved_at && (
              <button
                onClick={() => onResolve(gap.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-4"
              >
                Resolve
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

