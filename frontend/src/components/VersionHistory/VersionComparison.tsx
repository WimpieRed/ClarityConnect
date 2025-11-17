import React from 'react';
import { VersionComparison as VersionComparisonType } from '../../types';

interface VersionComparisonProps {
  comparison: VersionComparisonType;
  onClose: () => void;
}

export const VersionComparison: React.FC<VersionComparisonProps> = ({
  comparison,
  onClose,
}) => {
  const { version1, version2, differences } = comparison;

  const getFieldValue = (version: typeof version1, field: string): any => {
    return version.term_data[field] || null;
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  const fields = [
    { key: 'term', label: 'Term' },
    { key: 'base_definition', label: 'Definition' },
    { key: 'category', label: 'Category' },
    { key: 'code_name', label: 'Code Name' },
    { key: 'tags', label: 'Tags' },
    { key: 'compliance_frameworks', label: 'Compliance Frameworks' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-dark">Version Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Version Info */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">Version {version1.version_number}</p>
            <p className="text-xs text-gray-500">
              {new Date(version1.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
            {version1.change_reason && (
              <p className="text-xs text-gray-600 mt-1">{version1.change_reason}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Version {version2.version_number}</p>
            <p className="text-xs text-gray-500">
              {new Date(version2.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
            {version2.change_reason && (
              <p className="text-xs text-gray-600 mt-1">{version2.change_reason}</p>
            )}
          </div>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {fields.map((field) => {
              const val1 = getFieldValue(version1, field.key);
              const val2 = getFieldValue(version2, field.key);
              const hasDifference = differences[field.key] !== undefined;
              const isRemoved = val1 && !val2;
              const isAdded = !val1 && val2;
              const isModified = val1 && val2 && hasDifference;

              return (
                <div key={field.key} className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">{field.label}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Version 1 (Left) */}
                    <div
                      className={`p-3 rounded-lg border-2 ${
                        isRemoved || isModified
                          ? 'bg-red-50 border-red-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                        {formatValue(val1)}
                      </p>
                      {isRemoved && (
                        <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Removed
                        </span>
                      )}
                      {isModified && (
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Modified
                        </span>
                      )}
                    </div>

                    {/* Version 2 (Right) */}
                    <div
                      className={`p-3 rounded-lg border-2 ${
                        isAdded || isModified
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                        {formatValue(val2)}
                      </p>
                      {isAdded && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Added
                        </span>
                      )}
                      {isModified && (
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          Modified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {Object.keys(differences).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No differences found between these versions.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

