import React from 'react';
import { TermContext } from '../../types';

interface ClusterComparisonProps {
  comparisons: Record<string, TermContext[]>;
  termName?: string;
}

export const ClusterComparison: React.FC<ClusterComparisonProps> = ({
  comparisons,
  termName,
}) => {
  const clusters = Object.keys(comparisons);

  if (clusters.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No cluster comparisons available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {termName && (
        <h3 className="text-xl font-semibold text-brand-dark mb-4">
          Cluster Comparison: {termName}
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusters.map((cluster) => (
          <div
            key={cluster}
            className="border-l-4 border-brand-primary pl-4 py-2 bg-brand-light rounded"
          >
            <h4 className="font-semibold text-brand-dark mb-2">{cluster}</h4>
            {comparisons[cluster].map((context) => (
              <div key={context.id} className="mb-3">
                <p className="text-gray-700 text-sm">{context.context_definition}</p>
                {(context.system || context.product) && (
                  <div className="text-xs text-gray-500 mt-1">
                    {context.system && <span>System: {context.system}</span>}
                    {context.system && context.product && <span> • </span>}
                    {context.product && <span>Product: {context.product}</span>}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Updated: {new Date(context.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

