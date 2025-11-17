import React, { useState, useEffect } from 'react';
import { versionsApi } from '../../services/api';
import { TermVersion } from '../../types';
import { useUser } from '../../contexts/UserContext';

interface VersionHistoryProps {
  termId: string;
  onViewVersion?: (version: TermVersion) => void;
  onCompareVersion?: (version: TermVersion) => void;
  onRollback?: (version: TermVersion) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  termId,
  onViewVersion,
  onCompareVersion,
  onRollback,
}) => {
  const [versions, setVersions] = useState<TermVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rollbackConfirm, setRollbackConfirm] = useState<string | null>(null);
  const { userRole } = useUser();

  useEffect(() => {
    loadVersions();
  }, [termId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await versionsApi.list(termId);
      setVersions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (version: TermVersion) => {
    if (rollbackConfirm !== version.id) {
      setRollbackConfirm(version.id);
      return;
    }

    try {
      if (onRollback) {
        await onRollback(version);
      }
      setRollbackConfirm(null);
      await loadVersions();
    } catch (err: any) {
      alert(err.message || 'Failed to rollback version');
    }
  };

  const canRollback = userRole === 'admin' || userRole === 'editor';

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading version history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadVersions}
          className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No version history available for this term.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {versions.map((version) => (
        <div
          key={version.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-brand-pastel text-brand-dark rounded-full text-sm font-semibold">
                  Version {version.version_number}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(version.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              
              {version.change_reason && (
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Reason:</span> {version.change_reason}
                </p>
              )}
              
              {version.changed_by && (
                <p className="text-xs text-gray-500">
                  Changed by: {version.changed_by}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              {onViewVersion && (
                <button
                  onClick={() => onViewVersion(version)}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View
                </button>
              )}
              
              {onCompareVersion && (
                <button
                  onClick={() => onCompareVersion(version)}
                  className="px-3 py-1.5 text-sm bg-brand-pastel text-brand-dark rounded-lg hover:bg-opacity-80 transition-colors"
                >
                  Compare
                </button>
              )}
              
              {canRollback && onRollback && (
                <button
                  onClick={() => handleRollback(version)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    rollbackConfirm === version.id
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {rollbackConfirm === version.id ? 'Confirm Rollback' : 'Rollback'}
                </button>
              )}
            </div>
          </div>

          {rollbackConfirm === version.id && (
            <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This will create a new version with the current state, then restore this version. This action cannot be undone.
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

